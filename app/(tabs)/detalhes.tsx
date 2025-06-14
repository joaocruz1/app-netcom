// app/(tabs)/detalhes.tsx
import React from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { MaterialIcons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { Line, getInfoPlan, ProductPlan, InfoLinePlan } from '~/api/APIBrazmovel';
import Svg, { Circle } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { LineItem } from '~/components/LineItem';

export default function DetalhesLinha() {
  const { linha } = useLocalSearchParams<{ linha: string }>();
  const [product, setProduct] = useState<ProductPlan[]>([]);
  const [planItems, setPlanItems] = useState<Array<InfoLinePlan['items'][0]>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const linhaData: Line = JSON.parse(linha || '{}');
  const router = useRouter();

  useEffect(() => {
    const fetchLines = async () => {
      try {
        const userPlan = await getInfoPlan({ id: linhaData.id });
        setPlanItems(userPlan.items);
        setProduct(userPlan.items.map(item => item.product));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    fetchLines();
  }, [linhaData.id]);

  const formatPhoneNumber = (msisdn: string): string => {
    const cleaned = msisdn.replace(/\D/g, '');
    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return msisdn;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const radius = 80;
  const strokeWidth = 15;
  const circumference = 2 * Math.PI * radius;
  const progress = 0;
  const strokeDashoffset = circumference - circumference * progress;

  return (
    <SafeAreaView style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.userName}>Carlos</Text>
            <Text style={styles.phoneNumber}>{formatPhoneNumber(linhaData.msisdn)}</Text>
          </View>
          <TouchableOpacity style={styles.changeLineButton} onPress={() => router.push('/(tabs)')}>
            <Text style={styles.changeLineText}>Trocar linha</Text>
            <MaterialIcons name="keyboard-arrow-right" size={24} color="#FF6600" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Conteúdo principal */}
      <View style={styles.content}>
        {/* Dados de consumo com anel de progresso */}
        <View style={styles.progressContainer}>
          <Svg width={radius * 2} height={radius * 2} viewBox={`0 0 ${radius * 2} ${radius * 2}`}>
            <Circle
              stroke="#F0F0F0"
              fill="none"
              cx={radius}
              cy={radius}
              r={radius - strokeWidth / 2}
              strokeWidth={strokeWidth}
            />
            <Circle
              stroke="#FF6600"
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
            <Text style={styles.dataTitle}>0 MB</Text>
            <Text style={styles.dataSubtitle}>de 0 MB</Text>
          </View>
        </View>

        {/* Status e plano */}
        <TouchableOpacity style={styles.infoContainer}>
          <View style={styles.infoTextWrapper}>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{linhaData.status}</Text>
            </View>
            <Text style={styles.planName}>{product[0]?.title}</Text>
            <Text style={styles.renewalText}>
              {planItems[0]?.endDate 
                ? `Renovará em ${formatDate(planItems[0].endDate)}`
                : 'Data de renovação não disponível'}
            </Text>
          </View>
          <MaterialIcons name="keyboard-arrow-right" size={30} color="#FF6600" />
        </TouchableOpacity>

        {/* Banner Promocional */}
        <View style={styles.bannerContainer}>
          <Text style={styles.bannerPlaceholderText}>Espaço para Banner</Text>
        </View>
      </View>

      {/* Menu de navegação inferior */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="home" size={28} color="#FF6600" />
          <Text style={[styles.navText, { color: '#FF6600' }]}>Início</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <FontAwesome name="shopping-bag" size={24} color="#6B7280" />
          <Text style={styles.navText}>Loja</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialCommunityIcons name="account" size={28} color="#6B7280" />
          <Text style={styles.navText}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  header: {
    backgroundColor: '#0A2F5B',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userName: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  phoneNumber: {
    color: 'white',
    fontSize: 16,
    opacity: 0.9,
  },
  changeLineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  changeLineText: {
    color: '#FF6600',
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
    paddingTop: 30,
  },
  progressContainer: {
    width: 160,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  progressTextContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dataTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#0A2F5B',
  },
  dataSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 30,
    width: '100%',
  },
  infoTextWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  statusBadge: {
    backgroundColor: '#E6FFED',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 15,
  },
  statusText: {
    color: '#10B981',
    fontWeight: 'bold',
    fontSize: 14,
  },
  planName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0A2F5B',
    marginBottom: 5,
  },
  renewalText: {
    fontSize: 13,
    color: '#6B7280',
  },
  bannerContainer: {
    width: '100%',
    height: 100,
    borderRadius: 15,
    backgroundColor: '#FFEADD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerPlaceholderText: {
    color: '#FF6600',
    fontWeight: 'bold',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: 'white',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
});