import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI client with API Key from env variables
const genAI = new GoogleGenerativeAI({apiKey: process.env.GEMINI_API_KEY});

/**
 * Generates a chat response using Gemini API and returns it to the client.
 * Expects req.body: { prompt: string, history: [{ role: 'user' | 'model', text: string }] }
 */
const generateChatResponse = async (req, res) => {
  try {
    const { prompt, history } = req.body;

    // Map frontend history to Gemini message format
    const messages = Array.isArray(history)
      ? history.map(item => ({
          author: item.role === 'user' ? 'user' : 'bot',
          content: item.text,
        }))
      : [];

    // Append current prompt as last user message
    messages.push({ author: 'user', content: prompt });

    // Get model instance
    const chatModel = genAI.model('gemini-2.5-flash');

    // Send chat messages and get response
    const response = await chatModel.chat({ messages });

    // Extract text response from Gemini API
    const answer = response.choices?.[0]?.message?.content;

    res.json({ text: answer });

  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({
      error: 'Failed to get response from AI.',
      details: error.message || error.toString(),
    });
  }
};

export default generateChatResponse;

