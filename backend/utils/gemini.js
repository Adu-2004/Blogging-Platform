// import { GoogleGenAI } from "@google/genai";

// // The client gets the API key from the environment variable `GEMINI_API_KEY`.
// const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

// async function main(prompt) {
//   const response = await ai.models.generateContent({
//     model: "gemini-2.5-flash",
//     contents: prompt,
//   });
//   return response.text

// }

// export default main;

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_PROMPT = `You are "BlogBot", a friendly and creative AI assistant for an AI-powered blogging platform.

Your main jobs are:
1. Help users brainstorm BLOG TOPIC IDEAS based on their interests or niche.
2. Have friendly casual conversations (greetings, small talk, etc.)
3. Keep responses SHORT, friendly, and helpful — max 3-4 sentences or a short numbered list.

Rules:
- If the user says hi/hello/hey → greet them warmly and ask what they want to write about.
- If the user mentions a niche or interest → suggest 3-5 creative blog topic ideas.
- If the user asks for "more" → give 3-5 new different topic ideas.
- If unrelated to blogging → gently redirect them back to blogging topics.
- Always be encouraging — they are creators!
- Format topic ideas as a simple numbered list.
- Never write full blog posts. Just suggest topics with a one-line description.`;

/**
 * Send message to Gemini with conversation history
 * @param {string} userMessage - Current user message
 * @param {Array}  history     - Previous messages [{role, parts}] from DB
 * @returns {string}           - Gemini's reply
 */
const getChatResponse = async (userMessage, history = []) => {
  try {
    const chat = ai.chats.create({
      model: "gemini-2.5-flash",
      system: SYSTEM_PROMPT,
      history: history, // pass previous messages for context
    });

    const response = await chat.sendMessage({ message: userMessage });
    return response.text;

  } catch (err) {
    console.error("Gemini Service Error:", err.message);
    throw new Error("Gemini API failed");
  }
};

export default getChatResponse;