import { Text, View , TouchableOpacity, Alert,StyleSheet,SafeAreaView,Image,TouchableWithoutFeedback} from 'react-native'
import React, { Component, } from 'react'
import { Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';

const Ambiente =()=> {
  const navigation=useNavigation();
  const handleClick=()=>{
    navigation.navigate('cozinha')
  }



    return (
      <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Divisões</Text>
      </View>
      <Text style={styles.textStyle}>Cozinha</Text>
      <TouchableWithoutFeedback onPress={handleClick}>
      <Image source={require('../../assets/cozinha_vazia.jpg')} style={styles.imageSize} />
      </TouchableWithoutFeedback>
      <Text style={styles.textStyle}>Quarto</Text>
      <Image source={require('../../assets/bedroom_vazio.jpg')} style={styles.imageSize2}/>
      </SafeAreaView>
    )
  
}
const styles=StyleSheet.create({
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
    marginVertical: Platform.OS==='ios' ? -60:0,
    zIndex:1
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical:20,
  },
  imageSize:{
    width: '80%',
    height:220,
  
    marginHorizontal:100,
  },
  imageSize2:{
    width: '80%',
    height:220,
    
    
  },
  textStyle:{
    fontWeight:'bold',
    fontSize:19,
    marginTop:70,
    marginBottom:10
  }
})

export default Ambiente;