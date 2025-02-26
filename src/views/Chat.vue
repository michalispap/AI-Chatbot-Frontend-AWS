<template>
  <div class="chat-page">
    <div class="chat-messages">
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
      <input
        v-model="newMessage"
        @keyup.enter="sendMessage"
        placeholder="Type a message..."
        :disabled="isLoading"
      />
      <button @click="sendMessage" class="send-btn" :disabled="isLoading">
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
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useChatStore } from "../stores/chat";
import { storeToRefs } from "pinia";
import apiClient from "../services/api";

const chatStore = useChatStore();
const { messages } = storeToRefs(chatStore);
const newMessage = ref("");
const isLoading = ref(false);
const typingMessageId = ref(null);
const lastMessageId = ref(null);

onMounted(() => {
  chatStore.fetchMessages();
});

const sendMessage = async () => {
  if (newMessage.value.trim() !== "" && !isLoading.value) {
    const userText = newMessage.value.trim();
    newMessage.value = "";
    isLoading.value = true;
    
    // Add user message immediately
    const userMsgId = Date.now();
    messages.value.push({
      id: userMsgId,
      role: "user",
      message: userText
    });
    
    // Add typing indicator
    const aiTypingId = Date.now() + 1;
    typingMessageId.value = aiTypingId;
    messages.value.push({
      id: aiTypingId,
      role: "ai",
      message: ""
    });
    
    try {
      // Call actual AI API endpoint
      const response = await apiClient.post("/chat", {
        message: userText
      });
      
      // Remove typing indicator
      const index = messages.value.findIndex(m => m.id === aiTypingId);
      if (index !== -1) {
        messages.value.splice(index, 1);
      }
      
      const aiMsgId = Date.now() + 2;
      lastMessageId.value = aiMsgId;
      messages.value.push({
        id: aiMsgId,
        role: "ai",
        message: response.data.message || response.data.response || "I didn't get a proper response."
      });
    } catch (error) {
      console.error("Error fetching AI response:", error);
      
      // Remove typing indicator
      const index = messages.value.findIndex(m => m.id === aiTypingId);
      if (index !== -1) {
        messages.value.splice(index, 1);
      }
      
      // Add error message
      messages.value.push({
        id: Date.now() + 3,
        role: "ai",
        message: "Sorry, I encountered an error. Please try again."
      });
    } finally {
      typingMessageId.value = null;
      isLoading.value = false;
      
      // Reset animation class after animation completes
      setTimeout(() => {
        lastMessageId.value = null;
      }, 2000);
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
  height: 100vh;
  margin-right: 300px;
  margin-left: 300px;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: #f4f4f4;
  display: flex;
  flex-direction: column;
  background-color: #d6e6ff;
}

.message {
  max-width: 60%;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  margin-bottom: 10px;
  padding: 15px;
  border-radius: 8px;
  font-size: 16px;
  line-height: 1.4;
}

.ai-message {
  align-self: flex-start;
  background: #5f95e7;
  color: #fff;
}

.user-message {
  align-self: flex-end;
  background: #409cff;
  color: #fff;
}

.chat-input-area {
  position: sticky;
  bottom: 0;
  background: #fff;
  display: flex;
  padding: 10px;
  background-color: #d6e6ff;
}

.chat-input-area input {
  flex: 1;
  border: 1px solid #ccc;
  border-radius: 5px 0 0 5px;
  padding: 10px;
  font-size: 16px;
}

.send-btn {
  width: 50px;
  background: #409cff;
  border: none;
  border-radius: 0 5px 5px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.send-btn:hover {
  background: #0056b3;
}

.send-btn:disabled,
input:disabled {
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
  background-color: #ffffff;
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

@media (max-width: 600px),
       (orientation: landscape) and (max-height: 600px) {
  .chat-page {
    max-width: none;
    width: 100%;
    margin: 0;
    padding: 0;
  }
}
</style>