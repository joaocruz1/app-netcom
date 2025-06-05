// app/(register)/summary.tsx
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Alert, 
  SafeAreaView, 
  StatusBar, 
  Image 
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useRegistrationStore } from '../../store/registrationStore';

export default function SummaryScreen() {
  const router = useRouter();
  const registrationData = useRegistrationStore((state) => state);
  const resetRegistration = useRegistrationStore((state) => state.reset);

  const handleFinalSubmit = () => {
    // Aqui seria o local ideal para enviar os dados para a API
    console.log('DADOS FINAIS PARA ENVIAR À API:', registrationData);
    
    // Após o envio (ou simulação), resetamos o store e navegamos para o login
    resetRegistration();
    router.replace('/(auth)/login');
  };

  return (
    <SafeAreaView className="flex-1 bg-netcom-background">
      <StatusBar />
      {/* Escondemos o cabeçalho padrão para ter controle total do layout */}
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Container principal para centralizar tudo */}
      <View className="flex-1 justify-between items-center p-8">
        
        {/* Espaçador superior para empurrar o conteúdo para o centro */}
        <View />

        {/* Conteúdo central de sucesso */}
        <View className="items-center">
          <Image
            source={require('../../assets/images/success-icon.png')} // Verifique se este caminho está correto!
            className="w-32 h-32 mb-8"
            resizeMode="contain"
          />
          <Text className="text-3xl font-bold text-netcom-blue mb-4">Pronto!</Text>
          <Text className="text-base text-netcom-text-secondary text-center max-w-xs">
            Seu cadastro foi concluído. Agora, para aproveitar todos os benefícios, basta fazer o login.
          </Text>
        </View>
        
        {/* Botão de Continuar na parte inferior */}
        <View className="w-full">
          <TouchableOpacity
            className="w-full bg-netcom-orange py-4 rounded-xl items-center active:scale-[0.98]"
            onPress={handleFinalSubmit}
          >
            <Text className="text-white text-base font-bold tracking-wider">Ir para o Login</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}