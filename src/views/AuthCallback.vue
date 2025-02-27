<template>
  <div class="callback-container">
    <div class="loading">
      <div class="spinner"></div>
      <p>Please wait...</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getCurrentUser } from 'aws-amplify/auth';

const router = useRouter();

onMounted(async () => {
  try {
    await getCurrentUser();
    router.push('/chat');
  } catch {
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
</style>