import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Platform, TouchableOpacity, Image, ScrollView, TouchableWithoutFeedback, Alert } from 'react-native';
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
  const [reloadCount, setReloadCount] = useState(0); // Estado para forçar o reload
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };

  // Função para carregar os últimos equipamentos com base no ambiente selecionado
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
  }, [cardName, reloadCount]); // Adicionando reloadCount para forçar a atualização quando necessário

  // Função para verificar se o consumo mensal passou de 15 kWh e exibir um alerta se necessário
  const verificarConsumoMensal = (equipamentos) => {
    const consumoTotal = equipamentos.reduce((total, equipamento) => total + equipamento.ConsumoMensal, 0);
    
    if (consumoTotal > 20) {
      Alert.alert(
        'Alerta de Consumo',
        'O consumo mensal de alguns equipamentos é maior que 20 kWh (Se encontram em vermelho). ' +
        'Considere substituir alguns equipamentos por modelos mais eficientes. Você pode verificar equipamentos alternativos clicando no botão, que se encontra no final da página.',
        [{ text: 'OK', onPress: () => console.log('Alerta fechado') }]
      );
    }
  };

  // Logo após a declaração do useState de 'equipamentos', chame a função verificarConsumoMensal
  useEffect(() => {
    verificarConsumoMensal(equipamentos);
  }, [equipamentos]);

  // Função para navegar para a tela de estatísticas
  const handleNavigation = () => {
    navigation.navigate("EstatisticasCalculo", { ambienteSelecionado: cardName });
  };

  // Função para calcular o consumo total mensal dos equipamentos
  const calcularConsumoTotal = (equipamentos) => {
    return equipamentos.reduce((total, equipamento) => total + equipamento.ConsumoMensal, 0);
  };

  // Função para renderizar o ícone com base no nome do equipamento
  const renderIcon = (equipName, ConsumoMensal) => {
    const color = ConsumoMensal > 50 ? 'red' : 'green';
    
    if (equipName.toLowerCase().includes('notebook') || equipName.toLowerCase().includes('laptop')) {
      return <Entypo name="laptop" size={RFPercentage(3)} color={color} />;
    } else if (equipName.toLowerCase().includes('telemóvel') || equipName.toLowerCase().includes('telemovel')) {
      return <MaterialCommunityIcons name="cellphone" size={RFPercentage(3)} color={color} />;
    } else if (equipName.toLowerCase().includes('tablet')) {
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

  // Objeto que mapeia os tipos de equipamento para as cores
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

  // useEffect para um intervalo que executa a cada 10 segundos
  

  const handlePesquisa = () => {
    navigation.navigate("EquipamentoScreen");
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
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollStyle}>
        
          <>
            {calcularConsumoTotal(equipamentos) > 20 && (
              <Text style={styles.sugestao}>
                O consumo mensal total dos equipamentos é maior que 20 kWh. Considere substituir alguns equipamentos por modelos mais eficientes.
              </Text>
            )}

            <Button title="Visualizar dados dos equipamentos" onPress={handleNavigation} style={{marginTop:hp(3)}}/>

          
            <View style={{ height: hp(20), flexDirection: 'row', marginTop: hp(10) }}>
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
            
            <Button title="Pesquisar NOVOS equipamentos" onPress={handlePesquisa} style={{marginTop:hp(5)}}/>
          </>
        
      </ScrollView>
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
  }
});

export default NovaTela;
