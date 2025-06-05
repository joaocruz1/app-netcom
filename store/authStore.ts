// store/authStore.ts
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: number;
  nome_razao: string;
}

interface AuthState {
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (token: string, userData: User) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  isAuthenticated: false,

  setAuth: async (token, userData) => {
    set({ accessToken: token, user: userData, isAuthenticated: true });
    await AsyncStorage.setItem('accessToken', token);
    await AsyncStorage.setItem('userData', JSON.stringify(userData));
  },

  logout: async () => {
    set({ accessToken: null, user: null, isAuthenticated: false });
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('userData');
  },
}));