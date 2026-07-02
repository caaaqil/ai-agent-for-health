const User = require('../models/User');
const { streamChat, jsonCompletion } = require('../services/ai');

/**
 * Build a short profile summary the AI can use to personalise its answers.
 * Returns '' when we have no usable profile data (e.g. logged-out / empty profile).
 */
async function buildUserContext(userId) {
    if (!userId) return '';
    let user;
    try {
        user = await User.findById(userId);
    } catch {
        return '';
    }
    if (!user) return '';

    const p = user.profile || {};
    const bits = [];
    if (user.name) bits.push(`Name: ${user.name}`);
    if (p.age) bits.push(`Age: ${p.age}`);
    if (p.weight) bits.push(`Current weight: ${p.weight} kg`);
    // Normalise height typed in metres (1.75) to cm (175).
    const heightCm = p.height > 0 && p.height < 3 ? Math.round(p.height * 100) : p.height;
    if (heightCm) bits.push(`Height: ${heightCm} cm`);
    if (p.weight && heightCm) {
        const bmi = (p.weight / ((heightCm / 100) ** 2)).toFixed(1);
        bits.push(`BMI: ${bmi}`);
    }

    if (p.goal && p.goal !== 'maintain' && p.targetWeight) {
        const verb = p.goal === 'lose weight' ? 'lose' : 'gain';
        const total = Math.abs((p.startWeight || p.weight) - p.targetWeight).toFixed(1);
        let line = `Goal: ${verb} ${total} kg (target ${p.targetWeight} kg)`;
        if (p.deadline) line += ` by ${new Date(p.deadline).toLocaleDateString()}`;
        bits.push(line);

        const remaining = p.goal === 'lose weight' ? p.weight - p.targetWeight : p.targetWeight - p.weight;
        if (remaining > 0) bits.push(`Still ${remaining.toFixed(1)} kg to go`);
    } else if (p.goal) {
        bits.push(`Goal: ${p.goal}`);
    }

    if (p.caloriesTarget) bits.push(`Daily calorie target: ${p.caloriesTarget} kcal`);
    if (p.proteinTarget) bits.push(`Daily protein target: ${p.proteinTarget} g`);

    if (bits.length === 0) return '';
    return `\nThe user's health profile (personalise your advice to it — use their goal, weight and deadline when relevant, but never repeat the whole profile back to them):\n- ${bits.join('\n- ')}\n`;
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
    const userContext = await buildUserContext(userId);

    try {
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.setHeader('Cache-Control', 'no-cache');

        const full = await streamChat({
            system: `${systemPrompt}\n${userContext}`,
            user: message,
            clientRes: res,
        });

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
        console.error('AI Error Detail:', err.response ? err.response.data : err.message);
        if (!res.headersSent) {
            res.status(500).json({ message: 'AI failed to respond. Check the AI provider configuration.' });
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
        const analysis = await jsonCompletion({ prompt, image });

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
                ? 'Meal analysis failed. Image analysis needs a vision-capable model.'
                : 'Meal analysis failed. Check the AI provider configuration.',
        });
    }
};

// =======================
// WORKOUT GENERATOR (streamed)
// =======================
exports.generateWorkout = async (req, res) => {
    const { userId, goal } = req.body;
    const userContext = await buildUserContext(userId);

    const system = `You are a professional fitness coach.
Rules:
- Tailor the plan to the user's profile when it is provided.
- Include rest days.
- For each day give the focus, 2-4 exercises and a duration.
- Keep it realistic and easy to follow.

Format:
Day 1 — <focus> (<duration>): <exercises>
Day 2 — ...`;
    const user = `Create a simple, beginner-friendly 7-day workout plan for this goal: "${goal}".\n${userContext}`;

    try {
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.setHeader('Cache-Control', 'no-cache');
        await streamChat({ system, user, clientRes: res });
    } catch (err) {
        console.error('Workout generation error:', err.response ? err.response.data : err.message);
        if (!res.headersSent) {
            res.status(500).json({ message: 'Workout generation failed. Check the AI provider configuration.' });
        } else {
            res.end();
        }
    }
};
