const axios = require('axios');
const User = require('../models/User');

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://127.0.0.1:11434/api/generate';
console.log('AI Controller initialized with Ollama URL:', OLLAMA_URL);

// =======================
// CHAT (CONTROLLED AI)
// =======================
exports.chat = async (req, res) => {
    const { userId, message } = req.body;
    console.log(`AI Chat Request - User: ${userId}, Message: "${message}"`);

    try {
        const allowedKeywords = [
            "fitness", "exercise", "gym", "workout",
            "diet", "nutrition", "calories", "protein",
            "health", "fat", "muscle", "weight", "training", "plan"
        ];

        const isValid = allowedKeywords.some(word =>
            message.toLowerCase().includes(word)
        );

        if (!isValid) {
            return res.json({
                response: "I'm sorry, I only answer questions related to health, fitness, and nutrition."
            });
        }

        const systemPrompt = `You are a professional AI Health and Fitness Assistant. You ONLY answer questions related to fitness, nutrition, and wellness. Keep answers simple.`;
        const fullPrompt = `${systemPrompt}\n\nUser: ${message}\nAI:`;

        console.log(`Sending to Ollama: ${process.env.AI_MODEL} at ${OLLAMA_URL}`);
        const response = await axios.post(OLLAMA_URL, {
            model: process.env.AI_MODEL || 'phi3:latest',
            prompt: fullPrompt,
            stream: false
        });

        const aiMessage = response.data.response;
        console.log(`AI Response: ${aiMessage.substring(0, 50)}...`);

        if (userId) {
            await User.findByIdAndUpdate(userId, {
                $push: {
                    chatHistory: [
                        { role: 'user', content: message },
                        { role: 'assistant', content: aiMessage }
                    ]
                }
            });
        }

        res.json({ response: aiMessage });

    } catch (err) {
        console.error('Ollama Error Detail:', err.response ? err.response.data : err.message);
        res.status(500).json({
            message: 'AI failed to respond. Make sure Ollama is running and the model is pulled.'
        });
    }
};

// =======================
// MEAL ANALYSIS
// =======================
exports.analyzeMeal = async (req, res) => {
    const { userId, foodText } = req.body;

    const prompt = `
You are a nutrition expert.

Analyze this meal: "${foodText}".

Return ONLY JSON in this format:
{
  "calories": number,
  "protein": number,
  "fat": number,
  "note": "short advice"
}
`;

    try {
        const response = await axios.post(OLLAMA_URL, {
            model: process.env.AI_MODEL || 'llama3',
            prompt: prompt,
            stream: false,
            format: 'json'
        });

        const analysis = JSON.parse(response.data.response);

        // 💾 Save meal history
        await User.findByIdAndUpdate(userId, {
            $push: {
                mealHistory: {
                    food: foodText,
                    ...analysis
                }
            }
        });

        res.json(analysis);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Meal analysis failed' });
    }
};

// =======================
// WORKOUT GENERATOR
// =======================
exports.generateWorkout = async (req, res) => {
    const { userId, goal } = req.body;

    const prompt = `
You are a professional fitness coach.

Create a simple 7-day workout plan for this goal: "${goal}".

Rules:
- Keep it beginner friendly
- Include rest days
- Mention exercises and duration

Format:
Day 1: ...
Day 2: ...
`;

    try {
        const response = await axios.post(OLLAMA_URL, {
            model: process.env.AI_MODEL || 'llama3',
            prompt: prompt,
            stream: false
        });

        res.json({ plan: response.data.response });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Workout generation failed' });
    }
};