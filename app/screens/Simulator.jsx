import React, { useState } from 'react';
import { Text, View, TextInput, Button, Image, StyleSheet, SafeAreaView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard, Alert, StatusBar, TouchableOpacity } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { getDatabase, ref, push, update } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';

const Simulator = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [dailyConsumptionHours, setDailyConsumptionHours] = useState('');
  const [nationalPricePerKWh, setNationalPricePerKWh] = useState('');
  const [etiquetElet, setEtiquetaElet] = useState('');
  const [daysOfMonth, setDaysOfMonth] = useState('');
  const [taxesOrFees, setTaxesOrFees] = useState('');
  const [result, setResult] = useState(null);

  const calculateResult = () => {
    const user = getAuth().currentUser;

    if (!user) {
      // Usuário não autenticado
      return;
    }

    const uid = user.uid;

    const num1 = parseFloat(selectedOption === 'EDP' ? 0.07 : selectedOption === 'Repsol' ? 0.06 : 0);
    const num2 = parseFloat(dailyConsumptionHours);
    const num3 = parseFloat(nationalPricePerKWh);
    const num4 = parseFloat(daysOfMonth);
    const num5 = parseFloat(taxesOrFees);
    const num6=  parseFloat(etiquetElet);

    if (!isNaN(num2) && !isNaN(num3) && !isNaN(num4) && !isNaN(num5) && !isNaN(num6)) {
      const consumptionResult = num2 * num3 * num4 * num6;
      const finalResult = (consumptionResult + num5).toFixed(2);

      // Obtenha uma referência para a base de dados
      const database = getDatabase();
      const userResultsRef = ref(database, `userResults/${uid}`);

      // Crie um novo nó no banco de dados
      const newUserResultRef = push(userResultsRef);

      // Defina os dados no novo nó
      update(newUserResultRef, {
        company: num1,
        daily_hours: num2,
        kwh_price: num3,
        days_of_month: num4,
        taxes_or_fees: num5,
        etiqueta_elet: num6,
        result: finalResult,
        timestamp: new Date().toISOString(),
      });

      // Exibir um alerta com o resultado
      Alert.alert('Resultado', `Custo total: ${finalResult}`);
    } else {
      setResult(null);
    }
  };

  const navigation = useNavigation();
  const handleGoBack = () => {
    navigation.goBack();
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack}>
              <Image source={require('../../assets/go_back.png')} style={styles.buttonStyle} />
            </TouchableOpacity>
            <View style={styles.headerTextContainer}>
                <Text style={styles.headerText}>Simulator</Text>
            </View>
         
        </View>
        <ScrollView contentContainerStyle={styles.scrollviewcontent} showsVerticalScrollIndicator={false}>
          {/* Conteúdo da tela */}
          <Text style={styles.textAboveDropdown}>{'\n\n\n\n'}Escolha uma companhia (kWh)</Text>

          <RNPickerSelect
            onValueChange={(value) => {
              setSelectedOption(value);
              // Defina os valores automaticamente com base na escolha do usuário
              setEtiquetaElet(value === 'EDP' ? '0.07' : value === 'Repsol' ? '0.06' : '');
            }}
            items={[
              { label: 'Selecione uma Opção', value: null },
              { label: 'EDP', value: 'EDP' },
              { label: 'Repsol', value: 'Repsol' },
              { label: 'Other', value: 'Other' },
            ]}
            style={pickerSelectStyles}
            value={selectedOption}
            
          />


          <Text style={styles.inputLabel}>Consumo diário em horas</Text>
          <TextInput
            style={styles.input}
            placeholder="Horas"
            keyboardType="numeric"
            value={dailyConsumptionHours}
            onChangeText={(value) => {
              // Verifica se o valor é um número
              if (!isNaN(value)) {
                // Converte o valor para número inteiro
                let num = parseInt(value);
          
                // Limita o número entre 0 e 24
                if (num >= 0 && num <= 24) {
                  setDailyConsumptionHours(num.toString()); // Atualiza o estado com o valor válido
                } else if (num > 24) {
                  Alert.alert('Você só pode inserir um valor de 0 a 24')// Define como 24 se o valor for maior que 24
                  // Aqui você pode adicionar um alerta ao usuário informando que o valor foi ajustado para 24
                  // ou outro feedback adequado ao seu aplicativo
                }
              } else {
                // Caso o valor não seja um número, você pode limpar o valor ou mostrar um aviso
                setDailyConsumptionHours(''); // Limpa o valor do estado
                // Aqui você pode adicionar um alerta ao usuário informando que apenas números são permitidos
                // ou outro feedback adequado ao seu aplicativo
              }
            }
          }
          />



          <Text style={styles.inputLabel}>kWh da Etiquetagem Elétrica</Text>
          <TextInput
            style={styles.input}
            placeholder="Preço"
            keyboardType="numeric"
            value={etiquetElet}
            onChangeText={(text) => setEtiquetaElet(text)}
          />

          <Text style={styles.inputLabel}>Preço Nacional por kWh</Text>
          <TextInput
            style={styles.input}
            placeholder="Preço Nacional"
            keyboardType="numeric"
            value={nationalPricePerKWh}
            onChangeText={(text) => setNationalPricePerKWh(text)}
          />




          <Text style={styles.inputLabel}>Dias do mês</Text>
          <TextInput
            style={styles.input}
            placeholder="Dias"
            keyboardType="numeric"
            value={daysOfMonth}
            onChangeText={(value) => {
              // Verifica se o valor é um número
              if (!isNaN(value)) {
                // Converte o valor para número inteiro
                let num = parseInt(value);
          
                // Limita o número entre 0 e 24
                if (num >= 0 && num <= 31) {
                  setDaysOfMonth(num.toString()); // Atualiza o estado com o valor válido
                } else if (num > 31) {
                  Alert.alert('Você só pode inserir um número de 0 a 31')// Define como 24 se o valor for maior que 24
                  setDaysOfMonth(''); 
                  // Aqui você pode adicionar um alerta ao usuário informando que o valor foi ajustado para 24
                  // ou outro feedback adequado ao seu aplicativo
                }
              } else {
                // Caso o valor não seja um número, você pode limpar o valor ou mostrar um aviso
                setDaysOfMonth(''); // Limpa o valor do estado
                // Aqui você pode adicionar um alerta ao usuário informando que apenas números são permitidos
                // ou outro feedback adequado ao seu aplicativo
              }
            }}
          />



          <Text style={styles.inputLabel}>Taxas/Impostos</Text>
          <TextInput
            style={styles.input}
            placeholder="Insira taxas/impostos"
            keyboardType="numeric"
            value={taxesOrFees}
            onChangeText={(text) => setTaxesOrFees(text)}
          />

          <Button title="Calcular" onPress={calculateResult} />

          {result !== null && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultText}>Custo Total: {result}</Text>
            </View>
          )}

          <Image
            source={require('../../assets/gasto_energetico_calculo.png')}
            style={styles.image}
          />
        </ScrollView>
        
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
    width: wp(90),
    borderColor: 'gray',
    borderWidth: 1.5,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 20,
    borderRadius: 7,
  },
  resultContainer: {
    marginTop: 20,
  },
  resultText: {
    fontSize: 18,
  },
  image: {
    marginTop: 20,
    width: wp(90),
    height: hp(15),
  },
  scrollviewcontent: {
    flexDirection: 'column',
    paddingBottom: hp(15),
  },
  buttonStyle: {
    height: hp(4), // ajuste a altura conforme necessário
    width: hp(4), // ajuste a largura conforme necessário
  },
  
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'red', // Altere a cor do texto aqui
    paddingRight: 30, // para garantir que o texto não seja cortado
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'red', // Altere a cor do texto aqui
    paddingRight: 30, // para garantir que o texto não seja cortado
  },
});

export default Simulator;
