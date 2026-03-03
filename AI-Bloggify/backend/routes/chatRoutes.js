import express from 'express';
import auth from '../middleware/authMiddleware.js'
import {
  sendMessage,
  getChatHistory,
  clearSession
} from '../controllers/chatbotController.js';

const router = express.Router();

// POST   /api/chat               → Send message, get Gemini reply
router.post('/', sendMessage);

// GET    /api/chat/history/:id   → Fetch session history
router.get('/history/:sessionId', getChatHistory);

// DELETE /api/chat/clear/:id     → Clear session messages
router.delete('/clear/:sessionId', clearSession);

export default router;