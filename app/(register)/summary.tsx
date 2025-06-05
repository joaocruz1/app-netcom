// app/(register)/summary.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useRegistrationStore } from '../../store/registrationStore';
// Você pode usar uma imagem de sucesso aqui também
// import { Image } from 'react-native';

export default function SummaryScreen() {
  const router = useRouter();
  const registrationData = useRegistrationStore((state) => state);
  const resetRegistration = useRegistrationStore((state) => state.reset);

  const handleFinalSubmit = () => {
    console.log('DADOS FINAIS PARA ENVIAR À API:', registrationData);
    // TODO: Implementar a chamada real para a API de cadastro/leads
    Alert.alert('Pronto!', 'Seu cadastro foi concluído. Agora você será direcionado para a tela de login.', [
      { text: 'OK', onPress: () => {
        resetRegistration();
        router.replace('/(auth)/login');
      }}
    ]);
  };

  return (
    <View className="flex-1 justify-center items-center bg-netcom-background p-6">
      <Stack.Screen options={{ title: 'Revisão (4/4)' }} />
      <Text className="text-2xl font-bold text-netcom-blue mb-4">Tudo certo!</Text>
      {/* Aqui você pode exibir um resumo dos dados preenchidos pelo usuário */}
      <Text className="text-base text-netcom-text-secondary text-center mb-8">
        Seu pré-cadastro está quase pronto. Clique em Finalizar para enviar seus dados.
      </Text>
      
      <TouchableOpacity
        className="w-full bg-netcom-orange py-4 rounded-xl items-center"
        onPress={handleFinalSubmit}
      >
        <Text className="text-white text-base font-bold">Finalizar</Text>
      </TouchableOpacity>
    </View>
  );
}