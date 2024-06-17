import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { getDatabase, ref, onValue, remove } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import RNPickerSelect from 'react-native-picker-select';
import { useNavigation } from '@react-navigation/native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

const windowWidth = Dimensions.get('window').width;

const Statistics = () => {
  const [equipamentos, setEquipamentos] = useState([]);
  const [simulatorResults, setSimulatorResults] = useState([]);
  const [sortOrder, setSortOrder] = useState('recent'); // 'recent' or 'oldest'
  const navigation = useNavigation();

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

  const handleDeleteResultado = (resultId) => {
    console.log('Deletar equipamento com ID:', resultId);
    const auth = getAuth();
    const user = auth.currentUser;
    const userId = user ? user.uid : null;

    if (userId) {
      // Remover equipamento da base de dados
      const resultRef = ref(getDatabase(), `userResults/${userId}/${resultId}`);
      remove(resultRef);

      // Atualizar o estado removendo o equipamento específico da lista
      setSimulatorResults((prevResultados) =>
        prevResultados.filter((resultado) => resultado.resultId !== resultId)
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
          const equipamentosArray = equipamentosData
            ? Object.entries(equipamentosData).map(([equipId, equipamento]) => ({ equipId, ...equipamento }))
            : [];

          // Adicionando um campo de dataSubmissao usando timestamp do Firebase
          const equipamentosComTimestamp = equipamentosArray.map((equipamento) => ({
            ...equipamento,
            dataSubmissao: equipamento.timestamp,
          }));

          // Ordenar equipamentos com base na escolha de ordenação
          const equipamentosOrdenados = sortEquipamentos(equipamentosComTimestamp, sortOrder);

          setEquipamentos(equipamentosOrdenados);
        });

        // Obter resultados do simulador
        const simulatorResultsRef = ref(getDatabase(), `userResults/${userId}`);
        onValue(simulatorResultsRef, (snapshot) => {
          const resultsData = snapshot.val();
          const resultsArray = resultsData
            ? Object.entries(resultsData).map(([resultId, resultado]) => ({ resultId, ...resultado }))
            : [];
          setSimulatorResults(resultsArray);
        });
      }
    };

    fetchEquipamentos();
  }, [sortOrder]);

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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Statistics</Text>
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
        <ScrollView>
        {/* Lista de Equipamentos como Cards em ScrollView */}
        <ScrollView horizontal contentContainerStyle={styles.scrollViewContainer}>
          {equipamentos.map((item, index) => (
            <View key={index} style={styles.cardContainer}>
              <View style={styles.equipamentoItem}>
                <Text>Equipamento: {item.Equip}</Text>
                <Text>Marca: {item.Marca}</Text>
                <Text>Horas Diárias: {item.HorasDeUsoDiaria} horas</Text>
                <Text>Potência: {item.Potencia}</Text>
                <Text>Quantidade: {item.Quantidade}</Text>
                <Text>Ambiente: {item.SelectedEnviroment}</Text>
                <Text>Consumo Mensal: {item.ConsumoMensal}</Text>
                {/* Certifique-se de passar o ID corretamente para a função */}
                <TouchableOpacity onPress={() => handleDeleteEquipamento(item.equipId)} style={styles.deleteButton}>
                  <Text style={styles.deleteButtonText}>Remover</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
        <TouchableOpacity onPress={() => navigation.navigate('List')}>
          <Text style={styles.navigateToButton}>Ir para a Lista</Text>
        </TouchableOpacity>

        {/* Resultados do Simulador */}
        <Text style={styles.textSize}>Resultados do Simulador</Text>
        <ScrollView horizontal contentContainerStyle={styles.scrollViewContainer}>
          {simulatorResults.map((result, index) => (
            <View key={index} style={styles.cardContainerResults}>
              <View style={styles.equipamentoItem}>
                <Text>Daily Hours: {result.daily_hours}</Text>
                <Text>kWh Price: {result.kwh_price}</Text>
                <Text>Days of Month: {result.days_of_month}</Text>
                <Text>Taxes/Fees: {result.taxes_or_fees}</Text>
                <Text>Total Cost: {result.result}</Text>
                <TouchableOpacity onPress={() => handleDeleteResultado(result.resultId)} style={styles.deleteButton}>
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
    padding: RFValue(30),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RFValue(19),
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    width: '101%',
    marginVertical: RFValue(-7),
  },
  headerText: {
    color: '#fff',
    fontSize: RFPercentage(3),
    fontWeight: 'bold',
    marginVertical: RFValue(20),
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
    margin: RFValue(15),
    marginLeft: RFValue(1),
  },
  cardContainerResults: {
    maxWidth: windowWidth - RFValue(50), // Ajuste a largura conforme necessário
    margin: RFValue(15),
    marginLeft: RFValue(2),
  },
  scrollViewContainer: {
    flexDirection: 'row',
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
  navigateToButton: {
    marginTop: RFValue(15),
    fontWeight: 'bold',
    color: '#336F95',
  },
});

export default Statistics;
