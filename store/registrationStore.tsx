// store/registrationStore.ts
import { create } from 'zustand';

// Definimos a estrutura dos dados que vamos coletar
interface RegistrationState {
  email: string;
  // Informações Pessoais
  fullName: string;
  cpf: string;
  birthDate: string;
  // Informações de Endereço
  cep: string;
  street: string;
  neighborhood: string;
  number: string;
  complement: string;
  city: string;
  state: string;
  // Ação para atualizar qualquer campo do formulário
  updateField: (field: keyof Omit<RegistrationState, 'updateField'>, value: string) => void;
  // Ação para limpar os dados após o envio
  reset: () => void;
}

const initialState = {
  email: '',
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