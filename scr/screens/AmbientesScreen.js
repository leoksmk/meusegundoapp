import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { List, FAB, Portal, Modal, TextInput, Button, Title, useTheme, ActivityIndicator } from 'react-native-paper';
import { ambienteService, clienteService } from '../services/api';

const AmbientesScreen = () => {
  const theme = useTheme();
  const [ambientes, setAmbientes] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [newAmbiente, setNewAmbiente] = useState({
    nome: '',
    descricao: '',
    clienteId: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [ambientesRes, clientesRes] = await Promise.all([
        ambienteService.getAll(),
        clienteService.getAll(),
      ]);
      setAmbientes(ambientesRes.data);
      setClientes(clientesRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAmbiente = async () => {
    try {
      await ambienteService.create(newAmbiente);
      setVisible(false);
      setNewAmbiente({ nome: '', descricao: '', clienteId: '' });
      loadData();
    } catch (error) {
      console.error('Error creating ambiente:', error);
    }
  };

  const getClienteNome = (clienteId) => {
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente ? cliente.nome : 'Cliente não encontrado';
  };

  const renderItem = ({ item }) => (
    <List.Item
      title={item.nome}
      description={`${item.descricao}\nCliente: ${getClienteNome(item.clienteId)}`}
      left={props => <List.Icon {...props} icon="room" />}
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
        data={ambientes}
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
          <Title style={styles.modalTitle}>Novo Ambiente</Title>
          <TextInput
            label="Nome"
            value={newAmbiente.nome}
            onChangeText={text => setNewAmbiente({ ...newAmbiente, nome: text })}
            style={styles.input}
          />
          <TextInput
            label="Descrição"
            value={newAmbiente.descricao}
            onChangeText={text => setNewAmbiente({ ...newAmbiente, descricao: text })}
            multiline
            numberOfLines={3}
            style={styles.input}
          />
          <TextInput
            label="ID do Cliente"
            value={newAmbiente.clienteId}
            onChangeText={text => setNewAmbiente({ ...newAmbiente, clienteId: text })}
            keyboardType="numeric"
            style={styles.input}
          />
          <Button mode="contained" onPress={handleCreateAmbiente} style={styles.button}>
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

export default AmbientesScreen; 
