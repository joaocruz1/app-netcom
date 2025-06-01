// app/(auth)/login.tsx
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
  StatusBar // Import StatusBar
} from 'react-native';
import { Link } from 'expo-router';

export default function LoginScreen() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('Identifier:', identifier);
    console.log('Password:', password);
    // TODO: Lógica de autenticação aqui
    // Ex: router.replace('/(tabs)');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white" // Fundo branco para a tela toda
    >
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" /> 
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled" // Para o teclado não fechar ao tocar fora dos inputs
      >
        <View className="flex-1 justify-center items-center p-8">
          {/* Logo da Netcom */}
          <Image
            source={require('../../../assets/images/netcom-logo.png')} // Ajuste o caminho se necessário!
                                                                    // Para app/(auth)/login.tsx, se assets está na raiz, o caminho é ../../assets/...
            className="w-52 h-28 mb-10" // Aumentei um pouco o tamanho e a margem
            resizeMode="contain"
          />

          <Text className="text-3xl font-bold text-netcom-blue mb-8 text-center">
            Acessar Minha Conta
          </Text>

          {/* Campo de Usuário/Identificador */}
          <View className="w-full mb-5">
            <Text className="text-sm text-netcom-dark-text font-semibold mb-1 ml-1">Usuário</Text>
            <TextInput
              className="w-full bg-netcom-light-gray border border-gray-300 text-netcom-dark-text rounded-lg p-4 text-base focus:border-netcom-orange focus:ring-1 focus:ring-netcom-orange"
              placeholder="CPF, E-mail ou Código de Cliente"
              placeholderTextColor="#9CA3AF" // gray-400
              value={identifier}
              onChangeText={setIdentifier}
              autoCapitalize="none"
              keyboardType="email-address" // ou default
            />
          </View>

          {/* Campo de Senha */}
          <View className="w-full mb-6">
            <Text className="text-sm text-netcom-dark-text font-semibold mb-1 ml-1">Senha</Text>
            <TextInput
              className="w-full bg-netcom-light-gray border border-gray-300 text-netcom-dark-text rounded-lg p-4 text-base focus:border-netcom-orange focus:ring-1 focus:ring-netcom-orange"
              placeholder="Digite sua senha"
              placeholderTextColor="#9CA3AF" // gray-400
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {/* Botão de Entrar */}
          <TouchableOpacity
            className="w-full bg-netcom-orange py-4 rounded-lg items-center justify-center mb-6 shadow-md active:opacity-80"
            onPress={handleLogin}
          >
            <Text className="text-white text-lg font-bold">ENTRAR</Text>
          </TouchableOpacity>

          {/* Link Esqueci minha senha */}
          <Link href="/(auth)/forgot-password" asChild>
            <TouchableOpacity className="py-2">
              <Text className="text-netcom-blue text-sm hover:text-netcom-orange active:text-netcom-orange/80">
                Esqueci minha senha
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}