import React from 'react';
import ChatBot from 'react-chatbotify';
import { sendMessage } from '../context/Chatapi';

const BlogBotChatbot = () => {

  const flow = {
    start: {
      message: "👋 Hey! I'm BlogBot — your creative blogging assistant!\n\nTell me your niche or interest and I'll suggest amazing blog topic ideas! ✍️",
      options: [
        "Blog topic ideas 💡",
        "Fitness 🏋️",
        "Tech 💻",
        "Travel ✈️",
        "Finance 💰",
      ],
      path: 'gemini_chat'
    },

    gemini_chat: {
      message: async (params) => {
        const userInput = params.userInput;
        if (!userInput?.trim()) return "Please type something and I'll help! 😊";
        try {
          const reply = await sendMessage(userInput);
          return reply;
        } catch (err) {
          return "⚠️ Oops! Something went wrong. Please try again.";
        }
      },
      options: ["More ideas 🔄", "Different niche 🔀", "Help me get started 🚀"],
      path: 'gemini_chat'
    }
  };

  const settings = {
    header: {
      title: "✍️ BlogBot",
      showAvatar: true,
    },
    tooltip: {
      mode: "ALWAYS",
      text: "💡 Need blog ideas?",
    },
    chatHistory: {
      disabled: false,
      storageKey: "blogbot_ui_history",
      maxEntries: 20,
    },
    userBubble: { showAvatar: false, animate: true },
    botBubble:  { showAvatar: true,  animate: true },
    input: {
      placeholder: "e.g. I write about fitness and wellness...",
      maxLength: 300,
    },
    notification: {
      disabled: false,
      defaultToggledOn: true,
      volume: 0.3,
    }
  };

  // ✅ No styles prop = react-chatbotify default theme applied
  return <ChatBot flow={flow} settings={settings} />;
};

export default BlogBotChatbot;