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
                <Text style={styles.headerText}>Cozinha</Text>
            </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentScroll}>
        
        <TouchableOpacity
          style={styles.expandingCard}
          onPress={() => handleCardPress(1)}
        >
          <View style={styles.cardContent}>
            <Image source={require('../../assets/arcondicionado_copy2.png')} style={styles.imageCard} />
            <Text style={styles.cardTitle}>Frigorífico</Text>
            {expandedCard === 1 && (
              <>
                <Text style={styles.titleText}>
                Evite a abertura frequente da porta:
                </Text>
                <Text>
                Cada vez que a porta é aberta, o frigorífico precisa trabalhar mais para manter a temperatura interna. Tente ser eficiente ao abrir e fechar a porta.{'\n'}
                </Text>
                <Text style={styles.titleText}>
                Mantenha as bobinas do condensador limpas: 
                </Text>
                <Text>
                As bobinas sujas fazem com que o frigorífico trabalhe mais para se manter frio. Limpe regularmente as bobinas localizadas na parte traseira ou na parte inferior do aparelho.
                </Text>
                <Text style={styles.titleText}>
                Verifique a vedação da porta:
                </Text>
                <Text>
                Certifique-se de que a vedação da porta está em boas condições para evitar a fuga de ar frio.{'\n'}
                </Text>
                <Text style={styles.titleText}>
                Descongele regularmente:
                </Text>
                <Text>
                Se o seu frigorífico não tem descongelação automática, descongele-o regularmente para garantir que o gelo não se acumule, o que aumenta o consumo de energia.
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
            <Image source={require('../../assets/laptop_2.png')} style={styles.imageCard} />
            <Text style={styles.cardTitle}>Chaleira eletrica</Text>
            {expandedCard === 2 && (
            <>
              <Text style={styles.titleText}>
              Encha apenas o necessário:
              </Text>
              <Text>
              Encha a chaleira com a quantidade de água necessária para a quantidade de bebida desejada, evitando encher demais, o que levaria mais tempo para ferver e consumir mais energia.{'\n'}
              </Text>
              <Text style={styles.titleText}>
              Use a quantidade certa de água: 
              </Text>
              <Text>
              Use a marcação de nível na chaleira para aquecer a quantidade correta de água, evitando desperdício e economizando energia.
              </Text>
              <Text style={styles.titleText}>
              Escolha uma chaleira com bom isolamento:
              </Text>
              <Text>
              Se possível, opte por uma chaleira com bom isolamento térmico para manter a água quente por mais tempo, reduzindo a necessidade de reaquecer.{'\n'}
              </Text>
              <Text style={styles.titleText}>
              Limpe regularmente:
              </Text>
              <Text>
              Mantenha a chaleira limpa, especialmente a base e o elemento de aquecimento, para garantir um funcionamento eficiente e econômico.
              </Text>
            </>
            )}
          </View>
        </TouchableOpacity>

       
        <TouchableOpacity
          style={styles.expandingCard}
          onPress={() => handleCardPress(3)}
        >
          <View style={styles.cardContent}>
            <Image source={require('../../assets/console.png')} style={styles.imageCard} />
            <Text style={styles.cardTitle}>Microondas</Text>
            {expandedCard === 3 && (
              <>
              <Text style={styles.titleText}>
              Use recipientes adequados:
              </Text>
              <Text>
              Utilize recipientes que são seguros para uso no micro-ondas e que permitam o aquecimento uniforme dos alimentos. Isso reduz a quantidade de tempo necessária para aquecer ou cozinhar os alimentos, economizando energia.{'\n'}
              </Text>
              <Text style={styles.titleText}>
              Limpe regularmente:
              </Text>
              <Text>
              Mantenha o interior e a vedação da porta do micro-ondas limpos para garantir um funcionamento eficiente. Resíduos de alimentos podem aumentar o tempo de cozimento e consumo de energia.
              </Text>
              <Text style={styles.titleText}>
              Desligue o micro-ondas quando não estiver em uso:
              </Text>
              <Text>
              Certifique-se de desligar o micro-ondas da tomada quando não estiver em uso, pois mesmo em standby, o aparelho consome energia.{'\n'}
              </Text>
              
            </>
            )}
          </View>
        </TouchableOpacity>

       
        <TouchableOpacity
          style={styles.expandingCard}
          onPress={() => handleCardPress(4)}
        >
          <View style={styles.cardContent}>
            <Image source={require('../../assets/tv_moderna.png')} style={styles.imageCard} />
            <Text style={styles.cardTitle}>Máquina de Lavar Loiça</Text>
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

       
        <TouchableOpacity
          style={styles.expandingCard}
          onPress={() => handleCardPress(5)}
        >
          <View style={styles.cardContent}>
            <Image source={require('../../assets/tv_moderna.png')} style={styles.imageCard} />
            <Text style={styles.cardTitle}>Máquina de Lavar Roupa</Text>
            {expandedCard === 5 && (
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

       
        <TouchableOpacity
          style={styles.expandingCard}
          onPress={() => handleCardPress(6)}
        >
          <View style={styles.cardContent}>
            <Image source={require('../../assets/tv_moderna.png')} style={styles.imageCard} />
            <Text style={styles.cardTitle}>Forno</Text>
            {expandedCard === 6 && (
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
    textAlign: 'center', 
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
    height: hp(4), 
    width: hp(4), 
  },
});

export default Quarto;
