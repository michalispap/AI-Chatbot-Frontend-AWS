<template>
    <div class="login-container">
      <h1>Login</h1>
      <div v-if="error" class="error-message">{{ error }}</div>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">Username/Email</label>
          <input 
            type="text" 
            id="username" 
            v-model="username" 
            required 
          />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            required 
          />
        </div>
        <button type="submit" :disabled="isLoading">
          {{ isLoading ? 'Logging in...' : 'Login' }}
        </button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '../stores/auth';
  
  const router = useRouter();
  const authStore = useAuthStore();
  
  const username = ref('');
  const password = ref('');
  const error = ref('');
  const isLoading = ref(false);
  
  const handleLogin = async () => {
    isLoading.value = true;
    error.value = '';
    
    try {
      await authStore.signIn(username.value, password.value);
      router.push('/'); // Redirect to home after login
    } catch (err) {
      console.error(err);
      error.value = err.message || 'Failed to login. Please try again.';
    } finally {
      isLoading.value = false;
    }
  };
  </script>
  
  <style scoped>
  .login-container {
    max-width: 400px;
    margin: 60px auto;
    padding: 20px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  h1 {
    text-align: center;
    margin-bottom: 24px;
  }
  
  .form-group {
    margin-bottom: 16px;
  }
  
  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
  }
  
  input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
  }
  
  button {
    width: 100%;
    padding: 12px;
    background-color: #409cff;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  
  button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
  
  .error-message {
    color: #e74c3c;
    margin-bottom: 16px;
    padding: 8px;
    background-color: #fdeded;
    border-radius: 4px;
  }
  </style>