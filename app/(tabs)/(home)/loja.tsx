// app/(tabs)/(home)/loja.tsx

import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    FlatList
} from 'react-native';
import { useRouter, usePathname,Stack } from 'expo-router';
import { MaterialIcons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { getProducts, ProductInfo } from '~/api/APIBrazmovel';
import { LinearGradient } from 'expo-linear-gradient';

type ProductItem = ProductInfo['items'][0];

// 1. Centralizando a paleta de cores para fácil manutenção
const palette = {
    'netcom-blue': '#0A2F5B',
    'netcom-orange': '#FF6600',
    'netcom-orange-darker': '#E05A00',
    'netcom-background': '#F9FAFB',
    'netcom-card-bg': '#FFFFFF',
    'netcom-input-bg': '#FFFFFF',
    'netcom-input-border': '#D1D5DB',
    'netcom-input-focus-border': '#FF8C00',
    'netcom-text-primary': '#111827',
    'netcom-text-secondary': '#6B7280',
    'netcom-link': '#0A2F5B',
    'netcom-placeholder': '#9CA3AF'
};

interface Section {
    title: string;
}


export default function LojaScreen() {
    const router = useRouter();
    const pathname = usePathname();

    const [products, setProducts] = useState<ProductItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    const renderSectionHeader = ({ section: { title } }: { section: Section }) => (
        <View style={styles.sectionHeaderContainer}>
            <Text style={styles.sectionHeader}>{title}</Text>
        </View>
    );

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    const ProductCard = ({ item }: { item: ProductItem }) => {
        const details = item.subtitle.split('\n');
        const mainSubtitle = details.shift();

        return (
            <View style={styles.productCard}>
                <View>
                    <Text style={styles.productTitle}>{item.title}</Text>
                    <Text style={styles.productSubtitle}>{mainSubtitle}</Text>
                    
                    <View style={styles.detailsList}>
                        {details.map((detail, index) => (
                            <View key={index} style={styles.detailItem}>
                                <MaterialIcons name="check-circle-outline" size={20} color={palette['netcom-blue']} style={styles.bulletIcon} />
                                <Text style={styles.detailText}>{detail.trim()}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View>
                    <TouchableOpacity>
                        <LinearGradient
                            colors={[palette['netcom-orange'], palette['netcom-orange-darker']]}
                            style={styles.actionButton}
                        >
                            <Text style={styles.actionButtonText}>Contratar Plano</Text>
                            <MaterialIcons name="keyboard-arrow-right" size={22} color="white" />
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };
    
    const BottomNavBar = () => {
        const navItems = [
            { icon: 'home', label: 'Início', type: 'MaterialIcons', path: '/(tabs)/(home)' },
            { icon: 'shopping-bag', label: 'Loja', type: 'FontAwesome', path: '/(tabs)/(home)/loja' },
            { icon: 'account', label: 'Perfil', type: 'MaterialCommunityIcons', path: '/(tabs)/(home)/perfil' }
        ] as const;

        return (
            <View style={styles.navContainer}>
                {navItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                        <TouchableOpacity key={item.path} style={styles.navButton} onPress={() => router.push(item.path)}>
                            {item.type === 'MaterialIcons' && <MaterialIcons name={item.icon} size={26} color={isActive ? palette['netcom-blue'] : palette['netcom-placeholder']} />}
                            {item.type === 'FontAwesome' && <FontAwesome name={item.icon} size={24} color={isActive ? palette['netcom-blue'] : palette['netcom-placeholder']} />}
                            {item.type === 'MaterialCommunityIcons' && <MaterialCommunityIcons name={item.icon} size={26} color={isActive ? palette['netcom-blue'] : palette['netcom-placeholder']} />}
                            <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>{item.label}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        );
    };

    if (loading) {
        return <SafeAreaView style={styles.container}><ActivityIndicator style={{flex: 1}} size="large" color="white" /></SafeAreaView>;
    }

    if (error) {
        return <SafeAreaView style={styles.container}><View style={styles.centeredContainer}><Text style={styles.errorText}>{error}</Text></View></SafeAreaView>;
    }

    return (
        <SafeAreaView style={styles.container}>
        <Stack.Screen
            options={{
                title: 'Loja',
                // headerTitleAlign: 'center', // LINHA REMOVIDA
                headerLeft: () => (
                    <TouchableOpacity 
                        onPress={() => router.back()} 
                        style={styles.headerButton}
                    >
                        <MaterialIcons name="arrow-back" size={24} color={palette['netcom-card-bg']} />
                    </TouchableOpacity>
                ),
                headerStyle: { 
                    backgroundColor: palette['netcom-orange'], 
                },
                headerTintColor: palette['netcom-card-bg'], // Cor do título e ícones
                headerTitleStyle: {
                    fontWeight: '600',
                    fontSize: 18
                },
                headerShadowVisible: false, // Adicionado para um visual mais limpo
            }}
        />
            <FlatList
                data={products}
                renderItem={({ item }) => <ProductCard item={item} />}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.contentContainer}
                ListHeaderComponent={
                    <View style={styles.headerContainer}>
                        <Text style={styles.screenTitle}>Nossos Planos</Text>
                        <Text style={styles.screenSubtitle}>Escolha a oferta perfeita para você.</Text>
                    </View>
                }
            />
            <BottomNavBar />
        </SafeAreaView>
    );
}

// 2. Estilos atualizados para usar o objeto 'palette'
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF",
    },
    contentContainer: {
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    headerContainer: {
        paddingHorizontal: 4,
        paddingTop: 20,
        marginBottom: 10,
    },
    screenTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: palette['netcom-card-bg'], // Branco
    },
    screenSubtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.7)', // Mantido como branco translúcido
    },
    productCard: {
        backgroundColor: palette['netcom-card-bg'],
        borderRadius: 20,
        borderWidth: 3,
        borderColor: palette['netcom-orange'], // Borda Laranja
        padding: 24,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 8,
        justifyContent: 'space-between',
        minHeight: 380,
    },
    productTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: palette['netcom-blue'],
    },
    productSubtitle: {
        fontSize: 15,
        color: palette['netcom-text-secondary'],
        marginTop: 6,
        marginBottom: 20,
        lineHeight: 22,
    },
    detailsList: {
        marginBottom: 24,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    bulletIcon: {
        marginRight: 12,
    },
    detailText: {
        fontSize: 15,
        color: palette['netcom-text-primary'],
        flex: 1,
        lineHeight: 22,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        marginBottom: 12,
    },
    priceText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: palette['netcom-blue'],
    },
    cycleText: {
        fontSize: 16,
        color: palette['netcom-text-secondary'],
        marginLeft: 4,
        marginBottom: 3,
    },
    actionButton: {
        borderRadius: 16,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    actionButtonText: {
        color: palette['netcom-card-bg'], // Branco
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 4,
    },
    centeredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        color: palette['netcom-card-bg'], // Branco
        fontSize: 16,
        textAlign: 'center',
    },
    navContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: palette['netcom-input-border'],
        backgroundColor: palette['netcom-card-bg'],
    },
    navButton: {
        alignItems: 'center',
        padding: 4,
        flex: 1,
    },
    navLabel: {
        fontSize: 12,
        color: palette['netcom-placeholder'],
        marginTop: 5,
        fontWeight: '500',
    },
    navLabelActive: {
        color: palette['netcom-blue'],
        fontWeight: '600',
    },
    sectionHeaderContainer: {
    backgroundColor: '#F9FAFB',
    paddingTop: 24,
    paddingBottom: 8,
    paddingHorizontal: 4,
},
sectionHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280', // Cinza médio
    textTransform: 'capitalize',
    letterSpacing: 0.5,
},
headerButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
},
});