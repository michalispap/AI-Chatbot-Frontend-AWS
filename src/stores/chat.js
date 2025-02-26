import { defineStore } from "pinia";
import { ref } from "vue";
import apiClient from "../services/api";

export const useChatStore = defineStore("chat", () => {
  const messages = ref([]);

  const fetchMessages = () => {
    messages.value = [];
    // Add initial welcome message
    messages.value.push({
      id: Date.now(),
      role: "ai",
      message: "Welcome to the Student Portal! How can I help you today?",
    });
  };

  return { messages, fetchMessages };
});