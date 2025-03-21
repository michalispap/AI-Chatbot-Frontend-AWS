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

  // Function to ensure user has a profile (won't modify existing profiles unless they're empty)
  const ensureUserProfile = async (userId) => {
    try {
      console.log("Checking if profile exists for:", userId);
      
      // First check if profile exists
      try {
        const response = await apiClient.get(`/api/students/${userId}`);
        console.log("Profile exists:", response.data);
        
        // Check if the profile has name data - if not, update it
        if (!response.data.first_name || !response.data.last_name || 
            response.data.first_name === "" || response.data.last_name === "") {
          console.log("Profile exists but has empty fields, updating...");
          
          // Get email
          let email = response.data.email || '';
          if (!email) {
            try {
              const attributes = await fetchUserAttributes();
              email = attributes.email || '';
            } catch (err) {
              console.warn("Couldn't fetch user attributes");
            }
          }

          // Extract names from UvA student email
          let firstName = "Student";
          let lastName = "User";

          if (email && email.endsWith("@student.uva.nl")) {
            try {
              const [localPart] = email.split('@');
              const nameParts = localPart.split('.');
              
              // Only use if we have at least two parts (firstName.lastName)
              if (nameParts.length >= 2) {
                firstName = nameParts[0];
                // Join all remaining parts as last name (handles middle names)
                lastName = nameParts.slice(1).join(' ');
                
                // Capitalize first letter of each name
                firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
                lastName = lastName.charAt(0).toUpperCase() + lastName.slice(1);
              }
            } catch (err) {
              console.warn("Failed to parse name from email:", err);
              // Fall back to defaults if parsing fails
            }
          }

          // Update the empty profile
          await apiClient.post("/api/students/upsert", {
            id: userId,
            first_name: firstName,
            last_name: lastName,
            email: email
          });
          
          console.log("Updated empty profile with default values");
        }
        
        return; // Profile exists with data, do nothing
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

          // Extract names from UvA student email
          let firstName = "Student";
          let lastName = "User";

          if (email && email.endsWith("@student.uva.nl")) {
            try {
              const [localPart] = email.split('@');
              const nameParts = localPart.split('.');
              
              // Only use if we have at least two parts (firstName.lastName)
              if (nameParts.length >= 2) {
                firstName = nameParts[0];
                // Join all remaining parts as last name (handles middle names)
                lastName = nameParts.slice(1).join(' ');
                
                // Capitalize first letter of each name
                firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
                lastName = lastName.charAt(0).toUpperCase() + lastName.slice(1);
              }
            } catch (err) {
              console.warn("Failed to parse name from email:", err);
              // Fall back to defaults if parsing fails
            }
          }

          console.log("Creating new profile with data:", {
            id: userId,
            email: email
          });
          
          // Create minimal profile
          try {
            const response = await apiClient.post("/api/students/upsert", {
              id: userId,
              first_name: firstName,
              last_name: lastName,
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