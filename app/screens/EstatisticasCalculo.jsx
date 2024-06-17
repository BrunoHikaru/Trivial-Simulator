import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image, Platform } from 'react-native';
import { getDatabase, ref, onValue, remove } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import RNPickerSelect from 'react-native-picker-select';
import { useNavigation } from '@react-navigation/native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const windowWidth = Dimensions.get('window').width;

const Statistics = ({route}) => {
  const [equipamentos, setEquipamentos] = useState([]);
  const [sortOrder, setSortOrder] = useState('recent'); // 'recent' or 'oldest'
  const navigation = useNavigation();
  const { ambienteSelecionado } = route.params;

  const handleDeleteEquipamento = (equipId) => {
    console.log('Deletar equipamento com ID:', equipId);
    const auth = getAuth();
    const user = auth.currentUser;
    const userId = user ? user.uid : null;

    if (userId) {
      // Remover equipamento da base de dados
      const equipamentoRef = ref(getDatabase(), `equipamentos/${userId}/${equipId}`);
      remove(equipamentoRef);

      // Atualizar o estado removendo o equipamento específico da lista
      setEquipamentos((prevEquipamentos) =>
        prevEquipamentos.filter((equipamento) => equipamento.equipId !== equipId)
      );
    }
  };

  useEffect(() => {
    const fetchEquipamentos = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      const userId = user ? user.uid : null;
  
      if (userId) {
        // Obter equipamentos
        const equipamentosRef = ref(getDatabase(), `equipamentos/${userId}`);
        onValue(equipamentosRef, (snapshot) => {
          const equipamentosData = snapshot.val();
  
          // Verificar se há dados de equipamentos
          if (equipamentosData) {
            const equipamentosArray = Object.entries(equipamentosData)
              .map(([equipId, equipamento]) => ({ equipId, ...equipamento }))
              .filter((equipamento) => equipamento.SelectedEnvironment === ambienteSelecionado); // Filtrar por ambiente selecionado
  
            // Adicionando um campo de dataSubmissao usando timestamp do Firebase
            const equipamentosComTimestamp = equipamentosArray.map((equipamento) => ({
              ...equipamento,
              dataSubmissao: equipamento.timestamp,
            }));
  
            // Ordenar equipamentos com base na escolha de ordenação
            const equipamentosOrdenados = sortEquipamentos(equipamentosComTimestamp, sortOrder);
  
            setEquipamentos(equipamentosOrdenados);
          } else {
            // Se não houver dados de equipamentos, definir a lista como vazia
            setEquipamentos([]);
          }
        });
      }
    };

    fetchEquipamentos();
  }, [ambienteSelecionado, sortOrder]);

  const sortEquipamentos = (equipamentos, order) => {
    // Ordenar equipamentos com base no timestamp
    const sortedEquipamentos = equipamentos.sort((a, b) => {
      if (order === 'recente') {
        return b.dataSubmissao - a.dataSubmissao;
      } else {
        return a.dataSubmissao - b.dataSubmissao;
      }
    });

    return sortedEquipamentos;
  };

  const handleGoBack = () => {
    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack}>
          <Image source={require('../../assets/go_back.png')} style={styles.buttonStyle} />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerText}>Dados de Equipamentos</Text>
        </View>
      </View>
     
      {/* Conteúdo da tela */}
      <View style={styles.content}>
        <Text style={styles.textSize}>Equipamentos Submetidos</Text>
        {/* Dropdown para escolher a ordem de classificação */}
        <View style={styles.dropdownContainer}>
          <Text>Ordenar por: </Text>
          <RNPickerSelect
            onValueChange={(value) => setSortOrder(value)}
            items={[
              { label: 'Mais recente', value: 'recente' },
              { label: 'Mais antigo', value: 'antigo' },
            ]}
            placeholder={{ label: 'selecione', value: null }}
            style={{ inputAndroid: { color: 'black' } }}
          />
        </View>
        <ScrollView showsHorizontalScrollIndicator={false} >
          {/* Lista de Equipamentos como Cards em ScrollView */}
          <ScrollView horizontal contentContainerStyle={styles.scrollViewContainer} showsHorizontalScrollIndicator={false}>
            {equipamentos.map((item, index) => (
              <View key={index} style={styles.cardContainer}>
                <View style={styles.equipamentoItem}>
                  <Text>Equipamento: {item.Equip}</Text>
                  <Text>Marca: {item.Marca}</Text>
                  <Text>Horas Diárias: {item.HorasDeUsoDiaria} horas</Text>
                  <Text>Potência: {item.Potencia}</Text>
                  <Text>Quantidade: {item.Quantidade}</Text>
                  <Text>Ambiente: {item.SelectedEnvironment}</Text>
                  <Text>Consumo Mensal: {item.ConsumoMensal}</Text>
                  {/* Certifique-se de passar o ID corretamente para a função */}
                  <TouchableOpacity onPress={() => handleDeleteEquipamento(item.equipId)} style={styles.deleteButton}>
                    <Text style={styles.deleteButtonText}>Remover</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  header: {
    backgroundColor: '#336F95',
    paddingVertical: hp(3),
    paddingHorizontal: wp(3),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: wp(5),
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    width: wp(100),
    height: hp(15),
    marginTop: Platform.OS === 'ios' ? hp(0) : 0,
    zIndex: 1,
  },
  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: RFPercentage(3),
    fontWeight: 'bold',
    marginVertical: hp(2),
  },
  dropdownContainer: {
    marginVertical: RFValue(10),
    paddingHorizontal: RFValue(20),
    flexDirection: 'row',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: RFValue(20),
  },
  equipamentoItem: {
    marginBottom: RFValue(10),
    borderWidth: RFValue(2),
    borderColor: '#336F95',
    padding: RFValue(13),
    borderRadius: RFValue(10),
  },
  cardContainer: {
    maxWidth: windowWidth - RFValue(50), // Ajuste a largura conforme necessário
    marginHorizontal: RFValue(15),
  },
  textSize: {
    fontSize: RFPercentage(2),
    fontWeight: 'bold',
    marginBottom: RFValue(10),
  },
  deleteButton: {
    color: 'white',
    marginTop: RFValue(5),
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
    borderWidth: RFValue(1),
    borderRadius: RFValue(7),
    padding: RFValue(3),
    marginTop: RFValue(15),
    backgroundColor: 'red',
    borderColor: 'black',
  },
  deleteButtonText: {
    fontWeight: 'bold',
    color: 'white',
  },
});

export default Statistics;
