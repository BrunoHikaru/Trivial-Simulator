import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFPercentage } from "react-native-responsive-fontsize";

const Simuladores = () => {
    const navigation = useNavigation();

    const handleCardPress = (screenName) => {
        navigation.navigate(screenName);
    };

    return (
        <SafeAreaView style={styles.container}>
            
            <View style={styles.header}>
                <Text style={styles.headerText}>Simuladores</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false}>
                
                <TouchableOpacity
                    style={[styles.cardContainer, { backgroundColor: 'rgba(0, 0, 255, 0.4)' }]}
                    onPress={() => handleCardPress('Simulator')}
                >
                    <View style={styles.cardContent}>
                        <Image source={require('../../assets/energy_cost.png')} style={styles.imageCard} />
                        <Text style={styles.textContainer}>Simulador de Gasto Mensal</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.cardContainer, { backgroundColor: 'rgba(0, 0, 255, 0.4)' }]}
                    onPress={() => handleCardPress('FormEquipamentos')}
                >
                    <View style={styles.cardContent}>
                        <Image source={require('../../assets/livingroom.png')} style={styles.imageCard} />
                        <Text style={styles.textContainer}>Simulador de Equipamento Único</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.cardContainer, { backgroundColor: 'rgba(0, 0, 255, 0.4)' }]}
                    onPress={() => handleCardPress('EletrodomesticosForm')}
                >
                    <View style={styles.cardContent}>
                        <Image source={require('../../assets/cuttedequips.png')} style={styles.imageCard} />
                        <Text style={styles.textContainer}>Formulário / Simulador de Equipamento</Text>
                    </View>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F2',
    },
    header: {
        backgroundColor: '#336F95',
        paddingVertical: hp(3),
        alignItems: 'center',
        justifyContent: 'center',
        borderTopLeftRadius: wp(0),
        borderTopRightRadius: wp(0),
        borderRadius:wp(5),
        height: hp(15),
        marginTop: Platform.OS === 'ios' ? hp(-7) : 0,
        marginBottom: hp(2),
    },
    headerText: {
        color: '#fff',
        fontSize: RFPercentage(3),
        fontWeight: 'bold',
    },
    scrollView: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingBottom: hp(15),
    },
    cardContainer: {
        borderRadius: wp(5),
        marginHorizontal: wp(5),
        marginVertical: hp(2),
        alignItems: 'center',
    },
    cardContent: {
        alignItems: 'center',
    },
    imageCard: {
        height: hp(15),
        width: wp(86),
        marginVertical: hp(2),
        borderRadius: wp(5),
    },
    textContainer: {
        color: 'white',
        textAlign: 'center',
        fontSize:  Platform.OS==='ios'?RFPercentage(2):RFPercentage(2)+Platform.OS==='android'?RFPercentage(3):RFPercentage(3) ,
        fontWeight: 'bold',
        marginVertical: hp(1),
    },
});

export default Simuladores;
