// app/(register)/verify.tsx
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ActivityIndicator,
  ScrollView // Importe a ScrollView
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const CODE_LENGTH = 6;

export default function VerifyCodeScreen() {
  const router = useRouter();
  
  const [code, setCode] = useState(new Array(CODE_LENGTH).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  
  const inputsRef = useRef<(TextInput | null)[]>([]);

  const handleInputChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < CODE_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerifyCode = () => {
    const verificationCode = code.join('');   
    setIsLoading(true);
    console.log('Verificando código:', verificationCode);

    setTimeout(() => {
      setIsLoading(false);
      router.push('/(register)/personal');
    }, 1500);
  };

  return (
    <SafeAreaView className="flex-1 bg-netcom-background">
      <StatusBar  />
      {/* O título do cabeçalho é controlado pelo _layout.tsx do grupo */}
      <Stack.Screen options={{ title: '' }} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        {/* Usamos ScrollView para centralizar e permitir rolagem quando o teclado aparecer */}
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="p-6">
            <View className="items-center mb-10">
              <Text className="text-3xl font-bold text-netcom-blue mb-3">Verifique seu e-mail</Text>
              <Text className="text-base text-netcom-text-secondary text-center">
                Enviamos um código de 6 dígitos para {'\n'}
                <Text className="font-semibold">{'seu e-mail'}</Text>
              </Text>
            </View>

            <View className="flex-row justify-center items-center gap-2 mb-10">
              {code.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => { inputsRef.current[index] = ref; }}
                  className="w-12 h-14 bg-white border-2 border-netcom-input-border rounded-xl text-center text-2xl font-bold text-netcom-text-primary focus:border-netcom-orange"
                  maxLength={1}
                  keyboardType="numeric"
                  value={digit}
                  onChangeText={(text) => handleInputChange(text, index)}
                  onKeyPress={(e) => handleBackspace(e, index)}
                  selectTextOnFocus
                />
              ))}
            </View>

            <TouchableOpacity
              className={`w-full py-4 rounded-xl items-center justify-center mb-6
                          active:scale-[0.98]
                          ${isLoading ? 'bg-netcom-orange/60' : 'bg-netcom-orange active:bg-netcom-orange-darker'}`}
              onPress={handleVerifyCode}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text className="text-white text-base font-bold tracking-wider">Continuar</Text>
              )}
            </TouchableOpacity>

            <View className="items-center">
              <Text className="text-sm text-netcom-text-secondary">Não recebeu o código?</Text>
              <TouchableOpacity onPress={() => console.log('Reenviar código para:')} className="mt-1">
                <Text className="text-sm font-bold text-netcom-orange underline">
                  Verifique sua caixa de spam ou clique aqui
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}