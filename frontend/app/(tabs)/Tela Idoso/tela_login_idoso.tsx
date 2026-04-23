import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import {
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

export default function TelaLoginIdoso() {
  const [cpf, setCpf] = React.useState('');
  const [senha, setSenha] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [errorTitle, setErrorTitle] = React.useState('Erro no login');
  const [showErrorModal, setShowErrorModal] = React.useState(false);
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const formatCpf = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);

    if (digits.length <= 3) {
      return digits;
    }

    if (digits.length <= 6) {
      return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    }

    if (digits.length <= 9) {
      return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    }

    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
  };

  const openErrorModal = (title: string, message: string) => {
    setErrorTitle(title);
    setErrorMessage(message);
    setShowErrorModal(true);
  };

  const handleCpfChange = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    setCpf(numericValue);
    if (showErrorModal) {
      setShowErrorModal(false);
    }
  };

  const handleEntrar = async () => {
    if (!cpf.trim() || !senha) {
      const message = 'Preencha CPF e senha para continuar.';
      openErrorModal('Campos obrigatórios', message);
      return;
    }

    if (cpf.trim().length !== 11) {
      const message = 'Digite um CPF com 11 números para entrar.';
      openErrorModal('CPF inválido', message);
      return;
    }

    try {
      setErrorMessage('');
      setShowErrorModal(false);
      setIsSubmitting(true);

      await api.post('/auth/idoso/login', {
        cpf,
        senha,
      });

      setShowSuccessModal(true);
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.error ??
          (error.request
            ? 'Não foi possível conectar ao servidor. Verifique se o backend está ligado.'
            : 'Não foi possível fazer login agora.')
        : 'Não foi possível fazer login agora.';

      openErrorModal('Erro no login', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinue = () => {
    setShowSuccessModal(false);
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
              maxLength={14}
              onChangeText={handleCpfChange}
              placeholder="000.000.000-00"
              placeholderTextColor="#737373"
              style={styles.input}
              value={formatCpf(cpf)}
            />

            <TextInput
              onChangeText={(value) => {
                setSenha(value);
                if (showErrorModal) {
                  setShowErrorModal(false);
                }
              }}
              placeholder="Senha"
              placeholderTextColor="#737373"
              secureTextEntry
              style={styles.input}
              value={senha}
            />

            {errorMessage ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            ) : null}

            <TouchableOpacity
              activeOpacity={0.6}
              onPress={handleEntrar}
              disabled={isSubmitting}
              style={styles.buttonWrapper}>
              <LinearGradient
                colors={['#FFB06A', '#FF9230']}
                end={{ x: 1, y: 0.5 }}
                start={{ x: 0, y: 0.5 }}
                style={styles.button}>
                <Text style={styles.buttonText}>{isSubmitting ? 'Entrando...' : 'Entrar'}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      <Modal
        animationType="fade"
        transparent
        visible={showErrorModal}
        onRequestClose={() => setShowErrorModal(false)}>
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={() => setShowErrorModal(false)} />
          <View style={styles.modalCard}>
            <View style={styles.modalErrorIconWrap}>
              <Text style={styles.modalErrorIcon}>!</Text>
            </View>
            <Text style={styles.modalTitle}>{errorTitle}</Text>
            <Text style={styles.modalText}>{errorMessage}</Text>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setShowErrorModal(false)}
              style={styles.modalErrorButton}>
              <Text style={styles.modalButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent
        visible={showSuccessModal}
        onRequestClose={() => setShowSuccessModal(false)}>
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={() => setShowSuccessModal(false)} />
          <View style={styles.modalCard}>
            <View style={styles.modalSuccessIconWrap}>
              <Text style={styles.modalSuccessIcon}>✓</Text>
            </View>
            <Text style={styles.modalTitle}>Login realizado com sucesso</Text>
            <Text style={styles.modalText}>
              Seu acesso foi confirmado. Clique em continuar para entrar no app.
            </Text>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleContinue}
              style={styles.modalSuccessButton}>
              <Text style={styles.modalButtonText}>Continuar</Text>
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
  errorBox: {
    borderRadius: 14,
    backgroundColor: '#FFE8DE',
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 4,
  },
  errorText: {
    color: '#B54708',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    textAlign: 'center',
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
  modalErrorIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 999,
    backgroundColor: '#FFE8DE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  modalErrorIcon: {
    fontSize: 24,
    fontWeight: '800',
    color: '#B54708',
  },
  modalSuccessIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 999,
    backgroundColor: '#FFE4CC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  modalSuccessIcon: {
    fontSize: 24,
    fontWeight: '800',
    color: '#F58220',
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
  modalErrorButton: {
    minWidth: 150,
    minHeight: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F58220',
    paddingHorizontal: 18,
  },
  modalSuccessButton: {
    minWidth: 150,
    minHeight: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F58220',
    paddingHorizontal: 18,
  },
  modalButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
