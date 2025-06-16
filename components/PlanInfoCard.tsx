import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // 1. Mude para useRouter para consistência
import { Line, ProductPlan, InfoLinePlan } from '~/api/APIBrazmovel';

// Tipos para as props que o Card recebe para exibição
interface PlanoInfoCardProps {
    linhaData: Line; // Apenas a linha é necessária para a navegação
    product: ProductPlan[]; // Mantido para exibição no card
    planItems: Array<InfoLinePlan['items'][0]>; // Mantido para exibição no card
}

// ... (função formatDate, se estiver aqui) ...

const PlanoInfoCard: React.FC<PlanoInfoCardProps> = ({ linhaData, product, planItems }) => {
    const router = useRouter(); // 2. Use o router do Expo

    const handlePress = () => {
        // 3. A LÓGICA PRINCIPAL: Passe apenas o objeto 'linhaData' stringificado
        router.push({
            pathname: '/(tabs)/(home)/plano-detalhes',
            params: { 
                // Use o mesmo nome de parâmetro ('linha') para consistência
                linha: JSON.stringify(linhaData) 
            },
        });
    };
    
    // O resto do componente (lógica de exibição) permanece o MESMO, pois ele precisa
    // dos dados `product` e `planItems` para renderizar corretamente na tela de detalhes.
    const status = linhaData?.status?.toUpperCase() || 'UNKNOWN';
    const isStatusActive = status === 'ACTIVE';
    const planName = product?.[0]?.title || 'Plano não carregado';
    const renewalDate = planItems?.[0]?.endDate;

    const formatDate = (dateString?: string): string => {
        if (!dateString) return 'Data indisponível';
        const date = new Date(dateString);
        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const year = date.getUTCFullYear();
        return `${day}/${month}/${year}`;
    };

    return (
        // O onPress agora chama a nova função handlePress
        <TouchableOpacity style={styles.infoCard} onPress={handlePress}>
            <View style={styles.infoContent}>
                <View style={styles.infoHeader}>
                    <View style={[styles.statusBadge, isStatusActive ? styles.statusActive : styles.statusInactive]}>
                        <Text style={[styles.statusText, isStatusActive ? styles.statusTextActive : styles.statusTextInactive]}>
                            {status}
                        </Text>
                    </View>
                    <MaterialIcons name="keyboard-arrow-right" size={24} color="#0A2F5B" />
                </View>
                <Text style={styles.planName}>{planName}</Text>
                <View style={styles.renewalContainer}>
                    <MaterialIcons name="update" size={18} color="#6B7280" />
                    <Text style={styles.renewalText}>
                        {`Renovação: ${formatDate(renewalDate)}`}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

// ... (estilos permanecem os mesmos) ...
const styles = StyleSheet.create({
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
        backgroundColor: '#D1FAE5',
    },
    statusInactive: {
        backgroundColor: '#FEE2E2',
    },
    statusText: {
        fontWeight: 'bold',
        fontSize: 13,
        textTransform: 'uppercase',
    },
    statusTextActive: {
        color: '#065F46',
    },
    statusTextInactive: {
        color: '#991B1B',
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
});


export default PlanoInfoCard;