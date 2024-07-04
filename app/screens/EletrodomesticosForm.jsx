import React, { useState, useEffect } from 'react';
import { Text, TextInput, View, Button, StyleSheet, SafeAreaView, Alert, Platform, TouchableWithoutFeedback, Keyboard, FlatList, Image, TouchableOpacity, ScrollView, KeyboardAvoidingView } from 'react-native';
import { getDatabase, ref, set, onValue, get, orderByChild, limitToLast, serverTimestamp, push } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import RNPickerSelect from 'react-native-picker-select';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { useNavigation } from '@react-navigation/native';

function writeEquipamentos(userId, selectedEnvironment, equipamento, marca, quantidade, numdiasusadosmes, potencia, horasdeusodiaria) {
  const db = getDatabase();
  const equipamentosRef = ref(db, `equipamentos/${userId}`);
  const novoEquipamentoRef = push(equipamentosRef);
  const consumoMensal = calcularConsumo(quantidade, potencia, horasdeusodiaria, numdiasusadosmes);

  set(novoEquipamentoRef, {
    SelectedEnvironment: selectedEnvironment,
    Equip: equipamento,
    Marca: marca,
    Quantidade: quantidade,
    NumDiasUsadosMes: numdiasusadosmes,
    Potencia: potencia,
    HorasDeUsoDiaria: horasdeusodiaria,
    ConsumoMensal: consumoMensal,
    timestamp: serverTimestamp(),
  })
    .then(() => {
      console.log('Dados enviados com sucesso!');
    })
    .catch((error) => {
      console.error('Erro ao enviar dados:', error);
    });
}

function calcularConsumo(quantidade, potencia, horasDeUsoDiaria, numDiasUsadosMes) {
  const potenciaEmKW = potencia / 1000;
  const consumoMensal = (potenciaEmKW * horasDeUsoDiaria * numDiasUsadosMes) * quantidade;
  return consumoMensal;
}

const EletrodomesticosForm = () => {
  const [equipamento, setEquipamento] = useState('');
  const [marca, setMarca] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [numdiasusadosmes, setNumDiasUsadosMes] = useState('');
  const [potencia, setPotencia] = useState('');
  const [horasDeUsoDiaria, setHorasDeUsoDiaria] = useState('');
  const [ultimoEquipamento, setUltimoEquipamento] = useState(null);
  const [equipamentos, setEquipamentos] = useState([]);
  const [environmentNames, setEnvironmentNames] = useState([]);
  const [selectedEnvironment, setSelectedEnvironment] = useState('');

  useEffect(() => {
    const carregarUltimosEquipamentos = async (userId) => {
      const db = getDatabase();
      const equipamentosRef = ref(db, `equipamentos/${userId}`);
      const query = orderByChild('timestamp');
      const snapshot = await get(query);
      if (snapshot.exists()) {
        const equipamentosArray = [];
        snapshot.forEach((childSnapshot) => {
          equipamentosArray.push(childSnapshot.val());
        });
        setEquipamentos(equipamentosArray.reverse());
      } else {
        setEquipamentos([]);
      }
    };

    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      carregarUltimosEquipamentos(user.uid);
    } else {
      setEquipamentos([]);
    }
  }, [ultimoEquipamento]);

  const handleSubmit = () => {
    if (!equipamento || !marca || !horasDeUsoDiaria || !quantidade || !selectedEnvironment || !numdiasusadosmes || !potencia) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    const consumoMensal = calcularConsumo(parseFloat(quantidade), parseFloat(potencia), parseFloat(horasDeUsoDiaria), parseFloat(numdiasusadosmes));
    const consumoMensalFormatado = consumoMensal.toFixed(2);

    Alert.alert(
      'Resultado do Consumo',
      `O consumo mensal estimado é de ${consumoMensalFormatado} kWh.`,
      [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ],
      { cancelable: false }
    );

    const auth = getAuth();
    const user = auth.currentUser;
    const userId = user ? user.uid : null;

    if (userId) {
      writeEquipamentos(userId, selectedEnvironment, equipamento, marca, quantidade, numdiasusadosmes, potencia, horasDeUsoDiaria);
      setUltimoEquipamento(equipamento);
      setSelectedEnvironment('');
      setEquipamento('');
      setMarca('');
      setQuantidade('');
      setNumDiasUsadosMes('');
      setPotencia('');
      setHorasDeUsoDiaria('');
    } else {
      Alert.alert('Erro', 'Usuário não autenticado.');
    }
  };

  const loadEnvironmentNames = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const db = getDatabase();
      const userEnvironmentsCollection = ref(db, `AmbienteCards/${user.uid}`);

      try {
        const snapshot = await get(userEnvironmentsCollection);

        if (snapshot.exists()) {
          const environmentNames = [];
          snapshot.forEach((childSnapshot) => {
            const environment = childSnapshot.val();
            environmentNames.push({ label: environment.title, value: environment.title });
          });

          setEnvironmentNames(environmentNames);
        } else {
          setEnvironmentNames([]);
        }
      } catch (error) {
        console.error('Erro ao carregar os nomes dos ambientes da base de dados:', error);
      }
    }
  };

  useEffect(() => {
    loadEnvironmentNames();
  }, []);

  const navigation = useNavigation();
  const handleGoBack = () => {
    navigation.goBack();
  }


  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack}>
              <Image source={require('../../assets/go_back.png')} style={styles.buttonStyle} />
            </TouchableOpacity>
            <View style={styles.headerTextContainer}>
                <Text style={styles.headerText}>Formulário</Text>
            </View>
        </View>
        <Text>{'\n\n'}</Text>
        
        <View style={styles.formTextoContainer}>
          <Text style={styles.formTexto}>Formulário de Equipamentos:</Text>
        </View>
        <View style={styles.imageSizeContainer} >
          <Image source={require('../../assets/smart-tv.png')} style={styles.imageSize} />
          <Image source={require('../../assets/aplicativo-movel.png')} style={styles.imageSize} />
          <Image source={require('../../assets/computador-portatil.png')} style={styles.imageSize} />
        </View>
        <ScrollView contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          <RNPickerSelect
            style={pickerSelectStyles}
            value={selectedEnvironment}
            placeholder={{ label: 'Escolha o ambiente', value: null }}
            onValueChange={(value) => setSelectedEnvironment(value)}
            items={environmentNames}
          />
          <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={-110}>
            <TextInput
              style={styles.input}
              placeholder="Equipamento"
              value={equipamento}
              onChangeText={(value) => setEquipamento(value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Marca"
              value={marca}
              onChangeText={(value) => setMarca(value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Quantidade de Aparelhos"
              value={quantidade}
              onChangeText={(value) => setQuantidade(value)}
              keyboardType='numeric'
            />
            <TextInput
              style={styles.input}
              placeholder="Potência"
              value={potencia}
              onChangeText={(value) => setPotencia(value)}
              keyboardType='numeric'
            />
            <TextInput
              style={styles.input}
              placeholder="N.º de dias utilizado no mês"
              value={numdiasusadosmes}
              keyboardType='numeric'
              onChangeText={(value) => {
                // Verifica se o valor é um número
                if (!isNaN(value)) {
                  // Converte o valor para número inteiro
                  let num = parseInt(value);
            
                  // Limita o número entre 0 e 24
                  if (num >= 0 && num <= 31) {
                    setNumDiasUsadosMes(num.toString()); // Atualiza o estado com o valor válido
                  } else if (num > 24) {
                    Alert.alert('Você só pode inserir um número de 0 a 31')// Define como 24 se o valor for maior que 24
                    setNumDiasUsadosMes('');
                    // Aqui você pode adicionar um alerta ao usuário informando que o valor foi ajustado para 24
                    // ou outro feedback adequado ao seu aplicativo
                  }
                } else {
                  setNumDiasUsadosMes('');
                  // Caso o valor não seja um número, você pode limpar o valor ou mostrar um aviso
                   // Limpa o valor do estado
                  // Aqui você pode adicionar um alerta ao usuário informando que apenas números são permitidos
                  // ou outro feedback adequado ao seu aplicativo
                }
              }}
            />
            <TextInput
              style={styles.input}
              placeholder="Horas de Uso Diária"
              value={horasDeUsoDiaria}
              keyboardType='numeric'
              onChangeText={(value) => {
              // Verifica se o valor é um número
                if (!isNaN(value)) {
                // Converte o valor para número inteiro
                  let num = parseInt(value);
          
                // Limita o número entre 0 e 24
                  if (num >= 0 && num <= 24) {
                  setHorasDeUsoDiaria(num.toString()); // Atualiza o estado com o valor válido
                  } else if (num > 24) {
                  Alert.alert('Você só pode inserir um número de 0 a 24') // Define como 24 se o valor for maior que 24
                  setHorasDeUsoDiaria('');
                  // Aqui você pode adicionar um alerta ao usuário informando que o valor foi ajustado para 24
                  // ou outro feedback adequado ao seu aplicativo
                  }
                } else {
                // Caso o valor não seja um número, você pode limpar o valor ou mostrar um aviso
                setHorasDeUsoDiaria(''); // Limpa o valor do estado
                // Aqui você pode adicionar um alerta ao usuário informando que apenas números são permitidos
                // ou outro feedback adequado ao seu aplicativo
                }
              }
            }
            />
          </KeyboardAvoidingView>

          <TouchableOpacity onPress={handleSubmit} style={styles.submeterButton}>
            <Text style={styles.submeterButtonText}>Submeter</Text>
          </TouchableOpacity>

          <Text>{'\n\n'}</Text>

          {ultimoEquipamento && (
            <View style={styles.ultimoEquipamentoContainer}>
              <Text style={styles.ultimoEquipamentoTexto}>Último Equipamento Submetido:  {'\n --> '}{ultimoEquipamento}</Text>
            </View>
          )}
        </View>
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
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
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: hp(2),
    textAlign: 'center', // centralizar o texto
    marginLeft:hp(-4)
  },
  formContainer: {
    paddingHorizontal: wp(5),
    marginTop: hp(2),
  },
  input: {
    height: hp(6),
    borderColor: 'gray',
    borderWidth: 1.5,
    marginBottom: hp(2),
    paddingHorizontal: wp(3),
    borderRadius: wp(3),
    fontSize: RFValue(14),
  },
  formTextoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(0),
    justifyContent: 'center',
  },
  formTexto: {
    fontSize: RFPercentage(2.5),
    fontWeight: 'bold',
    color: '#336F95',
  },
  ultimoEquipamentoContainer: {
    backgroundColor: '#5295bf',
    borderRadius: wp(2),
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: hp(2),
    padding: wp(3),
  },
  ultimoEquipamentoTexto: {
    fontSize: RFPercentage(2),
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  imageSize: {
    width: wp(12),
    height: wp(12),
    marginVertical: hp(2),
    marginHorizontal: wp(3),
  },
  imageSizeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  submeterButton: {
    backgroundColor: '#00a500',
    padding: hp(1.5),
    borderRadius: wp(3),
    alignItems: 'center',
    marginHorizontal: wp(15),
    marginTop: hp(2),
  },
  submeterButtonText: {
    color: '#fff',
    fontSize: RFPercentage(2),
    fontWeight: 'bold',
  },
  scrollView:{
    paddingBottom: hp(10),
  },
  buttonStyle: {
    height: hp(4), // ajuste a altura conforme necessário
    width: hp(4), // ajuste a largura conforme necessário
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: RFValue(14),
    paddingVertical: hp(2),
    paddingHorizontal: wp(4),
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: wp(2),
    color: 'red',
    paddingRight: wp(4),
    marginTop: hp(1),
    marginBottom: hp(3),
  },
  inputAndroid: {
    fontSize: RFValue(14),
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: wp(2),
    color: 'red',
    paddingRight: wp(4),
    marginTop: hp(1),
    marginBottom: hp(3),
  },
});

export default EletrodomesticosForm;
