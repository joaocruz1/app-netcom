import axios from "axios";

const API_BASE_URL = 'https://api.brazmovel.com.br/v1/customer/';
const token = process.env.EXPO_PUBLIC_BRAZMOVEL_TOKEN;

interface idUser {
    id: string; // Removed optional as we need it for the API call
}

export interface Line {
    id: string;
    iccid: string;
    msisdn: string;
    status: string;
}

interface InfoUser {
    id: string;
    name: string;
    email: string;
    cpf: string;
    status: string;
    birthdate: string;
    createdAt: string;
    updatedAt: string;
    lines: Line[];
}

export const getLines = async (payload: idUser): Promise<Line[]> => {
    try {
        const response = await axios.get<InfoUser>(`${API_BASE_URL}${payload.id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data.lines;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            console.error('API Error:', error.response.status, error.response.data);
            throw new Error(
                error.response.data.error || 'Ocorreu um erro ao tentar obter as linhas.'
            );
        } else {
            console.error('Network or other error:', error);
            throw new Error('Não foi possível conectar. Verifique sua internet.');
        }
    }
}