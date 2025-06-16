// app/profile/_layout.tsx

import React from 'react';
import { Stack } from 'expo-router';
import { CardProvider } from '~/context/CardContext';

const headerColor = '#FF6600'; // Mesma cor do seu layout de Tabs

export default function ProfileLayout() {
  return (
    <CardProvider>
      <Stack     screenOptions={{
        headerShown: true, // <- ALTERADO PARA TRUE
        headerStyle: {
          backgroundColor: headerColor,
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTitleAlign: 'center',
      }} />
    </CardProvider>
  );
}