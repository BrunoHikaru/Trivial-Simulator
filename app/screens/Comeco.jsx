import React from 'react';
import { Text, View, ImageBackground, StyleSheet, Image, TouchableHighlight, TouchableWithoutFeedback } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import EnergyAnimation from '../EnergyAnimation';
import { RFPercentage } from "react-native-responsive-fontsize";
const Comeco = () => {
  const navigation = useNavigation();

  const handleImageClick = () => {
    navigation.navigate('Login');
  };

  return (
    <ImageBackground
      source={require('../../assets/wind_turbine.png')}
      style={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        <EnergyAnimation />
        <View style={styles.textContainer}>
          <Text style={styles.text}>
            Bem-Vindo ao {'\n'}Trivial Simulator
          </Text>
          <Text style={styles.secondText}>
            Siga para a página de Login
          </Text>
        </View>
        <TouchableWithoutFeedback onPress={handleImageClick} underlayColor="transparent">
          <Image source={require('../../assets/next_icon_bright.png')} style={styles.imageIcon} />
        </TouchableWithoutFeedback>
        <LinearGradient
          colors={['transparent', 'rgba(0, 0, 0, 0.4)']}
          style={styles.gradient}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'flex-start', // Alinha os itens à esquerda
  },
  textContainer: {
    marginLeft: wp(8), // Adiciona margem à esquerda para alinhar os textos
    marginTop: hp(-30),
  },
  text: {
    color: 'white',
    fontSize: RFPercentage(4),
    fontWeight: 'bold',
    marginBottom: hp(2), // Adiciona espaçamento entre os textos
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
  },
  imageIcon: {
    height: hp(7),
    width: hp(7),
    marginVertical: hp(7),
    marginLeft: wp(8), // Adiciona margem à esquerda para alinhar a imagem
    borderColor: 'white',
    zIndex: 1,
  },
  secondText: {
    color: '#A9A9A0',
    fontSize: RFPercentage(3),
    fontWeight: 'bold',
    textAlign: 'left', // Alinha o texto à esquerda
  },
});

export default Comeco;
