import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Line } from '~/api/APIBrazmovel';

interface LineItemProps {
  item: Line;
}

/**
 * Formata um número de telefone (msisdn) para o padrão brasileiro (DD) 9XXXX-XXXX.
 * @param msisdn O número de telefone, que pode incluir o código do país '55'.
 * @returns O número formatado ou o original em caso de formato inesperado.
 */
const formatPhoneNumberBR = (msisdn: string): string => {
  if (!msisdn) return '';

  const cleaned = msisdn.replace(/\D/g, '');
  
  // Remove o '55' se presente e verifica se o número restante tem 11 dígitos (DD + 9 dígitos)
  const nationalNumber = cleaned.startsWith('55') ? cleaned.substring(2) : cleaned;
  
  if (nationalNumber.length === 11) {
    const ddd = nationalNumber.substring(0, 2);
    const firstPart = nationalNumber.substring(2, 7);
    const secondPart = nationalNumber.substring(7);
    return `(${ddd}) ${firstPart}-${secondPart}`;
  }
  
  // Fallback para outros formatos, como telefones fixos (DD + 8 dígitos)
  if (nationalNumber.length === 10) {
    const ddd = nationalNumber.substring(0, 2);
    const firstPart = nationalNumber.substring(2, 6);
    const secondPart = nationalNumber.substring(6);
    return `(${ddd}) ${firstPart}-${secondPart}`;
  }
  
  return msisdn; // Retorna o original se não corresponder aos padrões
};

export const LineItem = ({ item }: LineItemProps) => {
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: '/(tabs)/detalhes',
      params: { linha: JSON.stringify(item) },
    });
  };

  // Determina o estilo do status dinamicamente
  const isStatusActive = item.status?.toUpperCase() === 'ACTIVE';
  const statusTextStyle = isStatusActive ? styles.statusTextActive : styles.statusTextInactive;
  const statusDotStyle = isStatusActive ? styles.statusDotActive : styles.statusDotInactive;

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={handlePress}
    >
      {/* Ícone à Esquerda */}
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name="cellphone" size={24} color="#0A2F5B" />
      </View>

      {/* Informações da Linha (Número e Status) */}
      <View style={styles.lineInfo}>
        <Text style={styles.lineNumber}>
          {formatPhoneNumberBR(item.msisdn)}
        </Text>
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, statusDotStyle]} />
          <Text style={[styles.statusText, statusTextStyle]}>
            {item.status?.toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Ícone de Chevron à Direita */}
      <MaterialCommunityIcons name="chevron-right" size={28} color="#A0AEC0" />
    </TouchableOpacity>
  );
};

// Estilização completa via StyleSheet para um design profissional e consistente
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20, // Bordas mais arredondadas
    padding: 16,
    marginHorizontal: 20, // Ajustado para alinhar com o padding da tela principal
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    // Sombra sutil e profissional
    shadowColor: '#9FB1C6',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  iconContainer: {
    backgroundColor: '#F0F5FF', // Fundo de cor azul bem claro para o ícone
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lineInfo: {
    flex: 1, // Faz esta view ocupar o espaço restante
    marginLeft: 16,
  },
  lineNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 6, // Espaço entre o número e o status
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusDotActive: {
    backgroundColor: '#34D399', // Verde para status 'ACTIVE'
  },
  statusDotInactive: {
    backgroundColor: '#EF4444', // Vermelho para outros status
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  statusTextActive: {
    color: '#065F46', // Texto verde escuro
  },
  statusTextInactive: {
    color: '#B91C1C', // Texto vermelho escuro
  },
});