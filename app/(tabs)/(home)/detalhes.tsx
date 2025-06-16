// app/(tabs)/detalhes.tsx
import React, { useEffect, useState } from 'react';
import { 
    View, 
    Text, 
    SafeAreaView, 
    StyleSheet, 
    TouchableOpacity, 
    ActivityIndicator, 
    Dimensions,
    ScrollView // 1. Importe o ScrollView
} from 'react-native';
import { useLocalSearchParams, usePathname, useRouter } from 'expo-router';
import { MaterialIcons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { Line, getInfoPlan, ProductPlan, InfoLinePlan, getUsageLine, LineUsage } from '~/api/APIBrazmovel';
import Svg, { Circle } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import PlanoInfoCard from '~/components/PlanInfoCard';

const { width } = Dimensions.get('window');

export default function DetalhesLinha() {
    const { linha } = useLocalSearchParams<{ linha: string }>();
    const [product, setProduct] = useState<ProductPlan[]>([]);
    const [planItems, setPlanItems] = useState<Array<InfoLinePlan['items'][0]>>([]);
    const [usageData, setUsageData] = useState<LineUsage | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const linhaData: Line = JSON.parse(linha || '{}');
    const router = useRouter();
    const pathname = usePathname();

        const BottomNavBar = () => {
        const navItems = [
            // O path deve corresponder exatamente ao nome do arquivo na sua estrutura de pastas
            { icon: 'home', label: 'Início', type: 'MaterialIcons', path: '/(tabs)/(home)' },
            { icon: 'shopping-bag', label: 'Loja', type: 'FontAwesome', path: '/(tabs)/(home)/loja' },
            { icon: 'account', label: 'Perfil', type: 'MaterialCommunityIcons', path: '/(tabs)/(home)/perfil' }
        ] as const; // Usar 'as const' para garantir a tipagem correta para o router.push

        return (
            <View style={styles.navContainer}>
                {navItems.map((item, index) => {
                    // Um item é ativo se o seu caminho for igual ao caminho da tela atual
                    const isActive = pathname === item.path;

                    return (
                        <TouchableOpacity 
                            key={index} 
                            style={styles.navButton} 
                            onPress={() => router.push(item.path)} // Ação de navegação
                        >
                            {item.type === 'MaterialIcons' && <MaterialIcons name={item.icon} size={26} color={isActive ? '#0A2F5B' : '#9CA3AF'} />}
                            {item.type === 'FontAwesome' && <FontAwesome name={item.icon} size={24} color={isActive ? '#0A2F5B' : '#9CA3AF'} />}
                            {item.type === 'MaterialCommunityIcons' && <MaterialCommunityIcons name={item.icon} size={26} color={isActive ? '#0A2F5B' : '#9CA3AF'} />}
                            <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
                                {item.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        );
    };



    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!linhaData.id) {
                    setError('Dados da linha não encontrados.');
                    setLoading(false);
                    return;
                }
                const userPlan = await getInfoPlan({ id: linhaData.id });
                setPlanItems(userPlan.items);
                setProduct(userPlan.items.map(item => item.product));

                const usage = await getUsageLine({ id: linhaData.id });
                setUsageData(usage);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Erro desconhecido');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [linhaData.id]);

    const formatPhoneNumber = (msisdn: string): string => {
        const cleaned = (msisdn || '').replace(/\D/g, '');
        if (cleaned.length === 11) {
            return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        }
        return msisdn;
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'Data indisponível';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const bytesToGB = (bytes: number): number => bytes / (1024 * 1024 * 1024);

    const formatDataDisplay = (bytes: number): string => {
        if (typeof bytes !== 'number') return '0 GB';
        const gbValue = bytesToGB(bytes);
        return gbValue.toFixed(2) + ' GB';
    };

    // Configurações do círculo de progresso
    const radius = width * 0.28; // Reduzido um pouco para melhor encaixe
    const strokeWidth = 12;
    const circumference = 2 * Math.PI * radius;
    const dataUsed = usageData ? usageData.total - usageData.remaining : 0;
    const progress = usageData && usageData.total > 0 ? dataUsed / usageData.total : 0;
    const strokeDashoffset = circumference - circumference * progress;

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.centeredContainer}>
                    <ActivityIndicator size="large" color="#0A2F5B" />
                </View>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.centeredContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Cabeçalho com gradiente */}
            <LinearGradient
                colors={['#0A2F5B', '#1A4B8C']}
                style={styles.header}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
            >
                <View style={styles.headerContent}>
                    <View>
                        <Text style={styles.userName}>Carlos</Text>
                        <Text style={styles.phoneNumber}>{formatPhoneNumber(linhaData.msisdn)}</Text>
                    </View>
                    <TouchableOpacity 
                        style={styles.changeLineButton}
                        onPress={() => router.push('/(tabs)/(home)')}
                    >
                        <Text style={styles.changeLineText}>Trocar linha</Text>
                        <MaterialIcons name="keyboard-arrow-right" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </LinearGradient>

            {/* 2. Substitua a View de 'content' por um ScrollView */}
            <ScrollView 
                style={styles.content}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* Container do círculo de progresso */}
                <View style={styles.progressCard}>
                    <View style={styles.progressContainer}>
                        <Svg width={radius * 2} height={radius * 2} viewBox={`0 0 ${radius * 2} ${radius * 2}`}>
                            <Circle stroke="#F0F5FF" fill="none" cx={radius} cy={radius} r={radius - strokeWidth / 2} strokeWidth={strokeWidth} />
                            <Circle
                                stroke="#0A2F5B"
                                fill="none"
                                cx={radius}
                                cy={radius}
                                r={radius - strokeWidth / 2}
                                strokeWidth={strokeWidth}
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                                strokeLinecap="round"
                                transform={`rotate(-90 ${radius} ${radius})`}
                            />
                        </Svg>
                        <View style={styles.progressTextContainer}>
                            <Text style={styles.dataTitle}>
                                {usageData ? formatDataDisplay(usageData.remaining) : '0 GB'}
                            </Text>
                            <Text style={styles.dataSubtitle}>Disponível</Text>
                            <View style={styles.progressDivider} />
                            <Text style={styles.dataTotal}>
                                {usageData ? formatDataDisplay(usageData.total) : '0 GB'} Total
                            </Text>
                        </View>
                    </View>
                    <View style={styles.percentageBadge}>
                        <Text style={styles.percentageText}>
                            {`${(progress * 100).toFixed(0)}% USADO`}
                        </Text>
                    </View>
                </View>

                {/* Card de informações do plano */}
                <PlanoInfoCard
                    linhaData={linhaData}
                    product={product}
                    planItems={planItems}
                />

                {/* Banner promocional */}
                <View style={styles.bannerCard}>
                    <LinearGradient
                        colors={['#FFEADD', '#FFD8C5']}
                        style={styles.bannerGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    >
                        <Text style={styles.bannerTitle}>Oferta Especial</Text>
                        <Text style={styles.bannerText}>Ative agora e ganhe 5GB extras!</Text>
                    </LinearGradient>
                </View>
            </ScrollView>

            {/* Menu de navegação (permanece fixo no final) */}
            <BottomNavBar />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    header: {
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 20,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    userName: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    phoneNumber: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 16,
    },
    changeLineButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    changeLineText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
        marginRight: 4,
    },
    // 3. Estilos para o ScrollView e seu conteúdo
    content: {
        flex: 1, // Permite que o ScrollView ocupe o espaço disponível
    },
    contentContainer: {
        paddingHorizontal: 20,
        paddingVertical: 24, // Adicionado padding vertical
    },
    progressCard: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#9CA3AF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
        marginBottom: 20,
    },
    progressContainer: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    progressTextContainer: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dataTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#0A2F5B',
        marginBottom: 2,
    },
    dataSubtitle: {
        fontSize: 14,
        color: '#6B7280',
    },
    dataTotal: {
        fontSize: 16,
        fontWeight: '600',
        color: '#6B7280',
        marginTop: 4,
    },
    progressDivider: {
        width: 40,
        height: 1.5,
        backgroundColor: '#E5E7EB',
        marginVertical: 8,
    },
    percentageBadge: {
        backgroundColor: '#F0F5FF',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
    },
    percentageText: {
        color: '#0A2F5B',
        fontWeight: 'bold',
        fontSize: 14,
    },
    infoCard: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#9CA3AF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
        marginBottom: 20,
    },
    infoContent: {
        width: '100%',
    },
    infoHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 20,
    },
    statusActive: {
      backgroundColor: '#D1FAE5', // Verde
    },
    statusInactive: {
      backgroundColor: '#FEE2E2', // Vermelho
    },
    statusText: {
        fontWeight: 'bold',
        fontSize: 13,
        color: '#065F46', // Cor para texto do status ativo
    },
    planName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0A2F5B',
        marginBottom: 12,
    },
    renewalContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    renewalText: {
        fontSize: 14,
        color: '#6B7280',
        marginLeft: 8,
    },
    bannerCard: {
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#9CA3AF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
        marginBottom: 20, // Adiciona espaço antes do fim da área de rolagem
    },
    bannerGradient: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        minHeight: 100,
    },
    bannerTitle: {
        color: '#C25A1A',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    bannerText: {
        color: '#4B5563',
        fontSize: 14,
    },
    navContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        backgroundColor: 'white',
    },
    navButton: {
        alignItems: 'center',
        padding: 4,
    },
    navLabel: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 5,
        fontWeight: '500',
    },
    navLabelActive: {
        color: '#0A2F5B',
        fontWeight: '600',
    },
    centeredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        color: '#EF4444',
        fontSize: 16,
        textAlign: 'center',
        fontWeight: '500'
    },
});