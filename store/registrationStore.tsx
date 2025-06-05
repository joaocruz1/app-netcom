// store/registrationStore.ts
import { create } from 'zustand';

interface RegistrationState {
  email: string;
  password?: string; // Adicionado
  confirmPassword?: string; // Adicionado
  // ... outros campos que você já tem
  fullName: string;
  cpf: string;
  birthDate: string;
  cep: string;
  street: string;
  neighborhood: string;
  number: string;
  complement: string;
  city: string;
  state: string;
  updateField: (field: keyof Omit<RegistrationState, 'updateField' | 'reset'>, value: string) => void;
  reset: () => void;
}

const initialState = {
  email: '',
  password: '', // Adicionado
  confirmPassword: '', // Adicionado
  fullName: '',
  cpf: '',
  birthDate: '',
  cep: '',
  street: '',
  neighborhood: '',
  number: '',
  complement: '',
  city: '',
  state: '',
};

export const useRegistrationStore = create<RegistrationState>((set) => ({
  ...initialState,
  updateField: (field, value) => set((state) => ({ ...state, [field]: value })),
  reset: () => set(initialState),
}));