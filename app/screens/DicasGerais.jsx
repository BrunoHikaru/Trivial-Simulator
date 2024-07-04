import { Text, View,SafeAreaView,StyleSheet,TouchableOpacity,Image, Platform} from 'react-native'
import React, { Component } from 'react'
import { useNavigation } from '@react-navigation/native'

const DicasGerais =()=> {
    const navigation=useNavigation()
    const handleGoBack=()=>{
        navigation.navigate('Dicas')
    }

    return (
        <SafeAreaView style={styles.container}>
      <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack}>
            <Image source={require('../../assets/go_back.png')} style={styles.buttonStyle} />
          </TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.headerText}>Dicas Gerais</Text>
        </View>
      </View>
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
        zIndex:1,
        flexDirection:'row'
      },
      headerText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical:20,
      },
      buttonStyle:{
        justifyContent:'flex-start',
        height:15,
        marginHorizontal:-100,
      },
})


export default DicasGerais