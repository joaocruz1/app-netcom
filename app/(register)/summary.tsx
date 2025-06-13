// app/(register)/summary.tsx
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StatusBar,
  Image,
  ActivityIndicator, // Importar para feedback de loading
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { createCustomer } from '~/api/APIServer';
import { useStore } from '../../store/store';
import { useState } from 'react';

export default function SummaryScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Pega todos os dados do store
  const customerData = useStore();

  const handleFinalSubmit = async () => {
    setIsLoading(true);

    // Monta o payload final com os dados do store
    const payload = {
      name: customerData.name,
      cpf: customerData.cpf.replace(/[^\d]/g, ''), // Envia só os números do CPF
      birthdate: customerData.birthdate,
      email: customerData.email,
      password: customerData.password,
      gender: customerData.gender,
      line: customerData.line,
      address: {
        street: customerData.address.street,
        city: customerData.address.city,
        state: customerData.address.state,
        neighbourhood: customerData.address.neighborhood,
        zipCode: customerData.address.cep.replace('-', ''), // Envia só os números do CEP
        number: customerData.address.number,
        complement: customerData.address.complement,
      },
    };

    try {
      // Agora a chamada corresponde à função corrigida e o erro desaparecerá
      await createCustomer(payload);
      Alert.alert('Sucesso!', 'Seu cadastro foi concluído.');
      router.replace('/(auth)/login');
    } catch (error: any) {
      Alert.alert('Erro no Cadastro', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-netcom-background">
      <StatusBar barStyle="dark-content" />
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-1 justify-between items-center p-8">
        <View />

        <View className="items-center">
          <Image
            source={require('../../assets/images/success-icon.png')}
            className="w-32 h-32 mb-8"
            resizeMode="contain"
          />
          <Text className="text-3xl font-bold text-netcom-blue mb-4">Pronto!</Text>
          <Text className="text-base text-netcom-text-secondary text-center max-w-xs">
            Seu cadastro foi concluído. Agora, para aproveitar todos os benefícios,
            basta fazer o login.
          </Text>
        </View>

        <View className="w-full">
          <TouchableOpacity
            className={`w-full py-4 rounded-xl items-center justify-center ${
              isLoading ? 'bg-netcom-orange/60' : 'bg-netcom-orange active:scale-[0.98]'
            }`}
            onPress={handleFinalSubmit}
            disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="text-white text-base font-bold tracking-wider">
                Ir para o Login
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}