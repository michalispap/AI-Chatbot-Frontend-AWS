import { defineStore } from "pinia";
import { ref } from "vue";
import apiClient from "../services/api";

export const useChatStore = defineStore("chat", () => {
  const messages = ref([]);

  const fetchMessages = () => {
    // Load messages from localStorage if available
    const savedMessages = localStorage.getItem("chatMessages");
    if (savedMessages) {
      messages.value = JSON.parse(savedMessages);
    } else {
      // Add initial welcome message only if no saved messages
      messages.value = [{
        id: Date.now(),
        role: "ai",
        message: "Welcome to the Student Portal! How can I help you today?",
      }];
      // Save initial message
      saveMessages();
    }
  };
  
  // Save messages to localStorage
  const saveMessages = () => {
    localStorage.setItem("chatMessages", JSON.stringify(messages.value));
  };
  
  // Add a message and persist it
  const addMessage = (message) => {
    messages.value.push(message);
    saveMessages();
  };
  
  // Clear chat history
  const clearHistory = () => {
    messages.value = [{
      id: Date.now(),
      role: "ai",
      message: "How can I help you today?",
    }];
    saveMessages();
  };

  // Export saveMessages function
  return { messages, fetchMessages, addMessage, clearHistory, saveMessages };
});