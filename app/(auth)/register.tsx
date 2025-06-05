// app/(auth)/register.tsx (DESIGN ALINHADO COM LOGIN.TSX)
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
  Alert,
  StyleSheet // Para sombras, se necessário
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  // const [address, setAddress] = useState(''); // Se precisar do campo endereço
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = () => {
    if (!name || !email || !phone) {
      Alert.alert('Atenção', 'Por favor, preencha nome, e-mail e telefone.');
      return;
    }
    if (isLoading) return;
    setIsLoading(true);
    
    console.log('Novo Lead Recebido:', { name, email, phone });

    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        'Obrigado!',
        'Recebemos seu interesse. Em breve nossa equipe comercial entrará em contato.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    }, 2000);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-netcom-background" // Fundo da tela
    >
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" /> 
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} // Centraliza verticalmente
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center p-4">
          {/* Card principal */}
          <View 
            className="w-full max-w-sm bg-netcom-card-bg p-6 sm:p-8 rounded-2xl"
           
          >
    
            {/* Logo da Netcom */}
            <Image
              source={require('../../assets/images/netcom-logo.png')} // MESMO CAMINHO E LOGO DO LOGIN.TSX
              className="w-40 h-20 self-center mb-4" // Estilo do logo como no login
              resizeMode="contain"
              accessibilityLabel="Netcom Logo"
            />
            
            <Text className="text-sm sm:text-base text-netcom-text-secondary mb-6 text-center">
              Preencha seus dados para iniciarmos seu cadastro.
            </Text>

            {/* Campo de Nome Completo */}
            <View className="mb-5">
              <Text className="text-xs text-netcom-blue font-semibold mb-1.5 ml-1 tracking-wide">NOME COMPLETO</Text>
              <View className="flex-row items-center bg-netcom-input-bg border-2 border-netcom-input-border rounded-xl focus-within:border-netcom-input-focus-border">
                <MaterialCommunityIcons name="account-outline" size={22} color="#6B7280" className="mx-3" />
                <TextInput
                  className="flex-1 py-3 pr-3 text-netcom-text-primary text-base h-12"
                  placeholder="Seu nome completo"
                  placeholderTextColor="#A1A1AA"
                  value={name}
                  onChangeText={setName}
                  editable={!isLoading}
                />
              </View>
            </View>

            {/* Campo de E-mail */}
            <View className="mb-5">
              <Text className="text-xs text-netcom-blue font-semibold mb-1.5 ml-1 tracking-wide">E-MAIL</Text>
              <View className="flex-row items-center bg-netcom-input-bg border-2 border-netcom-input-border rounded-xl focus-within:border-netcom-input-focus-border">
                <MaterialCommunityIcons name="email-outline" size={22} color="#6B7280" className="mx-3" />
                <TextInput
                  className="flex-1 py-3 pr-3 text-netcom-text-primary text-base h-12"
                  placeholder="seu.email@exemplo.com"
                  placeholderTextColor="#A1A1AA"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  editable={!isLoading}
                />
              </View>
            </View>
            
            {/* Campo de Telefone */}
            <View className="mb-6">
              <Text className="text-xs text-netcom-blue font-semibold mb-1.5 ml-1 tracking-wide">TELEFONE / WHATSAPP</Text>
              <View className="flex-row items-center bg-netcom-input-bg border-2 border-netcom-input-border rounded-xl focus-within:border-netcom-input-focus-border">
                <MaterialCommunityIcons name="phone-outline" size={22} color="#6B7280" className="mx-3" />
                <TextInput
                  className="flex-1 py-3 pr-3 text-netcom-text-primary text-base h-12"
                  placeholder="(00) 90000-0000"
                  placeholderTextColor="#A1A1AA"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  editable={!isLoading}
                />
              </View>
            </View>

            {/* Botão de Enviar Interesse */}
            <TouchableOpacity
              
              className={`w-full py-3.5 rounded-xl items-center justify-center
                          transition-transform duration-150 ease-in-out active:scale-[0.98]
                          ${isLoading 
                            ? 'bg-netcom-orange/60' 
                            : 'bg-netcom-orange hover:bg-netcom-orange-darker active:bg-netcom-orange-darker'
                          }`}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text className="text-white text-base font-bold tracking-wider">ENVIAR INTERESSE</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Estilos para as sombras (para evitar o erro de shadowOffset, igual ao login.tsx