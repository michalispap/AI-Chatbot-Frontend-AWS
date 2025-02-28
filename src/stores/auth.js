import { defineStore } from "pinia";
import { ref } from "vue";
import { 
  signOut, 
  getCurrentUser, 
  fetchAuthSession, 
  signInWithRedirect,
  autoSignIn,
  fetchUserAttributes
} from 'aws-amplify/auth';
import { useChatStore } from "./chat";
import apiClient from "../services/api";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const isAuthenticated = ref(false);
  const isLoading = ref(true);

  // Function to ensure user has a profile (won't modify existing profiles)
  const ensureUserProfile = async (userId) => {
    try {
      console.log("Checking if profile exists for:", userId);
      
      // First check if profile exists
      try {
        const response = await apiClient.get(`/api/students/${userId}`);
        console.log("Profile exists:", response.data);
        return; // Profile exists, do nothing
      } catch (error) {
        // Determine if we should create a profile based on the error
        let shouldCreateProfile = false;
        
        // Case 1: 404 Not Found - Profile definitely doesn't exist
        if (error.response?.status === 404) {
          shouldCreateProfile = true;
          console.log("Profile not found (404), will create new profile");
        }
        // Case 2: No response object - Likely network error or server down
        else if (!error.response) {
          shouldCreateProfile = true;
          console.log("No response from server, will attempt to create profile");
        }
        // Case 3: Server errors (5xx) - Try creating profile as a fallback
        else if (error.response.status >= 500) {
          shouldCreateProfile = true;
          console.log(`Server error (${error.response.status}), will attempt to create profile`);
        } else {
          console.log(`Unexpected error (${error.response?.status}), not creating profile`);
        }
        
        if (shouldCreateProfile) {
          // Try to get email for new profile
          let email = '';
          try {
            const attributes = await fetchUserAttributes();
            email = attributes.email || '';
            console.log("Retrieved email for profile:", email);
          } catch (err) {
            console.warn("Couldn't fetch user attributes:", err);
          }

          console.log("Creating new profile with data:", {
            id: userId,
            email: email
          });
          
          // Create minimal profile
          try {
            const response = await apiClient.post("/api/students/upsert", {
              id: userId,
              first_name: "Student",
              last_name: "User",
              email: email
            });
            console.log("Successfully created profile:", response.data);
          } catch (createError) {
            console.error("Failed to create profile:", createError);
            console.error("Error details:", createError.response?.data);
          }
        }
      }
    } catch (err) {
      console.error("Error in ensureUserProfile:", err);
    }
  };

  // Check current auth status
  const checkAuth = async () => {
    isLoading.value = true;
    try {
      // Try autoSignIn but wrap it in try/catch to handle errors gracefully
      try {
        await autoSignIn();
        console.log("AutoSignIn completed successfully");
      } catch (autoSignInError) {
        // This error is expected in many cases, so we just log it and continue
        console.log("AutoSignIn not applicable:", autoSignInError.message);
        // We can continue with the regular auth flow
      }
      
      // Continue with session check regardless of autoSignIn result
      try {
        const session = await fetchAuthSession();
        if (session.tokens) {
          const userData = await getCurrentUser();
          user.value = userData;
          isAuthenticated.value = true;
          
          console.log("User authenticated:", userData.userId);
          
          // Initialize chat store with user ID
          const chatStore = useChatStore();
          await chatStore.setUserId();
          
          // Check and create profile if needed
          await ensureUserProfile(userData.userId);
        } else {
          console.log("No valid tokens in session");
          throw new Error('No valid session');
        }
      } catch (sessionError) {
        console.log("Session check failed:", sessionError.message);
        throw sessionError;
      }
    } catch (error) {
      console.error("Authentication error:", error);
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
      
      // Clear chat data on logout
      const chatStore = useChatStore();
      chatStore.clearUserData();
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
    signOut: signOutUser,
    ensureUserProfile // Expose this method for manual calls if needed
  };
});