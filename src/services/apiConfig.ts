import axios from 'axios';
import { useUserStore } from '../store/userStore';

const BASE_URL = 'http://172.16.2.112:5001/api';

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
  async error => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = useUserStore.getState().refreshToken;
      if (refreshToken) {
        try {
          const response = await axios.post(`${BASE_URL}/auth/refresh`, {
            refreshToken,
          });
          const { accessToken, refreshToken: newRefreshToken } = response.data;
          useUserStore.getState().setTokens({
            accessToken,
            refreshToken: newRefreshToken,
          });
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          useUserStore.getState().logout();
          return Promise.reject(refreshError);
        }
      } else {
        useUserStore.getState().logout();
      }
    }
    return Promise.reject(error);
  },
);

export default api;
