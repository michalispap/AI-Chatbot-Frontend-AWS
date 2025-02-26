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

  // For compatibility with the enhanced Chat.vue
  const sendMessage = (text) => {
    // This method is kept for compatibility but actual implementation
    // is now in the Chat.vue component for better animation control
  };

  return { messages, fetchMessages, sendMessage };
});