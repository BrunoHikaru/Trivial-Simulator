// EditProfile.js
import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';



const EditProfile = () => {
  const navigation = useNavigation();

  // Lógica para salvar as alterações no perfil

  const handleSaveChanges = () => {
    // Adicione a lógica para salvar as alterações no perfil aqui

    // Navegar de volta para a tela de perfil após salvar as alterações
    navigation.goBack();
    
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Perfil</Text>

      {/* Campos de edição do perfil (exemplo) */}
      <TextInput style={styles.input} placeholder="Novo Nome" />
      <TextInput style={styles.input} placeholder="Nova Descrição" multiline />

      {/* Botão para salvar alterações */}
      <TouchableOpacity onPress={handleSaveChanges} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Salvar Alterações</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: '#00a500',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default EditProfile;