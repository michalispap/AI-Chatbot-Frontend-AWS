import { defineStore } from "pinia";
import { ref } from "vue";
import apiClient from "../services/api";

export const useUserStore = defineStore("user", () => {
  const user = ref({
    firstName: "",
    lastName: "",
    email: "",
  });
  
  const isLoading = ref(false);
  const error = ref(null);

  // Using hardcoded studentId S123
  const fetchUser = async () => {
    isLoading.value = true;
    error.value = null;
    
    try {
      // Request to the specific endpoint with hardcoded student ID
      const response = await apiClient.get("/api/students/S123");
      
      // Map the response fields to our user object
      user.value = {
        firstName: response.data.first_name || "",
        lastName: response.data.last_name || "",
        email: response.data.email || "",
      };
      
      // We're intentionally excluding studentId and timestamp
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
      // We could implement the update functionality later
      // This is a placeholder for now
      await apiClient.put("/api/students/S123", {
        first_name: newUserData.firstName,
        last_name: newUserData.lastName,
        email: newUserData.email
      });
      
      user.value = newUserData;
      return true;
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