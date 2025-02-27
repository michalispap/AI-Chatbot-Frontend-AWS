import axios from "axios";
import { fetchAuthSession } from 'aws-amplify/auth';

const apiClient = axios.create({
  baseURL: "https://backend-api.com", // Replace with actual API endpoint
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

export default apiClient;