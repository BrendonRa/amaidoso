import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';

import api from '@/app/services/api';
import { useResponsavelProfile } from '@/contexts/responsavel-profile-context';
import { AuthLayout } from '@/src/components/auth/AuthLayout';
import { FeedbackModal } from '@/src/components/auth/FeedbackModal';
import { PrimaryButton } from '@/src/components/auth/PrimaryButton';
import { TextField } from '@/src/components/auth/TextField';
import { getApiErrorMessage, isValidEmail, normalizeEmail } from '@/src/utils/auth';

export default function HomeScreen() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<{ title: string; message: string } | null>(null);
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { updateProfile } = useResponsavelProfile();

  const handleLogin = async () => {
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail || !password) {
      setError({ title: 'Campos obrigatórios', message: 'Preencha email e senha para continuar.' });
      return;
    }

    if (!isValidEmail(normalizedEmail)) {
      setError({ title: 'Email inválido', message: 'Digite um email válido para entrar.' });
      return;
    }

    try {
      setError(null);
      setIsSubmitting(true);

      const response = await api.post('/auth/responsavel/login', {
        email: normalizedEmail,
        senha: password,
      });

      const user = response.data.user;

      updateProfile({
        nome: user.nome,
        usuario: user.nome,
        email: user.email,
        photoUri: user.fotoPerfil ?? null,
      });

      setShowSuccessModal(true);
    } catch (error) {
      setError({
        title: 'Erro no login',
        message: getApiErrorMessage(error, 'Não foi possível fazer login agora.'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinue = () => {
    setShowSuccessModal(false);
    router.push('./tela_home_responsavel');
  };

  return (
    <AuthLayout
      title="Entre Agora"
      subtitle={'Por favor entre na sua conta para\ncontinuar usando nosso app'}
      titleStyle={styles.title}
      brand={<Image source={require('../../../assets/images/logo.jpeg')} style={styles.logo} contentFit="contain" />}
      headerLeft={
        <TouchableOpacity activeOpacity={0.7} onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      }
      footer={
        <View style={styles.signupRow}>
          <Text style={styles.signupText}>Não possui uma conta?</Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push('./tela_cadastro_responsavel')}>
            <Text style={styles.signupHighlight}>Crie uma agora</Text>
          </TouchableOpacity>
        </View>
      }>
      <View style={styles.form}>
        <TextField
          value={email}
          onChangeText={(v) => {
            setEmail(v);
            setError(null);
          }}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextField
          value={password}
          onChangeText={(v) => {
            setPassword(v);
            setError(null);
          }}
          placeholder="Senha"
          secureTextEntry
        />

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push('./tela_recuperar_senha_responsavel')}
          style={styles.forgotPasswordWrapper}>
          <Text style={styles.forgotPasswordText}>Recuperar senha</Text>
        </TouchableOpacity>

        <PrimaryButton
          title={isSubmitting ? 'Entrando...' : 'Entrar'}
          onPress={handleLogin}
          disabled={isSubmitting}
          style={styles.primaryButton}
          gradientColors={['#2E6BFF', '#0047FF']}
        />
      </View>

      <FeedbackModal
        visible={!!error}
        variant="error"
        title={error?.title ?? 'Erro'}
        message={error?.message ?? ''}
        primaryActionLabel="Fechar"
        primaryColor="#D92D20"
        onPrimaryAction={() => setError(null)}
        onClose={() => setError(null)}
      />
      <FeedbackModal
        visible={showSuccessModal}
        variant="success"
        title="Login realizado com sucesso"
        message="Seu acesso foi confirmado. Clique em continuar para entrar no app."
        primaryActionLabel="Continuar"
        primaryColor="#0C4DFF"
        onPrimaryAction={handleContinue}
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
    color: '#0C4DFF',
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '700',
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
  forgotPasswordWrapper: {
    alignSelf: 'flex-end',
    marginTop: -4,
    marginBottom: 18,
  },
  forgotPasswordText: {
    fontSize: 11,
    color: '#3C3C3C',
    textDecorationLine: 'underline',
  },
  primaryButton: {
    alignSelf: 'center',
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
