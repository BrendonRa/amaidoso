import React from 'react';
import {View, Image, TouchableOpacity, StyleSheet, Text, TextInput, } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function Tela_Login_Idoso(){
  const [text, onChangeText] = React.useState('Useless Text');
  const [number, onChangeNumber] = React.useState('');
    return(
        <View style={styles.container}>
            <Image source={require('../../assets/images/logo.jpeg')} style={styles.logo}/>
            <Text style={styles.title}>Entre Agora</Text>
            <Text style={styles.subtitle}>Por favor, entre na sua conta para continuar usando o nosso app</Text>

            <TextInput
             onChangeText={onChangeNumber}
          value={number}
          placeholder="CPF"
          keyboardType="numeric"
          style={styles.button} />
              <TextInput
             onChangeText={onChangeText}
            value={number}
            placeholder="Senha"
            keyboardType="numeric"
            style={styles.button} />
        </View>
    );

}
const styles =  StyleSheet.create({

    container:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff'
  },
  logo:{
    width:120,
    height:120,
    marginBottom:30
  },
  title:{
    fontSize:20,
    fontWeight:'600',
    color: '#003DD6',
    marginBottom: 8,
    textAlign: 'center',

  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 40,
    textAlign: 'center',
  },

  button: {
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 12,
    width: 250,
    alignItems: 'center',
    marginTop: 8 ,
    borderWidth: 1,
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },


});