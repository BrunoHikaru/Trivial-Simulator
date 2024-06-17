import React, { useState } from 'react';
import { Text, View, StyleSheet, SafeAreaView, TouchableOpacity, Platform, Image, ScrollView, ImageBackground } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { RFPercentage } from "react-native-responsive-fontsize";

const Quarto = () => {
  const navigation = useNavigation();
  const [expandedCard, setExpandedCard] = useState(null);

  const handleGoBack = () => {
    navigation.goBack();
  }

  const handleCardPress = (cardId) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
      <TouchableOpacity onPress={handleGoBack}>
              <Image source={require('../../assets/go_back.png')} style={styles.buttonStyle} />
            </TouchableOpacity>
            <View style={styles.headerTextContainer}>
                <Text style={styles.headerText}>Quarto / Sala</Text>
            </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentScroll}>
        {/* Cartão expansível 1 */}
        <TouchableOpacity
          style={styles.expandingCard}
          onPress={() => handleCardPress(1)}
        >
          <View style={styles.cardContent}>
            <Image source={require('../../assets/arcondicionado_copy2.png')} style={styles.imageCard} />
            <Text style={styles.cardTitle}>Ar Condicionado</Text>
            {expandedCard === 1 && (
              <>
                <Text style={styles.titleText}>
                  Manutenção regular:
                </Text>
                <Text>
                  Limpe regularmente os filtros do ar condicionado. Filtros sujos reduzem a eficiência do aparelho, fazendo com que ele trabalhe mais para manter a temperatura desejada.{'\n'}
                </Text>
                <Text style={styles.titleText}>
                  Programação adequada:
                </Text>
                <Text>
                  Utilize programadores de tempo ou termostatos programáveis para ajustar automaticamente a temperatura quando você não estiver em casa. Isso evita o funcionamento desnecessário do ar condicionado.
                </Text>
              </>
            )}
          </View>
        </TouchableOpacity>

        {/* Cartão expansível 2 */}
        <TouchableOpacity
          style={styles.expandingCard}
          onPress={() => handleCardPress(2)}
        >
          <View style={styles.cardContent}>
            <Image source={require('../../assets/laptop_2.png')} style={styles.imageCard} />
            <Text style={styles.cardTitle}>Computador / Notebook</Text>
            {expandedCard === 2 && (
            <>
              <Text style={styles.titleText}>
              Ajuste as configurações de energia:
              </Text>
              <Text>
              Configure seu notebook para entrar em modo de espera ou hibernação após um período de inatividade. Reduza o brilho da tela e ajuste as configurações de suspensão para economizar energia quando não estiver em uso.{'\n'}
              </Text>
              <Text style={styles.titleText}>
              Limpe regularmente:
              </Text>
              <Text>
              Mantenha as aberturas de ventilação do seu notebook limpas para garantir uma circulação de ar adequada. Isso ajuda a prevenir o superaquecimento e a reduzir o esforço do ventilador, economizando energia.
              </Text>
              <Text style={styles.titleText}>
              Utilize o modo de economia de energia:
              </Text>
              <Text>
              Muitos sistemas operacionais oferecem um modo de economia de energia que ajusta automaticamente as configurações do sistema para reduzir o consumo de energia. Ative esse modo quando estiver trabalhando com tarefas menos intensivas em recursos.{'\n'}
              </Text>
              <Text style={styles.titleText}>
              Considere a substituição da bateria quando necessário:
              </Text>
              <Text>
              Se a bateria do seu notebook não estiver mais segurando a carga por um período significativo, considere substituí-la. Uma bateria antiga e desgastada pode exigir mais energia para manter o notebook funcionando, reduzindo a eficiência energética geral.
              </Text>
            </>
            )}
          </View>
        </TouchableOpacity>

        {/* Cartão expansível 3 */}
        <TouchableOpacity
          style={styles.expandingCard}
          onPress={() => handleCardPress(3)}
        >
          <View style={styles.cardContent}>
            <Image source={require('../../assets/console.png')} style={styles.imageCard} />
            <Text style={styles.cardTitle}>Videogame</Text>
            {expandedCard === 3 && (
              <>
              <Text style={styles.titleText}>
              Desligue quando não estiver em uso:
              </Text>
              <Text>
              Certifique-se de desligar completamente o videogame quando não estiver jogando. Muitos consoles consomem energia em modo de espera, então desconectá-los da energia quando não estiverem em uso pode ajudar a economizar energia.{'\n'}
              </Text>
              <Text style={styles.titleText}>
              Aproveite a configuração de economia de energia:
              </Text>
              <Text>
              Muitos videogames têm configurações que permitem reduzir o consumo de energia. Verifique as opções de economia de energia no menu de configurações e ajuste conforme necessário.
              </Text>
              <Text style={styles.titleText}>
              Mantenha o console limpo e ventilado:
              </Text>
              <Text>
              Evite obstruir as saídas de ar do console para garantir que ele funcione de forma eficiente. Um console que superaquece pode consumir mais energia.{'\n'}
              </Text>
              <Text style={styles.titleText}>
              Desative as funções extras:
              </Text>
              <Text>
              Alguns consoles têm recursos como luzes de LED ou funcionalidades extras que consomem energia. Desativar ou reduzir essas opções pode ajudar a economizar energia.
              </Text>
            </>
            )}
          </View>
        </TouchableOpacity>

        {/* Cartão expansível 4 */}
        <TouchableOpacity
          style={styles.expandingCard}
          onPress={() => handleCardPress(4)}
        >
          <View style={styles.cardContent}>
            <Image source={require('../../assets/tv_moderna.png')} style={styles.imageCard} />
            <Text style={styles.cardTitle}>Televisão</Text>
            {expandedCard === 4 && (
              <>
              <Text style={styles.titleText}>
              Ajuste o brilho e contraste:
              </Text>
              <Text>
              Reduzir o brilho e o contraste da televisão pode ajudar a reduzir o consumo de energia. Muitas televisões também têm modos de economia de energia que ajustam automaticamente essas configurações.{'\n'}
              </Text>
              <Text style={styles.titleText}>
              Desative o modo de espera:
              </Text>
              <Text>
              Desligar completamente a televisão em vez de deixá-la em modo de espera pode economizar uma quantidade significativa de energia ao longo do tempo.
              </Text>
              <Text style={styles.titleText}>
              Utilize um filtro de linha:
              </Text>
              <Text>
              Conectar a televisão a um filtro de linha ou régua de energia pode ajudar a evitar o consumo de energia em modo de espera, ao cortar o fornecimento de energia quando a TV não está em uso.{'\n'}
              </Text>
              
            </>
            )}
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
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
  buttonStyle: {
    justifyContent: 'flex-start',
    height: hp('2%'),
    marginHorizontal: -wp('8%'),
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
  buttonStyle: {
    height: hp(4), // ajuste a altura conforme necessário
    width: hp(4), // ajuste a largura conforme necessário
  },
});

export default Quarto;
