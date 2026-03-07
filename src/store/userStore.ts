import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from '../storage/mmkvStorage';

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  dob?: string;
  address?: string;
  addressType?: string;
  profilePhoto?: string;
  role?: string;
  isProfileCompleted?: boolean;
}

interface UserState {
  user: User | null;
  isLoggedIn: boolean;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  login: (
    user: User,
    tokens: { accessToken: string; refreshToken: string },
  ) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  setTokens: (tokens: { accessToken: string; refreshToken: string }) => void;
  setLoading: (loading: boolean) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoggedIn: false,
      token: null,
      refreshToken: null,
      isLoading: false,
      login: (
        user: User,
        tokens: { accessToken: string; refreshToken: string },
      ) => {
        set({
          user,
          isLoggedIn: true,
          token: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        });
      },
      logout: () => {
        set({
          user: null,
          isLoggedIn: false,
          token: null,
          refreshToken: null,
        });
      },
      updateUser: (updatedUser: Partial<User>) => {
        const currentUser = get().user;
        set({
          user: currentUser
            ? { ...currentUser, ...updatedUser }
            : (updatedUser as User),
        });
      },
      setTokens: (tokens: { accessToken: string; refreshToken: string }) => {
        set({
          token: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        });
      },
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);
