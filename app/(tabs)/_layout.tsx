import React from 'react';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export default function TabLayout() {
  const headerColor = '#FF6600';

  return (
    <>
      <StatusBar style="light" backgroundColor={headerColor} />
      <Tabs
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: headerColor,
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerTitleAlign: 'center',
          tabBarStyle: {
            display: 'none',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Minhas Linhas',
          }}
        />
        <Tabs.Screen
          name="detalhes"
          options={{
            title: 'Detalhes da Linha',
          }}
        />
      </Tabs>
    </>
  );
}