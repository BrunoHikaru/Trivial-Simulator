// EditProfile.js
import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';



const EditProfile = () => {
  const navigation = useNavigation();

  

  const handleSaveChanges = () => {
    navigation.goBack();
    
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Perfil</Text>

    
      <TextInput style={styles.input} placeholder="Novo Nome" />
      <TextInput style={styles.input} placeholder="Nova Descrição" multiline />

      
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
    backgroundColor: '#F2F2F2',
    
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: hp(5),
    textAlign: 'center',
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