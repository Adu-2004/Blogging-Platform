import ChatMessage from '../models/ChatMessage.js';

import getChatResponse from '../utils/gemini.js';

const MAX_MESSAGES_PER_SESSION = 50;
const HISTORY_CONTEXT_LIMIT = 10;

// ─── Helper: Enforce max message limit per session ────────
async function enforceSessionLimit(sessionId) {
  const count = await ChatMessage.countDocuments({ sessionId });
  if (count > MAX_MESSAGES_PER_SESSION) {
    const excess = count - MAX_MESSAGES_PER_SESSION;
    const oldest = await ChatMessage.find({ sessionId })
      .sort({ timestamp: 1 })
      .limit(excess);
    const ids = oldest.map(m => m._id);
    await ChatMessage.deleteMany({ _id: { $in: ids } });
  }
}

// ─── Helper: Convert DB messages → Gemini history format ──
function toGeminiHistory(messages) {
  return messages.map(m => ({
    role: m.sender === 'user' ? 'user' : 'model',
    parts: [{ text: m.message }]
  }));
}

// ─────────────────────────────────────────────────────────
// @desc    Send message and get Gemini reply
// @route   POST /api/chat
// @access  Public
// ─────────────────────────────────────────────────────────
export const sendMessage = async (req, res) => {
  const { message, sessionId } = req.body;

  if (!message || !sessionId) {
    return res.status(400).json({ error: 'message and sessionId are required' });
  }

  try {
    // 1. Fetch recent conversation history from DB (for Gemini context)
    const recentMessages = await ChatMessage.find({ sessionId })
      .sort({ timestamp: -1 })
      .limit(HISTORY_CONTEXT_LIMIT);

    const history = toGeminiHistory(recentMessages.reverse());

    // 2. Get Gemini reply
    const botReply = await getChatResponse(message, history);

    // 3. Save user message + bot reply to MongoDB
    await ChatMessage.insertMany([
      { sessionId, sender: 'user', message },
      { sessionId, sender: 'bot',  message: botReply }
    ]);

    // 4. Enforce 50 message limit per session
    await enforceSessionLimit(sessionId);

    res.status(200).json({ reply: botReply });

  } catch (err) {
    console.error('sendMessage Error:', err.message);
    res.status(500).json({ reply: "⚠️ Sorry, I'm having trouble right now. Please try again!" });
  }
};

// ─────────────────────────────────────────────────────────
// @desc    Get chat history for a session
// @route   GET /api/chat/history/:sessionId
// @access  Public
// ─────────────────────────────────────────────────────────
export const getChatHistory = async (req, res) => {
  try {
    const messages = await ChatMessage.find({ sessionId: req.params.sessionId })
      .sort({ timestamp: 1 })
      .select('sender message timestamp');

    res.status(200).json(messages);
  } catch (err) {
    console.error('getChatHistory Error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// ─────────────────────────────────────────────────────────
// @desc    Clear all messages for a session
// @route   DELETE /api/chat/clear/:sessionId
// @access  Public
// ─────────────────────────────────────────────────────────
export const clearSession = async (req, res) => {
  try {
    await ChatMessage.deleteMany({ sessionId: req.params.sessionId });
    res.status(200).json({ message: 'Session cleared successfully' });
  } catch (err) {
    console.error('clearSession Error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

