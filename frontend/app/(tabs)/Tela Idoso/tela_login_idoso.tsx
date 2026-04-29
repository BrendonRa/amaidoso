import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';

import api from '@/app/services/api';
import { AuthLayout } from '@/src/components/auth/AuthLayout';
import { FeedbackModal } from '@/src/components/auth/FeedbackModal';
import { PrimaryButton } from '@/src/components/auth/PrimaryButton';
import { TextField } from '@/src/components/auth/TextField';
import { formatCpf, getApiErrorMessage, normalizeCpfDigits } from '@/src/utils/auth';

export default function TelaLoginIdoso() {
  const [cpf, setCpf] = React.useState('');
  const [senha, setSenha] = React.useState('');
  const [error, setError] = React.useState<{ title: string; message: string } | null>(null);
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleEntrar = async () => {
    const cpfDigits = normalizeCpfDigits(cpf);

    if (!cpfDigits || !senha) {
      setError({ title: 'Campos obrigatórios', message: 'Preencha CPF e senha para continuar.' });
      return;
    }

    if (cpfDigits.length !== 11) {
      setError({ title: 'CPF inválido', message: 'Digite um CPF com 11 números para entrar.' });
      return;
    }

    try {
      setError(null);
      setIsSubmitting(true);

      await api.post('/auth/idoso/login', {
        cpf: cpfDigits,
        senha,
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
    router.push('./tela_tutorial_idoso');
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
      }>
      <View style={styles.form}>
        <TextField
          value={formatCpf(cpf)}
          onChangeText={(v) => {
            setCpf(v);
            setError(null);
          }}
          placeholder="000.000.000-00"
          keyboardType="number-pad"
          maxLength={14}
        />
        <TextField
          value={senha}
          onChangeText={(v) => {
            setSenha(v);
            setError(null);
          }}
          placeholder="Senha"
          secureTextEntry
        />

        <PrimaryButton
          title={isSubmitting ? 'Entrando...' : 'Entrar'}
          onPress={handleEntrar}
          disabled={isSubmitting}
          style={styles.primaryButton}
          gradientColors={['#FFB06A', '#FF9230']}
        />
      </View>

      <FeedbackModal
        visible={!!error}
        variant="error"
        title={error?.title ?? 'Erro'}
        message={error?.message ?? ''}
        primaryActionLabel="Fechar"
        primaryColor="#F58220"
        onPrimaryAction={() => setError(null)}
        onClose={() => setError(null)}
      />
      <FeedbackModal
        visible={showSuccessModal}
        variant="success"
        title="Login realizado com sucesso"
        message="Seu acesso foi confirmado. Clique em continuar para entrar no app."
        primaryActionLabel="Continuar"
        primaryColor="#F58220"
        onPrimaryAction={handleContinue}
        onClose={() => setShowSuccessModal(false)}
      />
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
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
  backButton: {
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
  form: {
    width: '100%',
    maxWidth: 320,
    alignSelf: 'center',
  },
  primaryButton: {
    alignSelf: 'center',
    marginTop: 8,
  },
});
