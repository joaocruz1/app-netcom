// contexts/CardContext.tsx

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// A interface Card permanece a mesma
export interface Card {
    id: string;
    number: string;
    name: string;
    expiry: string;
    cvv: string;
    cpf: string;
}

// 1. ADICIONE a função 'removeCard' à nossa interface de contexto
interface CardContextData {
    cards: Card[];
    loading: boolean;
    addCard: (card: Omit<Card, 'id'>) => Promise<void>;
    removeCard: (cardId: string) => Promise<void>; // <-- ADICIONE ESTA LINHA
}

const CardContext = createContext<CardContextData>({} as CardContextData);

export const CardProvider = ({ children }: { children: ReactNode }) => {
    const [cards, setCards] = useState<Card[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // ... (a função de carregar os cartões permanece a mesma)
        async function loadCardsFromStorage() {
            try {
                const storedCards = await AsyncStorage.getItem('@netcom:cards');
                if (storedCards) {
                    setCards(JSON.parse(storedCards));
                }
            } catch (e) {
                console.error("Failed to load cards.", e);
            } finally {
                setLoading(false);
            }
        }
        loadCardsFromStorage();
    }, []);

    const addCard = async (cardData: Omit<Card, 'id'>) => {
        // ... (a função de adicionar cartão permanece a mesma)
        try {
            const newCard = { ...cardData, id: String(new Date().getTime()) };
            const updatedCards = [...cards, newCard];
            setCards(updatedCards);
            await AsyncStorage.setItem('@netcom:cards', JSON.stringify(updatedCards));
        } catch (e) {
            console.error("Failed to save card.", e);
            throw new Error("Não foi possível salvar o cartão.");
        }
    };

    // 2. CRIE a nova função para remover um cartão
    const removeCard = async (cardId: string) => {
        try {
            // Filtra o array, mantendo todos os cartões EXCETO o que tem o ID correspondente
            const updatedCards = cards.filter(card => card.id !== cardId);
            setCards(updatedCards); // Atualiza o estado
            await AsyncStorage.setItem('@netcom:cards', JSON.stringify(updatedCards)); // Salva a nova lista no dispositivo
        } catch (e) {
            console.error("Failed to remove card.", e);
            throw new Error("Não foi possível remover o cartão.");
        }
    };

    return (
        // 3. FORNEÇA a nova função 'removeCard' para o contexto
        <CardContext.Provider value={{ cards, loading, addCard, removeCard }}>
            {children}
        </CardContext.Provider>
    );
};

export function useCards(): CardContextData {
    return useContext(CardContext);
}