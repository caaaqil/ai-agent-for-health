const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const aiController = require('../controllers/aiController');

// Auth & Profile
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile/:id', authController.getProfile);
router.put('/profile/:id', authController.updateProfile);

// AI & Health
router.post('/ai/chat', aiController.chat);
router.post('/ai/analyze-meal', aiController.analyzeMeal);
router.post('/ai/generate-workout', aiController.generateWorkout);

module.exports = router;
