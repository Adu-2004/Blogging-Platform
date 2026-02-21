import mongoose from 'mongoose';

const ChatMessageSchema = new mongoose.Schema({
  sessionId:   { type: String, required: true, index: true },
  sender:      { type: String, enum: ['user', 'bot'], required: true },
  message:     { type: String, required: true },
  timestamp:   { type: Date, default: Date.now }
});

// ✅ Auto-delete messages after 7 days
ChatMessageSchema.index({ timestamp: 1 }, { expireAfterSeconds: 7 * 24 * 60 * 60 });

const ChatMessage = mongoose.model('ChatMessage', ChatMessageSchema);
export default ChatMessage; 