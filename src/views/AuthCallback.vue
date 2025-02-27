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
import { getCurrentUser } from 'aws-amplify/auth';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

onMounted(async () => {
  try {
    const user = await getCurrentUser();
    if (user) {
      await authStore.checkAuth();
      router.push('/chat');
    } else {
      router.push('/login');
    }
  } catch (error) {
    console.error('Error:', error);
    router.push('/login');
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
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>