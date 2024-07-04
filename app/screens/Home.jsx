import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Modal, TextInput, TouchableWithoutFeedback, ImageBackground, Image, StatusBar,Keyboard, Platform } from 'react-native';
import { Card, Title } from 'react-native-paper';
import { Ionicons, FontAwesome5, AntDesign,Octicons  } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { LongPressGestureHandler, State, GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import SunAnimation from './SunAnimation';
import { getDatabase, ref, set, onValue, get, orderByChild, limitToLast, serverTimestamp, push } from 'firebase/database';
import EnergyAnimation from '../EnergyAnimation';
import { RFPercentage } from "react-native-responsive-fontsize";
import * as WebBrowser from 'expo-web-browser';

const Home = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [infoModalVisible2, setInfoModalVisible2] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [longPressActive, setLongPressActive] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [newCardName, setNewCardName] = useState('');
  const [editFieldModalVisible, setEditFieldModalVisible] = useState(false);
  const db = getDatabase();
  const [ultimoCardAmbiente, setultimoCardAmbiente] = useState(null);
  const [configurationModalVisible,setConfigurationModalVisible]=useState(false);

  const toggleEditFieldModal = () => {
    setEditModalVisible(false);
    setEditFieldModalVisible(!editFieldModalVisible);
  };

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

  const handleCardPress = (cardId) => {
    navigation.navigate('NovaTela', { cardId, cardName: cardsData.find(card => card.id === cardId)?.title });
  };

  const handleCardPress2 = (cardId2) => {
    if (cardId2 === 1) {
      navigation.navigate('Dicas');
    }
  };

  const data2 = [
    { id2: 1, title: 'Dicas', iconName: 'bulb-outline', backgroundColor: 'rgba(255, 255, 255, 0.4)' },
  ];

  const handleCardPressCalculos = (cardIdcalculos) => {
    if (cardIdcalculos === 1) {
      navigation.navigate('EletrodomesticosForm');
    } if (cardIdcalculos === 2) {
      navigation.navigate('FormEquipamentos');
    }
  };
  const dataCalculos = [
    { idcalculos: 1, title: 'Cálculos', iconName: 'bulb-outline', backgroundColor: 'rgba(255, 255, 255, 0.4)' },
    { idcalculos: 2, title: 'Cálculos', iconName: 'bulb-outline', backgroundColor: 'rgba(255, 255, 255, 0.4)' },
  ];

  const toggleInfoModal = () => {
    setInfoModalVisible(!infoModalVisible);
  };

  const toggleInfoModal2 = () => {
    setInfoModalVisible2(!infoModalVisible2);
  };

  const toggleEditModal = () => {
    setEditModalVisible(!editModalVisible);
  };

  const toggleConfigurationModal=()=>{
    setConfigurationModalVisible(!configurationModalVisible);
  }

  const openEditMenu = () => {
    setNewCardName(selectedCard?.title || '');
    toggleEditModal();
  };

  const [cardsData, setCardsData] = useState([
    { id: 1, title: 'Ambiente 1', iconName: 'house-user', backgroundColor: 'rgba(255, 255, 255, 0.4)' },
    { id: 2, title: 'Ambiente 2', iconName: 'house-user', backgroundColor: 'rgba(255, 255, 255, 0.4)' },
  ]);

  const updateCardName = () => {
    const updatedData = cardsData.map((card) =>
      card.id === selectedCard?.id ? { ...card, title: newCardName } : card
    );

    setCardsData(updatedData);

    toggleEditModal();
    setEditFieldModalVisible(false);
    setEditModalVisible(false);
  };

  const handleTouchName = () => {
    navigation.navigate('Profile');
  };

  const handleTesteJson = () => {
    navigation.navigate('getJson');
  };

  const [addModalVisible, setAddModalVisible] = useState(false);

  const toggleAddModal = () => {
    setAddModalVisible(!addModalVisible);
  };

  const writeCard = async (userId, title, iconName, backgroundColor) => {
    const db = getDatabase();
    const userCardsCollection = ref(db, `AmbienteCards/${userId}`);

    try {
      const newCardRef = await push(userCardsCollection, {
        title,
        iconName,
        backgroundColor,
        timestamp: serverTimestamp(),
      });

      setCardsData([...cardsData, { id: newCardRef.id, title, iconName, backgroundColor }]);
    } catch (error) {
      console.error('Erro ao adicionar o cartão:', error);
    }
  };

  useEffect(() => {
    const loadUserCards = async (userId) => {
      const db = getDatabase();
      const userCardsCollection = ref(db, `AmbienteCards/${userId}`);

      try {
        const snapshot = await get(userCardsCollection);

        if (snapshot.exists()) {
          const cardsArray = [];
          snapshot.forEach((childSnapshot) => {
            cardsArray.push({ id: childSnapshot.key, ...childSnapshot.val() });
          });

          console.log('Dados dos cartões obtidos:', cardsArray);

          setCardsData(cardsArray);
        } else {
          setCardsData([]);
        }
      } catch (error) {
        console.error('Erro ao carregar os cartões:', error);
      }
    };

    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('ID do usuário:', user.uid);

        loadUserCards(user.uid);
      } else {
        console.error('Erro!');
      }
    });

    return () => unsubscribe();
  }, [ultimoCardAmbiente]);

  const addNewCard = async () => {
    if (!newCardName || newCardName.trim() === "") {
      console.error('Por favor, insira um nome válido para o ambiente.');
      return;
    }

    const newCard = {
      title: newCardName,
      iconName: 'house-user',
      backgroundColor: 'rgba(255, 255, 255, 0.4)',
    };

    try {
      const user = getAuth().currentUser;

      await writeCard(user.uid, newCard.title, newCard.iconName, newCard.backgroundColor);

      setAddModalVisible(false);
      setNewCardName('');
    } catch (error) {
      console.error('Erro ao adicionar o cartão:', error);
    }
  };

  const deleteCard = async (cardId) => {
    const db = getDatabase();
    const userCardsCollection = ref(db, `AmbienteCards/${user.uid}/${cardId}`);

    try {
      await set(userCardsCollection, null);
      setCardsData(cardsData.filter((card) => card.id !== cardId));
    } catch (error) {
      console.error('Erro ao deletar o cartão:', error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={styles.container}>
      <ImageBackground source={require('../../assets/wind_turbine_mountains.png')} style={styles.backgroundImage}>
        <StatusBar barStyle="light-content" />
        <View style={styles.header}>
        <TouchableOpacity onPress={toggleInfoModal}>
            <Ionicons name="information-circle-outline" size={wp(8)} color="white" />
        </TouchableOpacity>
         
          <Text style={styles.headerText}>Home</Text>
          <TouchableOpacity onPress={toggleConfigurationModal}>
            <Octicons name="gear" size={wp(8)} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Bem-vindo(a),</Text>
          <Text style={styles.userName} onPress={handleTouchName}>{user?.displayName || 'Usuário'}</Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.ambienteContainer}>
            {cardsData.map((card) => (
              <TouchableWithoutFeedback
                key={card.id}
                onLongPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  setLongPressActive(true);
                  setSelectedCard(card);
                }}
                onPress={() => {
                  if (longPressActive) {
                    setLongPressActive(false);
                  } else {
                    handleCardPress(card.id);
                  }
                }}
              >
                <View style={[styles.cardContainer, { backgroundColor: card.backgroundColor }]}>
                  <TouchableOpacity 
                  onPress={() => handleCardPress(card.id)}
                  onLongPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy); // Adiciona vibração
                    setLongPressActive(true);
                    setSelectedCard(card);
                    toggleEditModal(); // Abre o pop-up de edição
                  }}
                  >
                    <FontAwesome5 name={card.iconName} size={wp(20)} color="white" style={{ alignSelf: 'center', marginTop: hp(3) }} />
                    <Title style={{ alignSelf: 'center', marginTop: hp(2) }}>{card.title}</Title>
                  </TouchableOpacity>

                  {longPressActive && selectedCard === card && (
                    <TouchableOpacity onPress={openEditMenu} style={styles.editButton}>
                      <AntDesign name="edit" size={wp(6)} color="white" />
                    </TouchableOpacity>
                  )}
                </View>
              </TouchableWithoutFeedback>
            ))}

            <TouchableWithoutFeedback onPress={toggleAddModal}>
              <View style={[styles.cardContainer, { backgroundColor: 'rgba(255, 255, 255, 0.4)' }]}>
                <AntDesign name="plus" size={wp(20)} color="white" style={{ alignSelf: 'center', marginTop: hp(3) }} />
                <Title style={{ alignSelf: 'center', marginTop: hp(2) }}>Adicionar Ambiente</Title>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </ScrollView>
      </ImageBackground>

      <Modal
        animationType="slide"
        transparent={true}
        visible={addModalVisible}
        onRequestClose={toggleAddModal}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Digite o nome do ambiente:</Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) => setNewCardName(text)}
              value={newCardName}
              placeholder="Nome do Ambiente"
            />
            <TouchableOpacity style={styles.addButton} onPress={addNewCard}>
              <Text style={styles.modalButtonText}>Adicionar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={toggleAddModal}>
              <Text style={styles.modalButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={toggleEditModal}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity style={styles.editFieldButton} onPress={toggleEditFieldModal}>
              <Text style={styles.modalButtonText}>Editar Nome</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={() => {
              deleteCard(selectedCard.id);
              setEditModalVisible(false);
            }}>
              <Text style={styles.modalButtonText}>Deletar Ambiente</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={toggleEditModal}>
              <Text style={styles.modalButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={editFieldModalVisible}
        onRequestClose={toggleEditFieldModal}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Digite o novo nome:</Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) => setNewCardName(text)}
              value={newCardName}
              placeholder="Nome do Ambiente"
            />
            <TouchableOpacity style={styles.addButton} onPress={updateCardName}>
              <Text style={styles.modalButtonText}>Atualizar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={toggleEditFieldModal}>
              <Text style={styles.modalButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={infoModalVisible}
        onRequestClose={toggleInfoModal}
      >
        <TouchableWithoutFeedback onPress={toggleInfoModal}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={{ fontSize: 20, fontWeight: 'bold'}}>Instruções{'\n'}</Text>
              <Text style={styles.modalText}>Para começar, adicione um ambiente clicando no botão "+" para continuar.</Text>
              <Text style={styles.modalText}>Se segurar por alguns segundos o cartão de cada ambiente, aparecera as opções de alterar nome, deletar.</Text>
              <Text style={styles.modalText}>Ao submeter equipamentos no ambiente por meio dos formulários, eles serão adicionados automaticamente.</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={infoModalVisible2}
        onRequestClose={toggleInfoModal2}
      >
        <TouchableWithoutFeedback onPress={toggleInfoModal2}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Informações sobre o aplicativo.</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>



    {/* Config Modal */}
    <Modal
        animationType="slide"
        transparent={true}
        visible={configurationModalVisible}
        onRequestClose={toggleConfigurationModal}
       
      >
        <TouchableWithoutFeedback onPress={toggleConfigurationModal}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity style={styles.politicaButton} onPress={()=>WebBrowser.openBrowserAsync('https://intellion.pt/politica-de-privacidade-2/')}>
                <Text style={styles.modalText}>Politíca de Privacidade</Text>
              </TouchableOpacity>
              
              
              <TouchableOpacity style={styles.litigioButton} onPress={()=>WebBrowser.openBrowserAsync('https://intellion.pt/contact/')}>
                <Text style={styles.modalText}>Suporte</Text>
              </TouchableOpacity>
              
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>



      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={editModalVisible}
      >
      
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity style={styles.editFieldButton} onPress={toggleEditFieldModal}>
              <Text style={styles.modalButtonText}>Editar Nome</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={() => {
              deleteCard(selectedCard.id);
              setEditModalVisible(false);
            }}>
              <Text style={styles.modalButtonText}>Deletar Ambiente</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={toggleEditModal}>
              <Text style={styles.modalButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
        
      </Modal>

    </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Platform.OS === 'android' ? hp(5) : hp(5)+ Platform.OS === 'ios' ? hp(0) : hp(7), // To account for the notch in iOS devices
    paddingHorizontal: wp(5),
  },
  headerText: {
    color: 'white',
    fontSize: wp(5),
    fontWeight: 'bold',
  },
  welcomeContainer: {
    marginTop: hp(5),
    paddingHorizontal: wp(5),
  },
  welcomeText: {
    color: 'white',
    fontSize: Platform.OS==='ios'?RFPercentage(2):RFPercentage(2)+Platform.OS==='android'?RFPercentage(3):RFPercentage(3) ,
  },
  userName: {
    color: 'white',
    fontSize:  Platform.OS==='ios'?RFPercentage(2.5):RFPercentage(2)+Platform.OS==='android'?RFPercentage(3):RFPercentage(3) ,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  scrollView: {
    flexGrow: 1,
    marginTop: hp(5),
    paddingBottom: hp(16),
  },
  ambienteContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginBottom: hp(2),
  },
  cardContainer: {
    width: wp(40),
    height: hp(25),
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 20,
    marginVertical: hp(2),
    justifyContent: 'center',
    elevation: 5,
  },
  editButton: {
    position: 'absolute',
    top: hp(2),
    right: wp(2),
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: wp(2),
    borderRadius: 50,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  bottomScrollView: {
    paddingHorizontal: wp(5),
  },
  bottomMenu: {
    flexDirection: 'row',
    marginBottom: hp(2),
  },
  bottomMenuItem: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    width: wp(25),
    height: wp(25),
    borderRadius: wp(25) / 2,
    marginHorizontal: wp(2),
  },
  bottomMenuItemText: {
    color: 'white',
    marginTop: hp(1),
    fontSize: wp(3),
    textAlign: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: wp(5),
    backgroundColor: 'white',
    borderRadius: wp(5),
    padding: wp(3),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: hp(2),
    textAlign: 'justify',
    fontSize: wp(4),
  },
  modalButtonText: {
    color: 'white',
    fontSize: wp(4),
    fontWeight: 'bold',
  },
  input: {
    width: wp(60),
    height: hp(5),
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: hp(2),
    paddingLeft: wp(2),
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: 'green',
    paddingVertical: hp(1),
    paddingHorizontal: wp(13),
    borderRadius: 5,
    marginBottom: hp(1),
  },
  deleteButton: {
    backgroundColor: 'red',
    paddingVertical: hp(1),
    paddingHorizontal: wp(6),
    borderRadius: 5,
    marginBottom: hp(1),
  },
  editFieldButton: {
    backgroundColor: 'blue',
    paddingVertical: hp(1),
    paddingHorizontal: wp(11),
    borderRadius: 5,
    marginBottom: hp(1),
  },
  cancelButton: {
    backgroundColor: 'gray',
    paddingVertical: hp(1),
    paddingHorizontal: wp(14),
    borderRadius: 5,
    marginBottom: hp(1),
  },
  politicaButton:{
    backgroundColor: 'lightgray',
    paddingVertical: hp(1),
    paddingHorizontal: wp(5),
    borderRadius: 13,
    alignSelf:'center',
    marginVertical: hp(1),
  },  
  litigioButton:{
    backgroundColor: 'lightgray',
    paddingVertical: hp(1),
    paddingHorizontal: wp(19),
    borderRadius: 13,
    alignSelf:'center',
    textAlign:'center',
    marginVertical: hp(1),
   
  }
});

export default Home;
