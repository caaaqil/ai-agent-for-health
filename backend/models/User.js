const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profile: {
        weight: { type: Number, default: 0 },
        height: { type: Number, default: 0 },
        goal: { type: String, enum: ['lose weight', 'gain muscle', 'maintain'], default: 'maintain' },
        caloriesTarget: { type: Number, default: 2000 },
        proteinTarget: { type: Number, default: 150 },
    },
    mealHistory: [{
        food: String,
        calories: Number,
        protein: Number,
        fat: Number,
        date: { type: Date, default: Date.now }
    }],
    chatHistory: [{
        role: { type: String, enum: ['user', 'assistant'] },
        content: String,
        date: { type: Date, default: Date.now }
    }]
});

module.exports = mongoose.model('User', UserSchema);
