import { Stack, usePathname, useRouter } from 'expo-router';
import { View, Text, TouchableOpacity } from 'react-native';
import React, { useMemo } from 'react'; // Importação do React adicionada
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Lista de etapas do cadastro
const STEPS = [
  { step: 1, screen: 'email', title: 'Acesso' },
  { step: 2, screen: 'personal', title: 'Dados' },
  { step: 3, screen: 'address', title: 'Endereço' },
  { step: 4, screen: 'summary', title: 'Finalizar' },
];

/**
 * Componente de Cabeçalho Customizado para o fluxo de registro.
 */
function CustomProgressHeader() {
  const pathname = usePathname();
  const router = useRouter();

  const { currentStep, isFirstStep } = useMemo(() => {
    const stepInfo = STEPS.find(s => pathname.endsWith(s.screen));
    return {
      currentStep: stepInfo ? stepInfo.step : 0,
      isFirstStep: stepInfo ? stepInfo.step === 1 : false,
    };
  }, [pathname]);

  if (currentStep === 0) {
    return null;
  }

  return (
    <View className="bg-netcom-background pt-14 pb-4 px-4 shadow-sm">
      {/* Botão de voltar e título */}
      <View className="flex-row items-center h-8">
        {!isFirstStep && (
          <TouchableOpacity onPress={() => router.back()} className="p-1 -ml-2 absolute z-10">
            <MaterialCommunityIcons name="chevron-left" size={32} color="#0A2F5B" />
          </TouchableOpacity>
        )}
        <View className="flex-1 items-center justify-center">
            <Text className="text-lg font-bold text-netcom-blue">
                {isFirstStep ? "Crie sua Conta" : "Etapas do Cadastro"}
            </Text>
        </View>
      </View>

      {/* --- ALTERAÇÃO AQUI --- */}
      {/* Indicador de Progresso agora centralizado */}
      <View className="mt-4">
        <View className="flex-row justify-center items-start">
          {STEPS.map((item, index) => {
            const isActive = currentStep === item.step;
            const isCompleted = currentStep > item.step;
            const isLastItem = index === STEPS.length - 1;

            return (
              // Usamos React.Fragment para agrupar a etapa e a linha sem um View extra
              <React.Fragment key={item.step}>
                {/* Etapa (círculo + título) */}
                <View className="items-center">
                  <View
                    className={`w-8 h-8 rounded-full items-center justify-center border-2 ${
                      isActive || isCompleted
                        ? 'border-netcom-orange bg-netcom-orange'
                        : 'border-gray-300 bg-white'
                    }`}
                  >
                    {isCompleted ? (
                      <MaterialCommunityIcons name="check-bold" size={18} color="white" />
                    ) : (
                      <Text className={`font-bold text-lg ${isActive ? 'text-white' : 'text-gray-500'}`}>
                        {item.step}
                      </Text>
                    )}
                  </View>
                  <Text
                    numberOfLines={1}
                    className={`text-xs mt-1 w-16 text-center font-semibold ${isActive ? 'text-netcom-orange' : 'text-gray-500'}`}
                  >
                    {item.title}
                  </Text>
                </View>

                {/* Linha de Conexão com largura fixa */}
                {!isLastItem && (
                  <View
                    className={`h-1 w-6 mt-3.5 ${isCompleted ? 'bg-netcom-orange' : 'bg-gray-300'}`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </View>
      </View>
    </View>
  );
}


export default function RegisterLayout() {
  return (
    <Stack screenOptions={{
      header: () => <CustomProgressHeader />,
    }}>
      <Stack.Screen name="email" />
      <Stack.Screen name="personal" />
      <Stack.Screen name="address" />
      <Stack.Screen name="verify" />
      <Stack.Screen name="summary" options={{ headerShown: false }} />
    </Stack>
  );
}