// api/brazmovelService.ts
import axios from 'axios';

// ❗ IMPORTANTE: Substitua pela URL base correta da API Brazmóvel
const API_BASE_URL = 'https://sua-url-da-api.com.br/api'; 

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tipagem para os dados que enviamos no login
interface LoginPayload {
  grant_type: 'password' | 'password_codcliente';
  username: string;
  password: string;
}

// Tipagem para a resposta de sucesso que esperamos da API
export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: {
    id: number;
    nome_razao: string;
    // Adicione outros campos do usuário que a API retorna e você queira usar
  };
}

/**
 * Função para autenticar o usuário na API Brazmóvel.
 * @param payload - Os dados de login (grant_type, username, password).
 * @returns A promessa com os dados de autenticação.
 */
export const loginUser = async (payload: LoginPayload): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>('/auth/login', payload);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // O servidor respondeu com um erro (ex: 401 - Não Autorizado)
      console.error('API Login Error:', error.response.data);
      // Lança o erro para que a tela de login possa tratá-lo
      throw new Error(error.response.data.message || 'Usuário ou senha inválidos.');
    } else {
      // Erro de rede ou outro problema
      console.error('Network or other error:', error);
      throw new Error('Não foi possível conectar. Verifique sua internet.');
    }
  }
};