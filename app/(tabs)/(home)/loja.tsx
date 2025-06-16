// app/(tabs)/(home)/loja.tsx

import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    FlatList,
    Dimensions
} from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { MaterialIcons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { getProducts, ProductInfo } from '~/api/APIBrazmovel';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

type ProductItem = ProductInfo['items'][0];

// Paleta de cores moderna e atualizada
const palette = {
    primary: '#0A2F5B',
    primaryLight: '#1A4B8C',
    secondary: '#FF6600',
    secondaryDark: '#E05A00',
    background: '#F8FAFC',
    cardBg: '#FFFFFF',
    textPrimary: '#1E293B',
    textSecondary: '#64748B',
    placeholder: '#94A3B8',
    success: '#10B981',
    white: '#FFFFFF',
    black: '#000000',
    gray100: '#F1F5F9',
    gray200: '#E2E8F0'
};

export default function LojaScreen() {
    const router = useRouter();
    const pathname = usePathname();

    const [products, setProducts] = useState<ProductItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Lógica para buscar produtos (não foi alterada)
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const productData = await getProducts();
                const activeProducts = productData.items.filter(p => p.status === 'ACTIVE');
                setProducts(activeProducts);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Erro ao carregar produtos.');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    // Card de produto redesenhado
    const ProductCard = ({ item, index }: { item: ProductItem; index: number }) => {
        const details = item.subtitle.split('\n');
        const mainSubtitle = details.shift();

        return (
            <Animated.View 
                entering={FadeInDown.delay(100 * index).duration(600)}
                style={styles.productCard}
            >
                <View style={styles.cardHeader}>
                    {index === 0 && ( // Adiciona o selo apenas ao primeiro item como exemplo
                        <View style={styles.cardBadge}>
                            <Text style={styles.cardBadgeText}>MAIS POPULAR</Text>
                        </View>
                    )}
                    <Text style={styles.productTitle}>{item.title}</Text>
                    <Text style={styles.productSubtitle}>{mainSubtitle}</Text>
                </View>
                
                <View style={styles.detailsList}>
                    {details.map((detail, idx) => (
                        <View key={idx} style={styles.detailItem}>
                            <MaterialIcons 
                                name="check-circle" 
                                size={20} 
                                color={palette.success} 
                                style={styles.bulletIcon} 
                            />
                            <Text style={styles.detailText}>{detail.trim()}</Text>
                        </View>
                    ))}
                </View>

                <View style={{ marginTop: 'auto' }}>
                    <View style={styles.priceContainer}>
                        <Text style={styles.priceText}>{formatCurrency(item.price/12)}</Text>
                        <Text style={styles.cycleText}>/mês</Text>
                    </View>

                    <TouchableOpacity activeOpacity={0.8}>
                        <LinearGradient
                            colors={[palette.secondary, palette.secondaryDark]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.actionButton}
                        >
                            <Text style={styles.actionButtonText}>Contratar Plano</Text>
                            <MaterialIcons name="arrow-forward" size={20} color={palette.white} />
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        );
    };
    
    // Barra de navegação com design atualizado
    const BottomNavBar = () => {
        const navItems = [
            { icon: 'home', label: 'Início', type: 'MaterialIcons', path: '/(tabs)/(home)' },
            { icon: 'shopping-bag', label: 'Loja', type: 'FontAwesome', path: '/(tabs)/(home)/loja' },
            { icon: 'account-circle', label: 'Perfil', type: 'MaterialCommunityIcons', path: '/(tabs)/(home)/perfil' }
        ] as const;

        return (
            <View style={styles.navContainer}>
                {navItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                        <TouchableOpacity 
                            key={item.path} 
                            style={styles.navButton} 
                            onPress={() => router.push(item.path)}
                            activeOpacity={0.7}
                        >
                            <View style={isActive ? styles.navIconActiveContainer : null}>
                                {item.type === 'MaterialIcons' && <MaterialIcons name={item.icon as any} size={26} color={isActive ? palette.primary : palette.textSecondary} />}
                                {item.type === 'FontAwesome' && <FontAwesome name={item.icon as any} size={24} color={isActive ? palette.primary : palette.textSecondary} />}
                                {item.type === 'MaterialCommunityIcons' && <MaterialCommunityIcons name={item.icon as any} size={26} color={isActive ? palette.primary : palette.textSecondary} />}
                            </View>
                            <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>{item.label}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        );
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={palette.primary} />
                <Text style={styles.loadingText}>Carregando nossos planos...</Text>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={styles.errorContainer}>
                <MaterialIcons name="error-outline" size={48} color={palette.secondary} />
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity 
                    style={styles.retryButton}
                    onPress={() => router.replace(pathname as any)}
                >
                    <Text style={styles.retryButtonText}>Tentar novamente</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={products}
                renderItem={({ item, index }) => <ProductCard item={item} index={index} />}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <Animated.View entering={FadeIn.duration(800)}>
                        <LinearGradient
                            colors={[palette.primary, palette.primaryLight]}
                            style={styles.headerGradient}
                        >
                            <Text style={styles.screenTitle}>Nossos Planos</Text>
                            <Text style={styles.screenSubtitle}>Encontre o plano perfeito para suas necessidades</Text>
                        </LinearGradient>
                        <View style={styles.listHeader}>
                            <Text style={styles.recommendationText}>Recomendado para você</Text>
                        </View>
                    </Animated.View>
                }
                ListFooterComponent={<View style={{ height: 80 }} />} // Espaço para o BottomNav não cobrir o último card
            />
            
            <BottomNavBar />
        </SafeAreaView>
    );
}

// Estilos redesenhados para uma aparência mais profissional
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: palette.background,
    },
    // --- Loading e Error States ---
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: palette.background,
    },
    loadingText: {
        marginTop: 16,
        color: palette.textPrimary,
        fontSize: 16,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    errorText: {
        color: palette.textPrimary,
        fontSize: 18,
        textAlign: 'center',
        marginVertical: 16,
        lineHeight: 26,
    },
    retryButton: {
        backgroundColor: palette.primary,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 16,
    },
    retryButtonText: {
        color: palette.white,
        fontWeight: '600',
        fontSize: 16,
    },
    // --- Header ---
    headerGradient: {
        paddingHorizontal: 24,
        paddingTop: 50, // Ajuste para SafeArea
        paddingBottom: 40,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
    },
    screenTitle: {
        fontSize: 32,
        fontWeight: '800',
        color: palette.white,
    },
    screenSubtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
        marginTop: 8,
        maxWidth: '80%',
    },
    listHeader: {
        paddingHorizontal: 8,
        marginTop: 24,
        marginBottom: 8,
    },
    recommendationText: {
        fontSize: 20,
        fontWeight: '700',
        color: palette.textPrimary,
    },
    // --- Lista ---
    contentContainer: {
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    // --- Card do Produto ---
    productCard: {
        backgroundColor: palette.cardBg,
        borderRadius: 24,
        padding: 24,
        marginBottom: 20,
        shadowColor: palette.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
        elevation: 10,
        borderWidth: 1,
        borderColor: palette.gray200,
        flex: 1,
    },
    cardHeader: {
        marginBottom: 16,
    },
    cardBadge: {
        backgroundColor: palette.secondary,
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        marginBottom: 16,
    },
    cardBadgeText: {
        color: palette.white,
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    productTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: palette.primary,
        marginBottom: 8,
    },
    productSubtitle: {
        fontSize: 15,
        color: palette.textSecondary,
        lineHeight: 22,
    },
    detailsList: {
        marginVertical: 16,
        borderTopWidth: 1,
        borderTopColor: palette.gray100,
        paddingTop: 16,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    bulletIcon: {
        marginRight: 12,
        marginTop: 3,
    },
    detailText: {
        fontSize: 15,
        color: palette.textPrimary,
        flex: 1,
        lineHeight: 22,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginVertical: 16,
    },
    priceText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: palette.primary,
    },
    cycleText: {
        fontSize: 16,
        color: palette.textSecondary,
        marginLeft: 4,
        marginBottom: 4,
    },
    actionButton: {
        borderRadius: 16,
        paddingVertical: 18,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    actionButtonText: {
        color: palette.white,
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 8,
    },
    // --- Barra de Navegação ---
    navContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 8,
        paddingBottom: 20, // Espaço para a Home Bar do iPhone
        borderTopWidth: 1,
        borderTopColor: palette.gray200,
        backgroundColor: palette.cardBg,
        position: 'absolute', // Fixa no final
        bottom: 0,
        left: 0,
        right: 0,
    },
    navButton: {
        alignItems: 'center',
        padding: 4,
        flex: 1,
    },
    navIconActiveContainer: {
        backgroundColor: palette.gray100,
        paddingHorizontal: 20,
        paddingVertical: 6,
        borderRadius: 20,
    },
    navLabel: {
        fontSize: 12,
        color: palette.textSecondary,
        marginTop: 6,
    },
    navLabelActive: {
        color: palette.primary,
        fontWeight: '600',
    },
});