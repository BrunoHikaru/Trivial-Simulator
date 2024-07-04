import React, { useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableWithoutFeedback,
  Platform
} from 'react-native';
import { Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';

const Cozinha = () => {
  const [imagemAtual, setImagemAtual] = useState(require('../../assets/cozinha_preenchida.jpg'));

  const trocarImagem = () => {
    // Substitua as imagens conforme necessário
    const novasImagens = [
      require('../../assets/cozinha_preenchida.jpg'),
      require('../../assets/cozinha_vazia.jpg'),
    
    ];

    const indiceAtual = novasImagens.indexOf(imagemAtual);
    const indiceProximaImagem = (indiceAtual + 1) % novasImagens.length;
    setImagemAtual(novasImagens[indiceProximaImagem]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Cozinha</Text>
      </View>

      {/* Imagem clicável */}
      <TouchableWithoutFeedback onPress={trocarImagem}>
        <Image source={imagemAtual} style={styles.imageSize} />
      </TouchableWithoutFeedback>

      <Text style={styles.textStyle}>Dados Estatísticos</Text>
      <Image source={require('../../assets/dados_estatisticos.jpg')} style={styles.imageSize2} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? 0 : 0,
  },
  header: {
    backgroundColor: '#336F95',
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 19,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    width: '101%',
    marginVertical: Platform.OS === 'ios' ? -60 : 0,
    zIndex: 1,
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  imageSize: {
    width: '80%',
    height: 220,
    marginTop: 100,
    marginHorizontal: 100,
  },
  imageSize2: {
    width: '80%',
    height: 300,
  },
  textStyle: {
    fontWeight: 'bold',
    fontSize: 19,
    marginTop: 70,
    marginBottom: 10,
  },
});

export default Cozinha;
