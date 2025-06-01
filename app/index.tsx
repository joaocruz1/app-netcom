// app/index.tsx
import { Redirect, useRouter } from 'expo-router';
// import { useEffect, useState } from 'react'; // Para lógica de verificação de auth
// import { useAuthStore } from '../store/authStore'; // Exemplo de como você usaria o Zustand

export default function AppIndex() {
  // Lógica de verificação de autenticação (exemplo para o futuro):
  // const isAuthenticated = useAuthStore((state) => !!state.token); // Exemplo
  // const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // useEffect(() => {
  //   // Simula a verificação do token ao iniciar o app
  //   // No app real, você verificaria o AsyncStorage pelo token salvo
  //   setIsLoadingAuth(false); 
  // }, []);

  // if (isLoadingAuth) {
  //   return <View><Text>Carregando...</Text></View>; // Ou uma tela de Splash bonita
  // }

  // if (isAuthenticated) {
  //   return <Redirect href="/(tabs)" />; // Se logado, vai para as abas principais
  // }
  
  // Se não estiver logado (ou para simplificar agora), redireciona para o login:
  return <Redirect href="/(auth)/login" />;
}