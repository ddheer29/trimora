import { authService } from '../services/authService';
import { useUserStore } from '../store/userStore';

export const refreshAuthToken = async (): Promise<boolean> => {
  try {
    const refreshToken = useUserStore.getState().refreshToken;

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await authService.refreshToken(refreshToken);

    if (response.tokens) {
      useUserStore.getState().setTokens(response.tokens);
      return true;
    }

    return false;
  } catch (error) {
    console.error('Token refresh failed:', error);
    useUserStore.getState().logout();
    return false;
  }
};
