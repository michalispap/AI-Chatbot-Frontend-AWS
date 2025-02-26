import { defineStore } from "pinia";
import { ref } from "vue";
import { signIn, signOut, getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const isAuthenticated = ref(false);
  const isLoading = ref(true);

  // Check current auth status
  const checkAuth = async () => {
    isLoading.value = true;
    try {
      const userData = await getCurrentUser();
      user.value = userData;
      isAuthenticated.value = true;
    } catch (error) {
      user.value = null;
      isAuthenticated.value = false;
    }
    isLoading.value = false;
  };

  // Sign in user
  const signInUser = async (username, password) => {
    try {
      const userData = await signIn({ username, password });
      user.value = userData;
      isAuthenticated.value = true;
      return userData;
    } catch (error) {
      throw error;
    }
  };

  // Sign out user
  const signOutUser = async () => {
    try {
      await signOut();
      user.value = null;
      isAuthenticated.value = false;
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    checkAuth,
    signIn: signInUser,
    signOut: signOutUser
  };
});