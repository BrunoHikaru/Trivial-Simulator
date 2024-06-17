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
  Button,
  TouchableOpacity,
  Image,
  Platform,
  Dimensions,
  Linking
} from 'react-native';
import Checkbox from 'expo-checkbox';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, updateProfile } from 'firebase/auth';
import { StatusBar } from 'expo-status-bar';
import { ButtonGroup } from 'react-native-elements';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

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
      alert('Sign In failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async () => {
    setLoading(true);
    try {
      if (displayName && displayName.trim() !== '') {
        const response = await createUserWithEmailAndPassword(auth, email, password);
        console.log(response);

        const user = response.user;

        // Enviar email de verificação
        await sendEmailVerification(user);

        // Atualizar o perfil com o displayName
        await updateProfile(user, { displayName });

        // Limpar os campos
        setDisplayName('');
        setEmail('');
        setPassword('');

        alert('Um email de verificação foi enviado. Por favor, verifique seu email.');

        // Mudar para a tela de login
        setSelectedIndex(0);
      } else {
        alert('Por favor, insira seu nome para criar uma conta.');
      }
    } catch (error) {
      console.log(error);
      alert('Falha no registro: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePressTerms = () => {
    // Aqui você pode colocar o URL para os termos e condições da sua aplicação
    const url = 'https://intellion.pt/termos-e-condicoes-trivial-simulator/';
    Linking.openURL(url);
  };

  // Função para enviar o email de verificação
  const sendEmailVerification = async (user) => {
    try {
      // Enviar email de verificação
      await sendPasswordResetEmail(auth, user.email);
    } catch (error) {
      console.log(error);
      alert('Falha ao enviar o e-mail de verificação: ' + error.message);
    }
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
          Esqueceu sua senha?
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

  const renderForgotPassword = () => (
    <>
      <TextInput
        value={email}
        style={styles.input}
        placeholder='Email para redefinição de senha'
        autoCapitalize='none'
        onChangeText={(text) => setEmail(text)}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={resetPassword} style={styles.button}>
          <Text style={styles.buttonText}>
            Enviar
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.forgotPasswordContainer}>
        <Text style={styles.forgotPasswordText} onPress={() => setSelectedIndex(0)}>
          Voltar para Login
        </Text>
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
      <View style={{ flexDirection: 'row', alignItems: 'center'}}>
        <Checkbox style={styles.checkbox} value={acceptTerms} onValueChange={setAcceptTerms} label="I accept the terms and conditions" />
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
  }

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

          <View style={styles.welcomeContainer}>
            <Text style={styles.instructionText}>
              Para começar a utilizar nosso simulador, Crie uma conta. Se já está registrado,{'\n'} faça o Login
            </Text>
          </View>

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.content}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0} // ajuste conforme necessário
          >
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
          </KeyboardAvoidingView>
          <StatusBar style="light" />
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
    flex: 1,
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
    color: 'blue',
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
