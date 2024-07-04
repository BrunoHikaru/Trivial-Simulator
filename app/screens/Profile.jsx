import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import * as Animatable from 'react-native-animatable';
import EnergyAnimation from '../EnergyAnimation';
import { Fontisto } from '@expo/vector-icons';

const Profile = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        navigation.navigate('Login');
      }
    });

    return () => unsubscribe();
  }, [navigation]);

  useFocusEffect(() => {
    // Reiniciar a animação quando a tela for focada
    // Você pode adicionar qualquer lógica de reinício de animação aqui, se necessário
    return () => {
      // Limpar quaisquer recursos quando a tela perder o foco
    };
  });

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  const handleLogout = () => {
    FIREBASE_AUTH.signOut();
  };

  const handleEquipamentos = () => {
    navigation.navigate('FormEquipamentos');
  };

  const handleInserirEquipamentos = () => {
    navigation.navigate('EletrodomesticosForm');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Profile</Text>
      </View>
      <Text>{'\n\n\n'}</Text>
      
      <View style={styles.headerContent}>
        <Image
          style={styles.profileImage}
          source={require('../../assets/userimage.jpg')}
        />
        <Text style={styles.profileName}>{user?.displayName}</Text>
        
      </View>
      
      <View style={styles.body}>
        {/* Seção de informações do perfil */}
        <View style={styles.profileInfo}>
          <Fontisto name="email" size={24} color="black" />
          <Text style={styles.infoText}>{user?.email}</Text>
        </View>
        {/* Adicione mais informações conforme necessário */}
      </View>

      {/* Botão para editar o perfil */}
      <Animatable.View duration={400} animation="fadeInLeft" easing="linear" iterationCount="1" direction="normal" style={{ transform: [{ rotateY: '0deg' }] }}>
        <TouchableOpacity onPress={handleEditProfile} style={styles.editButton}>
          <Text style={styles.editButtonText} disabled={true}>Editar Perfil</Text>
        </TouchableOpacity>
      </Animatable.View>
      
      {/* Botão para fazer logout */}
      <Animatable.View duration={400} animation="fadeInRight" easing="linear" iterationCount="1" direction="normal" style={{ transform: [{ rotateY: '0deg' }] }}>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </Animatable.View>
      
      {/* Botão para fazer logout */}
      <Animatable.View duration={400} animation="fadeInLeft" easing="linear" iterationCount="1" direction="normal" style={{ transform: [{ rotateY: '0deg' }] }}>
        <TouchableOpacity onPress={handleEquipamentos} style={styles.calculosButton}>
          <Text style={styles.calculosButtonText}>Cálculo Único por Aparelho</Text>
        </TouchableOpacity>
      </Animatable.View>
      
      <Animatable.View duration={400} animation="fadeInRight" easing="linear" iterationCount="1" direction="normal" style={{ transform: [{ rotateY: '0deg' }] }}>
        <TouchableOpacity onPress={handleInserirEquipamentos} style={styles.calculosButton}>
          <Text style={styles.calculosButtonText}>Inserir Equipamentos</Text>
        </TouchableOpacity>
      </Animatable.View>

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

    height: hp(15),
    marginTop: Platform.OS === 'ios' ? hp(-7) : 0,
  },
  headerContent: {
    alignItems: 'center',
    marginBottom: hp(2),
  },
  headerText: {
    color: '#fff',
    fontSize: RFPercentage(3),
    fontWeight: 'bold',
    marginVertical: hp(2),
  },
  profileImage: {
    width: wp(25),
    height: hp(12),
    borderRadius: wp(25/2),
    marginBottom: hp(2),
  },
  profileName: {
    fontSize: RFPercentage(3),
    fontWeight: 'bold',
  },
  body: {
    marginBottom: hp(2),
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1),
    marginHorizontal: wp(6),
  },
  infoText: {
    marginLeft: wp(2),
    fontSize: RFPercentage(2.5),

  },
  editButton: {
    backgroundColor: '#00a500',
    padding: hp(1),
    borderRadius: wp(2),
    alignItems: 'center',
    marginHorizontal: wp(5),
  },
  editButtonText: {
    color: '#fff',
    fontSize: RFPercentage(2),
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#ff0000',
    padding: hp(1),
    borderRadius: wp(2),
    alignItems: 'center',
    marginTop: hp(2),
    marginHorizontal: wp(5),
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: RFPercentage(2),
    fontWeight: 'bold',
  },
  calculosButtonText: {
    color: '#fff',
    fontSize: RFPercentage(2),
    fontWeight: 'bold',
  },
  calculosButton: {
    backgroundColor: '#B6B6AD',
    padding: hp(1),
    borderRadius: wp(2),
    alignItems: 'center',
    marginTop: hp(2),
    marginHorizontal: wp(5),
  },
});

export default Profile;
