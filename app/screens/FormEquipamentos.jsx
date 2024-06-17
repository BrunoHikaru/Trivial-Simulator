import React, { useState, useEffect } from 'react';
import {
  Text,
  TextInput,
  View,
  Button,
  StyleSheet,
  SafeAreaView,
  Alert,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
  Image,
  TouchableOpacity,
  Picker,
} from 'react-native';
import {
  getDatabase,
  ref,
  set,
  get,
  push,
  serverTimestamp,
} from 'firebase/database';
import { getAuth } from 'firebase/auth';
import RNPickerSelect from 'react-native-picker-select';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { useNavigation } from '@react-navigation/native';

function writeEquipamentos(
  userId,
  equipamento,
  marca,
  horasdeusodiaria,
  custoMedio,
  potencia,
  selectedEnvironment
) {
  const db = getDatabase();
  const equipamentosRef = ref(db, `CalculoEquipamentosUnicos/${userId}`);

  const novoEquipamentoRef = push(equipamentosRef);

  set(novoEquipamentoRef, {
    Equip: equipamento,
    Marca: marca,
    HorasDeUsoDiaria: horasdeusodiaria,
    CustoMedio: custoMedio,
    Potencia: potencia,
    Ambiente: selectedEnvironment,  
    timestamp: serverTimestamp(),
  })
    .then(() => {
      console.log('Dados enviados com sucesso!');
    })
    .catch((error) => {
      console.error('Erro ao enviar dados:', error);
    });
}

const FormEquipamentos = () => {
  const [selectedEnvironment, setSelectedEnvironment] = useState('');
  const [environmentNames, setEnvironmentNames] = useState([]); 
  const [equipamento, setEquipamento] = useState('');
  const [marca, setMarca] = useState('');
  const [horasDeUsoDiaria, setHorasDeUsoDiaria] = useState('');
  const [custoMedio, setCustoMedio] = useState('');
  const [potencia, setPotencia] = useState('');
  const [ultimoEquipamento, setUltimoEquipamento] = useState(null);
  const [equipamentos, setEquipamentos] = useState([]);

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

  const handleSubmit = () => {
    if (
      !selectedEnvironment ||
      !equipamento ||
      !marca ||
      !horasDeUsoDiaria ||
      !custoMedio ||
      !potencia
    ) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;
    const userId = user ? user.uid : null;

    if (userId) {
      writeEquipamentos(
        userId,
        equipamento,
        marca,
        horasDeUsoDiaria,
        custoMedio,
        potencia,
        selectedEnvironment
      );
      setUltimoEquipamento(equipamento);
      setEquipamento('');
      setMarca('');
      setHorasDeUsoDiaria('');
      setCustoMedio('');
      setPotencia('');
      setSelectedEnvironment('');  
      Alert.alert('Formulário Enviado', 'Dados do formulário salvos com sucesso!');
    } else {
      Alert.alert('Erro', 'Usuário não autenticado.');
    }
  };

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
                <Text style={styles.headerText}>Simulator</Text>
            </View>
        </View>
        <View style={styles.formContainer}>
          <RNPickerSelect
            style={pickerSelectStyles}
            value={selectedEnvironment}
            placeholder={{ label: 'Escolha o ambiente', value: null }}
            onValueChange={(value) => setSelectedEnvironment(value)}
            items={environmentNames}
          />

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
            placeholder="Horas de Uso Diária"
            value={horasDeUsoDiaria}
            onChangeText={(value) => setHorasDeUsoDiaria(value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Custo Médio (kWh)"
            value={custoMedio}
            onChangeText={(value) => setCustoMedio(value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Potência (watts)"
            value={potencia}
            onChangeText={(value) => setPotencia(value)}
          />

          <TouchableOpacity onPress={handleSubmit} style={styles.submeterButton}>
            <Text style={styles.submeterButtonText}>Submeter</Text>
          </TouchableOpacity>
        </View>
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
      paddingHorizontal: wp('5%'),
      marginTop: hp('2%'),
    },
    input: {
      height: hp('5%'),
      borderColor: 'gray',
      borderWidth: wp('0.3%'),
      marginBottom: hp('2%'),
      paddingHorizontal: wp('3%'),
      borderRadius: wp('2%'),
    },
    submeterButton:{
      backgroundColor: '#00a500',
      padding: wp('3%'),
      borderRadius: wp('2%'),
      alignItems: 'center',
      marginHorizontal:wp('15%'),
      marginTop:hp('1.5%')
    },
    submeterButtonText: {
      color: '#fff',
      fontSize: RFPercentage(2),
      fontWeight: 'bold',
    
    },
    buttonStyle: {
      height: hp(4), // ajuste a altura conforme necessário
      width: hp(4), // ajuste a largura conforme necessário
    },
});
const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
      fontSize: RFPercentage(2),
      paddingVertical: hp('2%'),
      paddingHorizontal: wp('4%'),
      borderWidth: wp('0.3%'),
      borderColor: 'gray',
      borderRadius: wp('2%'),
      color: 'red',
      paddingRight: wp('15%'),
      marginTop:hp('7%'),
      marginBottom:hp('3%')
    },
    inputAndroid: {
      fontSize: RFPercentage(2),
      paddingHorizontal: wp('4%'),
      paddingVertical: hp('1.5%'),
      borderWidth: wp('0.3%'),
      borderColor: 'gray',
      borderRadius: wp('2%'),
      color: 'red',
      paddingRight: wp('15%'),
    },
});
export default FormEquipamentos;
