// app/(register)/address.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  ActivityIndicator, // Para indicar o carregamento do CEP
  Alert,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useStore } from '~/store/store';

// Interface para a resposta da API ViaCEP
interface ViaCepResponse {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

export default function AddressScreen() {
  const router = useRouter();

  // Estados para cada campo do formulário
  const [cep, setCep] = useState('');
  const { setAddress } = useStore();
  const [street, setStreet] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');

  const [errors, setErrors] = useState<{ [key: string]: string | undefined }>({});
  const [isFetchingCep, setIsFetchingCep] = useState(false);

  // Efeito para buscar o endereço quando o CEP estiver completo
  useEffect(() => {
    const fetchAddress = async () => {
      const cleanedCep = cep.replace(/\D/g, ''); // Remove máscara
      if (cleanedCep.length !== 8) {
        return;
      }

      setIsFetchingCep(true);
      setErrors({}); // Limpa erros antigos
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cleanedCep}/json/`);
        const data: ViaCepResponse = await response.json();

        if (data.erro) {
          setErrors({ cep: 'CEP não encontrado.' });
          setStreet('');
          setNeighborhood('');
          setCity('');
          setState('');
        } else {
          setStreet(data.logradouro);
          setNeighborhood(data.bairro);
          setCity(data.localidade);
          setState(data.uf);
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
        setErrors({ cep: 'Não foi possível buscar o CEP. Verifique sua conexão.' });
      } finally {
        setIsFetchingCep(false);
      }
    };

    fetchAddress();
  }, [cep]);

  // Função para aplicar a máscara de CEP
  const handleCepChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    const formatted = cleaned.replace(/^(\d{5})(\d)/, '$1-$2');
    setCep(formatted);
  };

  const handleContinue = () => {
    const newErrors: { [key: string]: string | undefined } = {};

    if (!cep.trim()) newErrors.cep = 'O CEP é obrigatório.';
    if (!street.trim()) newErrors.street = 'O endereço é obrigatório.';
    if (!neighborhood.trim()) newErrors.neighborhood = 'O bairro é obrigatório.';
    if (!number.trim()) newErrors.number = 'O número é obrigatório.';
    if (!city.trim()) newErrors.city = 'A cidade é obrigatória.';
    if (!state.trim()) newErrors.state = 'O estado é obrigatório.';
    
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log('Validação bem-sucedida, salvando endereço no store...');
      setAddress({
        street,
        city,
        state,
        neighborhood,
        cep,
        number,
        complement,
      });
      router.push('/(register)/summary');
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
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6 py-8">
          <View className="items-center mb-8">
            <Text className="text-3xl font-bold text-netcom-blue mb-2">Endereço de Instalação</Text>
            <Text className="text-base text-netcom-text-secondary text-center">
              Onde você mora? Precisamos do seu endereço para verificar a cobertura.
            </Text>
          </View>
          
          {/* Campo de CEP */}
          <View className="mb-5">
            <Text className="text-xs text-netcom-blue font-semibold mb-1.5 ml-1 tracking-wide">CEP</Text>
            <View className="relative w-full">
              <TextInput
                className={`w-full bg-white border-2 rounded-xl p-3 text-base h-14 ${errors.cep ? 'border-red-500' : 'border-netcom-input-border'}`}
                placeholder="00000-000"
                placeholderTextColor="#A1A1AA"
                value={cep}
                onChangeText={(text) => {
                  handleCepChange(text);
                  if (errors.cep) setErrors({ ...errors, cep: undefined });
                }}
                keyboardType="numeric"
                maxLength={9}
              />
              {isFetchingCep && <ActivityIndicator size="small" color="#00529B" className="absolute right-4 top-4" />}
            </View>
            {errors.cep && <Text className="text-red-500 text-xs mt-1 ml-1">{errors.cep}</Text>}
          </View>

          {/* Campo de Endereço */}
          <View className="mb-5">
            <Text className="text-xs text-netcom-blue font-semibold mb-1.5 ml-1 tracking-wide">ENDEREÇO</Text>
            <TextInput
              className={`w-full bg-gray-100 border-2 rounded-xl p-3 text-base h-14 text-gray-500 ${errors.street ? 'border-red-500' : 'border-netcom-input-border'}`}
              placeholder="Rua, Avenida, etc."
              placeholderTextColor="#A1A1AA"
              value={street}
              onChangeText={(text) => {
                setStreet(text);
                if (errors.street) setErrors({ ...errors, street: undefined });
              }}
              editable={!isFetchingCep} // Desabilita enquanto busca CEP
            />
            {errors.street && <Text className="text-red-500 text-xs mt-1 ml-1">{errors.street}</Text>}
          </View>

          <View className="flex-row gap-4">
            {/* Campo de Número */}
            <View className="mb-5 flex-1">
              <Text className="text-xs text-netcom-blue font-semibold mb-1.5 ml-1 tracking-wide">NÚMERO</Text>
              <TextInput
                className={`w-full bg-white border-2 rounded-xl p-3 text-base h-14 ${errors.number ? 'border-red-500' : 'border-netcom-input-border'}`}
                placeholder="Ex: 123"
                placeholderTextColor="#A1A1AA"
                value={number}
                onChangeText={(text) => {
                  setNumber(text);
                  if (errors.number) setErrors({ ...errors, number: undefined });
                }}
                keyboardType="numeric"
              />
              {errors.number && <Text className="text-red-500 text-xs mt-1 ml-1">{errors.number}</Text>}
            </View>

            {/* Campo de Complemento */}
            <View className="mb-5 flex-1">
              <Text className="text-xs text-netcom-blue font-semibold mb-1.5 ml-1 tracking-wide">COMPLEMENTO</Text>
              <TextInput
                className="w-full bg-white border-2 border-netcom-input-border rounded-xl p-3 text-base h-14"
                placeholder="Apto, Bloco (Opcional)"
                placeholderTextColor="#A1A1AA"
                value={complement}
                onChangeText={setComplement}
              />
            </View>
          </View>

          {/* Campo de Bairro */}
          <View className="mb-5">
            <Text className="text-xs text-netcom-blue font-semibold mb-1.5 ml-1 tracking-wide">BAIRRO</Text>
            <TextInput
              className={`w-full bg-gray-100 border-2 rounded-xl p-3 text-base h-14 text-gray-500 ${errors.neighborhood ? 'border-red-500' : 'border-netcom-input-border'}`}
              placeholder="Seu bairro"
              placeholderTextColor="#A1A1AA"
              value={neighborhood}
              onChangeText={(text) => {
                setNeighborhood(text);
                if (errors.neighborhood) setErrors({ ...errors, neighborhood: undefined });
              }}
              editable={!isFetchingCep}
            />
            {errors.neighborhood && <Text className="text-red-500 text-xs mt-1 ml-1">{errors.neighborhood}</Text>}
          </View>

          {/* Campo de Cidade */}
          <View className="mb-5">
            <Text className="text-xs text-netcom-blue font-semibold mb-1.5 ml-1 tracking-wide">CIDADE</Text>
            <TextInput
              className={`w-full bg-gray-100 border-2 rounded-xl p-3 text-base h-14 text-gray-500 ${errors.city ? 'border-red-500' : 'border-netcom-input-border'}`}
              placeholder="Sua cidade"
              placeholderTextColor="#A1A1AA"
              value={city}
              onChangeText={(text) => {
                setCity(text);
                if (errors.city) setErrors({ ...errors, city: undefined });
              }}
              editable={!isFetchingCep}
            />
            {errors.city && <Text className="text-red-500 text-xs mt-1 ml-1">{errors.city}</Text>}
          </View>

          {/* Campo de Estado */}
          <View className="mb-8">
            <Text className="text-xs text-netcom-blue font-semibold mb-1.5 ml-1 tracking-wide">ESTADO</Text>
            <TextInput
              className={`w-full bg-gray-100 border-2 rounded-xl p-3 text-base h-14 text-gray-500 ${errors.state ? 'border-red-500' : 'border-netcom-input-border'}`}
              placeholder="Seu estado"
              placeholderTextColor="#A1A1AA"
              value={state}
              onChangeText={(text) => {
                setState(text);
                if (errors.state) setErrors({ ...errors, state: undefined });
              }}
              editable={!isFetchingCep}
            />
            {errors.state && <Text className="text-red-500 text-xs mt-1 ml-1">{errors.state}</Text>}
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
          <Text className="text-white text-base font-bold">Finalizar</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}