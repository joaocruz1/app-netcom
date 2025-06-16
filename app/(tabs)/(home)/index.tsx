// O caminho do seu arquivo, ex: app/(tabs)/(home)/index.tsx

import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    StatusBar,
} from 'react-native';
import { useAuthStore } from '../../../store/authStore'; // Mantenha o caminho correto para sua store
import { getLines, Line } from '~/api/APIBrazmovel';
import { LineItem } from '../../../components/LineItem'; // Mantenha o caminho correto para seu componente
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';

// Paleta de cores para consistência
const palette = {
    primary: '#0A2F5B',
    primaryLight: 'rgba(10, 47, 91, 0.8)',
    secondary: '#FF6600',
    secondaryDark: '#E05A00',
    background: '#F8FAFC',
    cardBg: '#FFFFFF',
    textPrimary: '#1E293B',
    textSecondary: '#64748B',
    white: '#FFFFFF',
    gray100: '#F1F5F9',
    gray300: '#CBD5E1',
};

export default function MinhasLinhasScreen() {
    // --- NENHUMA LÓGICA FOI ALTERADA AQUI ---
    const user = useAuthStore((state) => state.user);
    const [lines, setLines] = useState<Line[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLines = async () => {
            if (!user?.id) {
                setError('Usuário não identificado.');
                setLoading(false);
                return;
            }
            try {
                const userLines = await getLines({ id: user.id });
                setLines(userLines);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Ocorreu um erro ao buscar as linhas.');
            } finally {
                setLoading(false);
            }
        };
        fetchLines();
    }, [user?.id]);
    // --- FIM DA LÓGICA INALTERADA ---


    // Componente de cabeçalho redesenhado
    const ListHeader = () => (
        <Animated.View entering={FadeIn.duration(800)}>
            <LinearGradient
                colors={[palette.primary, palette.primaryLight]}
                style={styles.header}
            >
                <View style={styles.headerContent}>
                    <View style={styles.avatar}>
                        <Ionicons name="person" size={24} color={palette.primary} />
                    </View>
                    <View>
                        <Text style={styles.title}>Olá, {user?.name.split(' ')[0] || 'Cliente'}</Text>
                        <Text style={styles.subtitle}>Seja bem-vindo(a) de volta!</Text>
                    </View>
                </View>
            </LinearGradient>
            {lines.length > 0 && (
                <Text style={styles.sectionTitle}>Escolha uma linha para gerenciar</Text>
            )}
        </Animated.View>
    );
    
    // Animação para cada item da lista
    const AnimatedLineItem = ({ item, index }: { item: Line, index: number }) => (
        <Animated.View entering={FadeInUp.delay(100 * index).duration(600)}>
            <LineItem item={item} />
        </Animated.View>
    );

    if (loading) {
        return (
            <View style={styles.centeredContainer}>
                <ActivityIndicator size="large" color={palette.primary} />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centeredContainer}>
                <Ionicons name="cloud-offline-outline" size={60} color={palette.gray300} />
                <Text style={styles.statusText}>{error}</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.screen}>
            <StatusBar barStyle="light-content" backgroundColor={palette.primary} />
            
            <Animated.FlatList
                data={lines}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => <AnimatedLineItem item={item} index={index} />}
                ListHeaderComponent={ListHeader}
                contentContainerStyle={styles.listContentContainer}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.centeredContainer}>
                        <Ionicons name="apps-outline" size={60} color={palette.gray300} />
                        <Text style={styles.statusText}>Você ainda não possui linhas ativas.</Text>
                        <Text style={styles.statusSubtext}>Que tal ativar sua primeira linha agora?</Text>
                    </View>
                }
            />

            <View style={styles.floatingButtonContainer}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => router.push('/active/active-line')} // Rota ajustada
                >
                    <LinearGradient
                         colors={[palette.secondary, palette.secondaryDark]}
                         start={{ x: 0, y: 0 }}
                         end={{ x: 1, y: 0 }}
                         style={styles.floatingButton}
                    >
                        <Ionicons name="add" size={26} color={palette.white} />
                        <Text style={styles.floatingButtonText}>ATIVAR NOVA LINHA</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: palette.background,
    },
    header: {
        paddingHorizontal: 24,
        paddingTop: 50, // Espaço para a status bar
        paddingBottom: 30,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: palette.white,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: palette.white,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: palette.textPrimary,
        paddingHorizontal: 24,
        marginTop: 24,
        marginBottom: 8,
    },
    listContentContainer: {
        paddingBottom: 120,
    },
    floatingButtonContainer: {
        position: 'absolute',
        bottom: 30,
        left: 24,
        right: 24,
        alignItems: 'center',
    },
    floatingButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 30,
        shadowColor: palette.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 12,
    },
    floatingButtonText: {
        color: palette.white,
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    centeredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
        marginTop: 50, // Para não ficar colado no header
    },
    statusText: {
        fontSize: 18,
        fontWeight: '500',
        color: palette.textSecondary,
        textAlign: 'center',
        marginTop: 20,
    },
    statusSubtext: {
        fontSize: 16,
        color: palette.textSecondary,
        textAlign: 'center',
        marginTop: 8,
    },
});