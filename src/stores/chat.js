import { defineStore } from "pinia";
import { ref } from "vue";

export const useChatStore = defineStore("chat", () => {
  const messages = ref([]);

  const fetchMessages = () => {
    messages.value = [];
    // Add initial welcome message from AI
    messages.value.push({
      id: Date.now(),
      role: "ai",
      message: "Welcome to the Student Portal! How can I help you today?",
    });
  };

  // Push user message and AI response
  const sendMessage = (text) => {
    const userMsg = {
      id: Date.now(),
      role: "user",
      message: text,
    };
    messages.value.push(userMsg);

    const aiMsg = {
      id: Date.now() + 1,
      role: "ai",
      message: "I am your favorite AI assistant!",
    };
    messages.value.push(aiMsg);
  };

  return { messages, fetchMessages, sendMessage };
});
