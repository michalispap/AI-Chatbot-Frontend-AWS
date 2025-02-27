<template>
  <div class="callback-container">
    <div class="loading">
      <div class="spinner"></div>
      <p>Completing authentication...</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { fetchAuthSession } from 'aws-amplify/auth';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

onMounted(async () => {
  try {
    // First, try to get the auth session which will process the OAuth callback
    const session = await fetchAuthSession();
    
    if (session.tokens) {
      // Update authentication state
      await authStore.checkAuth();
      // Redirect to the chat page after successful authentication
      router.replace('/chat');
    } else {
      console.error('No session tokens found');
      router.replace('/login');
    }
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