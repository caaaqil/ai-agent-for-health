const axios = require('axios');
const User = require('../models/User');

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://127.0.0.1:11434/api/generate';
const AI_MODEL = process.env.AI_MODEL || 'phi3:latest';
const AI_VISION_MODEL = process.env.AI_VISION_MODEL || 'llava';
console.log('AI Controller initialized with Ollama URL:', OLLAMA_URL);

/**
 * Pipe an Ollama streaming response (newline-delimited JSON) to the client
 * as plain text tokens. Returns the full concatenated text once finished.
 */
function pipeOllamaStream(ollamaRes, clientRes, { onToken } = {}) {
    return new Promise((resolve, reject) => {
        let full = '';
        ollamaRes.data.on('data', (buf) => {
            buf.toString().split('\n').forEach((line) => {
                line = line.trim();
                if (!line) return;
                try {
                    const json = JSON.parse(line);
                    if (json.response) {
                        full += json.response;
                        clientRes.write(json.response);
                        onToken?.(json.response);
                    }
                } catch {
                    /* ignore partial / non-JSON lines */
                }
            });
        });
        ollamaRes.data.on('end', () => { clientRes.end(); resolve(full); });
        ollamaRes.data.on('error', (err) => { try { clientRes.end(); } catch { /* noop */ } reject(err); });
    });
}

// =======================
// CHAT (streamed)
// =======================
exports.chat = async (req, res) => {
    const { userId, message } = req.body;
    console.log(`AI Chat Request - User: ${userId}, Message: "${message}"`);

    const allowedKeywords = [
        'fitness', 'exercise', 'gym', 'workout', 'diet', 'nutrition', 'calorie',
        'protein', 'health', 'fat', 'muscle', 'weight', 'training', 'plan',
        'sleep', 'water', 'hydration', 'stretch', 'recovery', 'rice', 'food', 'meal',
    ];
    const isValid = allowedKeywords.some((word) => message.toLowerCase().includes(word));

    if (!isValid) {
        return res
            .type('text/plain')
            .send("I'm sorry, I only answer questions related to health, fitness, and nutrition.");
    }

    const systemPrompt = `You are a professional AI health, fitness and nutrition assistant.
Rules you MUST follow:
- Only answer questions about health, fitness, nutrition and wellness.
- Be factually accurate and concise. Never contradict yourself within an answer.
- When giving numbers (calories, macros, etc.), make sure they are consistent and realistic. If unsure, give an approximate range and say it is approximate.
- Do not invent claims. Prefer short, clear, practical advice.`;
    const fullPrompt = `${systemPrompt}\n\nUser: ${message}\nAssistant:`;

    try {
        const ollamaRes = await axios.post(
            OLLAMA_URL,
            { model: AI_MODEL, prompt: fullPrompt, stream: true },
            { responseType: 'stream', timeout: 120000 }
        );

        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.setHeader('Cache-Control', 'no-cache');

        const full = await pipeOllamaStream(ollamaRes, res);

        if (userId && full) {
            try {
                await User.findByIdAndUpdate(userId, {
                    $push: {
                        chatHistory: [
                            { role: 'user', content: message },
                            { role: 'assistant', content: full },
                        ],
                    },
                });
            } catch (e) {
                console.error('Failed to save chat history:', e.message);
            }
        }
    } catch (err) {
        console.error('Ollama Error Detail:', err.response ? err.response.data : err.message);
        if (!res.headersSent) {
            res.status(500).json({ message: 'AI failed to respond. Make sure Ollama is running and the model is pulled.' });
        } else {
            res.end();
        }
    }
};

// =======================
// MEAL ANALYSIS (text or image)
// =======================
exports.analyzeMeal = async (req, res) => {
    const { userId, foodText, image } = req.body;

    if (!foodText && !image) {
        return res.status(400).json({ message: 'Provide a meal description or an image.' });
    }

    const subject = foodText ? `this meal: "${foodText}"` : 'the meal shown in the image';
    const prompt = `You are a nutrition expert. Analyze ${subject}.
Return ONLY valid JSON in exactly this shape (numbers must be consistent and realistic):
{
  "calories": number,
  "protein": number,
  "fat": number,
  "carbs": number,
  "note": "one short, practical piece of advice"
}`;

    try {
        const payload = {
            model: image ? AI_VISION_MODEL : AI_MODEL,
            prompt,
            stream: false,
            format: 'json',
        };
        // Ollama expects raw base64 (no data: prefix)
        if (image) payload.images = [image.replace(/^data:image\/\w+;base64,/, '')];

        const response = await axios.post(OLLAMA_URL, payload, { timeout: 180000 });
        const analysis = JSON.parse(response.data.response);

        if (userId) {
            try {
                await User.findByIdAndUpdate(userId, {
                    $push: { mealHistory: { food: foodText || 'Photo meal', ...analysis } },
                });
            } catch (e) {
                console.error('Failed to save meal history:', e.message);
            }
        }

        res.json(analysis);
    } catch (err) {
        console.error('Meal analysis error:', err.response ? err.response.data : err.message);
        res.status(500).json({
            message: image
                ? 'Meal analysis failed. Image analysis needs a vision model — run "ollama pull llava".'
                : 'Meal analysis failed. Make sure Ollama is running.',
        });
    }
};

// =======================
// WORKOUT GENERATOR (streamed)
// =======================
exports.generateWorkout = async (req, res) => {
    const { goal } = req.body;

    const prompt = `You are a professional fitness coach.
Create a simple, beginner-friendly 7-day workout plan for this goal: "${goal}".
Rules:
- Include rest days.
- For each day give the focus, 2-4 exercises and a duration.
- Keep it realistic and easy to follow.

Format:
Day 1 — <focus> (<duration>): <exercises>
Day 2 — ...`;

    try {
        const ollamaRes = await axios.post(
            OLLAMA_URL,
            { model: AI_MODEL, prompt, stream: true },
            { responseType: 'stream', timeout: 120000 }
        );

        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.setHeader('Cache-Control', 'no-cache');

        await pipeOllamaStream(ollamaRes, res);
    } catch (err) {
        console.error('Workout generation error:', err.response ? err.response.data : err.message);
        if (!res.headersSent) {
            res.status(500).json({ message: 'Workout generation failed. Make sure Ollama is running.' });
        } else {
            res.end();
        }
    }
};
