import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { signOut } from 'firebase/auth';
import React from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ResponsavelGoogleSignInButton } from '@/components/responsavel-google-sign-in-button';
import { useResponsavelProfile } from '@/contexts/responsavel-profile-context';
import {
  getAuthErrorMessage,
  registerResponsavelFirebase,
  resendCurrentResponsavelEmailVerification,
} from '@/lib/firebase-auth-service';
import { getFirebaseAuth } from '@/lib/firebase';

const RESEND_COOLDOWN_SECONDS = 35;

export default function TelaCadastroResponsavel() {
  const { updateProfile } = useResponsavelProfile();
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [verificationEmail, setVerificationEmail] = React.useState('');
  const [showVerificationModal, setShowVerificationModal] = React.useState(false);
  const [resendCooldown, setResendCooldown] = React.useState(0);
  const [isResending, setIsResending] = React.useState(false);
  const [resendFeedback, setResendFeedback] = React.useState('');
  const [formError, setFormError] = React.useState('');

  const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  React.useEffect(() => {
    if (!showVerificationModal || resendCooldown <= 0) {
      return undefined;
    }

    const id = setTimeout(() => {
      setResendCooldown((current) => Math.max(0, current - 1));
    }, 1000);

    return () => clearTimeout(id);
  }, [resendCooldown, showVerificationModal]);

  /** Evita ficar em “Criando…” para sempre se rede/Firestore travarem após o Auth já ter criado o usuário. */
  function withTimeout<T>(promise: Promise<T>, ms: number, timeoutMessage: string): Promise<T> {
    return new Promise((resolve, reject) => {
      const id = setTimeout(() => reject(new Error(timeoutMessage)), ms);
      promise.then(
        (v) => {
          clearTimeout(id);
          resolve(v);
        },
        (e) => {
          clearTimeout(id);
          reject(e);
        },
      );
    });
  }

  const handleCreateAccount = async () => {
    const normalizedName = username.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedName || !normalizedEmail || !password || !confirmPassword) {
      setFormError('Preencha todos os campos para continuar.');
      return;
    }

    if (!isValidEmail(normalizedEmail)) {
      setFormError('');
      Alert.alert('Email inválido', 'Digite um email válido para concluir o cadastro.');
      return;
    }

    if (password.length < 6) {
      setFormError('');
      Alert.alert('Senha', 'A senha deve ter pelo menos 6 caracteres (Firebase).');
      return;
    }

    if (password !== confirmPassword) {
      setFormError('As senhas não conferem. Digite a mesma senha nos dois campos.');
      return;
    }

    try {
      setIsSubmitting(true);

      await withTimeout(
        registerResponsavelFirebase(normalizedName, normalizedEmail, password),
        30_000,
        'TIMEOUT_CADASTRO',
      );

      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setFormError('');
      setVerificationEmail(normalizedEmail);
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
      setResendFeedback('');
      setShowVerificationModal(true);
    } catch (error) {
      const timedOut =
        error instanceof Error && error.message === 'TIMEOUT_CADASTRO';
      Alert.alert(
        timedOut ? 'Demora anormal' : 'Erro no cadastro',
        timedOut
          ? 'A criação da conta passou do tempo esperado (rede). Tente de novo ou abra a tela de login se o usuário já tiver sido criado.'
          : getAuthErrorMessage(error, 'email'),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoToLogin = () => {
    setShowVerificationModal(false);
    void signOut(getFirebaseAuth()).catch(() => undefined);
    router.replace('./tela_login_responsavel');
  };

  const handleResendVerification = async () => {
    if (resendCooldown > 0 || isResending) {
      return;
    }

    try {
      setIsResending(true);
      setResendFeedback('');
      await resendCurrentResponsavelEmailVerification();
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
      setResendFeedback('Novo link enviado. Confira sua caixa de entrada e o spam.');
    } catch (error) {
      Alert.alert('Não foi possível reenviar', getAuthErrorMessage(error, 'email'));
    } finally {
      setIsResending(false);
    }
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
              onChangeText={(value) => {
                setUsername(value);
                if (formError) {
                  setFormError('');
                }
              }}
              placeholder="Nome de Usuário"
              placeholderTextColor="#737373"
              style={styles.input}
              value={username}
            />

            <TextInput
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={(value) => {
                setEmail(value);
                if (formError) {
                  setFormError('');
                }
              }}
              placeholder="Email"
              placeholderTextColor="#737373"
              style={styles.input}
              value={email}
            />

            <TextInput
              onChangeText={(value) => {
                setPassword(value);
                if (formError) {
                  setFormError('');
                }
              }}
              placeholder="Senha"
              placeholderTextColor="#737373"
              secureTextEntry
              style={styles.input}
              value={password}
            />

            <TextInput
              onChangeText={(value) => {
                setConfirmPassword(value);
                if (formError) {
                  setFormError('');
                }
              }}
              placeholder="Confirmar senha"
              placeholderTextColor="#737373"
              secureTextEntry
              style={styles.input}
              value={confirmPassword}
            />

            {formError ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{formError}</Text>
              </View>
            ) : null}

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

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>ou</Text>
              <View style={styles.dividerLine} />
            </View>

            <ResponsavelGoogleSignInButton
              disabled={isSubmitting}
              onBusyChange={setIsSubmitting}
              onError={(message) => Alert.alert('Google', message)}
              onSuccess={(user) => {
                updateProfile({
                  nome: user.nome,
                  usuario: user.nome,
                  email: user.email,
                  photoUri: user.fotoPerfil ?? null,
                  authProvider: 'google',
                });
                router.replace('./tela_home_responsavel');
              }}
            />

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
        visible={showVerificationModal}
        onRequestClose={() => undefined}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalIconWrap}>
              <Text style={styles.modalIcon}>@</Text>
            </View>

            <Text style={styles.modalTitle}>Confirme seu e-mail</Text>
            <Text style={styles.modalText}>
              Enviamos um link de confirmação para {verificationEmail}. Abra esse e-mail, clique
              no link e depois entre com sua conta.
            </Text>
            <Text style={styles.modalHint}>
              Isso confirma que o endereço informado está correto. Confira também a pasta de spam.
            </Text>

            {resendFeedback ? <Text style={styles.resendFeedback}>{resendFeedback}</Text> : null}

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleGoToLogin}
              style={styles.modalPrimaryButton}>
              <Text style={styles.modalPrimaryButtonText}>Ir para login</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.75}
              disabled={resendCooldown > 0 || isResending}
              onPress={handleResendVerification}
              style={[
                styles.modalSecondaryButton,
                (resendCooldown > 0 || isResending) && styles.modalSecondaryButtonDisabled,
              ]}>
              <Text style={styles.modalSecondaryButtonText}>
                {isResending
                  ? 'Reenviando...'
                  : resendCooldown > 0
                    ? `Reenviar link em ${resendCooldown}s`
                    : 'Reenviar link'}
              </Text>
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
  errorBox: {
    borderRadius: 14,
    backgroundColor: '#FFE5E5',
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 2,
  },
  errorText: {
    color: '#B42318',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    textAlign: 'center',
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
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#D0D0D0',
  },
  dividerText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
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
    backgroundColor: 'rgba(0, 0, 0, 0.34)',
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 20,
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
  modalIcon: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0C4DFF',
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
    color: '#333333',
    textAlign: 'center',
  },
  modalHint: {
    fontSize: 13,
    lineHeight: 18,
    color: '#666666',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 14,
  },
  resendFeedback: {
    fontSize: 13,
    lineHeight: 18,
    color: '#0C4DFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  modalPrimaryButton: {
    width: '100%',
    minHeight: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0C4DFF',
    paddingHorizontal: 18,
    marginTop: 4,
  },
  modalPrimaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modalSecondaryButton: {
    width: '100%',
    minHeight: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF3FF',
    paddingHorizontal: 18,
    marginTop: 10,
  },
  modalSecondaryButtonDisabled: {
    opacity: 0.58,
  },
  modalSecondaryButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0C4DFF',
  },
});
