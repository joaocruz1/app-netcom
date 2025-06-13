// api/brazmovelService.ts
import axios from 'axios';

// Interface para garantir que o payload tenha o formato correto
interface CustomerPayload {
  name: string;
  cpf: string;
  birthdate: string;
  email: string;
  password: string;
  gender: string;
  line: {
    iccid: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    neighbourhood: string;
    zipCode: string;
    number: string;
    complement: string;
  };
}

interface LoginPayload {
  cpf: string;
  password: string;
}

// O tipo de resposta que esperamos do nosso backend
interface LoginResponse {
  message: string;
  user: {
    id: string;
    email: string;
    name: string;
    cpf: string;
    status: string;
  };
  token: string; // O token JWT!
}


const API_BASE_URL = 'https://nextlayer.dev/';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


export const createCustomer = async (payload: CustomerPayload) => {
  const partnerToken = process.env.EXPO_PUBLIC_API_SECRET_TOKEN;

  console.log('Enviando payload para a API:', payload);

  try {
    const response = await apiClient.post('api/appnetcom/user/create', payload, {
      headers: { Authorization: `Bearer ${partnerToken}` },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('API Error:', error.response.data);
      throw new Error(
        error.response.data.message || 'Ocorreu um erro ao criar o cliente.'
      );
    } else {
      console.error('Network or other error:', error);
      throw new Error('Não foi possível conectar. Verifique sua internet.');
    }
  }
};

export const loginUser = async (payload: LoginPayload): Promise<LoginResponse> => {
  // O token para proteger a NOSSA API, não o da Brazmovel
  const partnerToken = process.env.EXPO_PUBLIC_API_SECRET_TOKEN;
  

  try {
    // A requisição agora é um POST para a nossa API com email e senha
    const response = await apiClient.post<LoginResponse>('api/appnetcom/user/login', payload, { 
      headers : { Authorization: `Bearer ${partnerToken}` }
    });
    console.log('Resposta da API de Login:', response.data);
    return response.data;

  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('API Error:', error.response.status, error.response.data);
      
      throw new Error(
        error.response.data.error || 'Ocorreu um erro ao tentar fazer o login.'
      );
    } else {
      console.error('Network or other error:', error);
      throw new Error('Não foi possível conectar. Verifique sua internet.');
    }
  }
};