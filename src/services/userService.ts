import api from './apiConfig';
import { User } from '../store/userStore';
import { ApiResponse } from './authService';

export interface UpdateProfileData {
  name?: string;
  userImage?: string;
  email?: string;
}

export const userService = {
  // Get user profile
  getProfile: async (): Promise<ApiResponse<User>> => {
    const response = await api.get('/user/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (
    userData: UpdateProfileData,
  ): Promise<ApiResponse<User>> => {
    const response = await api.patch('/user/profile', userData);
    return response.data;
  },

  // Upload avatar
  uploadAvatar: async (
    formData: FormData,
  ): Promise<ApiResponse<{ userImage: string }>> => {
    const response = await api.post('/user/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
