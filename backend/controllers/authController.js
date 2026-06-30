const mongoose = require('mongoose');
const User = require('../models/User');

// Never send the password (hashed or not) back to the client.
const sanitize = (userDoc) => {
    const user = userDoc.toObject ? userDoc.toObject() : userDoc;
    delete user.password;
    return user;
};

// A bcrypt hash always starts with "$2" — anything else is an old plain-text password.
const isHashed = (pw) => typeof pw === 'string' && pw.startsWith('$2');

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        // The pre-save hook in the User model hashes the password automatically.
        const user = new User({ name, email, password });
        await user.save();
        res.status(201).json({ message: 'User registered successfully', user: sanitize(user) });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        let match;
        if (isHashed(user.password)) {
            match = await user.comparePassword(password);
        } else {
            // Legacy account created before hashing existed: compare in plain text,
            // and if it matches, transparently upgrade it to a hash for next time.
            match = user.password === password;
            if (match) {
                user.password = password;
                user.markModified('password'); // force the pre-save hook to re-hash it
                await user.save();
            }
        }

        if (!match) return res.status(400).json({ message: 'Invalid credentials' });
        res.status(200).json({ message: 'Login successful', user: sanitize(user) });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.getProfile = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid user id' });
        }
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(sanitize(user));
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { age, weight, height, goal, targetWeight, deadline } = req.body;

        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid user id' });
        }
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const p = user.profile;

        // Detect whether the user is (re)setting their goal this time.
        const goalChanged =
            (goal !== undefined && goal !== p.goal) ||
            (targetWeight !== undefined && Number(targetWeight) !== p.targetWeight) ||
            (deadline !== undefined && String(deadline) !== String(p.deadline));

        if (age !== undefined) p.age = age;
        if (weight !== undefined) p.weight = weight;
        if (height !== undefined) p.height = height;
        if (goal !== undefined) p.goal = goal;
        if (targetWeight !== undefined) p.targetWeight = targetWeight;
        if (deadline !== undefined) p.deadline = deadline || null;

        // When a goal is set/changed, snapshot the starting weight + date so we can
        // show real progress later (start → current → target).
        if (goalChanged) {
            p.startWeight = weight !== undefined ? weight : p.weight;
            p.goalSetAt = new Date();
        }

        await user.save();
        res.json(sanitize(user));
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
