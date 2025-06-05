// app/(register)/_layout.tsx
import { Stack } from 'expo-router';

export default function RegisterLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#F9FAFB' }, // Fundo do cabeçalho
        headerTintColor: '#0A2F5B', // Cor do título e da seta (Netcom Blue)
        headerTitleStyle: { fontWeight: 'bold' },
        headerTitleAlign: 'center',
        headerBackTitle: 'Voltar',
        headerShadowVisible: false,
      }}
    />
  );
}