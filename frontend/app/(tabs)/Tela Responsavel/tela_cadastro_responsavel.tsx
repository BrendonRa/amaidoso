import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import React from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import api from '@/app/services/api';

export default function TelaCadastroResponsavel() {
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleCreateAccount = async () => {
    const normalizedName = username.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedName || !normalizedEmail || !password) {
      Alert.alert('Campos obrigatórios', 'Preencha nome, email e senha para continuar.');
      return;
    }

    if (!isValidEmail(normalizedEmail)) {
      Alert.alert('Email inválido', 'Digite um email válido para concluir o cadastro.');
      return;
    }

    try {
      setIsSubmitting(true);

      await api.post('/auth/responsavel/register', {
        nome: normalizedName,
        email: normalizedEmail,
        senha: password,
      });

      setUsername('');
      setEmail('');
      setPassword('');
      setShowSuccessModal(true);
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.error ?? 'Não foi possível concluir o cadastro agora.'
        : 'Não foi possível concluir o cadastro agora.';

      Alert.alert('Erro no cadastro', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoToLogin = () => {
    setShowSuccessModal(false);
    router.replace('./tela_login_responsavel');
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

          <Text style={styles.title}>Crie Agora</Text>
          <Text style={styles.subtitle}>
            Preencha os campos com suas{'\n'}informações
          </Text>

          <View style={styles.form}>
            <TextInput
              autoCapitalize="words"
              onChangeText={setUsername}
              placeholder="Nome de Usuário"
              placeholderTextColor="#737373"
              style={styles.input}
              value={username}
            />

            <TextInput
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={setEmail}
              placeholder="Email"
              placeholderTextColor="#737373"
              style={styles.input}
              value={email}
            />

            <TextInput
              onChangeText={setPassword}
              placeholder="Senha"
              placeholderTextColor="#737373"
              secureTextEntry
              style={styles.input}
              value={password}
            />

            <TouchableOpacity
              activeOpacity={0.6}
              onPress={handleCreateAccount}
              disabled={isSubmitting}
              style={styles.buttonWrapper}>
              <LinearGradient
                colors={['#2E6BFF', '#0047FF']}
                end={{ x: 1, y: 0.5 }}
                start={{ x: 0, y: 0.5 }}
                style={styles.button}>
                <Text style={styles.buttonText}>
                  {isSubmitting ? 'Criando...' : 'Criar Conta'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.signupRow}>
              <Text style={styles.signupText}>Possui uma conta?</Text>
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => router.push('./tela_login_responsavel')}
                style={styles.signupLinkWrapper}>
                <Text style={styles.signupHighlight}>Entre agora</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>

      <Modal
        animationType="fade"
        transparent
        visible={showSuccessModal}
        onRequestClose={() => setShowSuccessModal(false)}>
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={() => setShowSuccessModal(false)} />
          <View style={styles.modalCard}>
            <View style={styles.modalIconWrap}>
              <Feather name="check" size={24} color="#0C4DFF" />
            </View>
            <Text style={styles.modalTitle}>Cadastro realizado</Text>
            <Text style={styles.modalText}>
              Sua conta foi criada com sucesso. Clique em OK para ir ate a tela de login e entrar
              com o novo cadastro.
            </Text>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleGoToLogin}
              style={styles.modalButton}>
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    paddingHorizontal: 28,
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
    backgroundColor: '#DCE7FF',
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0C4DFF',
  },
  logo: {
    width: 118,
    height: 118,
    marginBottom: 18,
  },
  title: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '700',
    color: '#0C4DFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
    color: '#2E2E2E',
    textAlign: 'center',
    marginBottom: 34,
  },
  form: {
    width: '100%',
    maxWidth: 320,
  },
  input: {
    height: 58,
    borderWidth: 1,
    borderColor: '#B8B8B8',
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#151515',
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  buttonWrapper: {
    alignItems: 'center',
    marginTop: 26,
    marginBottom: 18,
  },
  button: {
    minWidth: 116,
    paddingVertical: 15,
    paddingHorizontal: 28,
    borderRadius: 999,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  signupText: {
    fontSize: 12,
    color: '#1E1E1E',
    textAlign: 'center',
  },
  signupLinkWrapper: {
    alignSelf: 'center',
  },
  signupHighlight: {
    fontWeight: '700',
    color: '#111111',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.28)',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 20,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 8,
  },
  modalIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 999,
    backgroundColor: '#DCE7FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#161616',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#4B4B4B',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    minWidth: 140,
    minHeight: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0C4DFF',
    paddingHorizontal: 18,
  },
  modalButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
