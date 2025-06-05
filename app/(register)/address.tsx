// app/(register)/address.tsx
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useRegistrationStore } from '../../store/registrationStore';

export default function AddressScreen() {
  const router = useRouter();
  const { cep, street, updateField } = useRegistrationStore(); // Pegue os campos necessários

  return (
    <ScrollView className="flex-1 bg-netcom-background p-6">
      <Stack.Screen options={{ title: 'Seu Endereço (3/4)' }} />
      <Text className="text-2xl font-bold text-netcom-blue mb-2 text-center">Onde você mora?</Text>
      <Text className="text-base text-netcom-text-secondary mb-8 text-center">Precisamos do seu endereço para verificar a cobertura.</Text>
      
      {/* Inputs para CEP, Rua, Bairro, etc. */}
      {/* Exemplo para CEP */}
      <View className="mb-5">
        <Text className="text-xs text-netcom-blue font-semibold mb-1.5 ml-1">CEP</Text>
        <TextInput
          className="w-full bg-white border-2 border-netcom-input-border rounded-xl p-3 text-base h-12"
          placeholder="00000-000"
          value={cep}
          onChangeText={(text) => updateField('cep', text)}
          keyboardType="numeric"
        />
      </View>
      {/* Adicione os outros inputs de endereço aqui */}

      <TouchableOpacity
        className="w-full bg-netcom-orange py-4 rounded-xl items-center mt-4"
        onPress={() => router.push('/(register)/summary')}
      >
        <Text className="text-white text-base font-bold">Continuar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}