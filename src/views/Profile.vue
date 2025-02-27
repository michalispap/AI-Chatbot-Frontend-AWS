<template>
  <div class="profile-container">
    <h1 class="title">User Profile</h1>
    
    <div v-if="isLoading" class="loading">
      Loading profile data...
    </div>
    
    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>
    
    <form v-else @submit.prevent="saveProfile">
      <label>First Name</label>
      <input v-model="user.firstName" type="text" />

      <label>Last Name</label>
      <input v-model="user.lastName" type="text" />

      <label>Email</label>
      <input v-model="user.email" type="email" disabled />
      <small>Email cannot be changed</small>

      <div class="form-actions">
        <button type="submit" :disabled="isSubmitting">
          {{ isSubmitting ? 'Saving...' : 'Save' }}
        </button>
      </div>
      
      <div v-if="saveError" class="error-message">
        {{ saveError }}
      </div>
      
      <div v-if="saveSuccess" class="success-message">
        {{ saveMessage }}
      </div>
    </form>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useUserStore } from "../stores/user";
import { storeToRefs } from "pinia";

const userStore = useUserStore();
const { user, isLoading, error } = storeToRefs(userStore);

const isSubmitting = ref(false);
const saveError = ref(null);
const saveSuccess = ref(false);
const saveMessage = ref("Profile updated successfully!");

onMounted(() => {
  userStore.fetchUser();
});

const saveProfile = async () => {
  saveError.value = null;
  saveSuccess.value = false;
  isSubmitting.value = true;
  
  try {
    const response = await userStore.updateUser({
      firstName: user.value.firstName,
      lastName: user.value.lastName,
      // Email is not included since we don't want to update it
    });
    
    saveSuccess.value = true;
    saveMessage.value = response?.message || "Profile updated successfully!";
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      saveSuccess.value = false;
    }, 3000);
    
  } catch (err) {
    saveError.value = "Failed to save profile changes. Please try again.";
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.profile-container {
  max-width: 600px;
  margin: 50px auto;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

.title {
  text-align: center;
  margin-bottom: 20px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

label {
  font-weight: bold;
}

input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

input:disabled {
  background-color: #f1f1f1;
  cursor: not-allowed;
}

small {
  color: #666;
  font-size: 0.8rem;
  margin-top: -10px;
}

.form-actions {
  margin-top: 10px;
}

button {
  background-color: #409cff;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  width: 100%;
}

button:hover {
  background-color: #0056b3;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.loading {
  text-align: center;
  padding: 20px;
  font-weight: bold;
  color: #666;
}

.error-message {
  color: #e74c3c;
  padding: 10px;
  border-radius: 5px;
  background-color: #fdeded;
  margin: 10px 0;
}

.success-message {
  color: #2ecc71;
  padding: 10px;
  border-radius: 5px;
  background-color: #e8f8f5;
  margin: 10px 0;
}

@media (max-width: 600px),
       (orientation: landscape) and (max-height: 600px) {
  .profile-container {
    margin: 20px;
    width: auto;
  }
}
</style>