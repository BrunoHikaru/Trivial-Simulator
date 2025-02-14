import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Platform, Animated, TouchableWithoutFeedback, Image, Keyboard, KeyboardAvoidingView, ImageBackground, ScrollView, TouchableOpacity } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';


const EquipamentoScreen = () => {
  const [searchCriteria, setSearchCriteria] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedDesignacao, setSelectedDesignacao] = useState('');
  const navigation = useNavigation();

  function handleBackButton() {
    navigation.goBack();
  }

  const equipamentos = [
    { id: 1, name: 'Inspiron', powerConsumption: '100W', marca: 'Dell', designacao: 'Notebook' },
    { id: 2, name: 'S200', powerConsumption: '50W', marca: 'Samsung', designacao: 'Tablet' },
    { id: 3, name: 'Galaxy Tab A9', powerConsumption: '60W', marca: 'Samsung', designacao: 'Tablet' },
    { id: 4, name: 'Victus Gaming Laptop 16-r1006np (9R5X8EA)', powerConsumption: '230w', marca: 'HP', designacao: 'Notebook' },
    { id: 5, name: 'KRUPS NESPRESSO VERTUO PLUS XN9038P3', powerConsumption: '1260W', marca: 'Nespresso', designacao: 'Cafeteira' },
    { id: 6, name: 'MÁQUINA CAFÉ SACO ELECTRONIA CM6616-15', powerConsumption: '1000W', marca: 'Electronia', designacao: 'Cafeteira' },
    { id: 7, name: 'KRUPS NESPRESSO ESSENZA MINI XN110110', powerConsumption: '1310w', marca: 'Nespresso', designacao: 'Cafeteira' },
    { id: 8, name: 'DIMOBILLI D6 PR', powerConsumption: '1200w', marca: 'DIMOBILLI', designacao: 'Cafeteira' },
    { id: 9, name: 'KRUPS DG KP2431P16', powerConsumption: '1600w', marca: 'Krups', designacao: 'Cafeteira' },

    { id: 10, name: 'MacBook Air M1', powerConsumption: '30W', marca: 'Apple', designacao: 'Notebook' },
    { id: 11, name: 'Lenovo ThinkPad X1 Nano', powerConsumption: '45W', marca: 'Lenovo', designacao: 'Notebook' },
    { id: 12, name: 'Samsung Galaxy S21', powerConsumption: '15W', marca: 'Samsung', designacao: 'Telemóvel' },
    { id: 13, name: 'iPhone 13', powerConsumption: '20W', marca: 'Apple', designacao: 'Telemóvel' },
    { id: 14, name: 'Huawei P40 Lite', powerConsumption: '18W', marca: 'Huawei', designacao: 'Telemóvel' },
    { id: 15, name: 'Microsoft Surface Go 3', powerConsumption: '45W', marca: 'Microsoft', designacao: 'Tablet' },
    { id: 16, name: 'Xiaomi Mi Pad 5', powerConsumption: '30W', marca: 'Xiaomi', designacao: 'Tablet' },
    { id: 17, name: 'LG 24MP88HV-S', powerConsumption: '23W', marca: 'LG', designacao: 'Monitor' },
    { id: 18, name: 'Dell UltraSharp U2419H', powerConsumption: '20W', marca: 'Dell', designacao: 'Monitor' },
    { id: 19, name: 'AOC 27V2H', powerConsumption: '22W', marca: 'AOC', designacao: 'Monitor' },
    { id: 20, name: 'LG OLED55C1', powerConsumption: '97W', marca: 'LG', designacao: 'Televisão' },
    { id: 21, name: 'Samsung QN55Q60TAFXZA', powerConsumption: '110W', marca: 'Samsung', designacao: 'Televisão' },
    { id: 22, name: 'TCL 55S425', powerConsumption: '75W', marca: 'TCL', designacao: 'Televisão' },
    { id: 23, name: 'Xiaomi Mi TV P1 43"', powerConsumption: '95W', marca: 'Xiaomi', designacao: 'Televisão' },
    { id: 24, name: 'Panasonic NN-SN686S', powerConsumption: '1200W', marca: 'Panasonic', designacao: 'Microondas' },
    { id: 25, name: 'Toshiba EM925A5A-BS', powerConsumption: '900W', marca: 'Toshiba', designacao: 'Microondas' },
    { id: 26, name: 'Samsung MG23K3575AS', powerConsumption: '800W', marca: 'Samsung', designacao: 'Microondas' },
    { id: 27, name: 'LG LFXS28968S', powerConsumption: '120W', marca: 'LG', designacao: 'Frigorífico' },
    { id: 28, name: 'Whirlpool WRS321SDHZ', powerConsumption: '140W', marca: 'Whirlpool', designacao: 'Frigorífico' },
    { id: 29, name: 'Samsung RF28R6201SR', powerConsumption: '150W', marca: 'Samsung', designacao: 'Frigorífico' },
    { id: 30, name: 'Electrolux ERF4113AOW', powerConsumption: '130W', marca: 'Electrolux', designacao: 'Frigorífico' },
    { id: 31, name: 'Philips 243V7QJAB', powerConsumption: '17W', marca: 'Philips', designacao: 'Monitor' },
    { id: 32, name: 'Asus ZenScreen MB16AC', powerConsumption: '15W', marca: 'Asus', designacao: 'Monitor' },
    { id: 33, name: 'Xiaomi Redmi Note 10', powerConsumption: '18W', marca: 'Xiaomi', designacao: 'Telemóvel' },
    { id: 34, name: 'OnePlus 9', powerConsumption: '20W', marca: 'OnePlus', designacao: 'Telemóvel' },

    { id: 35, name: 'Dell Latitude 5410', powerConsumption: '60W', marca: 'Dell', designacao: 'Notebook' },
    { id: 36, name: 'HP Pavilion 15', powerConsumption: '55W', marca: 'HP', designacao: 'Notebook' },
    { id: 37, name: 'iPhone SE 2022', powerConsumption: '18W', marca: 'Apple', designacao: 'Telemóvel' },
    { id: 38, name: 'Google Pixel 6a', powerConsumption: '18W', marca: 'Google', designacao: 'Telemóvel' },
    { id: 39, name: 'Asus Vivobook 15', powerConsumption: '45W', marca: 'Asus', designacao: 'Notebook' },
    { id: 40, name: 'Samsung Galaxy Tab S6 Lite', powerConsumption: '25W', marca: 'Samsung', designacao: 'Tablet' },
    { id: 41, name: 'Amazon Fire HD 10', powerConsumption: '20W', marca: 'Amazon', designacao: 'Tablet' },
    { id: 42, name: 'LG G8 ThinQ', powerConsumption: '15W', marca: 'LG', designacao: 'Telemóvel' },
    { id: 43, name: 'Hisense 55U6G', powerConsumption: '100W', marca: 'Hisense', designacao: 'Televisão' },
    { id: 44, name: 'Sony XBR-55X900F', powerConsumption: '105W', marca: 'Sony', designacao: 'Televisão' },
    { id: 45, name: 'Toshiba 32LF221U21', powerConsumption: '50W', marca: 'Toshiba', designacao: 'Televisão' },
    { id: 46, name: 'Electrolux EW6F4923EB', powerConsumption: '850W', marca: 'Electrolux', designacao: 'Máquina de Lavar Roupas' },
    { id: 47, name: 'Samsung WW80J5555MW', powerConsumption: '900W', marca: 'Samsung', designacao: 'Máquina de Lavar Roupas' },
    { id: 48, name: 'Bosch WGA254X0ES', powerConsumption: '1000W', marca: 'Bosch', designacao: 'Máquina de Lavar Roupas' },
    { id: 49, name: 'Beko DS7534CX0', powerConsumption: '1500W', marca: 'Beko', designacao: 'Máquina de Secar Roupas' },
    { id: 50, name: 'Samsung DV80TA020TE', powerConsumption: '1300W', marca: 'Samsung', designacao: 'Máquina de Secar Roupas' },
    { id: 51, name: 'Electrolux EW7H5824EB', powerConsumption: '1400W', marca: 'Electrolux', designacao: 'Máquina de Secar Roupas' },
    { id: 52, name: 'Philco PH8000', powerConsumption: '800W', marca: 'Philco', designacao: 'Liquidificador' },
    { id: 53, name: 'Mondial Turbo L-1000', powerConsumption: '600W', marca: 'Mondial', designacao: 'Liquidificador' },
    { id: 54, name: 'Britânia Diamante Black Filter', powerConsumption: '900W', marca: 'Britânia', designacao: 'Liquidificador' },
    { id: 55, name: 'LG Dual Inverter 12.000 BTU', powerConsumption: '950W', marca: 'LG', designacao: 'Ar Condicionado' },
    { id: 56, name: 'Samsung WindFree 9000 BTU', powerConsumption: '1000W', marca: 'Samsung', designacao: 'Ar Condicionado' },
    { id: 57, name: 'Midea Liva Eco 9000 BTU', powerConsumption: '850W', marca: 'Midea', designacao: 'Ar Condicionado' },
    { id: 58, name: 'Philips ', powerConsumption: '17W', marca: 'Philips', designacao: 'Monitor' },
    { id: 59, name: 'Asus ', powerConsumption: '15W', marca: 'Asus', designacao: 'Monitor' }
  ];


  const designacoes = [
    { label: 'Notebook', value: 'Notebook' },
    { label: 'Tablet', value: 'Tablet' },
    { label: 'Telemóvel', value: 'Telemóvel' },
    { label: 'Cafeteira', value: 'Cafeteira' },
    { label: 'Microondas', value: 'Microondas' },
    { label: 'Frigorífico', value: 'Frigorífico' },
    { label: 'Monitor', value: 'Monitor' },
    { label: 'Televisão', value: 'Televisão' },
    { label: 'Máquina de Lavar Roupas', value: 'Máquina de Lavar Roupas' },
    { label: 'Máquina de Secar Roupas', value: 'Máquina de Secar Roupas' },
    { label: 'Liquidificador', value: 'Liquidificador' },
    { label: 'Ar Condicionado', value: 'Ar Condicionado' }
  ];

  const handleSearch = () => {
    
    const filteredResults = equipamentos.filter(
      (equipamento) => equipamento.designacao.toLowerCase() === selectedDesignacao.toLowerCase()
    );

    setSearchResults(filteredResults);
  };

  return (

    <View style={{ flex: 1 }}>
      <ImageBackground source={require('../../assets/smart_home.png')} style={styles.backgroundImage}>
        <TouchableOpacity onPress={handleBackButton}>
          <Image source={require('../../assets/go_back.png')} style={styles.buttonStyle} />
        </TouchableOpacity>

        <View style={styles.searchBarContainer}>
          <RNPickerSelect
            onValueChange={(value) => setSelectedDesignacao(value)}
            items={designacoes}
            placeholder={{ label: 'Selecione uma designação', value: null }}
            style={pickerSelectStyles}
          />
          <TouchableOpacity style={styles.button} onPress={handleSearch}>
            <Text style={styles.buttonText}>Pesquisar</Text>
          </TouchableOpacity>
        </View>


        <View style={{ flex: 1 }}>
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardText}>Consumo: {item.powerConsumption}</Text>
                <Text style={styles.cardText}>Marca: {item.marca}</Text>
              </View>
            )}
            contentContainerStyle={{ paddingBottom: hp(20) }}
            keyboardShouldPersistTaps="handled"

          />
        </View>
      </ImageBackground>
    </View>

  );
};

const styles = StyleSheet.create({
  searchBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(3),
    marginTop: hp(10),
    padding: wp(5),
  },
  buttonStyle: {
    height: hp(5),
    marginHorizontal: wp(4),
    marginTop: hp(7),
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  button: {
    backgroundColor: '#5175c6',
    borderRadius: wp(2),
    paddingVertical: hp(2),
    paddingHorizontal: wp(3),
  },
  buttonText: {
    color: 'white',
    fontSize: RFPercentage(2),
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: wp(4),
    margin: wp(2),
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
    width: wp(90),
    marginHorizontal: wp(5)
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: RFPercentage(2.5),
    marginBottom: hp(1),
  },
  cardText: {
    fontSize: RFPercentage(2),
    color: 'gray',
  },
  scrollView: {
    paddingBottom: hp(20),
  },
});


const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: RFPercentage(2),
    paddingVertical: hp(2),
    paddingHorizontal: wp(3),
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    color: 'black',
    paddingRight: 30, 
    width: wp(63),
    backgroundColor: 'white',
  },
  inputAndroid: {
    fontSize: RFPercentage(2),
    paddingVertical: hp(2),
    paddingHorizontal: wp(3),
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    color: 'black',
    paddingRight: 30, 
  },
});
export default EquipamentoScreen;
