// const express = require('express');
// const { register, login } = require('../controllers/authController');
// const router = express.Router();

// router.post('/register', register);
// router.post('/login', login);

// module.exports = router;

import express from 'express';
import { register, login } from '../controllers/authController.js';
//import auth from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/admin-only', login, (req, res) => {
  res.status(200).json({ success: true, message: 'Welcome, Admin!' });
});

export default router;
