// app/(auth)/_layout.tsx
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="login" // Nome do arquivo da tela de login (login.tsx)
        options={{ headerShown: false }} // Para esconder o cabeçalho padrão
      />
      {/* Você pode adicionar outras telas de autenticação aqui depois, como "forgot-password" */}
    </Stack>
  );
}