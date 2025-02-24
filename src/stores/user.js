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
      const response = await apiClient.get("/user"); //To be implemented
      user.value = {
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        email: response.data.email,
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
      await apiClient.put("/user", newUserData); //To be implemented
      user.value = newUserData;
    } catch (error) {
      console.error(
        "Error updating user:",
        error.response?.data || error.message
      );
    }
  };

  return { user, fetchUser, updateUser };
});
