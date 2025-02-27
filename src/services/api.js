import axios from "axios";
import { fetchAuthSession } from 'aws-amplify/auth';

// Development flag to switch between mock and real API
const USE_MOCK_API = true; // Change to false when connecting to actual backend

const apiClient = axios.create({
  baseURL: USE_MOCK_API ? 
    "https://backend-api.com" : // Replace with actual API when ready
    "https://your-real-backend-url.com", 
  headers: {
    "Content-Type": "application/json",
  },
});

// Add authentication interceptor
apiClient.interceptors.request.use(async (config) => {
  try {
    const session = await fetchAuthSession();
    if (session.tokens?.idToken) {
      config.headers.Authorization = `Bearer ${session.tokens.idToken.toString()}`;
    }
    return config;
  } catch (error) {
    console.error('Error adding auth token to request:', error);
    return config;
  }
});

// Add response interceptor for better error handling
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.status, error.response.data);
      
      // Handle 401 Unauthorized
      if (error.response.status === 401) {
        // Redirect to login or refresh token
        console.warn('Authentication required');
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('Network Error:', error.request);
    } else {
      // Error setting up request
      console.error('Request Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Mock API functions for development
export const mockAPI = {
  chat: (message) => {
    return Promise.resolve({
      data: {
        message: `This is a mock response to: "${message}"`
      }
    });
  },
  getUser: () => {
    return Promise.resolve({
      data: {
        firstName: "Demo",
        lastName: "User",
        email: "demo@example.com"
      }
    });
  }
};

export default apiClient;