/*import ChatBot from "react-chatbotify";

const MyChatbot = () => {
     const id = "my-chatbot-id" // if not specified, will auto-generate uuidv4

  const flow = {
    "start": {
        message: "Hello there!",
        path: "loop",
    },
    "loop": {
        message: "Ask me anything...",
        path:"loop",
    },
  };
  return (
    <ChatBot flow={flow} />
  );
};
 
export default MyChatbot;
/*
import React from "react";
import  ChatBot  from "react-chatbotify";
import axios from "axios";

const MyChatBot = () => {
  const backendUrl = "api/blog/generate"; // Add your backend URL here

  const plugins = [];

  const flow = {
    start: {
      message: "Hello! Ask me anything powered by Gemini AI.",
      options: ["Start Chatting"],
      path: () => "chat",
    },
    chat: {
      path: async (params) => {
        const userMessage = params.latestUserMessage;
        if (!userMessage) return "chat";

        try {
          const response = await axios.post(backendUrl, { message: userMessage });

          if (response.data && response.data.reply) {
            await params.simulateStreamMessage(response.data.reply);
          } else {
            await params.simulateStreamMessage("Sorry, I didn't get a response.");
          }
        } catch (error) {
          await params.simulateStreamMessage("Oops! Something went wrong.");
        }

        return "chat";
      },
      options: ["Continue", "End Chat"],
      outputType: "character",
    },
  };

  return (
    <ChatBot
      settings={{ general: { embedded: true }, chatHistory: { storageKey: "gemini_axios_backend" } }}
      plugins={plugins}
      flow={flow}
    />
  );
};

export default MyChatBot;
*/
// /client/src/ChatBotComponent.jsx
import React, { useState } from "react";
import ChatBot from "react-chatbotify";
import axios from "axios";

const initialHistory = [
  { text: "Hello! I'm your project's AI assistant. Ask me anything!", path: "start" },
];

const MyChatbot = () => {
  const [history, setHistory] = useState(initialHistory);
  const CHAT_API_URL = "http://localhost:8080/api/blog/chatbot"; // ⬅️ This targets your new Express route

  const handleGeminiResponse = async (params) => {
    // 1. Prepare and track the new user message
    const newUserMessage = { role: "user", text: params.userInput };
    const updatedHistory = [...history, newUserMessage];

    try {
      // 2. Send the new prompt AND the conversation history to the server
      const response = await axios.post(CHAT_API_URL, {
        prompt: params.userInput,
        history: updatedHistory,
      });

      const aiResponse = response.data.text;
      
      // 3. Display the AI response (with streaming simulation)
      await params.streamMessage(aiResponse);
      await params.endStreamMessage(); 

      // 4. Update the local state history for the next turn
      setHistory([...updatedHistory, { role: "model", text: aiResponse }]);

    } catch (error) {
      console.error("Chatbot API Error:", error);
      await params.injectMessage("Oops! The AI server is unavailable right now. Try again later.");
    }
  };

  const flow = {
    start: {
      message: "How can I help you?",
      path: "gemini_response",
    },
    gemini_response: {
      message: handleGeminiResponse,
      path: "gemini_response", // Loop back
    },
  };

  return (
    <ChatBot
      flow={flow}
      chatHistory={{ initial: history }}
      settings={{
        embedded: false, 
        chatInput: { placeholder: "Ask the AI..." },
        botBubble: { simulateStream: true, showAvatar: true },
        theme: { primaryColor: '#2196F3' }
      }}
    />
  );
};

export default MyChatbot;




