import axios from 'axios';
import { useUserStore } from '../store/userStore';

const BASE_URL = 'http://localhost:3000/';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  config => {
    const token = useUserStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response?.status === 401) {
      // Token expired or invalid - try to refresh token
      const refreshToken = useUserStore.getState().refreshToken;
      if (refreshToken) {
        // Implement token refresh logic here if needed
      } else {
        useUserStore.getState().logout();
      }
    }
    return Promise.reject(error);
  },
);

export default api;
