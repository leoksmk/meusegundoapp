import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, useTheme, ActivityIndicator } from 'react-native-paper';
import { clienteService, ambienteService, dispositivoService } from '../services/api';

const HomeScreen = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    clientes: 0,
    ambientes: 0,
    dispositivos: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [clientesRes, ambientesRes, dispositivosRes] = await Promise.all([
        clienteService.getAll(),
        ambienteService.getAll(),
        dispositivoService.getAll(),
      ]);

      setStats({
        clientes: clientesRes.data.length,
        ambientes: ambientesRes.data.length,
        dispositivos: dispositivosRes.data.length,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.title}>Dashboard</Title>
      </View>

      <View style={styles.cardsContainer}>
        <Card style={styles.card}>
          <Card.Content>
            <Title>Clientes</Title>
            <Paragraph style={styles.number}>{stats.clientes}</Paragraph>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title>Ambientes</Title>
            <Paragraph style={styles.number}>{stats.ambientes}</Paragraph>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title>Dispositivos</Title>
            <Paragraph style={styles.number}>{stats.dispositivos}</Paragraph>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  cardsContainer: {
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    marginBottom: 16,
  },
  number: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6200ee',
  },
});

export default HomeScreen; 
