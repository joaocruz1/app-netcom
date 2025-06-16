// CÓDIGO CORRIGIDO
import { Stack } from 'expo-router';

export default function HomeStackLayout() {
  const headerColor = '#FF6600'; // Mesma cor do seu layout de Tabs

  return (
    <Stack
      screenOptions={{
        headerShown: true, // <- ALTERADO PARA TRUE
        headerStyle: {
          backgroundColor: headerColor,
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTitleAlign: 'center',
      }}>
      <Stack.Screen name="index" options={{ title: 'Minhas Linhas' }} />
      <Stack.Screen name="detalhes" options={{ title: 'Detalhes da Linha' }} />
      <Stack.Screen name="plano-detalhes" options={{ title: 'Detalhes do Plano' }} />
    </Stack>
  );
}