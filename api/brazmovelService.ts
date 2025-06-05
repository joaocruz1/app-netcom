// api/brazmovelService.ts
import axios from 'axios';

// Defina a URL base da API Brazmóvel aqui ou em um arquivo de constantes/env
// Exemplo: const API_BASE_URL = 'https://api.brazmovel.com.br/api'; // SUBSTITUA PELA URL CORRETA
const API_BASE_URL = 'SUA_URL_BASE_DA_API_BRAZMOVEL_AQUI'; 

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    // Outros headers que a API possa exigir
  },
});

// Interface para os dados de login
interface LoginPayload {
  grant_type: 'password' | 'password_codcliente';
  username: string;
  password: string;
}

// Interface para a resposta de sucesso do login (simplificada)
export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: {
    id: number;
    nome_razao: string;
    // Adicione outros campos do usuário que você queira usar
  };
}

export const loginUser = async (payload: LoginPayload): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>('/auth/login', payload);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // O servidor respondeu com um status de erro (4xx, 5xx)
      console.error('API Login Error:', error.response.data);
      throw error.response.data; // Lança os dados do erro da API
    } else {
      // Erro de rede ou outro tipo de erro
      console.error('Network or other error:', error);
      throw new Error('Erro ao tentar fazer login. Verifique sua conexão.');
    }
  }
};

// Você adicionará outras funções de API aqui depois (buscar faturas, etc.)