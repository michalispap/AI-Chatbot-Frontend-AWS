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