import api from './apiConfig';
import { useUserStore, User } from '../store/userStore';
import { ApiResponse, ProfileResponse } from './authService';

export interface UpdateProfileData {
  name?: string;
  dob?: string;
  address?: string;
  phone?: string;
  profilePhoto?: any;
}

const getProfileEndpoint = () => {
  const role = useUserStore.getState().user?.role;
  return role === 'partner' ? '/partner/profile' : '/customers/profile';
};

export const userService = {
  // Get user profile
  getProfile: async (): Promise<ProfileResponse> => {
    const endpoint = getProfileEndpoint();
    const response = await api.get(endpoint);
    return response.data;
  },

  // Update user profile
  updateProfile: async (formData: FormData): Promise<ProfileResponse> => {
    const endpoint = getProfileEndpoint();
    const response = await api.put(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
