import axios from "axios";

const apiClient = axios.create({
  baseURL: "", //replace with actual base URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
