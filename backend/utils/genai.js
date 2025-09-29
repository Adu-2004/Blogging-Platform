// server.js or a dedicated router file
/*

import GoogleGenerativeAI from '@google/generative-ai';




const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);



app.post('/api/chat', async (req, res) => {
  try {
    const { prompt, history } = req.body;

    // Use gemini-2.5-flash or another model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); 

    // Format history for the Gemini API if you are managing it
    const chatHistory = history.map(item => ({
        role: item.role,
        parts: [{ text: item.text }],
    }));

    const chat = model.startChat({
        history: chatHistory,
        // You can add system instructions here if needed
    });

    const result = await chat.sendMessage({ text: prompt });

    res.json({ text: result.text });
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ error: 'Failed to get response from AI' });
  }
});
*/
