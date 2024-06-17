import { Button, Text, View } from 'react-native'
import React, { Component } from 'react'
import { NavigationProp } from '@react-navigation/native';
import {FIREBASE_AUTH} from '../../FirebaseConfig';




interface RouterProps{
    navigation:NavigationProp<any,any>;
}

const List =({navigation}: RouterProps) => {
    return (
        <View style={{flex:1,justifyContent:'center', alignItems:'center'}}>
          <Button onPress={()=> navigation.navigate('details')} title="Open Details"/>
          <Button onPress={()=> FIREBASE_AUTH.signOut()} title="Logout"/>
          <Text>{JSON.stringify(FIREBASE_AUTH.currentUser?.email)}</Text>
          
        </View>
        
    );
};
    


export default List; 