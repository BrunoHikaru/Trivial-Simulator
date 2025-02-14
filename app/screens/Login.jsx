import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  ImageBackground,
  TouchableOpacity,
  Image,
  Platform,
  Dimensions,
  Linking,
  ScrollView
} from 'react-native';
import Checkbox from 'expo-checkbox';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, updateProfile, sendEmailVerification } from 'firebase/auth';
import { ButtonGroup } from 'react-native-elements';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const windowHeight = Dimensions.get('window').height;
  const [acceptTerms, setAcceptTerms] = useState(false);

  const auth = FIREBASE_AUTH;

  const signIn = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      const user = response.user;

      if (!user.emailVerified) {
        alert('Você precisa verificar seu email primeiro!');
        setLoading(false);
        return;
      }

      console.log(response);
    } catch (error) {
      console.log(error);
      alert('Login Falhou');
    } finally {
      setLoading(false);
    }
  };

  const signUp = async () => {
    setLoading(true);
    try {
      if (!acceptTerms) {
        alert('Você precisa aceitar os termos e condições para criar uma conta.');
        setLoading(false);
        return;
      }

      if (displayName && displayName.trim() !== '') {
        const response = await createUserWithEmailAndPassword(auth, email, password);
        console.log(response);

        const user = response.user;

       
        await sendEmailVerification(user);

        
        await updateProfile(user, { displayName });

        
        setDisplayName('');
        setEmail('');
        setPassword('');

        alert('Um email de verificação foi enviado. Por favor, verifique seu email.');

        
        setSelectedIndex(0);
      } else {
        alert('Por favor, insira seu nome para criar uma conta.');
      }
    } catch (error) {
      console.log(error);
      alert('Falha no registro');
    } finally {
      setLoading(false);
    }
  };

  const renderForgotPassword = () => (
    <>
      <TextInput
        value={email}
        style={styles.input}
        placeholder='Digite seu email'
        autoCapitalize='none'
        onChangeText={(text) => setEmail(text)}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={resetPassword} style={styles.button}>
          <Text style={styles.buttonText}>Redefinir Senha</Text>
        </TouchableOpacity>
      </View>
    </>
  );


  const handlePressTerms = () => {
    const url = 'https://intellion.pt/termos-e-condicoes-trivial-simulator/';
    Linking.openURL(url);
  };

  const resetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert('Um e-mail de redefinição de senha foi enviado para o seu endereço de e-mail.');
    } catch (error) {
      console.log(error);
      alert('Falha ao enviar o e-mail de redefinição de senha: ' + error.message);
    }
  };

  const renderLogin = () => (
    <>

      <TextInput
        value={email}
        style={styles.input}
        placeholder='Email'
        autoCapitalize='none'
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        secureTextEntry={true}
        value={password}
        style={styles.input}
        placeholder='Password'
        autoCapitalize='none'
        onChangeText={(text) => setPassword(text)}
      />
      <View style={styles.forgotPasswordContainer}>
        <Text style={styles.forgotPasswordText} onPress={() => setSelectedIndex(2)}>
          Esqueceu-se da sua senha?
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={signIn} style={styles.button}>
          <Text style={styles.buttonText}>
            Entrar
          </Text>
        </TouchableOpacity>
      </View>

    </>
  );

  const renderSignUp = () => (
    <>
      <TextInput
        value={displayName}
        style={styles.input}
        placeholder='Name'
        autoCapitalize='words'
        onChangeText={(text) => setDisplayName(text)}
      />
      <TextInput
        value={email}
        style={styles.input}
        placeholder='Email'
        autoCapitalize='none'
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        secureTextEntry={true}
        value={password}
        style={styles.input}
        placeholder='Password'
        autoCapitalize='none'
        onChangeText={(text) => setPassword(text)}
      />
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Checkbox
          style={styles.checkbox}
          value={acceptTerms}
          onValueChange={setAcceptTerms}
          label="I accept the terms and conditions"
        />
        <TouchableOpacity onPress={handlePressTerms}>
          <Text style={{ marginLeft: 15, color: 'white' }}>Eu aceito os <Text style={{ textDecorationLine: 'underline' }}>termos e condições</Text></Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator size='large' color='#0000ff' />
      ) : (
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={signUp} style={styles.button}>
            <Text style={styles.buttonText}>
              Criar Conta
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );

  const buttons = ['Login', 'Criar Conta'];

  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <ImageBackground
      source={require('../../assets/wind_turbine_mountains.png')}
      style={styles.backgroundImage}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleGoBack}>
              <Image source={require('../../assets/go_back.png')} style={styles.buttonStyle} />
            </TouchableOpacity>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerText}>Trivial Simulator</Text>
            </View>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: hp(37) }}>

            <View style={styles.welcomeContainer}>
              <Text style={styles.instructionText}>
                Para começar a utilizar nosso simulador, Crie uma conta. Se já está registrado,{'\n'} faça o Login
              </Text>
            </View>

            <View style={styles.content}>
              <ButtonGroup
                onPress={(selectedIndex) => setSelectedIndex(selectedIndex)}
                selectedIndex={selectedIndex}
                buttons={buttons}
                containerStyle={styles.buttonGroupContainer}
                selectedButtonStyle={styles.selectedButtonStyle}
                textStyle={styles.buttonText}
              />

              {selectedIndex === 0 && renderLogin()}
              {selectedIndex === 1 && renderSignUp()}
              {selectedIndex === 2 && renderForgotPassword()}
            </View>
          </ScrollView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    backgroundColor: 'rgba(51, 111, 149, 0.7)',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-between',

    borderRadius: wp(5),
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,

    height: hp(15),
    marginTop: Platform.OS === 'ios' ? hp(-7) : 0,
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: hp('5%'),
  },
  instructionText: {
    fontSize: 18,
    textAlign: 'center',
    marginHorizontal: wp('5%'),
    color: 'white',
    marginVertical: hp('5%'),
  },
  content: {

    paddingHorizontal: wp('5%'),


  },
  input: {
    marginVertical: hp('1%'),
    height: hp('7%'),
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    marginTop: hp('2%'),
  },
  button: {
    backgroundColor: 'rgba(51, 111, 149, 0.7)',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 17,
    color: 'white',
  },
  buttonGroupContainer: {
    height: hp('6%'),
    marginTop: hp('2%'),
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  selectedButtonStyle: {
    backgroundColor: '#336F95',
  },
  forgotPasswordContainer: {
    alignItems: 'center',
    marginVertical: hp('2%'),
  },
  forgotPasswordText: {
    color: 'white',
    textDecorationLine: 'underline',
  },
  buttonStyle: {
    height: 15,
  },
  checkbox: {
    margin: 8,
  },
});

export default Login;
