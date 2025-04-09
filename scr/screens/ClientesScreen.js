import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { List, FAB, Portal, Modal, TextInput, Button, Title, useTheme, ActivityIndicator } from 'react-native-paper';
import { clienteService } from '../services/api';

const ClientesScreen = () => {
  const theme = useTheme();
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [newCliente, setNewCliente] = useState({
    nome: '',
    email: '',
    telefone: '',
  });

  useEffect(() => {
    loadClientes();
  }, []);

  const loadClientes = async () => {
    try {
      const response = await clienteService.getAll();
      setClientes(response.data);
    } catch (error) {
      console.error('Error loading clientes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCliente = async () => {
    try {
      await clienteService.create(newCliente);
      setVisible(false);
      setNewCliente({ nome: '', email: '', telefone: '' });
      loadClientes();
    } catch (error) {
      console.error('Error creating cliente:', error);
    }
  };

  const renderItem = ({ item }) => (
    <List.Item
      title={item.nome}
      description={`${item.email}\n${item.telefone}`}
      left={props => <List.Icon {...props} icon="account" />}
    />
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={clientes}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
      />

      <Portal>
        <Modal
          visible={visible}
          onDismiss={() => setVisible(false)}
          contentContainerStyle={styles.modal}
        >
          <Title style={styles.modalTitle}>Novo Cliente</Title>
          <TextInput
            label="Nome"
            value={newCliente.nome}
            onChangeText={text => setNewCliente({ ...newCliente, nome: text })}
            style={styles.input}
          />
          <TextInput
            label="Email"
            value={newCliente.email}
            onChangeText={text => setNewCliente({ ...newCliente, email: text })}
            keyboardType="email-address"
            style={styles.input}
          />
          <TextInput
            label="Telefone"
            value={newCliente.telefone}
            onChangeText={text => setNewCliente({ ...newCliente, telefone: text })}
            keyboardType="phone-pad"
            style={styles.input}
          />
          <Button mode="contained" onPress={handleCreateCliente} style={styles.button}>
            Criar
          </Button>
        </Modal>
      </Portal>

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => setVisible(true)}
      />
    </View>
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
  list: {
    padding: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
});

export default ClientesScreen;