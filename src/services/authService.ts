import api from './apiConfig';
import { User } from '../store/userStore';

export interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  message?: string;
}

export interface AuthResponse {
  user: User;
  tokens: {
    access_token: string;
    refresh_token: string;
  };
}

export interface OTPResponse {
  message: string;
  success?: boolean;
}

export interface UsernameAvailabilityResponse {
  available: boolean;
}

export const authService = {
  // Send OTP for phone login
  sendOtp: async (phoneNumber: string): Promise<OTPResponse> => {
    const response = await api.post('/auth/send-otp', { phoneNumber });
    return response.data;
  },

  // Verify OTP and login/register
  verifyOtp: async (
    phoneNumber: string,
    otp: string,
  ): Promise<AuthResponse> => {
    const response = await api.post('/auth/verify-otp', {
      phoneNumber,
      otp,
    });
    return response.data;
  },

  // Sign in with OAuth (Google/Facebook)
  signInWithOauth: async (
    provider: 'google' | 'facebook',
    id_token: string,
  ): Promise<AuthResponse> => {
    const response = await api.post('/auth/signin-oauth', {
      provider,
      id_token,
    });
    return response.data;
  },

  // Sign up with OAuth
  signUpWithOauth: async (
    provider: 'google' | 'facebook',
    id_token: string,
    userData: {
      name: string;
      userImage: string;
      username: string;
      bio: string;
      email: string;
    },
  ): Promise<AuthResponse> => {
    const response = await api.post('/auth/signup-oauth', {
      provider,
      id_token,
      ...userData,
    });
    return response.data;
  },

  // Check username availability
  checkUsernameAvailability: async (
    username: string,
  ): Promise<UsernameAvailabilityResponse> => {
    const response = await api.post('/auth/check-username', { username });
    return response.data;
  },

  // Refresh token
  refreshToken: async (
    refresh_token: string,
  ): Promise<{ tokens: { access_token: string; refresh_token: string } }> => {
    const response = await api.post('/auth/refresh-token', { refresh_token });
    return response.data;
  },

  // Logout
  logout: async (): Promise<ApiResponse<null>> => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
};
