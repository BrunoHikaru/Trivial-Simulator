import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './app/screens/Login';
import List from './app/screens/List';
import { User, onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { FIREBASE_AUTH } from './FirebaseConfig';
import Home from './app/screens/Home';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, FontAwesome5, Feather, Entypo,AntDesign,Foundation  } from '@expo/vector-icons'; // Import icons
import Profile from './app/screens/Profile';
import Statistics from './app/screens/Statistics';
import Simulator from './app/screens/Simulator';
import EletrodomesticosForm from './app/screens/EletrodomesticosForm';
import { View, StyleSheet, Text, TouchableOpacity, StatusBar, Platform } from 'react-native';
import Ambiente from './app/screens/Ambiente';
import Comeco from './app/screens/Comeco';
import Dicas from './app/screens/Dicas';
import getJson from './app/screens/getJson';
import cozinha from './app/screens/cozinha';
import DicasGerais from './app/screens/DicasGerais';
import Quarto from './app/screens/Quarto';
import NovaTela from './app/screens/NovaTela';
import FormEquipamentos from './app/screens/FormEquipamentos';
import Simuladores from './app/screens/Simuladores';
import EstatisticasCalculo from './app/screens/EstatisticasCalculo';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import EquipamentoScreen from './app/screens/EquipamentoScreen';
import CozinhaDicas from './app/screens/CozinhaDicas';


const dicasStack=createNativeStackNavigator();

const stack=createNativeStackNavigator();

const Tab=createBottomTabNavigator();

const Stack=createNativeStackNavigator();

const InsideStack=createNativeStackNavigator();

const TabNavigator=createNativeStackNavigator();

var iconHeight=26;
var iconWidth=26;

function simuladores(){
  return(
    <TabNavigator.Navigator>
      <Stack.Screen name='Simuladores' component={Simuladores} options={{headerShown:false}}/>
      <Stack.Screen name='Simulator' component={Simulator} options={{headerShown:false}}/>
      <Stack.Screen name='EletrodomesticosForm' component={EletrodomesticosForm} options={{headerShown:false}}/>
      <Stack.Screen name='FormEquipamentos' component={FormEquipamentos} options={{headerShown:false}}/>
    </TabNavigator.Navigator>
  )
}

function comoPoupar(){
  return(
    <dicasStack.Navigator>
      <Stack.Screen name='Dicas' component={Dicas} options={{headerShown:false}}/>
      <Stack.Screen name='DicasGerais' component={DicasGerais} options={{headerShown:false}}/>
      <Stack.Screen name='Quarto' component={Quarto} options={{headerShown:false}}/>
      <Stack.Screen name='CozinhaDicas' component={CozinhaDicas} options={{headerShown:false}}/>
      
      
    </dicasStack.Navigator>
  )
}

function HomeNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
      <Stack.Screen name="Ambiente" component={Ambiente} options={{ headerShown: false }} />
      <Stack.Screen name='Comeco' component={Comeco} options={{headerShown:false}}/>
      <Stack.Screen name='Dicas' component={Dicas} options={{headerShown:false}}/>
      <Stack.Screen name='getJson' component={getJson} options={{headerShown:false}}/>
      <Stack.Screen name='cozinha' component={cozinha} options={{headerShown:false}}/>
      <Stack.Screen name='DicasGerais' component={DicasGerais} options={{headerShown:false}}/>
      <Stack.Screen name='Quarto' component={Quarto} options={{headerShown:false}}/>
      <Stack.Screen name='NovaTela' component={NovaTela} options={{headerShown:false}}/>
      <Stack.Screen name='FormEquipamentos' component={FormEquipamentos} options={{headerShown:false}}/>
      <Stack.Screen name='EletrodomesticosForm' component={EletrodomesticosForm} options={{headerShown:false}}/>
      <Stack.Screen name='Simuladores' component={Simuladores} options={{headerShown:false}}/>
      <Stack.Screen name='Simulator' component={Simulator} options={{headerShown:false}}/>
      <Stack.Screen name='Statistics' component={Statistics} options={{headerShown:false}}/>
      <Stack.Screen name='EstatisticasCalculo' component={EstatisticasCalculo} options={{headerShown:false}}/>
      <Stack.Screen name='EquipamentoScreen' component={EquipamentoScreen} options={{headerShown:false}}/>
      <Stack.Screen name='Profile' component={Profile} options={{headerShown:false}}/>
      {/* Adicione mais telas específicas da Statistics aqui, se necessário */}
    </Stack.Navigator>
  );
}

function StatisticsNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Statistics" component={Statistics} options={{ headerShown: false }} />
      <Stack.Screen name="List" component={List} options={{ headerShown: false }} />
      
      {/* Adicione mais telas específicas da Statistics aqui, se necessário */}
    </Stack.Navigator>
  );
}




export default function App() {
  
  const [user,setUser]=useState<User | null>(null);

  useEffect(()=>{
    onAuthStateChanged(FIREBASE_AUTH,(user)=>{
      console.log('user',user);
      setUser(user);
    });
    },[]);
  
  return (
    
    <NavigationContainer >
        {user ? (
          <Tab.Navigator screenOptions={{ 
            tabBarStyle: { backgroundColor: 'white',position: 'absolute', bottom: 25, left: 30, right: 30, elevation: 8, borderRadius:25, marginTop:17}, // Set background color
            tabBarActiveTintColor: '#5F8CA6', // Set active icon color
            tabBarInactiveTintColor: 'gray', // Set inactive icon color
          }}>
            
            <Tab.Screen name="Home" component={HomeNavigator} options={{headerShown: false ,tabBarIcon:({color,size})=>(
              <Ionicons name='home' size={size} color={color}/>
            ),}} />
            <Tab.Screen name="Simuladores" component={simuladores} options={{headerShown: false ,tabBarIcon:({color,size})=>(
              <Ionicons name='game-controller' size={size} color={color}/>
            
            ),}} />
            <Tab.Screen name="Dicas" component={comoPoupar} options={{headerShown: false ,tabBarIcon:({color,size})=>(
              <Foundation name="lightbulb" size={size} color={color} />
            ),}} />
            <Tab.Screen name="Perfil" component={Profile} options={{ headerShown: false ,tabBarIcon:({color,size})=>(
              <FontAwesome5 name='user-alt' size={size} color={color}/>
            ),}} />
            
           
            
          </Tab.Navigator>
        ):(
          <Stack.Navigator initialRouteName='Comeco'>
            <Tab.Screen name="Comeco" component={Comeco} options={{ headerShown: false }} />
            <Tab.Screen name="Login" component={Login} options={{ headerShown: false }} />
            
          </Stack.Navigator>
        )}
        
      
    </NavigationContainer>
 
  );
};