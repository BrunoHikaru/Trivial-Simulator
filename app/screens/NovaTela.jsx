import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Platform, TouchableOpacity, Image, ScrollView, TouchableWithoutFeedback, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getDatabase, ref, get } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Ionicons, MaterialCommunityIcons, AntDesign, MaterialIcons } from '@expo/vector-icons';
import { PieChart } from 'react-native-chart-kit';
import { useNavigation } from '@react-navigation/native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Button } from 'react-native-elements';
import { Entypo } from '@expo/vector-icons';

const NovaTela = ({ route }) => {
  const { cardId, cardName } = route.params;
  const [cardDetails, setCardDetails] = useState(null);
  const [equipamentos, setEquipamentos] = useState([]);
  const [reloadCount, setReloadCount] = useState(0); 
  const navigation = useNavigation();
  const [infoModalVisible, setInfoModalVisible] = useState(false);

  const handleGoBack = () => {
    navigation.goBack();
  };

  
  useEffect(() => {
    const carregarUltimosEquipamentos = async (userId) => {
      const db = getDatabase();
      const equipamentosRef = ref(db, `equipamentos/${userId}`);

      try {
        const snapshot = await get(equipamentosRef);
        if (snapshot.exists()) {
          const equipamentosArray = [];
          snapshot.forEach((childSnapshot) => {
            const equipamento = childSnapshot.val();
            if (equipamento.SelectedEnvironment === cardName) {
              equipamentosArray.push(equipamento);
            }
          });
          setEquipamentos(equipamentosArray.reverse());
        } else {
          setEquipamentos([]);
        }
      } catch (error) {
        console.error('Erro ao carregar os equipamentos:', error);
      }
    };

    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      carregarUltimosEquipamentos(user.uid);
    } else {
      setEquipamentos([]);
    }
  }, [cardName, reloadCount]); 

  
  const verificarConsumoMensal = (equipamentos) => {
    const limiteConsumo = {
      'notebook': 20,
      'telemóvel': 2,
      'tablet': 3,
      'tv': 30,
      'televisão':30,
      'liquidificador': 7,
      'impressora': 5,
      'monitor': 15,
      'caixa de som': 10,
      'cafeteira': 12,
      'microondas': 15,
    };

    equipamentos.forEach(equipamento => {
      const equipName = equipamento.Equip.toLowerCase();
      const consumoMensal = equipamento.ConsumoMensal;

      for (const tipoEquipamento in limiteConsumo) {
        if (equipName.includes(tipoEquipamento) && consumoMensal > limiteConsumo[tipoEquipamento]) {
          Alert.alert(
            'Alerta de Consumo',
            `O consumo mensal do equipamento "${equipamento.Equip}" é maior que ${limiteConsumo[tipoEquipamento]} kWh. Considere substituir por um modelo mais eficiente.`,
            [{ text: 'OK', onPress: () => console.log('Alerta fechado') }]
          );
          break;
        }
      }
    });
  };

  useEffect(() => {
    verificarConsumoMensal(equipamentos);
  }, [equipamentos]);

  
  const handleNavigation = () => {
    navigation.navigate("EstatisticasCalculo", { ambienteSelecionado: cardName });
  };

 
  const calcularConsumoTotal = (equipamentos) => {
    return equipamentos.reduce((total, equipamento) => total + equipamento.ConsumoMensal, 0);
  };


  const renderIcon = (equipName, ConsumoMensal) => {
    const limiteConsumo = {
      'notebook': 20,
      'telemóvel': 2,
      'tablet': 3,
      'tv': 30,
      'televisão':30,
      'liquidificador': 7,
      'impressora': 5,
      'monitor': 15,
      'caixa de som': 10,
      'cafeteira': 12,
      'microondas': 15,
    };

    let color = 'green';
    for (const tipoEquipamento in limiteConsumo) {
      if (equipName.toLowerCase().includes(tipoEquipamento) && ConsumoMensal > limiteConsumo[tipoEquipamento]) {
        color = 'red';
        break;
      }
    }

    if (equipName.toLowerCase().includes('notebook') || equipName.toLowerCase().includes('laptop') || equipName.toLowerCase().includes('computador portátil') || equipName.toLowerCase().includes('portátil')) {
      return <Entypo name="laptop" size={RFPercentage(3)} color={color} />;
    } else if (equipName.toLowerCase().includes('telemóvel') || equipName.toLowerCase().includes('telefone')) {
      return <MaterialCommunityIcons name="cellphone" size={RFPercentage(3)} color={color} />;
    } else if (equipName.toLowerCase().includes('tablet') || equipName.toLowerCase().includes('ipad')) {
      return <Ionicons name="ios-tablet-portrait" size={RFPercentage(3)} color={color} />;
    } else if (equipName.toLowerCase().includes('tv') || equipName.toLowerCase().includes('televisão')) {
      return <Ionicons name="tv-sharp" size={RFPercentage(3)} color={color} />;
    } else if (equipName.toLowerCase().includes('liquidificador')) {
      return <MaterialCommunityIcons name="blender" size={RFPercentage(3)} color={color} />;
    } else if (equipName.toLowerCase().includes('impressora')) {
      return <AntDesign name="printer" size={RFPercentage(3)} color={color} />;
    } else if (equipName.toLowerCase().includes('monitor') || equipName.toLowerCase().includes('tela')) {
      return <AntDesign name="iconfontdesktop" size={RFPercentage(3)} color={color} />;
    } else if (equipName.toLowerCase().includes('caixa de som') || equipName.toLowerCase().includes('som')) {
      return <MaterialIcons name="speaker" size={RFPercentage(3)} color={color} />;
    } else if (equipName.toLowerCase().includes('cafeteira')) {
      return <MaterialCommunityIcons name='coffee-maker-outline' size={RFPercentage(3)} color={color} />;
    } else if (equipName.toLowerCase().includes('microondas')) {
      return <MaterialIcons name='microwave' size={RFPercentage(3)} color={color} />;
    }
  };


  const equipColors = {
    'notebook': 'red',
    'telemovel': 'green',
    'tablet': 'blue',
    'tv': 'orange',
    'liquidificador': 'purple',
    'impressora': 'brown',
    'monitor': 'cyan',
    'caixa de som': 'magenta',
    'cafeteira': 'lightgreen',
    'microondas': 'lightblue',
  };

  const handlePesquisa = () => {
    navigation.navigate("EquipamentoScreen");
  };

  const toggleInfoModal = () => {
    setInfoModalVisible(!infoModalVisible);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack}>
          <Image source={require('../../assets/go_back.png')} style={styles.buttonStyle} />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerText}>{cardName ? cardName : ''}</Text>
        </View>
        <TouchableOpacity onPress={toggleInfoModal}>
          <Ionicons name="information-circle-outline" size={wp(8)} color="white" />
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollStyle}>
        <>
          <View style={{ height: hp(20), flexDirection: 'row', marginTop: hp(5) }}>
            <PieChart
              data={equipamentos.map(item => ({
                name: item.Equip,
                population: item.ConsumoMensal,
                color: equipColors[item.Equip.toLowerCase()] || 'gray',
              }))}
              width={wp(90)}
              height={hp(30)}
              chartConfig={{
                backgroundColor: '#FFFFFF',
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </View>
          <View style={styles.equipamentosContainer}>
            <Text style={styles.equipamentosTitulo}>Equipamentos:</Text>
            <FlatList
              data={equipamentos}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.equipamentoItem}>
                  <Text>{renderIcon(item.Equip, item.ConsumoMensal)}</Text>
                  <Text style={{ marginLeft: wp(2) }}>{` ${item.Equip}`}</Text>
                </View>
              )}
            />
          </View>
          <TouchableOpacity style={styles.novosEquipButton} onPress={handleNavigation}>
            <Text style={{borderRadius:2,textAlign:'center', marginTop:hp(0.6)}}>Dados dos Equipamentos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.novosEquipButton} onPress={handlePesquisa}>
            <Text style={{borderRadius:2,textAlign:'center', marginTop:hp(0.6)}}>Pesquisar Novos Equipamentos</Text>
          </TouchableOpacity>
        </>
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={infoModalVisible}
        onRequestClose={toggleInfoModal}
      >
        <TouchableWithoutFeedback onPress={toggleInfoModal}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={{ fontSize: 20, fontWeight: 'bold'}}>INFORMAÇÃO{'\n'}</Text>
              <Text style={styles.modalText}>Para ter a certeza de que o equipamento está consumindo muito, utilize os simuladores, inserindo dados precisos.</Text>
              <Text style={styles.modalText}>Aqui você poderá visualizar os dados que submeteu, assim como pesquisar por novos equipamentos.</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#336F95',
    padding: hp(3),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp(5),
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    width: wp(100),
    height: hp(15),
    marginTop: Platform.OS === 'ios' ? hp(-7) : 0,
    zIndex: 1,
    flexDirection: 'row',
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
  equipamentosContainer: {
    marginTop: hp(15),
  },
  equipamentosTitulo: {
    fontSize: RFPercentage(2.5),
    fontWeight: 'bold',
    marginBottom: hp(1),
    marginLeft: wp(5),
  },
  equipamentoItem: {
    marginBottom: hp(1),
    borderWidth: 1,
    borderColor: '#336F95',
    padding: wp(2),
    borderRadius: 5,
    flexDirection: 'row',
    marginHorizontal:hp(2)
  },
  buttonStyle: {
    justifyContent: 'flex-start',
    height: hp(3),
    marginHorizontal: wp(-3),
  },
  statisticsButton: {
    backgroundColor: '#4CAF50',
    borderRadius: hp(2),
    borderWidth: 1,
    marginTop: hp(5),
    textAlign: 'center',
    marginHorizontal: wp(3),
    fontSize: RFPercentage(2.5),
  },
  graficoChart: {
    flex: 1,
    height: Platform.OS === 'android' ? hp(30) : hp(20) + Platform.OS === 'ios' ? hp(25) : hp(25),
  },
  scrollStyle: {
    paddingBottom: hp(Platform.OS === 'android' ? 20 : 0 + Platform.OS === 'ios' ? 20 : 20)
  },
  sugestao:{
    fontSize: RFPercentage(1.5),
    fontWeight: 'bold',
    marginTop: hp(1.5),
    marginHorizontal: wp(3.7),
    textAlign:'auto'
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: wp(5),
    marginHorizontal:wp(10),
    backgroundColor: 'white',
    borderRadius: wp(5),
    padding: wp(3),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: hp(2),
    textAlign: 'justify',
    fontSize: wp(4),
  },
  novosEquipButton:{
    borderRadius:10, 
    borderWidth:1, 
    marginVertical:hp(3),
    height:Platform.OS==='android'?hp(5):hp(5)+Platform.OS==='ios'?hp(4):hp(4),
    width:wp(65), 
    backgroundColor:'lightblue',
    marginHorizontal:Platform.OS==='android'?hp(9.5):hp(9.5)+Platform.OS==='ios'?hp(8):hp(8)
  },
});

export default NovaTela;
