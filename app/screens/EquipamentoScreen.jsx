import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Platform, Animated, TouchableWithoutFeedback, Image, Keyboard, KeyboardAvoidingView, ImageBackground, TouchableOpacity } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';


const EquipamentoScreen = () => {
  const [searchCriteria, setSearchCriteria] = useState('');
  const [searchResults, setSearchResults] = useState([]);
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
    // Adicione mais exemplos de equipamentos aqui
  ];

  const handleSearch = () => {
    // Filtrar os resultados com base na designação fornecida pelo usuário
    const filteredResults = equipamentos.filter(
      (equipamento) => equipamento.designacao.toLowerCase() === searchCriteria.toLowerCase()
    );

    setSearchResults(filteredResults);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          <ImageBackground source={require('../../assets/smart_home.png')} style={styles.backgroundImage}>
            <TouchableOpacity onPress={handleBackButton}>
              <Image source={require('../../assets/go_back.png')} style={styles.buttonStyle} />
            </TouchableOpacity>
            <View style={styles.searchBarContainer}>
              <TextInput
                placeholder="Digite o critério de pesquisa..."
                value={searchCriteria}
                onChangeText={setSearchCriteria}
                style={styles.searchBar}
              />
              <TouchableOpacity style={styles.button} onPress={handleSearch}>
                <Text style={styles.buttonText}>Pesquisar</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={searchResults}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.equipamentosSearch}>
                  <Text style={styles.textoStyle}>{item.name}</Text>
                  <Text style={styles.textoStyle}>Consumo de energia: {item.powerConsumption}</Text>
                  {/* Adicione mais informações sobre o equipamento aqui */}
                  <Text style={styles.textoStyle}>Marca: {item.marca}</Text>
                </View>
              )}
              ListFooterComponent={ 
                <View style={styles.scrollView}>
                  {/* Este é o componente que atua como a área de pesquisa */}
                </View>
              }
            />

          </ImageBackground>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  searchBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(3),
    marginTop: hp(20),
    padding: wp(5),
  },

  buttonStyle: {
    height: hp(5),
    marginHorizontal: wp(4),
    marginTop: hp(7),
  },
  searchBar: {
    flex: 1,
    backgroundColor: 'lightgray',
    height: hp(7),
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: wp(2),
    paddingHorizontal: wp(3),
    marginRight: wp(2),

  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  textoStyle: {
    color: 'white',

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
  equipamentosSearch: {
    marginTop: hp(2),
    marginHorizontal: wp(6),

  },
  scrollView: {
    paddingBottom: hp(20), // Espaço adicional no final para a rolagem
    
  },

});

export default EquipamentoScreen;
