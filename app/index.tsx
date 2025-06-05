// app/index.tsx
import React, { useState, useRef } from 'react';
import { View, FlatList, Animated, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import OnboardingSlide from '../components/onboarding/OnboardingSlide';
import Paginator from '../components/onboarding/Paginator';
import { StatusBar } from 'expo-status-bar';

// Coloque os dados dos slides aqui ou importe de um arquivo de constantes
const slides = [
  {
    id: '1',
    image: require('../assets/images/onboarding-1.png'), // Use suas imagens!
    title: 'Conexão em qualquer lugar',
    description: 'Mantenha-se conectado com nossa ampla e estável cobertura de fibra óptica.',
  },
  {
    id: '2',
    image: require('../assets/images/onboarding-2.png'),
    title: 'Feito para você',
    description: 'Tenha o controle nas suas mãos! Consulte faturas, solicite suporte e muito mais.',
  },
  {
    id: '3',
    image: require('../assets/images/onboarding-3.png'),
    title: 'Suporte e Velocidade',
    description: 'Conte com nosso suporte rápido sempre que precisar e navegue com a máxima velocidade.',
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<FlatList>(null);
  const router = useRouter();

  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems[0]) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const navigateToLogin = () => {
    // No futuro, você pode salvar um status aqui para não mostrar o onboarding novamente
    // Ex: await AsyncStorage.setItem('@viewedOnboarding', 'true');
    router.push('/(auth)/login');
  };

  const navigateToRegister = () => {
    router.push('/(register)/email')
  };


  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-white">
      <StatusBar style="dark" />
      <View style={{ flex: 3 }}>
        <FlatList
          data={slides}
          renderItem={({ item }) => <OnboardingSlide item={item} />}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          keyExtractor={(item) => item.id}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
            useNativeDriver: false,
          })}
          scrollEventThrottle={32}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
          ref={slidesRef}
        />
      </View>

      <Paginator data={slides} scrollX={scrollX} />

      <View className="w-full px-6 py-4">
        <TouchableOpacity 
          className="w-full border-2 border-netcom-orange py-3.5 rounded-full items-center justify-center mb-4"
          onPress={navigateToRegister}
        >
          <Text className="text-netcom-orange text-base font-bold">QUERO SER NETCOM</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="w-full bg-netcom-orange py-4 rounded-full items-center justify-center shadow-md active:scale-[0.98]"
          onPress={navigateToLogin}
        >
          <Text className="text-white text-base font-bold">JÁ SOU CLIENTE</Text>
        </TouchableOpacity>

        <Text className="text-xs text-center text-gray-500 mt-5">
          Ao continuar, você aceita nossos{' '}
          <Text 
            className="font-bold underline" 
            // onPress={() => {/* Navegar para termos */}}
          >
            Termos e condições
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}