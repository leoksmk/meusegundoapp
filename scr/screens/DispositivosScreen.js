import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { List, FAB, Portal, Modal, TextInput, Button, Title, useTheme, ActivityIndicator, Switch } from 'react-native-paper';
import { dispositivoService, ambienteService } from '../services/api';

const DispositivosScreen = () => {
  const theme = useTheme();
  const [dispositivos, setDispositivos] = useState([]);
  const [ambientes, setAmbientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [newDispositivo, setNewDispositivo] = useState({
    nome: '',
    tipo: '',
    status: 'ATIVO',
    ambienteId: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [dispositivosRes, ambientesRes] = await Promise.all([
        dispositivoService.getAll(),
        ambienteService.getAll(),
      ]);
      setDispositivos(dispositivosRes.data);
      setAmbientes(ambientesRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDispositivo = async () => {
    try {
      await dispositivoService.create(newDispositivo);
      setVisible(false);
      setNewDispositivo({ nome: '', tipo: '', status: 'ATIVO', ambienteId: '' });
      loadData();
    } catch (error) {
      console.error('Error creating dispositivo:', error);
    }
  };

  const handleToggleStatus = async (dispositivo) => {
    try {
      const newStatus = dispositivo.status === 'ATIVO' ? 'INATIVO' : 'ATIVO';
      await dispositivoService.update(dispositivo.id, { ...dispositivo, status: newStatus });
      loadData();
    } catch (error) {
      console.error('Error updating dispositivo status:', error);
    }
  };

  const getAmbienteNome = (ambienteId) => {
    const ambiente = ambientes.find(a => a.id === ambienteId);
    return ambiente ? ambiente.nome : 'Ambiente não encontrado';
  };

  const renderItem = ({ item }) => (
    <List.Item
      title={item.nome}
      description={`${item.tipo}\nAmbiente: ${getAmbienteNome(item.ambienteId)}`}
      left={props => <List.Icon {...props} icon="devices" />}
      right={() => (
        <Switch
          value={item.status === 'ATIVO'}
          onValueChange={() => handleToggleStatus(item)}
        />
      )}
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
        data={dispositivos}
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
          <Title style={styles.modalTitle}>Novo Dispositivo</Title>
          <TextInput
            label="Nome"
            value={newDispositivo.nome}
            onChangeText={text => setNewDispositivo({ ...newDispositivo, nome: text })}
            style={styles.input}
          />
          <TextInput
            label="Tipo"
            value={newDispositivo.tipo}
            onChangeText={text => setNewDispositivo({ ...newDispositivo, tipo: text })}
            style={styles.input}
          />
          <TextInput
            label="ID do Ambiente"
            value={newDispositivo.ambienteId}
            onChangeText={text => setNewDispositivo({ ...newDispositivo, ambienteId: text })}
            keyboardType="numeric"
            style={styles.input}
          />
          <Button mode="contained" onPress={handleCreateDispositivo} style={styles.button}>
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

export default DispositivosScreen; 