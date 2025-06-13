import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { getLines,Line } from '~/api/APIBrazmovel';
import { LineItem } from '../../components/LineItem'; // Importe o componente LineItem

const MinhasLinhasScreen = () => {
  const user = useAuthStore((state) => state.user);
  const [lines, setLines] = useState<Line[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLines = async () => {
      if (!user?.id) {
        setError('Usuário não identificado');
        setLoading(false);
        return;
      }

      try {
        const userLines = await getLines({ id: user.id });
        setLines(userLines);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    fetchLines();
  }, [user?.id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6600" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>
          Olá, {user?.name.split(' ')[0] || 'Cliente'} 👋
        </Text>
        <Text style={styles.title}>
          Selecione a linha que deseja visualizar
        </Text>

        <FlatList
          data={lines}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <LineItem item={item} />}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhuma linha encontrada</Text>
            </View>
          }
        />
      </View>

      <View style={styles.floatingButtonContainer}>
        <TouchableOpacity
          style={[styles.buttonShadow, styles.floatingButton]}
          onPress={() => alert('Ativar nova linha')}
        >
          <Text style={styles.floatingButtonText}>ATIVAR NOVA LINHA</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  contentContainer: {
    flex: 1,
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3748',
    marginTop: 24,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 24,
    width: '100%',
    alignItems: 'center',
  },
  floatingButton: {
    backgroundColor: '#FF6600',
    width: '90%',
    paddingVertical: 16,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: '#6B7280',
    fontSize: 16,
  },
});

export default MinhasLinhasScreen;