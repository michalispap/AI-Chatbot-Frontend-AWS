<template>
  <div class="chat-page">
    <div class="chat-header">
      <h2>AI Chat Assistant 🤖</h2>
      <button @click="showDeleteConfirm = true" class="clear-btn" title="Clear chat history">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
      </button>
    </div>
    
    <div class="chat-messages" ref="messageContainer">
      <div
        v-for="msg in messages"
        :key="msg.id"
        class="message"
        :class="bubbleClass(msg.role)"
      >
        <template v-if="msg.id === typingMessageId && msg.role === 'ai'">
          <span class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </template>
        <template v-else>
          <span class="message-text" :class="{'animate-text': msg.id === lastMessageId}">
            {{ msg.message }}
          </span>
        </template>
      </div>
    </div>

    <div class="chat-input-area">
      <textarea
        v-model="newMessage"
        @keydown.enter.prevent="sendMessage"
        placeholder="Type a message..."
        class="chat-input"
        :disabled="isLoading"
      ></textarea>
      <button @click="sendMessage" class="send-btn" :disabled="isLoading || !newMessage.trim()">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="#FFFFFF"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M2 21l21-9-21-9v7l15 2-15 2v7z" />
        </svg>
      </button>
    </div>
    
    <!-- Delete Confirmation Popup -->
    <div class="popup-overlay" v-if="showDeleteConfirm">
      <div class="popup-container">
        <h3>Clear Chat History</h3>
        <p>Are you sure you want to delete all chat messages? This cannot be undone.</p>
        <div class="popup-buttons">
          <button @click="showDeleteConfirm = false" class="cancel-btn">Cancel</button>
          <button @click="clearHistory" class="confirm-btn">Delete</button>
        </div>
      </div>
    </div>
    
    <!-- Toast Notification -->
    <div class="toast-notification" v-if="showToast" :class="{ 'show': showToast }">
      <div class="toast-content">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>Chat history cleared</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, nextTick } from "vue";
import { useChatStore } from "../stores/chat";
import { storeToRefs } from "pinia";
import apiClient from "../services/api";

const chatStore = useChatStore();
const { messages } = storeToRefs(chatStore);
const newMessage = ref("");
const isLoading = ref(false);
const typingMessageId = ref(null);
const lastMessageId = ref(null);
const messageContainer = ref(null);
const showDeleteConfirm = ref(false);
const showToast = ref(false);

// Animation durations
const TYPING_ANIMATION_DURATION = 1400;
const NEW_MESSAGE_ANIMATION_DURATION = 1500;
const ANIMATION_RESET_DELAY = 2000;

// Auto-scroll to bottom of chat
const scrollToBottom = async () => {
  await nextTick();
  if (messageContainer.value) {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
  }
};

onMounted(() => {
  chatStore.fetchMessages();
  scrollToBottom();
});

// Clear history with confirmation
const clearHistory = () => {
  chatStore.clearHistory();
  showDeleteConfirm.value = false;
  showToast.value = true;
  
  // Auto-hide toast after 3 seconds
  setTimeout(() => {
    showToast.value = false;
  }, 3000);
};

const sendMessage = async () => {
  if (newMessage.value.trim() !== "" && !isLoading.value) {
    const userText = newMessage.value.trim();
    newMessage.value = "";
    isLoading.value = true;
    
    // Add user message immediately
    const userMsgId = Date.now();
    chatStore.addMessage({
      id: userMsgId,
      role: "user",
      message: userText
    });
    
    // Scroll after adding user message
    await scrollToBottom();
    
    // Add typing indicator
    const aiTypingId = Date.now() + 1;
    typingMessageId.value = aiTypingId;
    chatStore.addMessage({
      id: aiTypingId,
      role: "ai",
      message: ""
    });
    
    // Scroll to show typing indicator
    await scrollToBottom();
    
    try {
      // Simulate network delay (remove in production with real API)
      const response = await apiClient.post("/chat", {
        message: userText
      }).catch(error => {
        // If API fails, create mock response
        console.log("Using mock response due to API error:", error);
        return {
          data: {
            message: "This is a simulated response since the API isn't connected yet. Your message was: \"" + userText + "\""
          }
        };
      });
      
      // Remove typing indicator
      const index = messages.value.findIndex(m => m.id === aiTypingId);
      if (index !== -1) {
        messages.value.splice(index, 1);
        chatStore.saveMessages(); // Save after removing typing indicator
      }
      
      const aiMsgId = Date.now() + 2;
      lastMessageId.value = aiMsgId;
      chatStore.addMessage({
        id: aiMsgId,
        role: "ai",
        message: response.data.message || response.data.response || "I didn't get a proper response."
      });
      
      // Reset animation after it completes
      setTimeout(() => {
        if (lastMessageId.value === aiMsgId) {
          lastMessageId.value = null;
        }
      }, ANIMATION_RESET_DELAY);
      
      // Scroll to show AI response
      await scrollToBottom();
      
    } catch (error) {
      console.error("Chat process error:", error);
      
      // Remove typing indicator
      const index = messages.value.findIndex(m => m.id === aiTypingId);
      if (index !== -1) {
        messages.value.splice(index, 1);
        chatStore.saveMessages(); // Save after removing typing indicator
      }
      
      // Add error message
      const errorMsgId = Date.now() + 3;
      lastMessageId.value = errorMsgId;
      chatStore.addMessage({
        id: errorMsgId,
        role: "ai",
        message: "Sorry, I encountered an error. Please try again."
      });
      
      // Reset animation after it completes
      setTimeout(() => {
        if (lastMessageId.value === errorMsgId) {
          lastMessageId.value = null;
        }
      }, ANIMATION_RESET_DELAY);
      
      await scrollToBottom();
    } finally {
      typingMessageId.value = null;
      isLoading.value = false;
    }
  }
};

const bubbleClass = (role) => {
  return role === "ai" ? "ai-message" : "user-message";
};
</script>

<style scoped>
.chat-page {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 60px);
  max-width: 960px;
  margin: 0 auto;
  padding: 0 20px;
  overflow-x: hidden; /* Prevent horizontal scrolling */
}

.chat-header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 0;
  margin-top: 10px;
  position: relative;
}

.chat-header h2 {
  font-size: 1.5rem;
  color: #333;
  margin: 0;
  text-align: center;
}

.clear-btn {
  position: absolute;
  right: 0;
  background-color: rgba(220, 53, 69, 0.1);
  border: none;
  color: #dc3545;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.clear-btn:hover {
  background-color: rgba(220, 53, 69, 0.2);
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background-color: #d6e6ff; /* Match the background color from App.vue */
  border-radius: 8px 8px 0 0;
}

.message {
  max-width: 70%;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  margin-bottom: 10px;
  padding: 15px;
  border-radius: 18px;
  font-size: 16px;
  line-height: 1.4;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.ai-message {
  align-self: flex-start;
  background: #ffffff;
  color: #333;
  border-bottom-left-radius: 4px;
}

.user-message {
  align-self: flex-end;
  background: #007bff;
  color: #fff;
  border-bottom-right-radius: 4px;
}

.chat-input-area {
  display: flex;
  padding: 16px;
  gap: 10px;
  background-color: #d6e6ff; /* Match the background color */
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0 0 8px 8px;
  margin-bottom: 20px;
}

.chat-input {
  flex: 1;
  border: 1px solid #ccc;
  border-radius: 24px;
  padding: 12px 16px;
  font-size: 16px;
  resize: none;
  font-family: inherit;
  height: 60px; /* Increased fixed height */
  outline: none;
  overflow-y: hidden; /* Hide scrollbar */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
}

/* Hide scrollbar for Chrome/Safari/Opera */
.chat-input::-webkit-scrollbar {
  display: none;
}

.send-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #007bff;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.2s;
  flex-shrink: 0;
}

.send-btn:hover:not(:disabled) {
  background: #0056b3;
}

.send-btn:disabled,
.chat-input:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Typing indicator */
.typing-indicator {
  display: inline-flex;
  align-items: center;
}

.typing-indicator span {
  height: 8px;
  width: 8px;
  margin: 0 2px;
  background-color: #333;
  border-radius: 50%;
  display: inline-block;
  opacity: 0.7;
  animation: bounce 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(1) {
  animation-delay: -0.32s;
}

.typing-indicator span:nth-child(2) {
  animation-delay: -0.16s;
}

/* Popup styles */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup-container {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.popup-container h3 {
  margin-top: 0;
  color: #333;
}

.popup-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.cancel-btn {
  padding: 8px 16px;
  background-color: #f1f1f1;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.confirm-btn {
  padding: 8px 16px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

/* Toast notification */
.toast-notification {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%) translateY(100px);
  background-color: #333;
  color: white;
  padding: 0;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  opacity: 0;
  transition: all 0.3s ease;
}

.toast-notification.show {
  transform: translateX(-50%) translateY(0);
  opacity: 1;
}

.toast-content {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  gap: 10px;
}

.toast-content svg {
  stroke: #4CAF50;
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

/* Text animation */
.animate-text {
  display: inline-block;
  white-space: pre-wrap;
  overflow: hidden;
  animation: typing 1.5s steps(40, end);
}

@keyframes typing {
  from { max-height: 0; opacity: 0; }
  to { max-height: 1000px; opacity: 1; }
}

/* Responsive design */
@media (max-width: 1200px) {
  .chat-page {
    max-width: 90%;
  }
}

@media (max-width: 768px) {
  .chat-page {
    max-width: 95%;
    padding: 0 10px;
    width: 100%;
    overflow-x: hidden;
  }
  
  .message {
    max-width: 80%;
  }
}

@media (max-width: 480px) {
  .chat-page {
    max-width: 100%;
    padding: 0 8px;
    height: calc(100vh - 56px);
  }
  
  .chat-messages {
    padding: 10px;
  }
  
  .message {
    max-width: 90%;
    padding: 12px;
    font-size: 15px;
  }
  
  .chat-input-area {
    padding: 10px;
  }
  
  body {
    overflow-x: hidden;
  }
}
</style>