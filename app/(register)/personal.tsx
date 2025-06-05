// app/(register)/personal.tsx
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useRegistrationStore } from '../../store/registrationStore';

export default function PersonalInfoScreen() {
  const router = useRouter();
  const { fullName, cpf, birthDate, updateField } = useRegistrationStore();

  return (
    <ScrollView className="flex-1 bg-netcom-background p-6">
      <Stack.Screen options={{ title: 'Informações Pessoais (2/4)' }} />
      <Text className="text-2xl font-bold text-netcom-blue mb-2 text-center">Queremos te conhecer melhor!</Text>
      <Text className="text-base text-netcom-text-secondary mb-8 text-center">Esses dados são importantes para o seu cadastro.</Text>

      {/* Inputs para Nome Completo, CPF, Data de Nascimento, etc. */}
      {/* Exemplo de Input para Nome Completo */}
      <View className="mb-5">
        <Text className="text-xs text-netcom-blue font-semibold mb-1.5 ml-1">NOME COMPLETO</Text>
        <TextInput
          className="w-full bg-white border-2 border-netcom-input-border rounded-xl p-3 text-base h-12"
          placeholder="Seu nome completo"
          value={fullName}
          onChangeText={(text) => updateField('fullName', text)}
        />
      </View>
      {/* Adicione outros inputs para CPF e Data de Nascimento seguindo o mesmo padrão */}

      <TouchableOpacity
        className="w-full bg-netcom-orange py-4 rounded-xl items-center mt-4"
        onPress={() => router.push('/(register)/address')}
      >
        <Text className="text-white text-base font-bold">Continuar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}