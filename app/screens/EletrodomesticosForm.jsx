import React, { useState, useEffect } from 'react';
import { Text, TextInput, View, Button, StyleSheet, SafeAreaView, Alert, Platform, TouchableWithoutFeedback, Keyboard, FlatList, Image, TouchableOpacity, ScrollView, KeyboardAvoidingView, ActivityIndicator, Modal } from 'react-native';
import { getDatabase, ref, set, onValue, get, orderByChild, limitToLast, serverTimestamp, push } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import RNPickerSelect from 'react-native-picker-select';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';


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
  const [image, setImage] = useState(null);
  const [results, setResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState('');
  const [uploading, setUploading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Desculpe, precisamos de permissão de acesso a câmara para fazer isto funcionar!');
        }
      }
    })();
  }, []);

  const pickImageFromCamera = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log("Camera result:", result); 

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(uri);
      console.log("Image URI from camera:", uri); 
      await uploadImage(uri);
    }
  };

  const pickImageFromGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log("Gallery result:", result); 

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(uri);
      console.log("Image URI from gallery:", uri); 
      await uploadImage(uri);
    }
  };

  const translationDictionary = {
    "microwave": "Microondas",
    "computer monitor": "Monitor",
    "keyboard": "Teclado",
    "mouse": "Rato",
    "laptop": "Computador portátil",
    "refrigerator": "Frigorífico",
    "television": "Televisão",
    "oven": "Forno",
    "air conditioner": "Ar condicionado",
    "computer keyboard": "Teclado",
    "desk": "mesa",
    "washing machine": "Máquina de lavar Roupas",
    "blender": "Liquidificador",
    "coffeemaker": "Cafeteira",
    "mechanical fan": "Ventoinha",
    "mobile phone": "Telemóvel"
  };

  const translateTerm = (term) => {
    return translationDictionary[term.toLowerCase()] || term;
  };

  const uploadImage = async (uri) => {
    if (!uri) {
      Alert.alert('Erro', 'URI da Imagem não está definido');
      return;
    }

    console.log("Uploading image URI:", uri); 

    let apiUrl = 'http://13.37.58.38:5000/upload'; 

    let uriParts = uri.split('.');
    let fileType = uriParts[uriParts.length - 1];

    let formData = new FormData();
    formData.append('file', {
      uri: Platform.OS === 'android' ? uri : uri.replace('file://', ''),
      name: `photo.${fileType}`,
      type: `image/${fileType}`,
    });

    console.log("FormData:", formData); 

    setUploading(true); 

    try {
      let response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      let data = await response.json();

    
      let top5Results = data.slice(0, 5);

     
      let translatedResults = top5Results.map(result => translateTerm(result));

      console.log('Translated Top 5 Results:', translatedResults);
      setResults(translatedResults);
      setUploading(false); 
      setModalVisible(true);

    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Falha no carregamento!', error.message);
      setUploading(false); 
    }
  };

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

  useEffect(() => {
    if (equipamento.toLowerCase() === 'notebook' || equipamento.toLowerCase() === 'laptop' || equipamento.toLowerCase() === 'computador portátil' || equipamento.toLowerCase() === 'portátil') {
      setPotencia('45');
      setQuantidade('1')
    }
    if (equipamento.toLowerCase() === 'telemóvel' || equipamento.toLowerCase() === 'telefone') {
      setPotencia('15');
      setQuantidade('1')
    }
    if (equipamento.toLowerCase() === 'tablet' || equipamento.toLowerCase() === 'ipad') {
      setPotencia('15');
      setQuantidade('1')
    }
    if (equipamento.toLowerCase() === 'tv' || equipamento.toLowerCase() === 'televisão') {
      setPotencia('300');
      setQuantidade('1')
    }
    if (equipamento.toLowerCase() === 'cafeteira') {
      setPotencia('900');
      setQuantidade('1')
    }
    if (equipamento.toLowerCase() === 'microondas') {
      setPotencia('700');
      setQuantidade('1')
    }
    if (equipamento.toLowerCase() === 'liquidificador') {
      setPotencia('650');
      setQuantidade('1')
    }
    if (equipamento.toLowerCase() === 'impressora') {
      setPotencia('50');
      setQuantidade('1')
    }
    if (equipamento.toLowerCase() === 'monitor' || equipamento.toLowerCase() === 'tela') {
      setPotencia('50');
      setQuantidade('3')
    }
    if (equipamento.toLowerCase() === 'caixa de som' || equipamento.toLowerCase() === 'som') {
      setPotencia('100');
      setQuantidade('1')
    }
    if (equipamento.toLowerCase() === 'máquina de lavar roupas' || equipamento.toLowerCase() === 'lavar roupas') {
      setPotencia('1000');
      setQuantidade('2')
    }
    if (equipamento.toLowerCase() === 'máquina de lavar loiça' || equipamento.toLowerCase() === 'lavar loiça') {
      setPotencia('1300');
      setQuantidade('2')
    }
    if (equipamento.toLowerCase() === 'videogame' || equipamento.toLowerCase() === 'playstation' || equipamento.toLowerCase() === 'xbox') {
      setPotencia('300');
      setQuantidade('3')
    }
    if (equipamento.toLowerCase() === 'ar condicionado') {
      setPotencia('1300');
      setQuantidade('2')
    }
  }, [equipamento]);

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
          <View style={{ flexDirection: 'row', alignContent: 'space-between' }}>
            <TouchableOpacity style={styles.cameraButton} onPress={pickImageFromCamera}>
              <Text style={{ borderRadius: 2, textAlign: 'center', marginTop: hp(0.6) }}>Usar a câmara</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.galeriaButton} onPress={pickImageFromGallery}>
              <Text style={{ borderRadius: 2, textAlign: 'center', marginTop: hp(0.6) }}>Escolher da galeria</Text>
            </TouchableOpacity>
          </View>
          {image && <Image source={{ uri: image }} style={styles.image} />}

          {uploading && <ActivityIndicator size="large" color="#0000ff" />}
          <View style={styles.formContainer}>
            <RNPickerSelect
              style={pickerSelectStyles}
              value={selectedEnvironment}
              placeholder={{ label: 'Escolha o ambiente', value: null }}
              onValueChange={(value) => setSelectedEnvironment(value)}
              items={environmentNames}
              autoCorrect={false}
              autoCapitalize="none"
              spellCheck={false}
            />

            <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={-110}>
              <Text style={styles.textForm}>Equipamento:</Text>
              <TextInput
                style={styles.input}
                placeholder='Ex.Laptop'
                value={equipamento}
                onChangeText={(value) => setEquipamento(value)}
                autoCorrect={false}
                autoCapitalize="none"
                spellCheck={false}
              />

              <Text style={styles.textForm}>Marca:</Text>
              <TextInput
                style={styles.input}
                placeholder='Ex.Dell'
                value={marca}
                onChangeText={(value) => setMarca(value)}
                autoCorrect={false}
                autoCapitalize="none"
                spellCheck={false}
              />

              <Text style={styles.textForm}>Quantidade de Aparelhos:</Text>
              <TextInput
                style={styles.input}
                placeholder='Ex.1'
                value={quantidade}
                onChangeText={(value) => setQuantidade(value)}
                keyboardType='numeric'
                autoCorrect={false}
                autoCapitalize="none"
                spellCheck={false}
              />
              <Text style={styles.textForm}>Potência:</Text>
              <TextInput
                style={styles.input}
                placeholder='Ex.45'
                value={potencia}
                onChangeText={(value) => setPotencia(value)}
                keyboardType='numeric'
                autoCorrect={false}
                autoCapitalize="none"
                spellCheck={false}
              />
              <Text style={styles.textForm}>N.º de dias utilizado no mês:</Text>
              <TextInput
                style={styles.input}
                placeholder='Ex.27'
                value={numdiasusadosmes}
                keyboardType="numeric"
                autoCorrect={false}
                autoCapitalize="none"
                spellCheck={false}
                onChangeText={(value) => {
                  if (value === '') {
                    setNumDiasUsadosMes(''); 
                    return;
                  }
                  if (!isNaN(value)) {
                    let num = parseInt(value);
                    if (num >= 0 && num <= 31) {
                      setNumDiasUsadosMes(num.toString());
                    } else if (num > 31) {
                      Alert.alert('Você só pode inserir um número de 0 a 31');
                      setNumDiasUsadosMes('');
                    }
                  } else {
                    setNumDiasUsadosMes('');
                  }
                }}
              />
              <Text style={styles.textForm}>Horas de Uso Diária:</Text>
              <TextInput
                style={styles.input}
                placeholder='Ex.10'
                value={horasDeUsoDiaria}
                keyboardType='numeric'
                autoCorrect={false}
                autoCapitalize="none"
                spellCheck={false}
                onChangeText={(value) => {
                  if (value === '') {
                    setHorasDeUsoDiaria(''); 
                    return;
                  }
                  if (!isNaN(value)) {
                    let num = parseInt(value);
                    if (num >= 0 && num <= 24) {
                      setHorasDeUsoDiaria(num.toString());
                    } else if (num > 24) {
                      Alert.alert('Você só pode inserir um número de 0 a 24')
                      setHorasDeUsoDiaria('');
                    }
                  } else {
                    setHorasDeUsoDiaria('');
                  }
                }}
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

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}>
            <View style={styles.modalContainer}>
              <View style={styles.modalView}>
                <Text style={styles.modalTitle}>Equipamentos detectados:</Text>
                <RNPickerSelect
                  onValueChange={(itemValue) => {
                    setSelectedResult(itemValue);
                    setEquipamento(itemValue);
                  }}
                  items={results.map((result) => ({
                    label: result,
                    value: result,
                  }))}
                  placeholder={{
                    label: 'Selecione um objeto...',
                    value: null,
                  }}
                />
                <Button
                  title="Confirmar"
                  onPress={() => {
                    setModalVisible(!modalVisible);
                  }}
                />
              </View>
            </View>
          </Modal>
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
    textAlign: 'center',
    marginLeft: hp(-4),

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
    marginTop: hp(-2),
    justifyContent: 'center',
  },
  formTexto: {
    fontSize: Platform.OS === 'ios' ? RFPercentage(2.5) : RFPercentage(2, 5) + Platform.OS === 'android' ? RFPercentage(3) : RFPercentage(3),
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
  scrollView: {
    paddingBottom: hp(25),
  },
  buttonStyle: {
    height: hp(4),
    width: hp(4),
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
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
  modalTitle: {
    fontSize: Platform.OS === 'ios' ? RFPercentage(2) : RFPercentage(2) + Platform.OS === 'android' ? RFPercentage(2.5) : RFPercentage(2.5),
    marginBottom: hp(3),
    textAlign: 'center',
  },
  cameraButton: {
    borderRadius: 10,
    borderWidth: 1,
    marginVertical: hp(3),
    height: Platform.OS === 'android' ? hp(5) : hp(5) + Platform.OS === 'ios' ? hp(4) : hp(4),
    width: wp(40),
    backgroundColor: 'lightblue',
    marginLeft: hp(2.7),
    marginRight: Platform.OS === 'ios' ? hp(3.9) : hp(3.9) + Platform.OS === 'android' ? hp(5.2) : hp(5.2)
  },
  galeriaButton: {
    borderRadius: 10,
    borderWidth: 1,
    marginVertical: hp(3),
    height: Platform.OS === 'android' ? hp(5) : hp(5) + Platform.OS === 'ios' ? hp(4) : hp(4),
    width: wp(40),
    backgroundColor: 'lightblue',
  },
  textForm: {
    fontSize: Platform.OS === 'ios' ? RFPercentage(1.8) : RFPercentage(1.8) + Platform.OS === 'android' ? RFPercentage(2.3) : RFPercentage(2.3),
    marginHorizontal: hp(1),
    marginBottom: hp(0.5)
  }
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
