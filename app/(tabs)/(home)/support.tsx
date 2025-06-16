// app/support.tsx

import React from 'react';
import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Linking,
    Alert
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { MaterialIcons, Ionicons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Usando a paleta de cores definida anteriormente
const palette = {
    'netcom-blue': '#0A2F5B',
    'netcom-orange': '#FF6600',
    'netcom-background': '#F9FAFB',
    'netcom-card-bg': '#FFFFFF',
    'netcom-text-primary': '#111827',
    'netcom-text-secondary': '#6B7280',
};

export default function SupportScreen() {
    const router = useRouter();
    
    // Número fornecido, formatado para as URLs
    const phoneNumber = '553597086332';
    const formattedPhoneNumber = '(35) 99708-6332';

    // Função para abrir o discador do telefone
    const handleCall = async () => {
        try {
            await Linking.openURL(`tel:${phoneNumber}`);
        } catch (error) {
            Alert.alert("Erro", "Não foi possível realizar a chamada.");
        }
    };

    // Função para abrir o WhatsApp
    const handleWhatsApp = async () => {
        const message = encodeURIComponent("Olá! Gostaria de falar com o suporte da Braz Móvel.");
        const url = `https://wa.me/${phoneNumber}?text=${message}`;
        try {
            const supported = await Linking.canOpenURL(url);
            if (supported) {
                await Linking.openURL(url);
            } else {
                Alert.alert("Erro", "O WhatsApp não está instalado no seu dispositivo.");
            }
        } catch (error) {
            Alert.alert("Erro", "Não foi possível abrir o WhatsApp.");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen
                options={{
                    title: 'Atendimento',
                    headerStyle: { backgroundColor: "#FF6600" },
                    headerTintColor: "#FFFFFF",
                    headerTitleStyle: { fontWeight: 'bold' },
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 16 }}>
                            <MaterialIcons name="arrow-back" size={24} color={palette['netcom-text-primary']} />
                        </TouchableOpacity>
                    ),
                    headerShadowVisible: false,
                }}
            />
            
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* Card de Cabeçalho Criativo */}
                <LinearGradient
                    colors={[palette['netcom-blue'], '#1A4B8C']} // Gradiente sutil
                    style={styles.headerCard}
                >
                    <Feather name="headphones" size={48} color="rgba(255, 255, 255, 0.8)" />
                    <Text style={styles.headerTitle}>Central de Atendimento</Text>
                    <Text style={styles.headerSubtitle}>Estamos prontos para te ajudar da maneira que você preferir.</Text>
                </LinearGradient>

                {/* Card de Opção - Ligar */}
                <TouchableOpacity style={styles.optionCard} onPress={handleCall}>
                    <View style={[styles.iconContainer, {backgroundColor: '#DBEAFE'}]}>
                        <Ionicons name="call-outline" size={24} color="#1E40AF" />
                    </View>
                    <View style={styles.optionTextContainer}>
                        <Text style={styles.optionTitle}>Ligar para o suporte</Text>
                        <Text style={styles.optionDescription}>{formattedPhoneNumber}</Text>
                    </View>
                    <MaterialIcons name="keyboard-arrow-right" size={24} color={palette['netcom-text-secondary']} />
                </TouchableOpacity>
                
                {/* Card de Opção - WhatsApp */}
                <TouchableOpacity style={styles.optionCard} onPress={handleWhatsApp}>
                     <View style={[styles.iconContainer, {backgroundColor: '#D1FAE5'}]}>
                        <Ionicons name="logo-whatsapp" size={24} color="#065F46" />
                    </View>
                    <View style={styles.optionTextContainer}>
                        <Text style={styles.optionTitle}>Conversar no WhatsApp</Text>
                        <Text style={styles.optionDescription}>Para dúvidas e outros assuntos.</Text>
                    </View>
                    <MaterialIcons name="keyboard-arrow-right" size={24} color={palette['netcom-text-secondary']} />
                </TouchableOpacity>

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
        padding: 20,
    },
    headerCard: {
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        marginBottom: 32,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginTop: 16,
        textAlign: 'center',
    },
    headerSubtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
        marginTop: 8,
        textAlign: 'center',
    },
    optionCard: {
        backgroundColor: palette['netcom-card-bg'],
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    optionTextContainer: {
        flex: 1,
    },
    optionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: palette['netcom-text-primary'],
    },
    optionDescription: {
        fontSize: 14,
        color: palette['netcom-text-secondary'],
        marginTop: 4,
    }
});