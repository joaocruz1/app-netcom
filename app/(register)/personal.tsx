// app/(register)/personal.tsx
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

export default function PersonalInfoScreen() {
  const router = useRouter();
  const { fullName, cpf, birthDate, updateField } = useRegistrationStore();

  const handleContinue = () => {
    // Adicione validações se necessário, por exemplo, para o formato do CPF
    router.push('/(register)/address');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-netcom-background"
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <StatusBar barStyle="dark-content" />
      {/* O título no cabeçalho (barra de progresso) é controlado pelo _layout.tsx */}
      <Stack.Screen options={{ title: '' }} />
      
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6 py-8">
          <View className="items-center mb-8">
            <Text className="text-3xl font-bold text-netcom-blue mb-2">Informações Pessoais</Text>
            <Text className="text-base text-netcom-text-secondary text-center">
              Queremos te conhecer melhor!
            </Text>
          </View>

          {/* Input para Nome Completo */}
          <View className="mb-5">
            <Text className="text-xs text-netcom-blue font-semibold mb-1.5 ml-1 tracking-wide">NOME COMPLETO</Text>
            <TextInput
              className="w-full bg-white border-2 border-netcom-input-border rounded-xl p-3 text-base h-14"
              placeholder="Digite seu nome completo"
              placeholderTextColor="#A1A1AA"
              value={fullName}
              onChangeText={(text) => updateField('fullName', text)}
            />
          </View>

          {/* Input para CPF */}
          <View className="mb-5">
            <Text className="text-xs text-netcom-blue font-semibold mb-1.5 ml-1 tracking-wide">CPF</Text>
            <TextInput
              className="w-full bg-white border-2 border-netcom-input-border rounded-xl p-3 text-base h-14"
              placeholder="000.000.000-00"
              placeholderTextColor="#A1A1AA"
              value={cpf}
              onChangeText={(text) => updateField('cpf', text)}
              keyboardType="numeric"
            />
          </View>
          
          {/* Input para Data de Nascimento */}
          <View className="mb-8">
            <Text className="text-xs text-netcom-blue font-semibold mb-1.5 ml-1 tracking-wide">DATA DE NASCIMENTO</Text>
            <TextInput
              className="w-full bg-white border-2 border-netcom-input-border rounded-xl p-3 text-base h-14"
              placeholder="DD/MM/AAAA"
              placeholderTextColor="#A1A1AA"
              value={birthDate}
              onChangeText={(text) => updateField('birthDate', text)}
              keyboardType="numeric"
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
          <Text className="text-white text-base font-bold">Continuar</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}