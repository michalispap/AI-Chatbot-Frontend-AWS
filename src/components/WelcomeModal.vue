<template>
  <div class="modal-overlay">
    <div class="modal-container">
      <h2>Welcome to Better Canvas!</h2>
      <p class="welcome-text">Please complete your profile to get started.</p>
      
      <form @submit.prevent="saveProfile">
        <div class="form-group">
          <label for="firstName">First Name</label>
          <input 
            id="firstName" 
            v-model="firstName" 
            type="text" 
            required 
            :class="{ error: errors.firstName }"
          />
          <span class="error-text" v-if="errors.firstName">{{ errors.firstName }}</span>
        </div>
        
        <div class="form-group">
          <label for="lastName">Last Name</label>
          <input 
            id="lastName" 
            v-model="lastName" 
            type="text" 
            required
            :class="{ error: errors.lastName }"
          />
          <span class="error-text" v-if="errors.lastName">{{ errors.lastName }}</span>
        </div>
        
        <div class="form-group">
          <label for="email">Email</label>
          <input id="email" v-model="email" type="email" disabled />
          <small>This is your registered email and cannot be changed.</small>
        </div>
        
        <div class="button-group">
          <button type="submit" :disabled="isSubmitting">
            {{ isSubmitting ? 'Saving...' : 'Continue' }}
          </button>
        </div>
        
        <div v-if="submitError" class="error-message">
          {{ submitError }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '../stores/user';
import { storeToRefs } from 'pinia';

// Define the event that this component will emit
const emit = defineEmits(['onComplete']);

const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const firstName = ref('');
const lastName = ref('');
const email = ref('');
const isSubmitting = ref(false);
const submitError = ref('');
const errors = ref({
  firstName: '',
  lastName: ''
});

onMounted(async () => {
  // Populate email from Cognito user attributes
  email.value = user.value.email || '';
});

const validateForm = () => {
  let isValid = true;
  errors.value = {
    firstName: '',
    lastName: ''
  };
  
  if (!firstName.value.trim()) {
    errors.value.firstName = 'First name is required';
    isValid = false;
  }
  
  if (!lastName.value.trim()) {
    errors.value.lastName = 'Last name is required';
    isValid = false;
  }
  
  return isValid;
};

const saveProfile = async () => {
  if (!validateForm()) return;
  
  isSubmitting.value = true;
  submitError.value = '';
  
  try {
    await userStore.updateUser({
      firstName: firstName.value,
      lastName: lastName.value
    });
    
    // Emit the event to notify parent component
    emit('onComplete');
  } catch (err) {
    submitError.value = "Failed to save profile. Please try again.";
    console.error("Error saving profile:", err);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  background-color: white;
  border-radius: 8px;
  padding: 30px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

h2 {
  color: #333;
  margin-top: 0;
  text-align: center;
  margin-bottom: 10px;
}

.welcome-text {
  text-align: center;
  margin-bottom: 25px;
  color: #555;
}

form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

label {
  font-weight: 600;
  color: #444;
}

input {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
}

input:focus {
  outline: none;
  border-color: #409cff;
  box-shadow: 0 0 0 2px rgba(64, 156, 255, 0.2);
}

input:disabled {
  background-color: #f5f5f5;
  color: #666;
}

input.error {
  border-color: #dc3545;
}

.error-text {
  color: #dc3545;
  font-size: 14px;
  margin-top: 2px;
}

small {
  color: #777;
  font-size: 13px;
}

.button-group {
  margin-top: 10px;
}

button {
  width: 100%;
  padding: 12px;
  background-color: #409cff;
  color: white;
  border: none;
  border-radius: 5px;
  font-weight: 600;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s;
}

button:hover:not(:disabled) {
  background-color: #3089e0;
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error-message {
  padding: 10px;
  background-color: #ffebee;
  color: #c62828;
  border-radius: 4px;
  font-size: 14px;
  text-align: center;
}
</style>