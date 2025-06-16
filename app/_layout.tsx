// app/_layout.tsx (VERSÃO FINAL E CORRIGIDA)
import '../global.css';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { View, ActivityIndicator } from 'react-native';

const InitialLayout = () => {
  const { isAuthenticated, _hasHydrated } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  
  const [isNavigationReady, setNavigationReady] = useState(false);

  useEffect(() => {
    // A lógica de navegação só é executada quando AMBAS as condições são verdadeiras.
    if (!_hasHydrated || !isNavigationReady) {
      return;
    }

    const inTabsGroup = segments[0] === '(tabs)';

    if (isAuthenticated && !inTabsGroup) {
      // Se logado e fora da área principal, redireciona para dentro.
      router.replace('/(tabs)/(home)');
    } else if (!isAuthenticated && inTabsGroup) {
      // Se não logado e tentando acessar área protegida, redireciona para login.
      router.replace('/(auth)/login');
    }
  }, [isAuthenticated, _hasHydrated, isNavigationReady, segments, router]);

  // Passo 1: Mostra o loading APENAS enquanto a store não foi carregada.
  if (!_hasHydrated) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9FAFB' }}>
        <ActivityIndicator size="large" color="#FF6600" />
      </View>
    );
  }

  // Passo 2: Assim que a store carregar, renderiza o layout principal.
  // A propriedade onLayout irá disparar setNavigationReady(true), o que por sua vez
  // irá "desbloquear" o useEffect para fazer o redirecionamento, se necessário.
  return (
    <View style={{ flex: 1 }} onLayout={() => setNavigationReady(true)}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(register)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(home)" />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
    </View>
  );
};

export default function RootLayout() {
  return <InitialLayout />;
}