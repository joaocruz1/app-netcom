// store/authStore.ts (ATUALIZADO)
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// 1. (Opcional, mas recomendado) Definir uma interface para o objeto do usuário para ter um código mais seguro e previsível.
export interface User {
  id: string;
  cpf: string;
  email: string;
  name: string;
  status: string;
}

// 2. Atualizar o estado para incluir as informações do usuário
export interface AuthState {
  token: string | null;
  user: User | null; // Adicionado o estado do usuário
  isAuthenticated: boolean;
  _hasHydrated: boolean;
  login: (token: string, user: User) => void; // Ação de login agora recebe o usuário
  logout: () => void;
  setHasHydrated: (hydrated: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // 3. Adicionar os valores iniciais
      token: null,
      user: null,
      isAuthenticated: false,
      _hasHydrated: false,

      setHasHydrated: (hydrated) => {
        set({
          _hasHydrated: hydrated,
        });
      },

      // 4. Atualizar a ação de login para salvar o token E o usuário
      login: (token, user) => {
        set({
          token,
          user, // Salva o objeto do usuário no estado
          isAuthenticated: !!token,
        });
      },

      // 5. Atualizar o logout para limpar o token E o usuário
      logout: () => {
        set({
          token: null,
          user: null, // Limpa o usuário ao fazer logout
          isAuthenticated: false,
        });
        // Opcional: Limpar também o AsyncStorage completamente se necessário
        // AsyncStorage.removeItem('auth-storage');
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: (state) => {
        console.log('Dados de autenticação carregados do storage.');
        state?.setHasHydrated(true);
      },
    },
  ),
);
