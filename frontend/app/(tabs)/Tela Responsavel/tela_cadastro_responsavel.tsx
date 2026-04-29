import { router } from 'expo-router';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';

import api from '@/app/services/api';
import { AuthLayout } from '@/src/components/auth/AuthLayout';
import { FeedbackModal } from '@/src/components/auth/FeedbackModal';
import { PrimaryButton } from '@/src/components/auth/PrimaryButton';
import { TextField } from '@/src/components/auth/TextField';
import { getApiErrorMessage, isValidEmail, normalizeEmail } from '@/src/utils/auth';

export default function TelaCadastroResponsavel() {
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleCreateAccount = async () => {
    const normalizedName = username.trim();
    const normalizedEmail = normalizeEmail(email);

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
      Alert.alert('Erro no cadastro', getApiErrorMessage(error, 'Não foi possível concluir o cadastro agora.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoToLogin = () => {
    setShowSuccessModal(false);
    router.replace('./tela_login_responsavel');
  };

  return (
    <AuthLayout
      title="Crie Agora"
      subtitle={'Preencha os campos com suas\ninformações'}
      titleStyle={styles.title}
      brand={<Image source={require('../../../assets/images/logo.jpeg')} style={styles.logo} contentFit="contain" />}
      headerLeft={
        <TouchableOpacity activeOpacity={0.7} onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      }
      footer={
        <View style={styles.signupRow}>
          <Text style={styles.signupText}>Possui uma conta?</Text>
          <TouchableOpacity activeOpacity={0.8} onPress={() => router.push('./tela_login_responsavel')}>
            <Text style={styles.signupHighlight}>Entre agora</Text>
          </TouchableOpacity>
        </View>
      }>
      <View style={styles.form}>
        <TextField
          value={username}
          onChangeText={setUsername}
          placeholder="Nome"
          autoCapitalize="words"
        />
        <TextField
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextField
          value={password}
          onChangeText={setPassword}
          placeholder="Senha"
          secureTextEntry
        />

        <PrimaryButton
          title={isSubmitting ? 'Criando...' : 'Criar conta'}
          onPress={handleCreateAccount}
          disabled={isSubmitting}
          style={styles.primaryButton}
          gradientColors={['#2E6BFF', '#0047FF']}
        />
      </View>

      <FeedbackModal
        visible={showSuccessModal}
        variant="success"
        title="Cadastro realizado"
        message="Sua conta foi criada com sucesso. Clique em OK para voltar ao login."
        primaryActionLabel="OK"
        primaryColor="#0C4DFF"
        onPrimaryAction={handleGoToLogin}
        onClose={() => setShowSuccessModal(false)}
      />
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
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
  backButton: {
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
  form: {
    width: '100%',
    maxWidth: 320,
    alignSelf: 'center',
  },
  primaryButton: {
    alignSelf: 'center',
    marginTop: 8,
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  signupText: {
    fontSize: 12,
    color: '#1E1E1E',
    textAlign: 'center',
  },
  signupHighlight: {
    fontSize: 12,
    fontWeight: '800',
    color: '#111111',
    textDecorationLine: 'underline',
  },
});
