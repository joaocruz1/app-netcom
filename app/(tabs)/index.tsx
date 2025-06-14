import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar, // Import para controlar a status bar
} from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { getLines, Line } from '~/api/APIBrazmovel';
import { LineItem } from '../../components/LineItem';
import { Ionicons } from '@expo/vector-icons'; // Usaremos Ionicons para um visual mais clean

const MinhasLinhasScreen = () => {
  const user = useAuthStore((state) => state.user);
  const [lines, setLines] = useState<Line[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // A lógica de busca de dados permanece a mesma
    const fetchLines = async () => {
      if (!user?.id) {
        setError('Usuário não identificado.');
        setLoading(false);
        return;
      }
      try {
        const userLines = await getLines({ id: user.id });
        setLines(userLines);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ocorreu um erro ao buscar as linhas.');
      } finally {
        setLoading(false);
      }
    };
    fetchLines();
  }, [user?.id]);

  // Componente de renderização para o cabeçalho da lista
  const ListHeader = () => (
    <>
      <View style={styles.header}>
        <Text style={styles.title}>Olá, {user?.name.split(' ')[0] || 'Cliente'}</Text>
        <Text style={styles.subtitle}>Escolha uma linha para continuar</Text>
      </View>
      {lines.length > 0 && (
         <Text style={styles.sectionTitle}>MINHAS LINHAS</Text>
      )}
    </>
  );

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#0A2F5B" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Ionicons name="cloud-offline-outline" size={60} color="#B0B8C4" />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
      
      <FlatList
        data={lines}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <LineItem item={item} />}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.listContentContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.centeredContainer}>
            <Ionicons name="apps-outline" size={60} color="#B0B8C4" />
            <Text style={styles.emptyText}>Você ainda não possui linhas ativas.</Text>
            <Text style={styles.emptySubtext}>Que tal ativar sua primeira linha agora?</Text>
          </View>
        }
      />

      <View style={styles.floatingButtonContainer}>
        <TouchableOpacity
          style={styles.floatingButton}
          activeOpacity={0.8}
          onPress={() => alert('Ativar nova linha')}
        >
          <Ionicons name="add-circle" size={24} color="#FFFFFF" />
          <Text style={styles.floatingButtonText}>ATIVAR NOVA LINHA</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F8F9FA', // Um branco levemente acinzentado, mais suave aos olhos
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1A202C', // Preto um pouco mais suave
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 18,
    color: '#718096', // Cinza para texto de apoio
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#A0AEC0', // Cinza mais claro para títulos de seção
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  listContentContainer: {
    paddingBottom: 120, // Espaço para o botão flutuante não sobrepor o último item
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  floatingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6600', // Cor primária forte para a ação principal
    paddingVertical: 18,
    borderRadius: 18, // Bordas arredondadas modernas
    // Sombra suave e profissional
    shadowColor: '#0A2F5B',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  floatingButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
    letterSpacing: 0.5,
  },
  // Estilos para telas de status (Loading, Error, Empty)
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#F8F9FA',
  },
  errorText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#4A5568',
    textAlign: 'center',
    marginTop: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2D3748',
    textAlign: 'center',
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
    marginTop: 8,
  },
});


export default MinhasLinhasScreen;