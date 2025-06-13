import { create } from 'zustand';

// Interface para o endereço
interface Address {
  street: string;
  city: string;
  state: string;
  neighborhood: string;
  cep: string;
  number: string;
  complement: string;
}

// Interface para o estado completo da aplicação
export interface AppState {
  // --- Dados do Usuário ---
  name: string;
  cpf: string;
  birthdate: string;
  email: string;
  password: string;
  gender: string;
  
  // --- Dados da Linha (Exemplo) ---
  line: {
    iccid: string;
  };

  // --- Endereço ---
  address: Address;


  // Dados para login 
  cpfLogin: string;
  passwordLogin: string;


  // --- Funções para atualizar o estado ---
  setName: (name: string) => void;
  setCpf: (cpf: string) => void;
  setBirthdate: (birthdate: string) => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setAddress: (address: Address) => void;

  // --- Funções para atualizar o estado LOGIN ---
  setCPFLogin: (cpfLogin: string) => void;
  setPasswordLogin: (passwordLogin: string) => void;
}

// Criação do store com o estado e as ações
export const useStore = create<AppState>((set) => ({
  // Valores iniciais do estado
  name: '',
  cpf: '',
  birthdate: '',
  email: '',
  password: '',
  gender: 'M',
  line: { iccid: '89551094260145182086' }, // Valor padrão de exemplo
  address: {
    street: '',
    city: '',
    state: '',
    neighborhood: '',
    cep: '',
    number: '',
    complement: '',
  },

  // Valores inciais do estado Login
  cpfLogin: '',
  passwordLogin: '',

  // Funções que atualizam o estado
  setName: (name) => set({ name }),
  setCpf: (cpf) => set({ cpf }),
  setBirthdate: (birthdate) => set({ birthdate }),
  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),
  setAddress: (address) => set({ address }),


  // Funções que atualizam o estado para LOGIN
  setCPFLogin: (cpfLogin) => set({ cpfLogin }),
  setPasswordLogin: (passwordLogin) => set({ passwordLogin }),
  
}));