import { defineStore } from "pinia";
import { ref } from "vue";
import { 
  signOut, 
  getCurrentUser, 
  fetchAuthSession, 
  signInWithRedirect,
  autoSignIn
} from 'aws-amplify/auth';

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const isAuthenticated = ref(false);
  const isLoading = ref(true);

  // Check current auth status
  const checkAuth = async () => {
    isLoading.value = true;
    try {
      await autoSignIn();
      const session = await fetchAuthSession();
      if (session.tokens) {
        const userData = await getCurrentUser();
        user.value = userData;
        isAuthenticated.value = true;
      } else {
        throw new Error('No valid session');
      }
    } catch (error) {
      user.value = null;
      isAuthenticated.value = false;
    } finally {
      isLoading.value = false;
    }
  };

  // Sign in using Hosted UI
  const signInWithHostedUI = async () => {
    try {
      await signInWithRedirect();
    } catch (error) {
      console.error("Error starting sign-in process:", error);
      throw error;
    }
  };

  // Sign out user
  const signOutUser = async () => {
    try {
      await signOut({ global: true });
      user.value = null;
      isAuthenticated.value = false;
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Initialize auth state
  checkAuth();

  return {
    user,
    isAuthenticated,
    isLoading,
    checkAuth,
    signInWithHostedUI,
    signOut: signOutUser
  };
});