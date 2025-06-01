import 'global.css'
import { Stack } from 'expo-router';
// import { useEffect } from 'react'; // Para carregar fontes ou outras tarefas assíncronas
// import { useFonts } from 'expo-font'; // Para carregar fontes customizadas
// import * as SplashScreen from 'expo-splash-screen'; // Para controlar a tela de splash

// Se você for usar Zustand e quiser um Provider global (opcional, depende da sua config do Zustand)
// import { StoreProvider } from '../store/StoreProvider'; // Ajuste o caminho se necessário

// Mantenha a tela de splash visível enquanto carregamos recursos (opcional)
// SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Exemplo de carregamento de fontes (opcional para agora)
  // const [fontsLoaded, fontError] = useFonts({
  //   'SuaFonte-Regular': require('../assets/fonts/SuaFonte-Regular.ttf'),
  //   'SuaFonte-Bold': require('../assets/fonts/SuaFonte-Bold.ttf'),
  // });

  // useEffect(() => {
  //   if (fontsLoaded || fontError) {
  //     SplashScreen.hideAsync(); // Esconde a splash screen quando as fontes estiverem carregadas
  //   }
  // }, [fontsLoaded, fontError]);

  // if (!fontsLoaded && !fontError) {
  //   return null; // Não renderiza nada até que as fontes estejam carregadas (ou dê erro)
  // }

  return (
    // <StoreProvider> // Envolveria o app se você usar um Provider para o Zustand
      <Stack screenOptions={{ headerShown: false }}>
        {/* Define que o grupo (auth) faz parte deste Stack e não mostrará seu próprio header aqui */}
        <Stack.Screen name="(auth)" /> 
        
        {/* Define que o grupo (tabs) faz parte deste Stack e não mostrará seu próprio header aqui */}
        <Stack.Screen name="(tabs)" />

        {/* Você pode adicionar outras rotas globais aqui, como modais */}
        {/* <Stack.Screen name="modal" options={{ presentation: 'modal' }} /> */}

        {/* Para uma tela de "Não encontrado" (404) global, crie app/+not-found.tsx */}
        {/* <Stack.Screen name="+not-found" /> */}
      </Stack>
    // </StoreProvider>
  );
}