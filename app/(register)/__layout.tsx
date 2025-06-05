// app/(register)/_layout.tsx
import { Stack, usePathname } from 'expo-router';
import { View } from 'react-native';

const STEPS = [
  { step: 1, path: '/(register)' },
  { step: 2, path: '/(register)/personal' },
  { step: 3, path: '/(register)/address' },
  { step: 4, path: '/(register)/summary' },
];

function ProgressHeader() {
  const pathname = usePathname();
  const currentStep = STEPS.find(step => step.path === pathname)?.step || 0;

  return (
    <View className="flex-row w-full h-1.5 mt-2">
      {STEPS.map(({ step }) => (
        <View
          key={step}
          className={`flex-1 h-full rounded-full mx-1 ${
            currentStep >= step ? 'bg-netcom-orange' : 'bg-gray-300'
          }`}
        />
      ))}
    </View>
  );
}

export default function RegisterLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#F9FAFB' },
        headerTintColor: '#0A2F5B',
        headerTitleStyle: { fontWeight: 'bold' },
        headerTitleAlign: 'center',
        headerBackTitle: 'Voltar',
        headerShadowVisible: false,
        headerTitle: (props) => <ProgressHeader />, // Usando o componente de progresso como título
      }}
    />
  );
}