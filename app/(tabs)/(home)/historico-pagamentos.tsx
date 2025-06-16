import React, { useMemo } from 'react';
import { View, Text, SafeAreaView, StyleSheet, SectionList, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

interface PaymentItem {
    id: string;
    amount: number;
    status: 'CREATED' | 'PROCESSING' | 'CAPTURED' | 'SCHEDULED' | 'CANCELED' | 'DENIED' | 'REFUNDED' | 'BLOCKED' | 'INSUFFICIENT_PARTNER_BALANCE';
    payedAt: string;
}

interface Section {
    title: string;
    data: PaymentItem[];
}

export default function HistoricoPagamentosScreen() {
    const router = useRouter();
    const { history, productTitle } = useLocalSearchParams<{ history: string, productTitle: string }>();

    const paymentItems: PaymentItem[] = history ? JSON.parse(history) : [];

    const getStatusInfo = (status: PaymentItem['status']): { text: string, color: string, icon: string } => {
        switch (status) {
            case 'CAPTURED':
                return { text: 'Pago', color: '#4ADE80', icon: 'check-circle' }; // Verde
            case 'REFUNDED':
                return { text: 'Estornado', color: '#FBBF24', icon: 'assignment-return' }; // Amarelo
            case 'CANCELED':
                return { text: 'Cancelado', color: '#9CA3AF', icon: 'cancel' }; // Cinza
            case 'DENIED':
                return { text: 'Recusado', color: '#F87171', icon: 'error' }; // Vermelho
            case 'BLOCKED':
            case 'INSUFFICIENT_PARTNER_BALANCE':
                return { text: 'Falhou', color: '#F87171', icon: 'block' }; // Vermelho
            case 'PROCESSING':
                return { text: 'Processando', color: '#60A5FA', icon: 'pending' }; // Azul
            case 'CREATED':
            case 'SCHEDULED':
                return { text: 'Agendado', color: '#A78BFA', icon: 'schedule' }; // Roxo
            default:
                return { text: 'Pendente', color: '#FBBF24', icon: 'pending' }; // Amarelo
        }
    };

    const formatDateTime = (dateString?: string): string => {
        if (!dateString) return 'Data indisponível';
        const date = new Date(dateString);
        return date.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).replace(',', '');
    };

 

    const sections = useMemo(() => {
        const grouped: { [key: string]: PaymentItem[] } = {};

        paymentItems.forEach(item => {
            const date = new Date(item.payedAt);
            const monthYear = date.toLocaleString('pt-BR', { 
                month: 'long', 
                year: 'numeric' 
            });
            const capitalizedMonthYear = monthYear.charAt(0).toUpperCase() + monthYear.slice(1);
            
            if (!grouped[capitalizedMonthYear]) {
                grouped[capitalizedMonthYear] = [];
            }
            grouped[capitalizedMonthYear].push(item);
        });

        return Object.keys(grouped).map(key => ({
            title: key,
            data: grouped[key]
        }));
    }, [paymentItems]);

    const renderPaymentItem = ({ item }: { item: PaymentItem }) => {
        const statusInfo = getStatusInfo(item.status);

        return (
            <View style={styles.itemCard}>
                <View style={styles.itemContent}>
                    <View style={styles.itemIcon}>
                        <MaterialIcons 
                            name={statusInfo.icon as any} 
                            size={24} 
                            color={statusInfo.color} 
                        />
                    </View>
                    <View style={styles.itemDetails}>
                        <Text style={styles.itemTitle} numberOfLines={1} ellipsizeMode="tail">
                            {productTitle}
                        </Text>
                        <Text style={styles.itemDate}>{formatDateTime(item.payedAt)}</Text>
                    </View>
                    <View style={styles.itemAmountContainer}>
                        <View style={[styles.statusBadge, { borderColor: statusInfo.color }]}>
                            <Text style={[styles.statusText, { color: statusInfo.color }]}>
                                {statusInfo.text}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    const renderSectionHeader = ({ section: { title } }: { section: Section }) => (
        <View style={styles.sectionHeaderContainer}>
            <Text style={styles.sectionHeader}>{title}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen
                options={{
                    title: 'Histórico de Pagamentos',
                    headerTitleAlign: 'center',
                    headerLeft: () => (
                        <TouchableOpacity 
                            onPress={() => router.back()} 
                            style={styles.headerButton}
                        >
                            <MaterialIcons name="arrow-back" size={24} color="#FFF" />
                        </TouchableOpacity>
                    ),
                    headerStyle: { 
                        backgroundColor: '#FF6600', 
                    },
                    headerTintColor: '#FFF',
                    headerTitleStyle: {
                        fontWeight: '600',
                        fontSize: 18
                    },
                }}
            />
            
            <SectionList
                sections={sections}
                keyExtractor={(item) => item.id}
                renderItem={renderPaymentItem}
                renderSectionHeader={renderSectionHeader}
                contentContainerStyle={styles.listContainer}
                stickySectionHeadersEnabled={false}
                ListEmptyComponent={
                    <View style={styles.centeredContainer}>
                        <MaterialIcons 
                            name="payment" 
                            size={48} 
                            color="#D1D5DB" 
                            style={styles.emptyIcon}
                        />
                        <Text style={styles.emptyTitle}>Nenhum pagamento encontrado</Text>
                        <Text style={styles.emptyText}>Seus pagamentos aparecerão aqui</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB', // Cinza muito claro
    },
    listContainer: {
        paddingHorizontal: 16,
        paddingBottom: 20,
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
    itemCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    itemContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemIcon: {
        marginRight: 12,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemDetails: {
        flex: 1,
        marginRight: 8,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#111827', // Cinza escuro
        marginBottom: 4,
        maxWidth: 180,
    },
    itemDate: {
        fontSize: 13,
        color: '#6B7280', // Cinza médio
    },
    itemAmountContainer: {
        alignItems: 'flex-end',
    },
    itemAmount: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 6,
    },
    statusBadge: {
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 12,
        borderWidth: 1,
        backgroundColor: 'transparent',
    },
    statusText: {
        fontSize: 12,
        fontWeight: '500',
    },
    centeredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
        paddingHorizontal: 40,
    },
    emptyIcon: {
        marginBottom: 16,
        opacity: 0.5,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
        textAlign: 'center',
    },
    emptyText: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 20,
    },
    headerButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
});