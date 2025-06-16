// app/profile/change-password.tsx

import React, { useState } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Alert,
    ActivityIndicator,
    ScrollView
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Reutilizando a mesma paleta de cores para consistência
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

export default function ChangePasswordScreen() {
    const router = useRouter();

    // Estados apenas para os dois campos necessários
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Estados para controlar a visibilidade de cada senha
    const [isNewVisible, setIsNewVisible] = useState(false);
    const [isConfirmVisible, setIsConfirmVisible] = useState(false);
    
    const [loading, setLoading] = useState(false);

    // Função para lidar com a alteração de senha
    const handleUpdatePassword = async () => {
        // Validação simplificada para os dois campos
        if (!newPassword || !confirmPassword) {
            Alert.alert("Erro", "Todos os campos são obrigatórios.");
            return;
        }
        if (newPassword.length < 6) {
            Alert.alert("Senha fraca", "A nova senha deve ter pelo menos 6 caracteres.");
            return;
        }
        if (newPassword !== confirmPassword) {
            Alert.alert("Erro", "As senhas não coincidem.");
            return;
        }

        setLoading(true);
        try {
            // --- AQUI VOCÊ FARIA A CHAMADA PARA A SUA API ---
            // Ex: await api.updateUserPassword({ newPassword });
            
            await new Promise(resolve => setTimeout(resolve, 1500));

            Alert.alert("Sucesso", "Sua senha foi alterada com sucesso!", [
                { text: "OK", onPress: () => router.back() }
            ]);

        } catch (error) {
            Alert.alert("Erro", "Não foi possível alterar a senha. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen
                options={{
                    title: 'Alterar Senha',
                    headerStyle: { backgroundColor: palette['netcom-card-bg'] },
                    headerTintColor: palette['netcom-blue'],
                    headerTitleStyle: { fontWeight: 'bold', color: palette['netcom-text-primary'] },
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 16 }}>
                            <MaterialIcons name="arrow-back" size={24} color={palette['netcom-blue']} />
                        </TouchableOpacity>
                    ),
                    headerShadowVisible: false,
                }}
            />
            
            <ScrollView contentContainerStyle={styles.content}>
                {/* --- Campo para Nova Senha --- */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Nova senha"
                        placeholderTextColor={palette['netcom-placeholder']}
                        value={newPassword}
                        onChangeText={setNewPassword}
                        secureTextEntry={!isNewVisible}
                    />
                    <TouchableOpacity onPress={() => setIsNewVisible(!isNewVisible)} style={styles.eyeIcon}>
                        <Ionicons 
                            name={isNewVisible ? "eye-off-outline" : "eye-outline"} 
                            size={24} 
                            color={palette['netcom-placeholder']} 
                        />
                    </TouchableOpacity>
                </View>

                {/* --- Campo para Confirmar a Nova Senha --- */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Confirmar nova senha"
                        placeholderTextColor={palette['netcom-placeholder']}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={!isConfirmVisible}
                    />
                    <TouchableOpacity onPress={() => setIsConfirmVisible(!isConfirmVisible)} style={styles.eyeIcon}>
                        <Ionicons 
                            name={isConfirmVisible ? "eye-off-outline" : "eye-outline"} 
                            size={24} 
                            color={palette['netcom-placeholder']} 
                        />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={handleUpdatePassword} disabled={loading} style={styles.buttonContainer}>
                    <LinearGradient
                        colors={[palette['netcom-orange'], palette['netcom-orange-darker']]}
                        style={styles.button}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color={palette['netcom-card-bg']} />
                        ) : (
                            <Text style={styles.buttonText}>Alterar Senha</Text>
                        )}
                    </LinearGradient>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

// Os estilos são os mesmos da versão anterior, pois a estrutura é similar
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: palette['netcom-background'],
    },
    content: {
        flexGrow: 1,
        padding: 24,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: palette['netcom-card-bg'],
        borderRadius: 12,
        borderWidth: 1,
        borderColor: palette['netcom-input-border'],
        marginBottom: 16,
    },
    input: {
        flex: 1,
        height: 50,
        paddingHorizontal: 16,
        fontSize: 16,
        color: palette['netcom-text-primary'],
    },
    eyeIcon: {
        padding: 12,
    },
    buttonContainer: {
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 6,
        marginTop: 16,
    },
    button: {
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: palette['netcom-card-bg'],
        fontSize: 16,
        fontWeight: 'bold',
    },
});