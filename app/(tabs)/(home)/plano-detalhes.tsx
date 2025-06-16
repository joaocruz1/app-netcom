// Em app/PlanoDetalhesScreen.tsx (ou o caminho correspondente em seu projeto)

import React, { useEffect, useState } from 'react';
import { 
    View, 
    Text, 
    SafeAreaView, 
    StyleSheet, 
    TouchableOpacity, 
    ScrollView,
    ActivityIndicator
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router'; 
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

// Importe todas as funções e tipos necessários do seu arquivo de API
import { 
    Line, 
    getInfoPlan, 
    ProductPlan, 
    InfoLinePlan, 
    getInfoPayement, // Importação da nova função
    PaymentInfo     // Importação do novo tipo
} from '~/api/APIBrazmovel';

export default function PlanoDetalhesScreen() {
    const router = useRouter();
    const { linha } = useLocalSearchParams<{ linha: string }>();

    // Estados para os dados da tela
    const [product, setProduct] = useState<ProductPlan | null>(null);
    const [planItem, setPlanItem] = useState<InfoLinePlan['items'][0] | null>(null);
    const [paymentHistory, setPaymentHistory] = useState<PaymentInfo | null>(null);

    // Estados de controle da UI
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Parse dos dados da linha passados pela navegação
    const linhaData: Line = JSON.parse(linha || '{}');

    // Efeito para buscar os dados quando o componente é montado
    useEffect(() => {
        const fetchData = async () => {
            if (!linhaData.id) {
                setError('ID da linha não encontrado para buscar detalhes.');
                setLoading(false);
                return;
            }
            try {
                // Busca os dados do plano e o histórico de pagamentos em paralelo
                const [userPlan, payments] = await Promise.all([
                    getInfoPlan({ id: linhaData.id }),
                    getInfoPayement({ id: linhaData.id })
                ]);
                
                // Processa e define o estado para os dados do plano
                if (userPlan.items && userPlan.items.length > 0) {
                    setPlanItem(userPlan.items[0]);
                    setProduct(userPlan.items[0].product);
                } else {
                    // Define um erro se nenhum plano for encontrado, mas continua a execução
                    setError('Nenhum plano encontrado para esta linha.');
                }
                
                // Armazena o histórico de pagamentos no estado
                setPaymentHistory(payments);

            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.';
                setError(errorMessage);
            } finally {
                // Finaliza o estado de carregamento
                setLoading(false);
            }
        };
        fetchData();
    }, [linhaData.id]); // A dependência é o ID da linha

    // Função para navegar para a tela de histórico de pagamentos
    const handleNavigateToHistory = () => {
        // Verifica se o histórico existe e não está vazio
        if (!paymentHistory || paymentHistory.items.length === 0) {
            alert('Nenhum histórico de pagamento disponível.');
            return;
        }
        if (!product) {
        alert('Informações do plano não estão disponíveis.');
        return;
    }
        // Navega para a nova tela, passando os itens do histórico como string JSON
        router.push({
            pathname: '/historico-pagamentos', // Ajuste este caminho se necessário
            params: { history: JSON.stringify(paymentHistory.items), productTitle: product.title, }
        });
    };

    // Função para formatar datas no padrão brasileiro
    const formatDate = (dateString?: string): string => {
        if (!dateString) return 'Indisponível';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    // Componente customizado para o cabeçalho da tela
    const CustomHeader = () => (
        <Stack.Screen
            options={{
                title: 'Detalhes do plano',
                headerLeft: () => (
                    <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginLeft: 10 }}>
                        <MaterialIcons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                ),
                // Adicione outras customizações de header aqui, se necessário
                headerStyle: { backgroundColor: '#FF6600' },
                headerTintColor: 'white',
                headerTitleStyle: { fontWeight: 'bold' },
            }}
        />
    );

    // Renderização do estado de carregamento
    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <CustomHeader />
                <View style={styles.centeredContainer}>
                    <ActivityIndicator size="large" color="#0A2F5B" />
                </View>
            </SafeAreaView>
        );
    }

    // Renderização do estado de erro ou se os dados essenciais não foram carregados
    if (error && (!planItem || !product)) {
        return (
            <SafeAreaView style={styles.container}>
                <CustomHeader />
                <View style={styles.centeredContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            </SafeAreaView>
        );
    }

    // Renderização principal do componente
    return (
        <SafeAreaView style={styles.container}>
            <CustomHeader />
            <ScrollView contentContainerStyle={styles.contentContainer}>
                <View style={styles.card}>
                    {/* Seção de Informações do Plano */}
                    <View style={styles.planInfoContainer}>
                        <Text style={styles.planTitle}>{product?.title || 'Plano não encontrado'}</Text>
                        <Text style={styles.planDescription}>{product?.subtitle || 'Benefícios inclusos.'}</Text>
                    </View>

                    <View style={styles.divider} />

                    {/* Seção de Detalhes do Plano */}
                    <View style={styles.detailsContainer}>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Contratado em</Text>
                            <Text style={styles.detailValue}>{formatDate(planItem?.startDate)}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Válido Até</Text>
                            <Text style={styles.detailValue}>{formatDate(planItem?.endDate)}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Dados</Text>
                            <Text style={styles.detailValue}>{product?.title?.split(' ')[1] || 'Ilimitado'}</Text>
                        </View>
                        <View style={styles.detailRow}><Text style={styles.detailLabel}>SMS</Text><Text style={styles.detailValue}>Ilimitado</Text></View>
                        <View style={styles.detailRow}><Text style={styles.detailLabel}>Voz</Text><Text style={styles.detailValue}>Ilimitado</Text></View>
                    </View>

                    <View style={styles.divider} />

                    {/* Seção de Opções */}
                    <View style={styles.optionsContainer}>
                        <TouchableOpacity style={styles.optionButton} onPress={() => { /* Navegar para tela de forma de pagamento */ }}>
                            <View style={styles.optionIconContainer}><MaterialCommunityIcons name="check-circle" size={24} color="#22C55E" /></View>
                            <View style={styles.optionTextContainer}>
                                <Text style={styles.optionText}>Forma de pagamento</Text>
                                <Text style={styles.optionSubText}>Pacote Promocional</Text>
                            </View>
                            <MaterialIcons name="keyboard-arrow-right" size={24} color="#9CA3AF" />
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={styles.optionButton} 
                            onPress={handleNavigateToHistory}
                            disabled={!paymentHistory || paymentHistory.items.length === 0}
                        >
                            <View style={styles.optionIconContainer}><MaterialIcons name="calendar-today" size={22} color="#6B7280" /></View>
                            <View style={styles.optionTextContainer}>
                                <Text style={styles.optionText}>Histórico de pagamentos</Text>
                            </View>
                            <MaterialIcons name="keyboard-arrow-right" size={24} color="#9CA3AF" />
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

// Folha de Estilos
const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#F8FAFC' 
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
    contentContainer: { 
        padding: 20, 
    },
    card: { 
        backgroundColor: 'white', 
        borderRadius: 20, 
        padding: 20, 
        shadowColor: '#9CA3AF', 
        shadowOffset: { width: 0, height: 4 }, 
        shadowOpacity: 0.1, 
        shadowRadius: 12, 
        elevation: 5, 
    },
    planInfoContainer: { 
        marginBottom: 16, 
    },
    planTitle: { 
        fontSize: 22, 
        fontWeight: 'bold', 
        color: '#0A2F5B', 
        marginBottom: 4, 
    },
    planDescription: { 
        fontSize: 14, 
        color: '#6B7280', 
        lineHeight: 20, 
    },
    divider: { 
        height: 1, 
        backgroundColor: '#F3F4F6', 
        marginVertical: 16, 
    },
    detailsContainer: { 
        gap: 16, 
    },
    detailRow: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
    },
    detailLabel: { 
        fontSize: 15, 
        color: '#4B5563', 
    },
    detailValue: { 
        fontSize: 15, 
        fontWeight: '600', 
        color: '#0A2F5B', 
    },
    optionsContainer: { 
        gap: 8, 
    },
    optionButton: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingVertical: 12, 
    },
    optionIconContainer: { 
        width: 32, 
        alignItems: 'flex-start', 
    },
    optionTextContainer: { 
        flex: 1, 
        marginLeft: 8, 
    },
    optionText: { 
        fontSize: 16, 
        fontWeight: '500', 
        color: '#1F2937', 
    },
    optionSubText: { 
        fontSize: 14, 
        color: '#6B7280', 
        marginTop: 2, 
    },
});