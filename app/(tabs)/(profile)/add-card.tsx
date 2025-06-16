// app/profile/add-card.tsx

import React, { useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useCards } from '~/context/CardContext'; // Verifique se o caminho está correto
import { MaskedTextInput } from "react-native-mask-text";
import { LinearGradient } from 'expo-linear-gradient';
import { TextInput } from 'react-native-gesture-handler';

// 1. Paleta de cores completa e corrigida
const palette = {
    'netcom-blue': '#0A2F5B',
    'netcom-orange': '#FF6600',
    'netcom-orange-darker': '#E05A00', // Chave que estava faltando
    'netcom-background': '#F9FAFB',
    'netcom-card-bg': '#FFFFFF',
    'netcom-input-border': '#D1D5DB',
    'netcom-text-primary': '#111827',
    'netcom-text-secondary': '#6B7280',
    'netcom-placeholder': '#9CA3AF'
};

export default function AddCardScreen() {
    const router = useRouter();
    const { addCard } = useCards();
    const [loading, setLoading] = useState(false);

    // Estados para cada campo do formulário
    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCvv, setCardCvv] = useState('');
    const [cardCpf, setCardCpf] = useState('');

    const handleSubmit = async () => {
        const cardData = {
            number: cardNumber,
            name: cardName,
            expiry: cardExpiry,
            cvv: cardCvv,
            cpf: cardCpf,
        };

        if (!cardNumber || !cardName || !cardExpiry || !cardCvv || !cardCpf || cardNumber.length < 19 || cardExpiry.length < 5 || cardCvv.length < 3 || cardCpf.length < 14) {
            Alert.alert("Erro", "Por favor, preencha todos os campos corretamente.");
            return;
        }

        setLoading(true);
        try {
            await addCard(cardData);
            Alert.alert("Sucesso", "Cartão adicionado!", [
                { text: "OK", onPress: () => router.back() }
            ]);
        } catch (error) {
            // 2. Tratamento de erro seguro
            const errorMessage = error instanceof Error ? error.message : "Ocorreu um erro desconhecido.";
            Alert.alert("Erro", errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen
                options={{
                    headerShown: true, title: 'Novo Cartão',
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
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>Preencha os campos abaixo</Text>

                {/* 3. Campos do formulário escritos de forma explícita */}

                {/* Número do Cartão */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Número do cartão</Text>
                    <MaskedTextInput
                        style={styles.input}
                        placeholder="0000 0000 0000 0000"
                        placeholderTextColor={palette['netcom-placeholder']}
                        mask="9999 9999 9999 9999"
                        value={cardNumber}
                        onChangeText={setCardNumber}
                        keyboardType="numeric"
                    />
                </View>

                {/* Nome do Titular */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Nome do titular</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Informe o nome como no cartão"
                        placeholderTextColor={palette['netcom-placeholder']}
                        value={cardName}
                        onChangeText={setCardName}
                    />
                </View>

                {/* Validade */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Validade</Text>
                    <MaskedTextInput
                        style={styles.input}
                        placeholder="MM/AA"
                        placeholderTextColor={palette['netcom-placeholder']}
                        mask="99/99"
                        value={cardExpiry}
                        onChangeText={setCardExpiry}
                        keyboardType="numeric"
                    />
                </View>

                {/* Código de Segurança */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Código de segurança</Text>
                    <MaskedTextInput
                        style={styles.input}
                        placeholder="CVV"
                        placeholderTextColor={palette['netcom-placeholder']}
                        mask="999"
                        value={cardCvv}
                        onChangeText={setCardCvv}
                        keyboardType="numeric"
                    />
                </View>

                {/* CPF do Titular */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>CPF do titular</Text>
                    <MaskedTextInput
                        style={styles.input}
                        placeholder="000.000.000-00"
                        placeholderTextColor={palette['netcom-placeholder']}
                        mask="999.999.999-99"
                        value={cardCpf}
                        onChangeText={setCardCpf}
                        keyboardType="numeric"
                    />
                </View>

                <TouchableOpacity onPress={handleSubmit} disabled={loading} style={{ marginTop: 24 }}>
                    <LinearGradient colors={[palette['netcom-orange'], palette['netcom-orange-darker']]} style={styles.submitButton}>
                        {loading ? <ActivityIndicator color="white" /> : <Text style={styles.submitButtonText}>Confirmar cadastro do cartão</Text>}
                    </LinearGradient>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: palette['netcom-background'] },
    content: { padding: 24, paddingBottom: 40 },
    title: { fontSize: 18, fontWeight: 'bold', color: palette['netcom-text-primary'], marginBottom: 24 },
    inputGroup: { marginBottom: 16 },
    label: { fontSize: 14, color: palette['netcom-text-secondary'], marginBottom: 8, fontWeight: '500' },
    input: { backgroundColor: 'white', height: 50, borderRadius: 12, paddingHorizontal: 16, fontSize: 16, borderWidth: 1, borderColor: palette['netcom-input-border'], color: palette['netcom-text-primary'] },
    submitButton: { height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
    submitButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' }
});