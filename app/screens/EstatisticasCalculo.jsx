import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image, Platform, Modal } from 'react-native';
import { getDatabase, ref, onValue, remove } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import RNPickerSelect from 'react-native-picker-select';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Ionicons, MaterialCommunityIcons, AntDesign, MaterialIcons } from '@expo/vector-icons';


const windowWidth = Dimensions.get('window').width;

const Statistics = ({ route }) => {
  const [equipamentos, setEquipamentos] = useState([]);
  const [sortOrder, setSortOrder] = useState('recent'); 
  const navigation = useNavigation();
  const { ambienteSelecionado } = route.params;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedEquipamento, setSelectedEquipamento] = useState(null);

  const handleDeleteEquipamento = (equipId) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy); 
    console.log('Deletar equipamento com ID:', equipId);
    const auth = getAuth();
    const user = auth.currentUser;
    const userId = user ? user.uid : null;

    if (userId) {
      
      const equipamentoRef = ref(getDatabase(), `equipamentos/${userId}/${equipId}`);
      remove(equipamentoRef);

      
      setEquipamentos((prevEquipamentos) =>
        prevEquipamentos.filter((equipamento) => equipamento.equipId !== equipId)
      );
    }
    setIsModalVisible(false); 
  };

  const handleEditEquipamento = (equipamento) => {
    
    navigation.navigate('EditEquipamento', { equipamento });
    setIsModalVisible(false); 
  };

  useEffect(() => {
    const fetchEquipamentos = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      const userId = user ? user.uid : null;

      if (userId) {
        
        const equipamentosRef = ref(getDatabase(), `equipamentos/${userId}`);
        onValue(equipamentosRef, (snapshot) => {
          const equipamentosData = snapshot.val();

         
          if (equipamentosData) {
            const equipamentosArray = Object.entries(equipamentosData)
              .map(([equipId, equipamento]) => ({ equipId, ...equipamento }))
              .filter((equipamento) => equipamento.SelectedEnvironment === ambienteSelecionado); 

            
            const equipamentosComTimestamp = equipamentosArray.map((equipamento) => ({
              ...equipamento,
              dataSubmissao: equipamento.timestamp,
            }));

            
            const equipamentosOrdenados = sortEquipamentos(equipamentosComTimestamp, sortOrder);

            setEquipamentos(equipamentosOrdenados);
          } else {
            
            setEquipamentos([]);
          }
        });
      }
    };

    fetchEquipamentos();
  }, [ambienteSelecionado, sortOrder]);

  const sortEquipamentos = (equipamentos, order) => {
    
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

  const toggleEditModal = (equipamento) => {
    setSelectedEquipamento(equipamento);
    setIsModalVisible(!isModalVisible);
  }

  return (
    <View style={styles.container}>
      
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack}>
          <Image source={require('../../assets/go_back.png')} style={styles.buttonStyle} />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerText}>Dados de Equipamentos</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.textSize}>Equipamentos Submetidos</Text>
        
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
         
          <ScrollView horizontal contentContainerStyle={styles.scrollViewContainer} showsHorizontalScrollIndicator={false}>
            {equipamentos.map((item, index) => (
              <View key={index} style={styles.cardContainer}>
                <TouchableOpacity
                  onPress={() => console.log('Card pressed', item.equipId)}
                  onLongPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy); 
                    toggleEditModal(item); 
                  }}
                  style={styles.equipamentoItem}
                >
                  <Text>Equipamento: {item.Equip}</Text>
                  <Text>Marca: {item.Marca}</Text>
                  <Text>Horas Diárias: {item.HorasDeUsoDiaria}</Text>
                  <Text>Potência: {item.Potencia}</Text>
                  <Text>Quantidade: {item.Quantidade}</Text>
                  <Text>Dias utilizados no Mês: {item.NumDiasUsadosMes}</Text>
                  <Text>Ambiente: {item.SelectedEnvironment}</Text>
                  <Text>Consumo Mensal: {item.ConsumoMensal}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </ScrollView>
        <View style={{flexDirection:'row'}}>
          <Ionicons name="information-circle-outline" size={wp(8)} color="black" style={{marginTop:Platform.OS==='ios'?hp(-25):hp(-25)+Platform.OS==='android'?hp(-20):hp(-20)}}/>
          <Text style={{marginTop:Platform.OS==='ios'?hp(-25):hp(-25)+Platform.OS==='android'?hp(-20):hp(-20), marginHorizontal:hp(2),textAlign:'left',fontSize:Platform.OS==='ios'?RFPercentage(1.5):RFPercentage(1.5)+Platform.OS==='android'?RFPercentage(2):RFPercentage(2)}}>
            Para editar ou deletar um equipamento, pressione e segure por 3 segundos o cartão.
          </Text>
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Escolha uma ação</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => handleEditEquipamento(selectedEquipamento)}
            >
              <Text style={styles.modalButtonText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalButtonDelete]}
              onPress={() => handleDeleteEquipamento(selectedEquipamento.equipId)}
            >
              <Text style={styles.modalButtonText}>Excluir</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    maxWidth: windowWidth - RFValue(50), 
    marginHorizontal: RFValue(15),
  },
  textSize: {
    fontSize: RFPercentage(2),
    fontWeight: 'bold',
    marginBottom: RFValue(10),
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: wp(80),
    padding: RFValue(20),
    backgroundColor: 'white',
    borderRadius: RFValue(10),
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: RFPercentage(2.5),
    fontWeight: 'bold',
    marginBottom: RFValue(20),
  },
  modalButton: {
    width: '100%',
    padding: RFValue(10),
    alignItems: 'center',
    marginVertical: RFValue(5),
    borderRadius: RFValue(5),
    backgroundColor: '#336F95',
  },
  modalButtonDelete: {
    backgroundColor: 'red',
  },
  modalButtonText: {
    color: 'white',
    fontSize: RFPercentage(2),
  },
});

export default Statistics;
