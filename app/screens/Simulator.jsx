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
  const [nationalPricePerKWh, setNationalPricePerKWh] = useState('0.17'); 
  const [etiquetElet, setEtiquetaElet] = useState('');
  const [daysOfMonth, setDaysOfMonth] = useState('');
  const [taxesOrFees, setTaxesOrFees] = useState('');
 
  const [result, setResult] = useState(null);

  const calculateResult = () => {
    const user = getAuth().currentUser;

    if (!user) {
      
      return;
    }

    const uid = user.uid;

    const num2 = parseFloat(dailyConsumptionHours);
    const num3 = parseFloat(nationalPricePerKWh);
    const num4 = parseFloat(daysOfMonth);
    const num5 = parseFloat(taxesOrFees);
    const num6 = parseFloat(etiquetElet);

    if (!isNaN(num2) && !isNaN(num3) && !isNaN(num4) && !isNaN(num5) && !isNaN(num6)) {
      const consumptionResult = num2 * num3 * num4 * (num6/60);
      const finalResult = (consumptionResult + num5).toFixed(2);

      
      const database = getDatabase();
      const userResultsRef = ref(database, `userResults/${uid}`);

      
      const newUserResultRef = push(userResultsRef);

      
      update(newUserResultRef, {
        company: selectedOption,
        daily_hours: num2,
        kwh_price: num3,
        days_of_month: num4,
        taxes_or_fees: num5,
        etiqueta_elet: num6,
        result: finalResult,
        timestamp: new Date().toISOString(),
      });

      
      Alert.alert('Resultado', `Custo total (€): ${finalResult} € \n Custo Total (kWh): ${((num6/60)*num2*num4).toFixed(2)} kWh`);
    } else {
      setResult(null);
    }
  };

  const navigation = useNavigation();
  const handleGoBack = () => {
    navigation.goBack();
  };

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
        <ScrollView contentContainerStyle={styles.scrollviewcontent} showsVerticalScrollIndicator={false}>
          

          <Text style={{ ...styles.inputLabel, marginTop: hp(5) }}>Consumo diário em horas</Text>
          <TextInput
            style={styles.input}
            placeholder="Horas"
            keyboardType="numeric"
            value={dailyConsumptionHours}
            onChangeText={(value) => {
              if (value === '') {
                setDailyConsumptionHours(''); 
                return;
              }
              
              if (!isNaN(value)) {
                
                let num = parseInt(value);

                
                if (num >= 0 && num <= 24) {
                  setDailyConsumptionHours(num.toString());
                } else if (num > 24) {
                  Alert.alert('Você só pode inserir um valor de 0 a 24'); 
                  setDailyConsumptionHours(''); 
                  
                }
              } else {
               
                setDailyConsumptionHours(''); 
               
              }
            }}
          />

          <Text style={styles.inputLabel}>kWh da Etiquetagem Elétrica (Ex. 4.7)</Text>
          <TextInput
            style={styles.input}
            placeholder="Preço"
            keyboardType="numbers-and-punctuation"
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
          <Text style={{marginTop:hp(-1.2), marginBottom:hp(1.5), marginLeft:hp(2)}}>* 0.17 é o valor médio das companhias</Text>

          <Text style={styles.inputLabel}>Dias do mês</Text>
          <TextInput
            style={styles.input}
            placeholder="Dias"
            keyboardType="numeric"
            value={daysOfMonth}
            onChangeText={(value) => {
              if (value === '') {
                setDaysOfMonth(''); 
                return;
              }
              
              if (!isNaN(value)) {
                
                let num = parseInt(value);

                
                if (num >= 0 && num <= 31) {
                  setDaysOfMonth(num.toString()); 
                } else if (num > 31) {
                  Alert.alert('Você só pode inserir um número de 0 a 31'); 
                  setDaysOfMonth('');
                  
                }
              } else {
                
                setDaysOfMonth(''); 
               
              }
            }}
          />

          <Text style={styles.inputLabel}>Taxas / Impostos</Text>
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
              <Text style={styles.resultText}>Custo Total (Em EURO): {result} €</Text>
              <Text style={styles.resultText}>Custo Total (Em kWh): {result} kWh</Text>
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
    textAlign: 'center', 
    marginLeft: hp(-4),
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
    marginTop: hp(5),
    width: wp(90),
    height: hp(20),
    resizeMode: 'stretch',
  },
  scrollviewcontent: {
    flexDirection: 'column',
    paddingBottom: hp(25),
  },
  buttonStyle: {
    height: hp(4), 
    width: hp(4), 
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
    color: 'red', 
    paddingRight: 30, 
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'red', 
    paddingRight: 30, 
  },
});

export default Simulator;
