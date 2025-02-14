import React, { useState } from 'react';
import { Text, View, StyleSheet, SafeAreaView, TouchableOpacity, Platform, Image, ScrollView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFPercentage } from "react-native-responsive-fontsize";

const Dicas = () => {
  const navigation = useNavigation();

  const [showMoreInfoGeral, setShowMoreInfoGeral] = useState(false);
  const [showMoreInfoQuarto, setShowMoreInfoQuarto] = useState(false);
  const [showMoreInfoCozinha, setShowMoreInfoCozinha] = useState(false);

  const handleCardPress = (cardType) => {
    switch (cardType) {
      case 'Geral':
        navigation.navigate('DicasGerais');
        break;
      case 'Quarto':
        navigation.navigate('Quarto');
        break;
      case 'Cozinha':
        navigation.navigate('CozinhaDicas');
        break;
      default:
        break;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Como Poupar?</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollStyle}>
        <TouchableOpacity
          style={[styles.cardContainer, { backgroundColor: 'rgba(0, 0, 255, 0.4)' }]}
          onPress={() => handleCardPress('Geral')}
        >
          <View style={styles.cardContent}>
            <Text style={styles.textContainer}>Geral</Text>
          </View>
        </TouchableOpacity>

        {showMoreInfoGeral && (
          <View style={styles.moreinfoContainer}>
            <Text>Informações adicionais sobre Geral</Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.cardContainerQuarto, { backgroundColor: 'rgba(0, 0, 255, 0.4)' }]}
          onPress={() => handleCardPress('Quarto')}
        >
          <View style={styles.cardContent}>
            <Image source={require('../../assets/quarto_moderno.png')} style={styles.imageCard} />
            <Text style={styles.textContainerQuarto}>Quarto / Sala</Text>
          </View>
        </TouchableOpacity>

        {showMoreInfoQuarto && (
          <View style={styles.moreinfoContainer}>
            <Text>Informações adicionais sobre Quarto / Sala</Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.cardContainerCozinha, { backgroundColor: 'rgba(0, 0, 255, 0.3)' }]}
          onPress={() => handleCardPress('Cozinha')}
        >
          <View style={styles.cardContent}>
            <Image source={require('../../assets/Cozinha.png')} style={styles.imageCard} />
            <Text style={styles.textContainerQuarto}>Cozinha</Text>
          </View>
        </TouchableOpacity>

        {showMoreInfoCozinha && (
          <View style={styles.moreinfoContainer}>
            <Text>Informações adicionais sobre Cozinha</Text>
          </View>
        )}
      </ScrollView>
     
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? 0 : 0,
  },
  header: {
    backgroundColor: '#336F95',
    paddingVertical: hp(3),
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: wp(0),
    borderTopRightRadius: wp(0),
    borderRadius:wp(5),
    height: hp(15),
    marginTop: Platform.OS === 'ios' ? hp(-7) : 0,
    marginBottom: hp(2),
  },
  headerText: {
    color: '#fff',
    fontSize: RFPercentage(3),
    fontWeight: 'bold',
  },
  cardContainer: {
    borderRadius: wp(2),
    margin: wp(4),
    height: hp(8),
    overflow: 'hidden',
    marginVertical: hp(1),
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    color: 'white',
    textAlign: 'center',
    fontSize: Platform.OS==='ios'?RFPercentage(2):RFPercentage(2)+Platform.OS==='android'?RFPercentage(3):RFPercentage(3) ,
    fontWeight: 'bold',
  },
  cardContainerQuarto: {
    borderRadius: wp(2),
    margin: wp(4),
    height: hp(35),
    overflow: 'hidden',
    marginVertical: hp(1),
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainerQuarto: {
    color: 'white',
    textAlign: 'center',
    fontSize: Platform.OS==='ios'?RFPercentage(2):RFPercentage(2)+Platform.OS==='android'?RFPercentage(3):RFPercentage(3) ,
    fontWeight: 'bold',
    marginVertical: hp(3),
  },
  imageCard: {
    height: hp(20),
    width: wp(80),
    marginVertical: hp(1),
    borderRadius: wp(2),
  },
  cardContainerCozinha: {
    borderRadius: wp(2),
    margin: wp(4),
    height: hp(35),
    overflow: 'hidden',
    marginVertical: hp(1),
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollStyle: {
    paddingBottom: hp(20),
  },
  moreinfoContainer: {
    backgroundColor: 'rgba(0, 0, 255, 0.3)',
    paddingHorizontal: wp(12),
    margin: wp(4),
    marginBottom: hp(6),
    borderRadius: wp(2),
    paddingVertical: hp(2),
  },
});

export default Dicas;
