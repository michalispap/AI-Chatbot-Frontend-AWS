<template>
  <div class="chat-page">
    <div class="chat-messages">
      <div
        v-for="msg in messages"
        :key="msg.id"
        class="message"
        :class="bubbleClass(msg.role)"
      >
        {{ msg.message }}
      </div>
    </div>

    <div class="chat-input-area">
      <input
        v-model="newMessage"
        @keyup.enter="sendMessage"
        placeholder="Type a message..."
      />
      <button @click="sendMessage" class="send-btn">
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

const chatStore = useChatStore();
const { messages } = storeToRefs(chatStore);
const newMessage = ref("");

onMounted(() => {
  chatStore.fetchMessages();
});

const sendMessage = async () => {
  if (newMessage.value.trim() !== "") {
    await chatStore.sendMessage(newMessage.value.trim());
    newMessage.value = "";
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
