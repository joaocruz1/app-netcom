// app/_layout.tsx (ATUALIZADO)
import '../global.css';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore'; // Verifique se o caminho está correto
import { View, ActivityIndicator } from 'react-native';

// Este componente é a raiz da navegação e decide qual "grupo" mostrar.
const InitialLayout = () => {
  const { isAuthenticated, _hasHydrated } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Se a store ainda não foi carregada do AsyncStorage, não fazemos nada.
    if (!_hasHydrated) {
      return;
    }

    const inAuthGroup = segments[0] === '(auth)' || segments[0] === '(register)';

    // Se o usuário NÃO está logado E NÃO está nas telas de auth/register,
    // manda ele para a tela de login.
    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login');
    }
    // Se o usuário ESTÁ logado E está em uma tela de auth/register,
    // manda ele para a tela principal.
    else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, _hasHydrated, segments, router]);

  // Enquanto a store está sendo carregada, mostramos uma tela de loading.
  // Isso evita que a tela de login apareça rapidamente antes de redirecionar.
  if (!_hasHydrated) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Se a store já foi carregada, o Stack assume e mostra a tela correta.
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(register)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
};

// O componente principal exportado é o RootLayout que renderiza nosso InitialLayout.
export default function RootLayout() {
  return <InitialLayout />;
}
