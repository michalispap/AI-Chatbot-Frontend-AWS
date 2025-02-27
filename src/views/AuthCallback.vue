<template>
    <div class="callback-container">
      <div class="loading">
        <div class="spinner"></div>
        <p>Authenticating...</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { handleRedirectSignIn } from 'aws-amplify/auth/cognito';
  import { useAuthStore } from '../stores/auth';
  
  const router = useRouter();
  const authStore = useAuthStore();
  
  onMounted(async () => {
    try {
      // Handle the redirect and process the response
      await handleRedirectSignIn();
      
      // Update authentication state
      await authStore.checkAuth();
      
      // Redirect to the chat page after successful authentication
      router.replace('/chat');
    } catch (error) {
      console.error('Error during authentication callback:', error);
      router.replace('/login');
    }
  });
  </script>
  
  <style scoped>
  .callback-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
  
  .loading {
    text-align: center;
  }
  
  .spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-left-color: #409cff;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    margin: 0 auto 20px;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  </style>