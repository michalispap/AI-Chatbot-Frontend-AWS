import { defineStore } from "pinia";
import { ref } from "vue";
import apiClient from "../services/api";

export const useUserStore = defineStore("user", () => {
  const user = ref({
    firstName: "",
    lastName: "",
    email: "",
  });

  const fetchUser = async () => {
    try {
      // Update with actual user endpoint
      const response = await apiClient.get("/users/me");
      user.value = {
        firstName: response.data.firstName || response.data.given_name || '',
        lastName: response.data.lastName || response.data.family_name || '',
        email: response.data.email || '',
      };
    } catch (error) {
      console.error(
        "Error fetching user data:",
        error.response?.data || error.message
      );
    }
  };
  
  const updateUser = async (newUserData) => {
    try {
      // Update with actual user update endpoint
      await apiClient.put("/users/me", newUserData);
      user.value = newUserData;
    } catch (error) {
      console.error(
        "Error updating user:",
        error.response?.data || error.message
      );
      throw error;
    }
  };

  return { user, fetchUser, updateUser };
});