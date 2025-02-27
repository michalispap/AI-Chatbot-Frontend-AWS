import { defineStore } from "pinia";
import { ref } from "vue";
import apiClient from "../services/api";
import { getCurrentUser } from 'aws-amplify/auth';

export const useUserStore = defineStore("user", () => {
  const user = ref({
    firstName: "",
    lastName: "",
    email: "",
    id: "" // To store the Cognito user ID
  });
  
  const isLoading = ref(false);
  const error = ref(null);

  const fetchUser = async () => {
    isLoading.value = true;
    error.value = null;
    
    try {
      // Get Cognito user ID
      const cognitoUser = await getCurrentUser();
      user.value.id = cognitoUser.userId || "S123"; // Fallback to S123 if not available
      
      // Request to the specific endpoint
      const response = await apiClient.get("/api/students/S123");
      
      // Map the response fields to our user object
      user.value = {
        ...user.value, // Keep the ID
        firstName: response.data.first_name || "",
        lastName: response.data.last_name || "",
        email: response.data.email || "",
      };
      
      console.log("Profile data loaded successfully");
      
    } catch (err) {
      console.error("Error fetching user data:", err);
      error.value = "Failed to load profile data. Please try again later.";
    } finally {
      isLoading.value = false;
    }
  };
  
  const updateUser = async (newUserData) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      // POST to upsert endpoint with the required format
      const response = await apiClient.post("/api/students/upsert", {
        id: user.value.id,  // Use the Cognito ID
        first_name: newUserData.firstName,
        last_name: newUserData.lastName,
        email: user.value.email  // Keep the original email, don't allow changes
      });
      
      // Update local state with new values but keep email unchanged
      user.value = {
        ...user.value,
        firstName: newUserData.firstName,
        lastName: newUserData.lastName
      };
      
      return response.data; // Return response for UI feedback
    } catch (err) {
      console.error("Error updating user:", err);
      error.value = "Failed to update profile. Please try again later.";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  return { user, isLoading, error, fetchUser, updateUser };
});