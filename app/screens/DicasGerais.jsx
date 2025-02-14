import { Text, View, SafeAreaView, StyleSheet, TouchableOpacity, Image, Platform, ScrollView } from 'react-native'
import React, { Component, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { RFPercentage } from 'react-native-responsive-fontsize'

const DicasGerais = () => {
  const navigation = useNavigation()
  const [expandedCard, setExpandedCard] = useState(null);
  const handleCardPress = (cardId) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
  };
  const handleGoBack = () => {
    navigation.navigate('Dicas')
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack}>
          <Image source={require('../../assets/go_back.png')} style={styles.buttonStyle} />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerText}>Dicas Gerais</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentScroll}>
       
        <TouchableOpacity
          style={styles.expandingCard}
          onPress={() => handleCardPress(1)}
        >
          <View style={styles.cardContent}>
            <Image source={require('../../assets/dark_light.jpg')} style={styles.imageCard} />
            <Text style={styles.cardTitle}>Iluminação</Text>
            {expandedCard === 1 && (
              <>
                <Text style={styles.titleText}>
                  Aproveite a luz natural:
                </Text>
                <Text>
                  Sempre que possível, mantenha janelas, cortinas e persianas abertas durante o dia para aproveitar ao máximo a iluminação natural.{'\n'}
                </Text>
                <Text style={styles.titleText}>
                  Use lâmpadas de LED:
                </Text>
                <Text>
                Elas consomem até 80% menos energia e têm uma vida útil mais longa em comparação com as lâmpadas incandescentes.
                </Text>
                <Text style={styles.titleText}>
                  Instale sensores de movimento e temporizadores:
                </Text>
                <Text>
                  Em áreas comuns, como corredores e escadas, sensores garantem que as luzes fiquem acesas apenas quando necessário.
                </Text>
                <Text style={styles.titleText}>
                  Desligue as luzes:
                </Text>
                <Text>
                  Habitue-se a apagar as luzes ao sair de um ambiente.
                </Text>
              </>
            )}
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.expandingCard}
          onPress={() => handleCardPress(2)}
        >
          <View style={styles.cardContent}>
            <Image source={require('../../assets/microwave.jpg')} style={styles.imageCard} />
            <Text style={styles.cardTitle}>Aparelhos e Eletrodomésticos</Text>
            {expandedCard === 2 && (
              <>
                <Text style={styles.titleText}>
                Desconecte equipamentos da tomada:
                </Text>
                <Text>
                Aparelhos em "standby" continuam consumindo energia. Desconecte da tomada o que não está em uso, como carregadores de celular.
                </Text>
                <Text style={styles.titleText}>
                Escolha aparelhos eficientes:
                </Text>
                <Text>
                Ao comprar novos aparelhos, busque os que possuem selo de eficiência energética (como o selo Procel no Brasil), que indicam menor consumo.

                </Text>
                <Text style={styles.titleText}>
                Otimize o uso de eletrodomésticos: 
                </Text>
                <Text>
                Utilize a máquina de lavar roupas ou louça em sua capacidade máxima e, se possível, no modo econômico.
                </Text>
                <Text style={styles.titleText}>
                Regule o termostato de geladeiras e freezers:
                </Text>
                <Text>
                Mantenha a temperatura adequada para evitar que o motor precise trabalhar mais do que o necessário. Evite também abrir a porta frequentemente.
                </Text>
              </>
            )}
          </View>
        </TouchableOpacity>
        </ScrollView>



    </SafeAreaView>
  )

}

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
    marginLeft:hp(-4)
  },
  buttonStyle: {
    justifyContent: 'flex-start',
    height: hp('2%'),
    height: hp(4), 
    width: hp(4), 
  },
  expandingCard: {
    marginTop: hp('2%'),
    padding: wp('4%'),
    backgroundColor: 'rgba(0, 0, 255, 0.4)',
    borderRadius: wp('5%'),
    width: wp('90%'),
    marginHorizontal: wp('5%'),
  },
  cardContent: {
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: RFPercentage(2.5),
    fontWeight: 'bold',
    marginBottom: hp('1%'),
    marginTop: hp('1%'),
    color: 'white'
  },
  cardDetails: {
    fontSize: RFPercentage(2),
  },
  imageCard: {
    height: hp('17%'),
    width: wp('86%'),
    borderWidth: wp('1%'),
    borderColor: 'black',
    marginVertical: hp('1%'),
    marginLeft: wp('1.5%'),
    marginRight: wp('1.5%'),
    borderRadius: wp('7%'),
    resizeMode: 'cover',  
  },
  contentScroll: {
    flexGrow: 1,
    paddingBottom: hp('15%'),
  },
  titleText: {
    textAlign: 'justify',
    fontSize: RFPercentage(2),
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    marginVertical: hp(2),
  },
  
})


export default DicasGerais