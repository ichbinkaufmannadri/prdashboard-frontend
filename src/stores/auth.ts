import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserDTO } from '@/types/domain';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: UserDTO | null;
  isHydrated: boolean;

  setAuth: (payload: { accessToken: string; refreshToken: string; user: UserDTO }) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: UserDTO) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isHydrated: false,

      setAuth: ({ accessToken, refreshToken, user }) =>
        set({ accessToken, refreshToken, user }),
      setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
      setUser: (user) => set({ user }),
      clear: () => set({ accessToken: null, refreshToken: null, user: null }),
    }),
    {
      name: 'prdashboard-auth',
      onRehydrateStorage: () => (state) => {
        if (state) state.isHydrated = true;
      },
    },
  ),
);
