import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from '../storage/mmkvStorage';

export interface User {
  id: string;
  name?: string;
  email?: string;
  phone: string;
  userImage?: string;
}

interface UserState {
  user: User | null;
  isLoggedIn: boolean;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  login: (
    user: User,
    tokens: { access_token: string; refresh_token: string },
  ) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  setTokens: (tokens: { access_token: string; refresh_token: string }) => void;
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
        tokens: { access_token: string; refresh_token: string },
      ) => {
        set({
          user,
          isLoggedIn: true,
          token: tokens.access_token,
          refreshToken: tokens.refresh_token,
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
        if (currentUser) {
          set({ user: { ...currentUser, ...updatedUser } });
        }
      },
      setTokens: (tokens: { access_token: string; refresh_token: string }) => {
        set({
          token: tokens.access_token,
          refreshToken: tokens.refresh_token,
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
