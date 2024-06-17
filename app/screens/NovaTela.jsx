import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Platform, TouchableOpacity, Image, ScrollView, TouchableWithoutFeedback,Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getDatabase, ref, get, equalTo, orderByChild } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Ionicons, MaterialCommunityIcons, AntDesign, MaterialIcons } from '@expo/vector-icons';
import { PieChart } from 'react-native-chart-kit';

import { useNavigation } from '@react-navigation/native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Button } from 'react-native-elements';


const NovaTela = ({ route }) => {
  const { cardId, cardName } = route.params;
  const [cardDetails, setCardDetails] = useState(null);
  const [equipamentos, setEquipamentos] = useState([]);
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };

  useEffect(() => {
    const loadUserCards = async (userId) => {
      const db = getDatabase();
      const userCardsCollection = ref(db, `AmbienteCards/${userId}`);

      try {
        const snapshot = await get(userCardsCollection);

        if (snapshot.exists()) {
          const cardsArray = [];
          snapshot.forEach((childSnapshot) => {
            cardsArray.push({ id: childSnapshot.key, ...childSnapshot.val() });
          });

          const ultimoCard = cardsArray[cardsArray.length - 1];
          setCardDetails(ultimoCard);

          if (ultimoCard && ultimoCard.title) {
            const equipamentosPorAmbiente = await loadEquipamentosPorAmbiente(userId, ultimoCard.title);
            setEquipamentos(equipamentosPorAmbiente);
          }
        } else {
          setCardDetails(null);
        }
      } catch (error) {
        console.error('Erro ao carregar os cartões:', error);
      }
    };

    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        loadUserCards(user.uid);
      } else {
        console.error('Erro!');
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const carregarUltimosEquipamentos2 = async (userId) => {
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
      carregarUltimosEquipamentos2(user.uid);
    } else {
      setEquipamentos([]);
      console.log(ConsumoMensal)
    }
  }, [cardName]);

  const renderIcon = (equipName, ConsumoMensal) => {
    console.log("Consumo Mensal: ", ConsumoMensal)
    const color = ConsumoMensal > 50 ? 'red' : 'green';
    
    if (equipName.toLowerCase().includes('notebook') || equipName.toLowerCase().includes('laptop')) {
      return <Ionicons name="ios-laptop" size={RFPercentage(3)} color={color} />;
    } else if (equipName.toLowerCase().includes('telemóvel') || equipName.toLowerCase().includes('telemovel')) {
      return <Ionicons name="ios-phone-portrait" size={RFPercentage(3)} color={color} />;
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
    }else if (equipName.toLowerCase().includes('cafeteira')){
      return <MaterialCommunityIcons  name='coffee-maker-outline'  size={RFPercentage(3)} color={color} />;
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
  };

  const handleNavigation = () => {
    navigation.navigate("EstatisticasCalculo", { ambienteSelecionado: cardName});
  };

  const calcularConsumoTotal = (equipamentos) => {
    return equipamentos.ConsumoMensal;
  };


  // Função para verificar se o consumo mensal passou de 15 kWh e exibir um alerta se necessário
const verificarConsumoMensal = (equipamentos) => {
  const consumoTotal = equipamentos.reduce((total, equipamento) => total + equipamento.ConsumoMensal, 0);
  
  if (consumoTotal > 15) {
    Alert.alert(
      'Alerta de Consumo',
      'O consumo mensal de alguns equipamentos é maior que 15 kWh (Se encontram em vermelho). ' +
      'Considere substituir alguns equipamentos por modelos mais eficientes. Você pode verificar equipamentos alternativos clicando no botão, que se encontra no final da página.',
      
      [{ text: 'OK', onPress: () => console.log('Alerta fechado') }]
    );
  }
};

// Logo após a declaração do useState de 'equipamentos', chame a função verificarConsumoMensal
useEffect(() => {
  verificarConsumoMensal(equipamentos);
}, [equipamentos]);


  const handlePesquisa = () => {
    navigation.navigate("EquipamentoScreen");
  }

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
        {cardId ? (
          <>
          {calcularConsumoTotal(equipamentos) > 20 && (
            <Text style={styles.sugestao}>
              O consumo mensal total dos equipamentos é maior que 20 kWh. Considere substituir alguns equipamentos por modelos mais eficientes.
            </Text>
          )}
            <TouchableWithoutFeedback onPress={handleNavigation}>
              <Text style={styles.statisticsButton}>Dados dos equipamentos</Text>
            </TouchableWithoutFeedback>
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
            <TouchableWithoutFeedback onPress={handlePesquisa}>
              <Text style={styles.statisticsButton}>Pesquisar NOVOS equipamentos</Text>
            </TouchableWithoutFeedback>
            <Button title="Pesquisar NOVOS equipamentos" onPress={handlePesquisa}/>
          </>
        ) : (
          <Text>Carregando...</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
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
  },
  buttonStyle: {
    justifyContent: 'flex-start',
    height: hp(3),
    marginHorizontal: wp(-3),
  },
  statisticsButton: {
    backgroundColor: '#4CAF50',
    borderRadius: hp(5),
    border: 1,
   
    borderRightColor:'black',
    marginTop: hp(5),
    textAlign: 'center',
    height: hp(5),
    width: wp(90),
    marginHorizontal: wp(3),
    fontSize: RFPercentage(2.5),
  },
  graficoChart: {
    flex: 1,
    height: Platform.OS === 'android' ? hp(30) : hp(20) + Platform.OS === 'ios' ? hp(25) : hp(25),
  },
  scrollStyle:{
    paddingBottom:hp(
      Platform.OS === 'android' ? 20 : 0+Platform.OS === 'ios' ? 20: 20
      
    )
  },
});

export default NovaTela;
