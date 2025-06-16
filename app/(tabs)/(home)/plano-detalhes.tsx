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
import { Line, getInfoPlan, ProductPlan, InfoLinePlan } from '~/api/APIBrazmovel';

export default function PlanoDetalhesScreen() {
    const router = useRouter();
    const { linha } = useLocalSearchParams<{ linha: string }>();

    const [product, setProduct] = useState<ProductPlan | null>(null);
    const [planItem, setPlanItem] = useState<InfoLinePlan['items'][0] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // A variável 'linhaData' contém as informações da linha atual, incluindo o ID.
    // Ela já está disponível em todo o componente.
    const linhaData: Line = JSON.parse(linha || '{}');

    useEffect(() => {
        // ... (lógica de fetch de dados permanece a mesma)
        const fetchData = async () => {
            if (!linhaData.id) {
                setError('ID da linha não encontrado para buscar detalhes.');
                setLoading(false);
                return;
            }
            try {
                const userPlan = await getInfoPlan({ id: linhaData.id });
                if (userPlan.items && userPlan.items.length > 0) {
                    setPlanItem(userPlan.items[0]);
                    setProduct(userPlan.items[0].product);
                } else {
                    setError('Nenhum plano encontrado para esta linha.');
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Erro ao buscar detalhes do plano.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [linhaData.id]);

    const formatDate = (dateString?: string): string => {
        if (!dateString) return 'Indisponível';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    // Componente customizado para o botão de voltar
    const CustomHeader = () => (
        <Stack.Screen
            options={{
                title: 'Detalhes do plano',
                headerLeft: () => (
                    // CORREÇÃO: A ação de voltar deve ser simplesmente router.back()
                    <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginLeft: 10 }}>
                        <MaterialIcons name="arrow-back-ios" size={24} color="white" />
                    </TouchableOpacity>
                ),
            }}
        />
    );


    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <CustomHeader />
                <View style={styles.centeredContainer}><ActivityIndicator size="large" color="#0A2F5B" /></View>
            </SafeAreaView>
        );
    }

    if (error || !planItem || !product) {
        return (
            <SafeAreaView style={styles.container}>
                <CustomHeader />
                <View style={styles.centeredContainer}>
                    <Text style={styles.errorText}>{error || 'Não foi possível carregar os dados do plano.'}</Text>
                </View>
            </SafeAreaView>
        );
    }
    
    return (
        <SafeAreaView style={styles.container}>
            <CustomHeader />
            <ScrollView contentContainerStyle={styles.contentContainer}>
                <View style={styles.card}>
                    {/* ... (o resto do seu JSX permanece o mesmo) ... */}
                    <View style={styles.planInfoContainer}>
                        <Text style={styles.planTitle}>{product.title}</Text>
                        <Text style={styles.planDescription}>{product.subtitle || 'Benefícios inclusos.'}</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.detailsContainer}>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Contratado em</Text>
                            <Text style={styles.detailValue}>{formatDate(planItem.startDate)}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Válido Até</Text>
                            <Text style={styles.detailValue}>{formatDate(planItem.endDate)}</Text>
                        </View>
                        <View style={styles.detailRow}><Text style={styles.detailLabel}>Dados</Text><Text style={styles.detailValue}>{product.title?.split(' ')[1] || 'Ilimitado'}</Text></View>
                        <View style={styles.detailRow}><Text style={styles.detailLabel}>SMS</Text><Text style={styles.detailValue}>Ilimitado</Text></View>
                        <View style={styles.detailRow}><Text style={styles.detailLabel}>Voz</Text><Text style={styles.detailValue}>Ilimitado</Text></View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.optionsContainer}>
                         <TouchableOpacity style={styles.optionButton} onPress={() => {}}>
                             <View style={styles.optionIconContainer}><MaterialCommunityIcons name="check-circle" size={24} color="#22C55E" /></View>
                            <View style={styles.optionTextContainer}><Text style={styles.optionText}>Forma de pagamento</Text><Text style={styles.optionSubText}>Pacote Promocional</Text></View>
                            <MaterialIcons name="keyboard-arrow-right" size={24} color="#9CA3AF" />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.optionButton} onPress={() => {}}>
                             <View style={styles.optionIconContainer}><MaterialIcons name="calendar-today" size={22} color="#6B7280" /></View>
                            <View style={styles.optionTextContainer}><Text style={styles.optionText}>Histórico de pagamentos</Text></View>
                            <MaterialIcons name="keyboard-arrow-right" size={24} color="#9CA3AF" />
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

// Estilos permanecem os mesmos
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    centeredContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, },
    errorText: { color: '#EF4444', fontSize: 16, textAlign: 'center', fontWeight: '500' },
    contentContainer: { padding: 20, },
    card: { backgroundColor: 'white', borderRadius: 20, padding: 20, shadowColor: '#9CA3AF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5, },
    planInfoContainer: { marginBottom: 16, },
    planTitle: { fontSize: 22, fontWeight: 'bold', color: '#0A2F5B', marginBottom: 4, },
    planDescription: { fontSize: 14, color: '#6B7280', lineHeight: 20, },
    divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 16, },
    detailsContainer: { gap: 16, },
    detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', },
    detailLabel: { fontSize: 15, color: '#4B5563', },
    detailValue: { fontSize: 15, fontWeight: '600', color: '#0A2F5B', },
    optionsContainer: { gap: 8, },
    optionButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, },
    optionIconContainer: { width: 32, alignItems: 'flex-start', },
    optionTextContainer: { flex: 1, marginLeft: 8, },
    optionText: { fontSize: 16, fontWeight: '500', color: '#1F2937', },
    optionSubText: { fontSize: 14, color: '#6B7280', marginTop: 2, },
});