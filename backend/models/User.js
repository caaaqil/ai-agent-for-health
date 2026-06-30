const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profile: {
        age: { type: Number, default: 0 },
        weight: { type: Number, default: 0 },       // current weight (kg)
        height: { type: Number, default: 0 },       // height (cm)
        goal: { type: String, enum: ['lose weight', 'gain muscle', 'maintain'], default: 'maintain' },
        startWeight: { type: Number, default: 0 },   // weight when the goal was set (for progress)
        targetWeight: { type: Number, default: 0 },  // weight the user is aiming for
        deadline: { type: Date },                    // when they want to hit the target ("this month" etc.)
        goalSetAt: { type: Date },                   // when the current goal was created
        caloriesTarget: { type: Number, default: 2000 },
        proteinTarget: { type: Number, default: 150 },
    },
    mealHistory: [{
        food: String,
        calories: Number,
        protein: Number,
        fat: Number,
        carbs: Number,
        date: { type: Date, default: Date.now }
    }],
    chatHistory: [{
        role: { type: String, enum: ['user', 'assistant'] },
        content: String,
        date: { type: Date, default: Date.now }
    }]
});

// Hash the password automatically before saving — but only when it has changed,
// so updating a profile doesn't re-hash an already-hashed password.
// (Async middleware returns/throws instead of using next() in Mongoose 9.)
UserSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare a plain-text password against the stored hash.
UserSchema.methods.comparePassword = function (candidate) {
    return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', UserSchema);
