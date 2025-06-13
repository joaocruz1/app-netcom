import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { loginUser } from '~/api/APIServer';
import { useAuthStore } from '~/store/authStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
	

export default function LoginScreen() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { login: loginInStore } = useAuthStore();

  const handleLogin = async () => {
    if (isLoading || !identifier || !password) {
      if (!identifier || !password) {
        Alert.alert("Atenção", "Por favor, preencha seu e-mail e senha.");
      }
      return;
    }
    setIsLoading(true);

    try {
      // 1. Monta o payload que o nosso backend espera
      const loginPayload = {
        cpf: identifier,
        password: password,
      };

      // 2. Chama a função de login da API
      const { token, user } = await loginUser(loginPayload);

      // 3. PASSO CRÍTICO: Armazena o token e os dados do usuário
      // Para React Native, use AsyncStorage. Para web, seria localStorage.
      await AsyncStorage.setItem('authToken', token);

      // 4. Atualiza o estado global da aplicação (Zustand, Context, etc.)
      loginInStore(token,user);
      
      // 5. Navega para a área principal do app
      router.replace('/(tabs)');

    } catch (error: any) {
      // Mostra o erro retornado pela nossa API (ex: "Credenciais inválidas")
      Alert.alert('Erro no Login', error.message || 'Ocorreu um erro inesperado.');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-netcom-background">
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View className="items-center p-4">
          <View className="w-full max-w-sm bg-netcom-card-bg p-6 sm:p-8 rounded-2xl">
            <Image
              source={require('../../assets/images/netcom-logo.png')} // Verifique o caminho!
              className="w-40 h-20 self-center mb-6"
              resizeMode="contain"
              accessibilityLabel="Netcom Logo"
            />
            <Text className="text-2xl sm:text-3xl font-bold text-netcom-blue mb-2 text-center">
              Bem-vindo de Volta!
            </Text>
            <Text className="text-sm sm:text-base text-netcom-text-secondary mb-8 text-center">
              Acesse sua conta para continuar.
            </Text>

            <View className="mb-5">
              <Text className="text-xs text-netcom-blue font-semibold mb-1.5 ml-1 tracking-wide">IDENTIFICADOR</Text>
              <View className="flex-row items-center bg-netcom-input-bg border-2 border-netcom-input-border rounded-xl focus-within:border-netcom-input-focus-border">
                <MaterialCommunityIcons name="account-circle-outline" size={22} color="#6B7280" className="mx-3" />
                <TextInput
                  className="flex-1 py-3 pr-3 text-netcom-text-primary text-base h-12"
                  placeholder="Usuário, CPF, E-mail"
                  placeholderTextColor="#A1A1AA"
                  value={identifier}
                  onChangeText={setIdentifier}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  editable={!isLoading}
                />
              </View>
            </View>

            <View className="mb-6">
              <Text className="text-xs text-netcom-blue font-semibold mb-1.5 ml-1 tracking-wide">SENHA</Text>
              <View className="flex-row items-center bg-netcom-input-bg border-2 border-netcom-input-border rounded-xl focus-within:border-netcom-input-focus-border">
                <MaterialCommunityIcons name="lock-outline" size={22} color="#6B7280" className="mx-3" />
                <TextInput
                  className="flex-1 py-3 pr-3 text-netcom-text-primary text-base h-12"
                  placeholder="••••••••••"
                  placeholderTextColor="#A1A1AA"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  editable={!isLoading}
                  onSubmitEditing={handleLogin} // Permite logar pressionando "Enter" no teclado
                />
              </View>
            </View>

            <TouchableOpacity
              className={`w-full py-3.5 rounded-xl items-center justify-center mb-6 
                          transition-transform duration-150 ease-in-out active:scale-[0.98]
                          ${isLoading
                            ? 'bg-netcom-orange/60'
                            : 'bg-netcom-orange hover:bg-netcom-orange-darker active:bg-netcom-orange-darker'
                          }`}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text className="text-white text-base font-bold tracking-wider">ENTRAR</Text>
              )}
            </TouchableOpacity>

            <Link href="/(auth)/forgot-password" asChild>
              <TouchableOpacity className="py-2 self-center group">
                <Text className="text-netcom-link text-sm group-hover:underline group-active:opacity-70">
                  Esqueceu sua senha?
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}