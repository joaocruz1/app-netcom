// app/(register)/email.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useStore } from '../../store/store'; // 1. Importar o store

export default function CreateAccountScreen() {
  const router = useRouter();
  // 2. Puxar as funções de 'set' do store
  const { setEmail: setEmailInStore, setPassword: setPasswordInStore } = useStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  function handleContinue() {
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Senhas não coincidem', 'As senhas são diferentes.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Senha muito curta', 'Sua senha deve ter pelo menos 6 caracteres.');
      return;
    }

    // 3. Salvar os dados no store antes de navegar
    setEmailInStore(email);
    setPasswordInStore(password);

    // 4. Navegar para a próxima tela do fluxo
    router.push('/(register)/personal');
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-netcom-background"
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
      <StatusBar barStyle="dark-content" />
      <Stack.Screen options={{ title: 'Criar Conta' }} />

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View className="px-6 py-8">
          <View className="items-center mb-8">
            <Text className="text-3xl font-bold text-netcom-blue mb-2">
              Bem-vindo à Netcom! <Text>🎉</Text>
            </Text>
            <Text className="text-base text-netcom-text-secondary text-center px-4">
              Vamos começar sua jornada de conexão sem burocracia.
            </Text>
          </View>

          <Text className="text-lg font-semibold text-netcom-blue mb-6 text-center">
            Primeiro, informe um e-mail e senha para criar seu acesso. 🚀
          </Text>

          {/* Campo de E-mail */}
          <View className="mb-5">
            <Text className="text-xs text-netcom-blue font-semibold mb-1.5 ml-1 tracking-wide">
              E-MAIL
            </Text>
            <View className="flex-row items-center bg-white border-2 border-netcom-input-border rounded-xl">
              <MaterialCommunityIcons name="email-outline" size={22} color="#6B7280" className="mx-3" />
              <TextInput
                className="flex-1 py-3 pr-3 text-netcom-text-primary text-base h-14"
                placeholder="seu.email@exemplo.com"
                placeholderTextColor="#A1A1AA"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Campo de Senha */}
          <View className="mb-5">
            <Text className="text-xs text-netcom-blue font-semibold mb-1.5 ml-1 tracking-wide">
              SENHA
            </Text>
            <View className="flex-row items-center bg-white border-2 border-netcom-input-border rounded-xl">
              <MaterialCommunityIcons name="lock-outline" size={22} color="#6B7280" className="mx-3" />
              <TextInput
                className="flex-1 py-3 text-netcom-text-primary text-base h-14"
                placeholder="Crie uma senha"
                placeholderTextColor="#A1A1AA"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="p-3">
                <MaterialCommunityIcons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={22}
                  color="#6B7280"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Campo de Repetir Senha */}
          <View className="mb-8">
            <Text className="text-xs text-netcom-blue font-semibold mb-1.5 ml-1 tracking-wide">
              REPITA A SENHA
            </Text>
            <View className="flex-row items-center bg-white border-2 border-netcom-input-border rounded-xl">
              <MaterialCommunityIcons name="lock-check-outline" size={22} color="#6B7280" className="mx-3" />
              <TextInput
                className="flex-1 py-3 text-netcom-text-primary text-base h-14"
                placeholder="Confirme sua senha"
                placeholderTextColor="#A1A1AA"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} className="p-3">
                <MaterialCommunityIcons
                  name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={22}
                  color="#6B7280"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Botão de Continuar Fixo na Parte Inferior */}
      <View className="px-6 py-4 border-t border-gray-200 bg-netcom-background">
        <TouchableOpacity
          className="w-full bg-netcom-orange py-4 rounded-xl items-center justify-center active:scale-[0.98] active:bg-netcom-orange-darker"
          onPress={handleContinue}>
          <Text className="text-white text-base font-bold tracking-wider">Continuar</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}