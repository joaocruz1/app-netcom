// src/store/authStore.ts

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Definimos a interface para os dados do usuário que queremos guardar
interface User {
  id: string;
  name: string;
  email: string;
  cpf: string;
  status: string;
}

// Definimos a interface completa do nosso estado de autenticação
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
  // (Opcional) um estado para saber quando a store foi reidratada do AsyncStorage
  _hasHydrated: boolean; 
  setHasHydrated: (hasHydrated: boolean) => void;
}

export const useAuthStore = create(
  // 1. O middleware 'persist' envolve toda a nossa store
  persist<AuthState>(
    // 2. A função 'set' é como atualizamos o estado
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      _hasHydrated: false, // Começa como falso

      // Ação de Login: atualiza o estado com os dados recebidos
      login: (userData, token) => {
        set({
          user: userData,
          token: token,
          isAuthenticated: true,
        });
      },

      // Ação de Logout: limpa todos os dados de autenticação
      logout: () => {
        // Também limpa o token do AsyncStorage ao deslogar
        AsyncStorage.removeItem('authToken'); 
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },
      
      setHasHydrated: (hasHydrated) => {
        set({
          _hasHydrated: hasHydrated,
        });
      },
    }),
    // 3. Opções de configuração para o middleware 'persist'
    {
      name: 'auth-storage', // Nome da chave no AsyncStorage
      storage: createJSONStorage(() => AsyncStorage), // Define o motor de armazenamento
      // (Opcional) Função que é chamada após a reidratação do estado
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true);
        }
      },
    }
  )
);