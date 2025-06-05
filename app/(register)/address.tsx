// app/(register)/address.tsx
import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useRegistrationStore } from '../../store/registrationStore';

export default function AddressScreen() {
  const router = useRouter();
  const { 
    cep, 
    street, 
    neighborhood, 
    number, 
    complement, 
    city, 
    state, 
    updateField 
  } = useRegistrationStore();

  const handleContinue = () => {
    // Adicione validações para os campos de endereço se necessário
    router.push('/(register)/summary');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-netcom-background"
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <StatusBar barStyle="dark-content" />
      {/* O título no cabeçalho (barra de progresso) é controlado pelo _layout.tsx do grupo (register) */}
      <Stack.Screen options={{ title: '' }} />
      
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6 py-8">
          <View className="items-center mb-8">
            <Text className="text-3xl font-bold text-netcom-blue mb-2">Informações de Endereço</Text>
            <Text className="text-base text-netcom-text-secondary text-center">
              Onde você mora? Precisamos do seu endereço para verificar a cobertura.
            </Text>
          </View>

          {/* Campo de CEP */}
          <View className="mb-5">
            <Text className="text-xs text-netcom-blue font-semibold mb-1.5 ml-1 tracking-wide">CEP</Text>
            <TextInput
              className="w-full bg-white border-2 border-netcom-input-border rounded-xl p-3 text-base h-14 text-netcom-text-primary focus:border-netcom-orange"
              placeholder="00000-000"
              placeholderTextColor="#A1A1AA"
              value={cep}
              onChangeText={(text) => updateField('cep', text)}
              keyboardType="numeric"
            />
          </View>

          {/* Campo de Endereço */}
          <View className="mb-5">
            <Text className="text-xs text-netcom-blue font-semibold mb-1.5 ml-1 tracking-wide">ENDEREÇO</Text>
            <TextInput
              className="w-full bg-white border-2 border-netcom-input-border rounded-xl p-3 text-base h-14 text-netcom-text-primary focus:border-netcom-orange"
              placeholder="Rua, Avenida, etc."
              placeholderTextColor="#A1A1AA"
              value={street}
              onChangeText={(text) => updateField('street', text)}
            />
          </View>

          {/* Campo de Bairro */}
          <View className="mb-5">
            <Text className="text-xs text-netcom-blue font-semibold mb-1.5 ml-1 tracking-wide">BAIRRO</Text>
            <TextInput
              className="w-full bg-white border-2 border-netcom-input-border rounded-xl p-3 text-base h-14 text-netcom-text-primary focus:border-netcom-orange"
              placeholder="Seu bairro"
              placeholderTextColor="#A1A1AA"
              value={neighborhood}
              onChangeText={(text) => updateField('neighborhood', text)}
            />
          </View>

          <View className="flex-row gap-4">
            {/* Campo de Número */}
            <View className="mb-5 flex-1">
              <Text className="text-xs text-netcom-blue font-semibold mb-1.5 ml-1 tracking-wide">NÚMERO</Text>
              <TextInput
                className="w-full bg-white border-2 border-netcom-input-border rounded-xl p-3 text-base h-14 text-netcom-text-primary focus:border-netcom-orange"
                placeholder="Ex: 123"
                placeholderTextColor="#A1A1AA"
                value={number}
                onChangeText={(text) => updateField('number', text)}
                keyboardType="numeric"
              />
            </View>

            {/* Campo de Complemento */}
            <View className="mb-5 flex-1">
              <Text className="text-xs text-netcom-blue font-semibold mb-1.5 ml-1 tracking-wide">COMPLEMENTO</Text>
              <TextInput
                className="w-full bg-white border-2 border-netcom-input-border rounded-xl p-3 text-base h-14 text-netcom-text-primary focus:border-netcom-orange"
                placeholder="Apto, Bloco, etc. (Opcional)"
                placeholderTextColor="#A1A1AA"
                value={complement}
                onChangeText={(text) => updateField('complement', text)}
              />
            </View>
          </View>

          {/* Campo de Cidade */}
          <View className="mb-5">
            <Text className="text-xs text-netcom-blue font-semibold mb-1.5 ml-1 tracking-wide">CIDADE</Text>
            <TextInput
              className="w-full bg-white border-2 border-netcom-input-border rounded-xl p-3 text-base h-14 text-netcom-text-primary focus:border-netcom-orange"
              placeholder="Sua cidade"
              placeholderTextColor="#A1A1AA"
              value={city}
              onChangeText={(text) => updateField('city', text)}
            />
          </View>

          {/* Campo de Estado */}
          <View className="mb-8">
            <Text className="text-xs text-netcom-blue font-semibold mb-1.5 ml-1 tracking-wide">ESTADO</Text>
            <TextInput
              className="w-full bg-white border-2 border-netcom-input-border rounded-xl p-3 text-base h-14 text-netcom-text-primary focus:border-netcom-orange"
              placeholder="Seu estado"
              placeholderTextColor="#A1A1AA"
              value={state}
              onChangeText={(text) => updateField('state', text)}
            />
          </View>
        </View>
      </ScrollView>

      {/* Botão Fixo na Parte Inferior */}
      <View className="px-6 py-4 border-t border-gray-200 bg-netcom-background">
        <TouchableOpacity
          className="w-full bg-netcom-orange py-4 rounded-xl items-center"
          onPress={handleContinue}
        >
          <Text className="text-white text-base font-bold">Finalizar</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}