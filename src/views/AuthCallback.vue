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

const router = useRouter();

onMounted(async () => {
  try {
    // Wait a moment for Amplify to process the callback
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Try to get the session
    const session = await fetchAuthSession();
    
    if (session.tokens) {
      router.push('/chat');
    } else {
      console.error('No session tokens found');
      router.push('/login');
    }
  } catch (error) {
    console.error('Error during authentication callback:', error);
    router.push('/login');
  }
});
</script>