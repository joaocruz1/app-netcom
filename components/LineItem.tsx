import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Line } from '~/api/APIBrazmovel';

interface LineItemProps {
  item: Line;
}

const formatPhoneNumber = (msisdn: string): string => {
  const cleaned = msisdn.replace(/\D/g, '');
  const nationalNumber = cleaned.startsWith('55') ? cleaned.substring(2) : cleaned;
  
  if (nationalNumber.length === 9) {
    return `${nationalNumber.substring(0, 5)}-${nationalNumber.substring(5)}`;
  }
  
  if (nationalNumber.length === 8) {
    return `${nationalNumber.substring(0, 4)}-${nationalNumber.substring(4)}`;
  }
  
  return msisdn;
};

export const LineItem = ({ item }: LineItemProps) => {
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: '/(tabs)/detalhes',
      params: { linha: JSON.stringify(item) },
    });
  };

  return (
    <TouchableOpacity 
      style={styles.cardShadow} 
      className="bg-white p-5 rounded-xl mb-6 flex-row items-center justify-between mx-4"
      onPress={handlePress}
    >
      <View>
        <Text className="text-lg font-bold text-gray-800">
          {formatPhoneNumber(item.msisdn)}
        </Text>
        <View className="flex-row items-center mt-1">
          <Text className="text-green-600 font-semibold">{item.status}</Text>
        </View>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={32} color="#9CA3AF" />
    </TouchableOpacity>
  );
};

const styles = {
  cardShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
  },
};