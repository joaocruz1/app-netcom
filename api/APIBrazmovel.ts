import axios from "axios";

const API_BASE_URL = 'https://api.brazmovel.com.br/v1/';
const token = process.env.EXPO_PUBLIC_BRAZMOVEL_TOKEN;

interface idUser {
    id: string; // Removed optional as we need it for the API call
}

interface idLine {
    id: string;
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

export interface ProductPlan {
    id: string
    title: string,
    subtitle: string,
    price: number,
    cicle: number,
    status: string,
}

export interface InfoLinePlan {
  items: Array<{
    id: string;
    recurring: boolean;
    startDate: string;
    endDate: string;
    status: string;
    paymentMethod: string;
    lineId: string;
    product: ProductPlan;
  }>;
  count: number;
}

export interface LineUsage { 
    remaining : number,
    total : number,
    types : [
        description: string,
        remaining: number,
        total : number
    ]
}

export interface PaymentInfo {
    items : Array<{
        id : string,
        amount : number,
        status : number
        payedAt : string,
        startDate : string
        endDate : string
    }>;
    count : number;
}

export interface ProductInfo { 
    items : Array<{
        id : string,
        title : string,
        subtitle : string,
        price : number,
        cycle : number,
        status : string,
        productId : string
    }>;
    count : number;
}


export const getProducts = async (): Promise<ProductInfo> => {
    try {
        const response = await axios.get<ProductInfo>(`${API_BASE_URL}product`, {
                headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    }
    catch (error){
        if (axios.isAxiosError(error) && error.response) {
        console.error('API Error:', error.response.status, error.response.data);
        throw new Error(
        error.response.data.error || 'Ocorreu um erro ao tentar obter os produtos da loja.'
        );
        } else {
        console.error('Network or other error:', error);
        throw new Error('Não foi possível conectar. Verifique sua internet.');
        }
    }    
}

export const getInfoPayement = async (payload: idLine): Promise<PaymentInfo> => {
    try {
        const response = await axios.get<PaymentInfo>(`${API_BASE_URL}line/${payload.id}/payment`, {
                headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    }
    catch (error){
        if (axios.isAxiosError(error) && error.response) {
        console.error('API Error:', error.response.status, error.response.data);
        throw new Error(
        error.response.data.error || 'Ocorreu um erro ao tentar obter os pagementos.'
        );
        } else {
        console.error('Network or other error:', error);
        throw new Error('Não foi possível conectar. Verifique sua internet.');
        }
    }
}

export const getUsageLine = async (payload: idLine): Promise<LineUsage> => {
    try {
        console.log(payload.id);
        const response = await axios.get<LineUsage>(`${API_BASE_URL}line/${payload.id}/usage`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return {
            remaining: response.data.remaining, 
            total: response.data.total,         
            types: response.data.types          
        };

    }catch (error){
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

export const getInfoPlan = async (payload: idLine): Promise<InfoLinePlan> => {
    try {
        console.log(payload.id);
        const response = await axios.get<InfoLinePlan>(`${API_BASE_URL}line/${payload.id}/plan`, {
            headers : {
                Authorization: `Bearer ${token}`
            }
            });
            return response.data;
        

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

export const getLines = async (payload: idUser): Promise<Line[]> => {
    try {
        const response = await axios.get<InfoUser>(`${API_BASE_URL}customer/${payload.id}`, {
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


