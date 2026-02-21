import express from 'express';
import { register, login } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/admin-only', login, (req, res) => {
  res.status(200).json({ success: true, message: 'Welcome, Admin!' });
});

export default router;

