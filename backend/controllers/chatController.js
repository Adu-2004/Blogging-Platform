// /server/controllers/chatController.js

//import { GoogleGenAI } from "@google/genai";
/*import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini client once at module level
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generates a chat response using Gemini API and returns it to the client.
 * Expected req.body: { prompt: string, history: [{ role: 'user'|'model', text: string }] }
 
const generateChatResponse = async (req, res) => {
    try {
        const { prompt, history } = req.body;

        // Prepare chat history for Gemini
        const chatHistory = Array.isArray(history)
            ? history.map(item => ({
                role: item.role,
                parts: [{ text: item.text }],
            }))
            : [];

        // Start chat session with provided history
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const chat = model.startChat({ history: chatHistory });

        // Send the new user prompt
        const result = await chat.sendMessage({ text: prompt });

        // Return Gemini's response text
        res.json({ text: result.text });

    } catch (error) {
      
    console.error('Gemini API Error:', error);
    res.status(500).json({ 
        error: 'Failed to get response from AI.', 
        details: error.message || error.toString() 
    });


    }
};

// Export controller functions using CommonJS

 export default generateChatResponse;
//////////////////////////////////////////////////
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateChatResponse = async (req, res) => {
  try {
    const { prompt, history } = req.body;

    // Transform frontend history to Gemini chat messages format
    const messages = Array.isArray(history)
      ? history.map(item => ({
          author: item.role === 'user' ? 'user' : 'bot',
          content: item.text,
        }))
      : [];

    // Append current prompt as last user message
    messages.push({ author: 'user', content: prompt });

    // Call Gemini chat completions create method
    const response = await genAI.chat.completions.create({
      model: 'gemini-2.5-flash',
      messages: messages,
    });

    const answer = response.choices[0].message.content;

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
*/import { GoogleGenerativeAI } from '@google/generative-ai';

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

