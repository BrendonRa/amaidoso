import {View, Image, TouchableOpacity, StyleSheet, Text, } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function Tela_inicio2(){
return(
    <View style={styles.container}>
        <Image source={require('../../assets/images/logo.jpeg')}style={styles.logo}/>
        <Text style={styles.title}>Bem Vindo ao Amaidoso</Text>
        <Text style={styles.subtitle}>Selecione uma opção abaixo:</Text>

        <TouchableOpacity>
           <LinearGradient
           colors={['#6EA8FF', '#3D6DFF']}
          style={styles.button}>
             <Text>Sou Idoso</Text>
            </LinearGradient> 
        </TouchableOpacity>



        <TouchableOpacity>
            <LinearGradient
            colors={['#6EA8FF', '#3D6DFF']}
            style={styles.button}>
                <Text>Sou Responsavel</Text>
            </LinearGradient>
        </TouchableOpacity>

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
    color: '#5A8DEE',
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
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },


});