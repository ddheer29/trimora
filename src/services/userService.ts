import api from './apiConfig';
import { User } from '../store/userStore';
import { ApiResponse } from './authService';

export interface UpdateProfileData {
  name?: string;
  dob?: string;
  address?: string;
  phone?: string;
  profilePhoto?: any;
}

export const userService = {
  // Get user profile
  getProfile: async (): Promise<ApiResponse<User>> => {
    const response = await api.get('/customers/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (
    formData: FormData,
  ): Promise<ApiResponse<User>> => {
    const response = await api.put('/customers/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
