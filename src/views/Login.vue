<template>
  <div class="login-container">
    <h1>You must log in to proceed</h1>
    <div v-if="error" class="error-message">{{ error }}</div>
    <button @click="handleLogin" :disabled="isLoading" class="login-btn">
      {{ isLoading ? 'Redirecting...' : "Let's go!" }}
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();
const error = ref('');
const isLoading = ref(false);

const handleLogin = async () => {
  isLoading.value = true;
  error.value = '';
  
  try {
    await authStore.signInWithHostedUI();
    // Page will redirect to Cognito
  } catch (err) {
    console.error(err);
    error.value = err.message || 'Failed to start login process.';
    isLoading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 60px auto;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

h1 {
  margin-bottom: 24px;
}

.login-btn {
  width: 100%;
  padding: 12px;
  background-color: #409cff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 20px;
}

.login-btn:hover {
  background-color: #0056b3;
}

.login-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.error-message {
  color: #e74c3c;
  margin-bottom: 16px;
  padding: 8px;
  background-color: #fdeded;
  border-radius: 4px;
}
</style>