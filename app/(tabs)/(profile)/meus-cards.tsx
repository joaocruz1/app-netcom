// app/profile/my-cards.tsx

import React from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native'; // Importe o Alert
import { useRouter, Stack } from 'expo-router';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useCards, type Card } from '~/context/CardContext';
import { LinearGradient } from 'expo-linear-gradient';

const palette = {
    'netcom-blue': '#0A2F5B',
    'netcom-orange': '#FF6600',
    'netcom-orange-darker': '#E05A00',
    'netcom-background': '#F9FAFB',
    'netcom-card-bg': '#FFFFFF',
    'netcom-input-border': '#D1D5DB',
    'netcom-text-secondary': '#6B7280',
};

export default function MyCardsScreen() {
    const router = useRouter();
    // 1. Pegue a função 'removeCard' do nosso hook
    const { cards, loading, removeCard } = useCards();

    // 2. Crie uma função para mostrar o alerta de confirmação
    const handleDeleteCard = (cardId: string, cardLastDigits: string) => {
        Alert.alert(
            "Remover Cartão",
            `Tem certeza que deseja remover o cartão final ${cardLastDigits}?`,
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Remover", onPress: () => removeCard(cardId), style: "destructive" },
            ]
        );
    };

    // 3. Atualize o componente do card para incluir o botão de remover
    const SavedCard = ({ item }: { item: Card }) => (
        <LinearGradient colors={['#434343', '#212121']} style={styles.savedCard}>
            {/* Botão de lixeira posicionado no canto superior direito */}
            <TouchableOpacity 
                style={styles.deleteButton} 
                onPress={() => handleDeleteCard(item.id, item.number.slice(-4))}
            >
                <Ionicons name="trash-outline" size={24} color="rgba(255, 255, 255, 0.8)" />
            </TouchableOpacity>

            <View>
                <Ionicons name="card" size={32} color="white" />
                <Text style={styles.cardLastDigits}>**** {item.number.slice(-4)}</Text>
            </View>
            <Text style={styles.cardHolderName}>{item.name}</Text>
        </LinearGradient>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen
                options={{
                    headerShown: true, title: 'Meus Cartões',
                    headerStyle: { backgroundColor: palette['netcom-orange'] },
                    headerTintColor: 'white', headerTitleAlign: 'center',
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 16 }}>
                            <MaterialIcons name="arrow-back" size={24} color="white" />
                        </TouchableOpacity>
                    ),
                    headerShadowVisible: false,
                }}
            />
            
            {loading ? (
                <ActivityIndicator size="large" color={palette['netcom-blue']} style={{ flex: 1 }}/>
            ) : cards.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Nenhum cartão de crédito encontrado!</Text>
                </View>
            ) : (
                <FlatList
                    data={cards}
                    renderItem={SavedCard} 
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContainer}
                />
            )}

            <View style={styles.footer}>
                <TouchableOpacity onPress={() => router.push('/add-card')}>
                    <LinearGradient colors={[palette['netcom-orange'], palette['netcom-orange-darker']]} style={styles.addButton}>
                        <Text style={styles.addButtonText}>Adicionar cartão</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

// 4. Adicione os estilos para o botão de remover
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: palette['netcom-background'] },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyText: { fontSize: 16, color: palette['netcom-text-secondary'] },
    footer: { padding: 24, borderTopWidth: 1, borderTopColor: palette['netcom-input-border'], backgroundColor: palette['netcom-card-bg'] },
    addButton: { height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
    addButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
    listContainer: { padding: 16 },
    savedCard: { 
        borderRadius: 12, 
        padding: 20, 
        marginBottom: 16, 
        justifyContent: 'space-between', 
        height: 180,
        position: 'relative', // Necessário para posicionar o botão de lixeira
    },
    cardLastDigits: { color: 'white', fontSize: 22, fontWeight: 'bold', letterSpacing: 2, marginTop: 24 },
    cardHolderName: { color: 'white', fontSize: 16 },
    deleteButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        padding: 4, // Aumenta a área de toque
        zIndex: 1,
    }
});