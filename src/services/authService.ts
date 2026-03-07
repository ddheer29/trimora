import api from './apiConfig';
import { User } from '../store/userStore';

export interface ApiResponse<T> {
  status: string;
  data?: T;
  message?: string;
}

export interface AuthResponse {
  status: string;
  accessToken: string;
  refreshToken: string;
  data?: {
    user: User;
  };
}

export interface ProfileResponse {
  status: string;
  data?: {
    user: User;
  };
  message?: string;
}

export interface OTPResponse {
  status: string;
  message: string;
}

export const authService = {
  // Send OTP for phone login
  sendOtp: async (
    phone: string,
    role: string = 'partner',
  ): Promise<OTPResponse> => {
    console.log(`🚀 -> { phone, role }:`, { phone, role });
    const response = await api.post('/auth/send-otp', { phone, role });
    return response.data;
  },

  // Verify OTP and login/register
  verifyOtp: async (
    phone: string,
    otp: string,
    role: string = 'customer',
  ): Promise<AuthResponse> => {
    const response = await api.post('/auth/verify-otp', {
      phone,
      otp,
      role,
    });
    return response.data;
  },

  // Refresh token
  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data;
  },

  // Logout - typically client-side, but if server-side is needed:
  logout: async (): Promise<ApiResponse<null>> => {
    // Backend doesn't have a specific logout route in the doc,
    // but often it's used to blacklist tokens.
    // Assuming client-side logout handles clearing store.
    return { status: 'success', message: 'Logged out successfully' };
  },
};
