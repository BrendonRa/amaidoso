import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function TelaInicio() {
  return (
    <View style={styles.container}>

      <Image
        source={require('../../assets/images/logo.jpeg')}
        style={styles.logo}
      />

      <Text style={styles.title}>Bem-vindo ao Amaidoso</Text>

      <Text style={styles.subtitle}>
        Crie uma conta e comece a usar
      </Text>

      <TouchableOpacity onPress={() => console.log('Clicou')}>
        <LinearGradient
          colors={['#1456FF', '#003DD6']}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Vamos Nessa!</Text>
        </LinearGradient>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },

  logo: {
    width: 120,
    height: 120,
    marginBottom: 30,
  },

  title: {
    fontSize: 20,
    fontWeight: '600',
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