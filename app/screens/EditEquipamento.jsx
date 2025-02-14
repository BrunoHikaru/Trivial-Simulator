import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, Alert, Keyboard, ScrollView } from 'react-native';
import { getDatabase, ref, update } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { TouchableWithoutFeedback } from 'react-native';
import { KeyboardAvoidingView } from 'react-native';

const calcularConsumo = (quantidade, potencia, horasDeUsoDiaria, numDiasUsadosMes) => {
  const potenciaEmKW = potencia / 1000;
  const consumoMensal = (potenciaEmKW * horasDeUsoDiaria * numDiasUsadosMes) * quantidade;
  return consumoMensal.toFixed(2);
};

const EditEquipamento = ({ route }) => {
  const { equipamento } = route.params;
  const [equipamentoData, setEquipamentoData] = useState({
    ...equipamento,
    NumDiasUsadosMes: equipamento.NumDiasUsadosMes || '',
    ConsumoMensal: equipamento.ConsumoMensal || '',
  });
  const navigation = useNavigation();

  useEffect(() => {
    const { Quantidade, Potencia, HorasDeUsoDiaria, NumDiasUsadosMes } = equipamentoData;
    if (Quantidade && Potencia && HorasDeUsoDiaria && NumDiasUsadosMes) {
      const consumoMensal = calcularConsumo(
        parseFloat(Quantidade),
        parseFloat(Potencia),
        parseFloat(HorasDeUsoDiaria),
        parseFloat(NumDiasUsadosMes)
      );
      setEquipamentoData(prevData => ({
        ...prevData,
        ConsumoMensal: consumoMensal
      }));
    }
  }, [equipamentoData.Quantidade, equipamentoData.Potencia, equipamentoData.HorasDeUsoDiaria, equipamentoData.NumDiasUsadosMes]);

  const handleInputChange = (field, value) => {
    setEquipamentoData({
      ...equipamentoData,
      [field]: value,
    });
  };

  const handleSaveChanges = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    const userId = user ? user.uid : null;

    if (userId) {
      
      const equipamentoRef = ref(getDatabase(), `equipamentos/${userId}/${equipamento.equipId}`);
      update(equipamentoRef, equipamentoData)
        .then(() => {
          Alert.alert('Sucesso', 'Equipamento atualizado com sucesso');
          navigation.goBack();
        })
        .catch((error) => {
          Alert.alert('Erro', `Falha ao atualizar o equipamento: ${error.message}`);
        });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}> 
    <View style={styles.container}>
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom:hp(10)}}>
      
      <Text style={styles.headerText}>Editar Equipamento</Text>

      <Text style={{fontSize:RFPercentage(2), marginLeft:wp(2), marginVertical:hp(1),fontWeight:'500'}}>Equipamento:</Text>
      <TextInput
        style={styles.input}
        placeholder="Equipamento"
        value={equipamentoData.Equip}
        onChangeText={(text) => handleInputChange('Equip', text)}
      />

      <Text style={{fontSize:RFPercentage(2), marginLeft:wp(2), marginVertical:hp(1),fontWeight:'500'}}>Marca:</Text>
      <TextInput
        style={styles.input}
        placeholder="Marca"
        value={equipamentoData.Marca}
        onChangeText={(text) => handleInputChange('Marca', text)}
      />

      <Text style={{fontSize:RFPercentage(2), marginLeft:wp(2), marginVertical:hp(1),fontWeight:'500'}}>Horas diárias:</Text>
      <TextInput
        style={styles.input}
        placeholder="Horas Diárias"
        value={equipamentoData.HorasDeUsoDiaria}
        onChangeText={(text) => handleInputChange('HorasDeUsoDiaria', text)}
        keyboardType="numeric"
      />

      <Text style={{fontSize:RFPercentage(2), marginLeft:wp(2), marginVertical:hp(1),fontWeight:'500'}}>Potência:</Text>
      <TextInput
        style={styles.input}
        placeholder="Potência"
        value={equipamentoData.Potencia}
        onChangeText={(text) => handleInputChange('Potencia', text)}
        keyboardType="numeric"
      />

      <Text style={{fontSize:RFPercentage(2), marginLeft:wp(2), marginVertical:hp(1),fontWeight:'500'}}>Quantidade:</Text>
      <TextInput
        style={styles.input}
        placeholder="Quantidade"
        value={equipamentoData.Quantidade}
        onChangeText={(text) => handleInputChange('Quantidade', text)}
        keyboardType="numeric"
      />

      <Text style={{fontSize:RFPercentage(2), marginLeft:wp(2), marginVertical:hp(1),fontWeight:'500'}}>N.º de dias utilizado no mês:</Text>
      <TextInput
        style={styles.input}
        placeholder="Número de Dias Usados por Mês"
        value={equipamentoData.NumDiasUsadosMes}
        onChangeText={(text) => handleInputChange('NumDiasUsadosMes', text)}
        keyboardType="numeric"
      />

      <Text style={{fontSize:RFPercentage(2), marginLeft:wp(2), marginVertical:hp(1),fontWeight:'500'}}>Consumo Mensal:</Text>
      <TextInput
        style={[styles.input, { backgroundColor: '#E0E0E0' }]} 
        placeholder="Consumo Mensal"
        value={equipamentoData.ConsumoMensal}
        editable={false} 
      />
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
        <Text style={styles.saveButtonText}>Salvar</Text>
      </TouchableOpacity>
    </ScrollView>
    </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: RFValue(20),
    backgroundColor: '#F2F2F2',
    marginVertical: hp(5)
  },
  headerText: {
    fontSize: RFPercentage(3),
    fontWeight: 'bold',
    marginBottom: hp(7),
    textAlign: 'center',
  },
  input: {
    height: RFValue(50),
    borderColor: '#336F95',
    borderWidth: RFValue(2),
    borderRadius: RFValue(10),
    marginBottom: RFValue(10),
    paddingHorizontal: RFValue(10),
  },
  saveButton: {
    backgroundColor: '#336F95',
    padding: RFValue(15),
    borderRadius: RFValue(10),
    alignItems: 'center',
    marginTop: RFValue(20),
  },
  saveButtonText: {
    color: 'white',
    fontSize: RFPercentage(2.5),
    fontWeight: 'bold',
  },
});

export default EditEquipamento;
