import { defineStore } from "pinia";
import { ref, computed } from "vue";
import apiClient from "../services/api";
import { getCurrentUser } from 'aws-amplify/auth';

export const useChatStore = defineStore("chat", () => {
  const messages = ref([]);
  const userId = ref(null);

  // Set user ID
  const setUserId = async () => {
    try {
      const cognitoUser = await getCurrentUser();
      userId.value = cognitoUser.userId;
      console.log("Chat store using user ID:", userId.value);
    } catch (error) {
      console.error("Error getting user ID for chat:", error);
      userId.value = null;
    }
  };

  // Compute the localStorage key based on user ID
  const storageKey = computed(() => {
    return userId.value ? `chatMessages_${userId.value}` : null;
  });

  const fetchMessages = async () => {
    // Ensure we have the user ID first
    if (!userId.value) {
      await setUserId();
    }

    // Only proceed if we have a valid user ID
    if (userId.value) {
      // Load messages from localStorage with user-specific key
      const savedMessages = localStorage.getItem(storageKey.value);
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
    } else {
      // Fallback if user ID could not be retrieved
      messages.value = [{
        id: Date.now(),
        role: "ai",
        message: "Welcome to the Student Portal! How can I help you today?",
      }];
    }
  };
  
  // Save messages to localStorage with user-specific key
  const saveMessages = () => {
    if (userId.value && storageKey.value) {
      localStorage.setItem(storageKey.value, JSON.stringify(messages.value));
    }
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

  // Clear user data (for logout)
  const clearUserData = () => {
    messages.value = [];
    userId.value = null;
  };

  // Export functions
  return { 
    messages, 
    fetchMessages, 
    addMessage, 
    clearHistory, 
    saveMessages,
    clearUserData,
    setUserId 
  };
});