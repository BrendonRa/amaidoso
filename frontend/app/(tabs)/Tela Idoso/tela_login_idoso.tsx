import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TelaLoginIdoso() {
  const [cpf, setCpf] = React.useState('');
  const [senha, setSenha] = React.useState('');

  const handleCpfChange = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    setCpf(numericValue);
  };

  const handleEntrar = () => {
    router.push('./tela_tutorial_idoso');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}>
        <View style={styles.content}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.back()}
            style={styles.backButton}>
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>

          <Image
            source={require('../../../assets/images/logo.jpeg')}
            style={styles.logo}
            contentFit="contain"
          />

          <Text style={styles.title}>Entre Agora</Text>
          <Text style={styles.subtitle}>
            Por favor entre na sua conta para{'\n'}continuar usando nosso app
          </Text>

          <View style={styles.form}>
            <TextInput
              keyboardType="number-pad"
              maxLength={11}
              onChangeText={handleCpfChange}
              placeholder="CPF"
              placeholderTextColor="#737373"
              style={styles.input}
              value={cpf}
            />

            <TextInput
              onChangeText={setSenha}
              placeholder="Senha"
              placeholderTextColor="#737373"
              secureTextEntry
              style={styles.input}
              value={senha}
            />

            <TouchableOpacity activeOpacity={0.6} onPress={handleEntrar} style={styles.buttonWrapper}>
              <LinearGradient
                colors={['#FFB06A', '#FF9230']}
                end={{ x: 1, y: 0.5 }}
                start={{ x: 0, y: 0.5 }}
                style={styles.button}>
                <Text style={styles.buttonText}>Entrar</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 28,
    zIndex: 1,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: '#FFE4CC',
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FF9230',
  },
  logo: {
    width: 108,
    height: 108,
    marginBottom: 22,
  },
  title: {
    fontSize: 29,
    lineHeight: 34,
    fontWeight: '700',
    color: '#F58220',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
    color: '#2E2E2E',
    textAlign: 'center',
    marginBottom: 42,
  },
  form: {
    width: '100%',
    maxWidth: 320,
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderColor: '#A8A8A8',
    borderRadius: 17,
    paddingHorizontal: 18,
    fontSize: 15,
    color: '#151515',
    backgroundColor: '#FFFFFF',
    marginBottom: 14,
  },
  buttonWrapper: {
    alignItems: 'center',
    marginTop: 42,
  },
  button: {
    minWidth: 118,
    paddingVertical: 14,
    paddingHorizontal: 26,
    borderRadius: 999,
    alignItems: 'center',
    shadowColor: '#F58220',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
