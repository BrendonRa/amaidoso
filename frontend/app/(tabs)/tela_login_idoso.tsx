import React from 'react';
import {View, Image, TouchableOpacity, StyleSheet, Text, TextInput, } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

export default function Tela_Login_Idoso(){
  const [text, onChangeText] = React.useState('Useless Text');
  const [number, onChangeNumber] = React.useState('');

    return(
        <View style={styles.container}>
            <Image source={require('../../assets/images/logo.jpeg')} style={styles.logo}/>
            <Text style={styles.title}>Entre Agora</Text>
            <Text style={styles.subtitle}>Por favor entre na sua conta para</Text>
            <Text style={styles.subtitle}>continuar usando nosso app</Text>
          <SafeAreaProvider>
             <SafeAreaView>
            <TextInput
             onChangeText={onChangeNumber}
          value={number}
          placeholder="CPF"
          keyboardType="numeric"
          style={styles.input} ></TextInput>
              
              <TextInput
             onChangeText={onChangeText}
            value={text}
            placeholder="Senha"
            keyboardType="numeric"
            style={styles.input} />
            <TouchableOpacity style={styles.button2}>
                <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>
            </SafeAreaView>
            </SafeAreaProvider>
        </View>
    );

}
const styles =  StyleSheet.create({

    container:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  logo:{
    width:120,
    height:120,
    marginBottom:30,
    marginTop: 100,
  },
  title:{
    fontSize:20,
    fontWeight:'bold',
    color: '#FF9230',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 10,
    color: 'black',
    marginBottom: 0,
    textAlign: 'center',
    fontWeight: 'bold',
  },

  input: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 12,
    width: 250,
    alignItems: 'center',
    marginTop: 20 ,
    borderWidth: 1,
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  button2: {
    display:'flex',
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 200,
    width: 100,
    alignItems: 'center',
    marginTop: 80,
    backgroundColor: '#FF9230',
    marginLeft: 'auto',
    marginRight: 'auto',
  },


});