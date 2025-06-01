// app/(auth)/login.tsx (Sem sombras)
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
  // StyleSheet foi removido pois não estamos mais definindo sombras aqui
} from 'react-native';
import { Link } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function LoginScreen() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    if (isLoading) return;
    setIsLoading(true);
    console.log('Login attempt:');
    console.log('Identifier:', identifier);
    console.log('Password:', password);
    setTimeout(() => {
      setIsLoading(false);
      // TODO: Lógica de autenticação real
      // router.replace('/(tabs)');
    }, 2000);
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
          {/* Removida a classe shadow-xl daqui e a aplicação de style={styles.cardShadow} */}
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
                />
              </View>
            </View>

            {/* Removida a classe shadow-lg daqui e a aplicação de style={styles.buttonShadow} */}
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

// StyleSheet foi removido pois não estamos mais definindo sombras com ele aqui.
// Se você precisar de outros estilos complexos não cobertos pelo NativeWind, pode adicioná-lo de volta.