// app/_layout.tsx (ATUALIZADO)
import '../global.css';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(register)" /> {/* <-- ADICIONE ESTA LINHA */}
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}