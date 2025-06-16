// app/activate-line.tsx

import React, { useState } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ScrollView,
    ActivityIndicator,
    Linking
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { MaskedTextInput } from "react-native-mask-text";
import { LinearGradient } from 'expo-linear-gradient';

// Usando a paleta de cores definida anteriormente
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

export default function ActivateLineScreen() {
    const router = useRouter();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(false);

    // Dados para a lista de passos, facilitando a manutenção
    const activationSteps = [
        "Insira o chip em seu aparelho.",
        "Aguarde até que o chip seja reconhecido e um pop-up apareça.",
        "Selecione o DDD desejado.",
        "Após selecionar o DDD, aguarde um SMS com seu novo número BRAZ.",
        "Volte ao app e insira o número no campo especificado."
    ];
    
    // O botão é desabilitado se estiver carregando ou se o número não estiver completo
    const isButtonDisabled = loading || phoneNumber.length < 11;

    const handleActivate = async () => {
        if (isButtonDisabled) return;

        setLoading(true);
        try {
            // --- AQUI VOCÊ FARIA A CHAMADA PARA A SUA API PARA ATIVAR A LINHA ---
            // Ex: await api.activateLine({ number: `55${phoneNumber}` });
            
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulando chamada de API

            Alert.alert("Sucesso!", "Sua nova linha foi ativada e adicionada à sua conta.", [
                { text: "OK", onPress: () => router.push('/(tabs)/(home)') } // Navega para a home
            ]);

        } catch (error) {
            Alert.alert("Erro", "Não foi possível ativar a linha. Verifique o número e tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    const handleSupportCall = () => {
        const supportNumber = '79998552734'; // Número da imagem
        Linking.openURL(`tel:${supportNumber}`);
    };

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen
                options={{
                    title: 'Nova linha',
                    headerStyle: { backgroundColor: "#FF6600" },
                    headerTintColor: "#FFFF",
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 16 }}>
                            <MaterialIcons name="arrow-back" size={24} color={palette['netcom-text-primary']} />
                        </TouchableOpacity>
                    ),
                    headerShadowVisible: false,
                }}
            />
            
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.card}>
                    <Text style={styles.title}>Com seu chip BRAZ em mãos, siga os passos abaixo:</Text>
                    
                    {/* Lista de Passos */}
                    <View style={styles.stepsContainer}>
                        {activationSteps.map((step, index) => (
                            <View key={index} style={styles.stepItem}>
                                <View style={styles.stepNumberContainer}>
                                    <Text style={styles.stepNumber}>{index + 1}</Text>
                                </View>
                                <Text style={styles.stepText}>{step}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={styles.card}>
                    <Text style={styles.inputLabel}>Insira aqui seu número BRAZ</Text>
                    
                    {/* Input de Telefone com DDI fixo */}
                    <View style={styles.phoneInputContainer}>
                        <View style={styles.ddiContainer}>
                            <Text style={styles.ddiText}>+55</Text>
                        </View>
                        <MaskedTextInput
                            style={styles.input}
                            mask="(99) 99999-9999"
                            placeholder="(00) 00000-0000"
                            placeholderTextColor={palette['netcom-placeholder']}
                            onChangeText={(_, rawText) => setPhoneNumber(rawText)}
                            keyboardType="numeric"
                        />
                    </View>

                    {/* Botão de Continuar */}
                    <TouchableOpacity onPress={handleActivate} disabled={isButtonDisabled}>
                        <LinearGradient
                            colors={isButtonDisabled ? ['#D1D5DB', '#E5E7EB'] : [palette['netcom-orange'], palette['netcom-orange-darker']]}
                            style={styles.button}
                        >
                            {loading ? 
                                <ActivityIndicator color={palette['netcom-card-bg']} /> :
                                <Text style={[styles.buttonText, { color: isButtonDisabled ? palette['netcom-text-secondary'] : palette['netcom-card-bg'] }]}>
                                    Continuar
                                </Text>
                            }
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                <View style={styles.helpContainer}>
                    <Text style={styles.helpText}>
                        Não recebeu o SMS?{' '}
                        <Text style={styles.linkText} onPress={handleSupportCall}>
                            Entre em contato com o suporte.
                        </Text>
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: palette['netcom-background'],
    },
    scrollContainer: {
        padding: 16,
    },
    card: {
        backgroundColor: palette['netcom-card-bg'],
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: palette['netcom-text-primary'],
        marginBottom: 20,
        textAlign: 'center',
        lineHeight: 24,
    },
    stepsContainer: {
        gap: 16,
    },
    stepItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    stepNumberContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(10, 47, 91, 0.1)', // Azul bem claro
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    stepNumber: {
        color: palette['netcom-blue'],
        fontWeight: 'bold',
        fontSize: 16,
    },
    stepText: {
        flex: 1,
        color: palette['netcom-text-secondary'],
        fontSize: 15,
        lineHeight: 22,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: palette['netcom-text-primary'],
        textAlign: 'center',
        marginBottom: 16,
    },
    phoneInputContainer: {
        flexDirection: 'row',
        backgroundColor: palette['netcom-card-bg'],
        borderRadius: 12,
        borderWidth: 1,
        borderColor: palette['netcom-input-border'],
        height: 50,
        overflow: 'hidden',
    },
    ddiContainer: {
        backgroundColor: palette['netcom-background'],
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
        borderRightWidth: 1,
        borderRightColor: palette['netcom-input-border'],
    },
    ddiText: {
        color: palette['netcom-text-secondary'],
        fontWeight: '600',
        fontSize: 16,
    },
    input: {
        flex: 1,
        height: '100%',
        paddingHorizontal: 16,
        fontSize: 16,
        color: palette['netcom-text-primary'],
    },
    button: {
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    helpContainer: {
        marginTop: 24,
        alignItems: 'center',
    },
    helpText: {
        color: palette['netcom-text-secondary'],
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
    },
    linkText: {
        color: palette['netcom-orange'],
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
});