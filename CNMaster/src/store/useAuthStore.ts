import { create } from 'zustand';
import { createMMKV } from 'react-native-mmkv';
import { User } from '../types';

export const storage = createMMKV();

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isInitializing: boolean;
  hasSeenOnboarding: boolean;
  
  setUser: (user: Partial<User>) => void; 
  setTokens: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  initialize: () => void;
  completeOnboarding: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isInitializing: true,
  hasSeenOnboarding: false,

  setUser: (userData) => {
    set((state) => {
      const currentUser = (state.user || {}) as Partial<User>;
      
      const updatedUser = {
        ...currentUser,
        ...userData,
        isProfileCompleted: userData.isProfileCompleted ?? currentUser.isProfileCompleted ?? true,
      } as User;

      storage.set('user', JSON.stringify(updatedUser));
      return { user: updatedUser };
    });
  },
  
  setTokens: (accessToken, refreshToken) => {
    storage.set('accessToken', accessToken);
    storage.set('refreshToken', refreshToken);
    set({ accessToken, refreshToken });
  },
  
  logout: () => {
    storage.remove('accessToken');
    storage.remove('refreshToken');
    storage.remove('user');
    set({ user: null, accessToken: null, refreshToken: null });
  },

  completeOnboarding: () => {
    storage.set('hasSeenOnboarding', true);
    set({ hasSeenOnboarding: true });
  },
  
  initialize: () => {
    const accessToken = storage.getString('accessToken') || null;
    const refreshToken = storage.getString('refreshToken') || null;
    const hasSeenOnboarding = storage.getBoolean('hasSeenOnboarding') ?? false;

    const userString = storage.getString('user');
    let user = null;
    if (userString) {
      try {
        user = JSON.parse(userString); 
      } catch (error) {
        console.error('Failed to parse user from storage:', error);
      }
    }

    set({ 
      accessToken, 
      refreshToken, 
      hasSeenOnboarding,
      user,
      isInitializing: false 
    });
  },
}));