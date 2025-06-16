// app/profile/change-email.tsx

import React, { useState } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Alert,
    ActivityIndicator
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// 1. Reutilizando a mesma paleta de cores para consistência
const palette = {
    'netcom-blue': '#0A2F5B',
    'netcom-orange': '#FF6600',
    'netcom-orange-darker': '#E05A00',
    'netcom-background': '#F9FAFB',
    'netcom-card-bg': '#FFFFFF',
    'netcom-input-border': '#D1D5DB',
    'netcom-text-primary': '#111827',
    'netcom-text-secondary': '#6B7280',
    'netcom-placeholder': '#9CA3AF'
};

export default function ChangeEmailScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    // Função para lidar com a alteração de e-mail
    const handleUpdateEmail = async () => {
        if (!email.trim() || !email.includes('@')) {
            Alert.alert("Erro", "Por favor, insira um e-mail válido.");
            return;
        }

        setLoading(true);
        try {
            // --- AQUI VOCÊ FARIA A CHAMADA PARA A SUA API ---
            // Ex: await api.updateUserEmail(email);
            
            // Simulando uma chamada de API
            await new Promise(resolve => setTimeout(resolve, 1500));

            Alert.alert("Sucesso", "Seu e-mail foi alterado com sucesso!", [
                { text: "OK", onPress: () => router.back() }
            ]);

        } catch (error) {
            Alert.alert("Erro", "Não foi possível alterar o e-mail. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* 2. Cabeçalho personalizado com as cores da paleta */}
            <Stack.Screen
                options={{
                    title: 'Alterar E-mail',
                    headerStyle: { backgroundColor: palette['netcom-card-bg'] },
                    headerTintColor: palette['netcom-blue'],
                    headerTitleStyle: {
                        fontWeight: 'bold',
                        color: palette['netcom-text-primary'],
                    },
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 16 }}>
                            <MaterialIcons name="arrow-back" size={24} color={palette['netcom-blue']} />
                        </TouchableOpacity>
                    ),
                    headerShadowVisible: false, // Remove a sombra para um look mais limpo
                }}
            />
            
            {/* 3. Conteúdo da tela */}
            <View style={styles.content}>
                <TextInput
                    style={styles.input}
                    placeholder="Novo email"
                    placeholderTextColor={palette['netcom-placeholder']}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                />

                <TouchableOpacity onPress={handleUpdateEmail} disabled={loading} style={styles.buttonContainer}>
                    <LinearGradient
                        colors={[palette['netcom-orange'], palette['netcom-orange-darker']]}
                        style={styles.button}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color={palette['netcom-card-bg']} />
                        ) : (
                            <Text style={styles.buttonText}>Alterar</Text>
                        )}
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

// 4. Estilos que utilizam a paleta de cores
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: palette['netcom-background'], // Fundo da tela
    },
    content: {
        flex: 1,
        padding: 24,
    },
    input: {
        backgroundColor: palette['netcom-card-bg'],
        height: 50,
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        borderWidth: 1,
        borderColor: palette['netcom-input-border'],
        color: palette['netcom-text-primary'],
        marginBottom: 24,
    },
    buttonContainer: {
        borderRadius: 25, // Deve corresponder ao borderRadius do LinearGradient
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 6,
    },
    button: {
        height: 50,
        borderRadius: 25, // Borda bem arredondada como na imagem
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: palette['netcom-card-bg'],
        fontSize: 16,
        fontWeight: 'bold',
    },
});