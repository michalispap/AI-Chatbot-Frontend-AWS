<template>
  <div id="app">
    <Navbar />
    <div class="main-content">
      <router-view />
    </div>
    
    <!-- Welcome modal for new users -->
    <WelcomeModal 
      v-if="showWelcomeModal" 
      @onComplete="completeWelcome" 
    />
  </div>
</template>

<script setup>
import Navbar from "./components/Navbar.vue";
import WelcomeModal from "./components/WelcomeModal.vue";
import { ref, onMounted } from "vue";
import { useAuthStore } from "./stores/auth";
import { useUserStore } from "./stores/user";
import { useRouter } from "vue-router";
import apiClient from "./services/api";
import { getCurrentUser } from 'aws-amplify/auth';

const authStore = useAuthStore();
const userStore = useUserStore();
const router = useRouter();
const showWelcomeModal = ref(false);
const isCheckingProfile = ref(true);

onMounted(async () => {
  await authStore.checkAuth();
  
  if (authStore.isAuthenticated) {
    // Check if user has a complete profile
    await checkUserProfile();
    
    if (!isCheckingProfile.value && !showWelcomeModal.value) {
      router.push('/chat');
    }
  }
});

// Check if the user has a profile and show welcome modal if not
const checkUserProfile = async () => {
  isCheckingProfile.value = true;
  
  try {
    // Get the user ID
    const cognitoUser = await getCurrentUser();
    const userId = cognitoUser.userId;
    
    try {
      // Try to fetch user profile
      await apiClient.get(`/api/students/${userId}`);
      // If successful, user has a profile
      showWelcomeModal.value = false;
    } catch (error) {
      // If 404 or other error, user doesn't have a profile
      if (error.response?.status === 404 || !error.response) {
        showWelcomeModal.value = true;
        await userStore.fetchUser(); // Still fetch user to get email
      }
    }
  } catch (error) {
    console.error("Error checking user profile:", error);
  } finally {
    isCheckingProfile.value = false;
  }
};

// Called when user completes the welcome modal
const completeWelcome = () => {
  showWelcomeModal.value = false;
  router.push('/chat');
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap");

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  height: 100%;
  font-family: "Poppins", sans-serif;
  font-size: 18px;
  font-weight: 400;
  background-color: #d6e6ff;
  color: #333;
}

#app {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #d6e6ff;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>