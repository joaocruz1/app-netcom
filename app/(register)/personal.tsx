// app/(register)/personal.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Alert // Importe o Alert para feedback
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useStore } from '~/store/store';

// --- FUNÇÕES DE VALIDAÇÃO E FORMATAÇÃO ---

/**
 * Valida um número de CPF brasileiro.
 * @param cpf - O CPF a ser validado (pode conter máscara).
 * @returns true se o CPF for válido, false caso contrário.
 */
const validateCpf = (cpf: string): boolean => {
  const cpfClean = cpf.replace(/[^\d]/g, ''); // Remove caracteres não numéricos

  if (cpfClean.length !== 11 || /^(\d)\1{10}$/.test(cpfClean)) {
    return false;
  }

  let sum = 0;
  let remainder;

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cpfClean.substring(i - 1, i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) {
    remainder = 0;
  }
  if (remainder !== parseInt(cpfClean.substring(9, 10))) {
    return false;
  }

  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cpfClean.substring(i - 1, i)) * (12 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) {
    remainder = 0;
  }
  if (remainder !== parseInt(cpfClean.substring(10, 11))) {
    return false;
  }

  return true;
};

/**
 * Valida a data de nascimento e a idade mínima (18 anos).
 * @param dateStr - A data no formato "DD/MM/AAAA".
 * @returns true se a data for válida e a idade for >= 18, false caso contrário.
 */
const validateBirthDate = (dateStr: string): boolean => {
  const match = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return false;

  const [_, day, month, year] = match.map(Number);
  const date = new Date(year, month - 1, day);

  // Verifica se a data é válida (ex: 31/02/2023 não é válido)
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return false;
  }
  
  // Verifica se a pessoa tem pelo menos 18 anos
  const today = new Date();
  const age = today.getFullYear() - date.getFullYear();
  const monthDifference = today.getMonth() - date.getMonth();
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < date.getDate())) {
    return age - 1 >= 18;
  }

  return age >= 18;
};


export default function PersonalInfoScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [errors, setErrors] = useState<{ name?: string; cpf?: string; birthDate?: string }>({});
  const { setName: setNameInStore, setCpf: setCpfInStore, setBirthdate: setBirthdateInStore } = useStore();

  // --- FUNÇÕES DE MÁSCARA ---

  const handleCpfChange = (text: string) => {
    const cleaned = text.replace(/[^\d]/g, '');
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2})$/);
    if (!match) {
      setCpf(text);
      return;
    };
    let formatted = '';
    if (match[1]) formatted += match[1];
    if (match[2]) formatted += `.${match[2]}`;
    if (match[3]) formatted += `.${match[3]}`;
    if (match[4]) formatted += `-${match[4]}`;
    setCpf(formatted);
  };

  const handleBirthDateChange = (text: string) => {
    const cleaned = text.replace(/[^\d]/g, '');
    const match = cleaned.match(/^(\d{0,2})(\d{0,2})(\d{0,4})$/);
    if (!match) {
      setBirthDate(text);
      return;
    }
    let formatted = '';
    if (match[1]) formatted += match[1];
    if (match[2]) formatted += `/${match[2]}`;
    if (match[3]) formatted += `/${match[3]}`;
    setBirthDate(formatted);
  };
  
  // --- FUNÇÃO DE SUBMISSÃO ---

  const handleContinue = () => {
    const newErrors: { name?: string; cpf?: string; birthDate?: string } = {};

    // Validação do Nome
    if (!name.trim()) {
      newErrors.name = 'O nome completo é obrigatório.';
    }

    // Validação do CPF
    if (!cpf) {
      newErrors.cpf = 'O CPF é obrigatório.';
    } else if (!validateCpf(cpf)) {
      newErrors.cpf = 'CPF inválido. Verifique o número digitado.';
    }

    // Validação da Data de Nascimento
    if (!birthDate) {
      newErrors.birthDate = 'A data de nascimento é obrigatória.';
    } else if (!validateBirthDate(birthDate)) {
      newErrors.birthDate = 'Data inválida ou você deve ter mais de 18 anos.';
    }
    
    setErrors(newErrors);

    if (Object.keys(errors).length === 0) {
      // 2. Salvar os dados no store
      setNameInStore(name);
      setCpfInStore(cpf);
      
      // A API espera AAAA-MM-DD, então formatamos a data
      const [day, month, year] = birthDate.split('/');
      const formattedBirthDate = `${year}-${month}-${day}`;
      setBirthdateInStore(formattedBirthDate);

      router.push('/(register)/address');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-netcom-background"
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <StatusBar barStyle="dark-content" />
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
              className={`w-full bg-white border-2 rounded-xl p-3 text-base h-14 ${errors.name ? 'border-red-500' : 'border-netcom-input-border'}`}
              placeholder="Digite seu nome completo"
              placeholderTextColor="#A1A1AA"
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (errors.name) setErrors({ ...errors, name: undefined });
              }}
            />
            {errors.name && <Text className="text-red-500 text-xs mt-1 ml-1">{errors.name}</Text>}
          </View>

          {/* Input para CPF */}
          <View className="mb-5">
            <Text className="text-xs text-netcom-blue font-semibold mb-1.5 ml-1 tracking-wide">CPF</Text>
            <TextInput
              className={`w-full bg-white border-2 rounded-xl p-3 text-base h-14 ${errors.cpf ? 'border-red-500' : 'border-netcom-input-border'}`}
              placeholder="000.000.000-00"
              placeholderTextColor="#A1A1AA"
              value={cpf}
              onChangeText={(text) => {
                handleCpfChange(text);
                if (errors.cpf) setErrors({ ...errors, cpf: undefined });
              }}
              keyboardType="numeric"
              maxLength={14} // 11 números + 2 pontos + 1 traço
            />
            {errors.cpf && <Text className="text-red-500 text-xs mt-1 ml-1">{errors.cpf}</Text>}
          </View>
          
          {/* Input para Data de Nascimento */}
          <View className="mb-8">
            <Text className="text-xs text-netcom-blue font-semibold mb-1.5 ml-1 tracking-wide">DATA DE NASCIMENTO</Text>
            <TextInput
              className={`w-full bg-white border-2 rounded-xl p-3 text-base h-14 ${errors.birthDate ? 'border-red-500' : 'border-netcom-input-border'}`}
              placeholder="DD/MM/AAAA"
              placeholderTextColor="#A1A1AA"
              keyboardType="numeric"
              value={birthDate}
              onChangeText={(text) => {
                handleBirthDateChange(text)
                if (errors.birthDate) setErrors({ ...errors, birthDate: undefined });
              }}
              maxLength={10} // DD/MM/AAAA
            />
            {errors.birthDate && <Text className="text-red-500 text-xs mt-1 ml-1">{errors.birthDate}</Text>}
          </View>
        </View>
      </ScrollView>

      {/* Botão Fixo na Parte Inferior */}
      <View className="px-6 py-4 border-t border-gray-200 bg-netcom-background">
        <TouchableOpacity
          className="w-full bg-netcom-orange py-4 rounded-xl items-center"
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <Text className="text-white text-base font-bold">Continuar</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}