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
import { PasswordInput, PasswordVisibilityToggle } from '@/components/password-input';
import { ResponsavelGoogleSignInButton } from '@/components/responsavel-google-sign-in-button';
import { useLanguage } from '@/contexts/language-context';
import { useResponsavelProfile } from '@/contexts/responsavel-profile-context';
import {
  getAuthErrorMessage,
  loginResponsavelFirebase,
  resendResponsavelEmailVerification,
} from '@/lib/firebase-auth-service';

const RESEND_COOLDOWN_SECONDS = 35;

export default function HomeScreen() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [errorTitle, setErrorTitle] = React.useState('Erro no login');
  const [showErrorModal, setShowErrorModal] = React.useState(false);
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [canResendVerification, setCanResendVerification] = React.useState(false);
  const [resendCooldown, setResendCooldown] = React.useState(0);
  const [isResendingVerification, setIsResendingVerification] = React.useState(false);
  const [resendFeedback, setResendFeedback] = React.useState('');
  const { updateProfile } = useResponsavelProfile();
  const { t } = useLanguage();

  const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const openErrorModal = (title: string, message: string, allowResend = false) => {
    setErrorTitle(title);
    setErrorMessage(message);
    setCanResendVerification(allowResend);
    setResendFeedback('');
    setShowErrorModal(true);
  };

  React.useEffect(() => {
    if (!showErrorModal || !canResendVerification || resendCooldown <= 0) {
      return undefined;
    }

    const id = setTimeout(() => {
      setResendCooldown((current) => Math.max(0, current - 1));
    }, 1000);

    return () => clearTimeout(id);
  }, [canResendVerification, resendCooldown, showErrorModal]);

  const handleLogin = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      const message = t('Preencha e-mail e senha.');
      openErrorModal(t('Campos obrigatórios'), message);
      return;
    }

    if (password.length < 6) {
      openErrorModal(t('Senha'), t('Use pelo menos 6 caracteres.'));
      return;
    }

    if (!isValidEmail(normalizedEmail)) {
      const message = t('Digite um e-mail valido.');
      openErrorModal(t('Email inválido'), message);
      return;
    }

    try {
      setErrorMessage('');
      setShowErrorModal(false);
      setIsSubmitting(true);

      const user = await loginResponsavelFirebase(normalizedEmail, password);

      updateProfile({
        nome: user.nome,
        usuario: user.nome,
        email: user.email,
        photoUri: user.fotoPerfil ?? null,
        authProvider: 'password',
      });

      setShowSuccessModal(true);
    } catch (error) {
      const isEmailNotVerified =
        error && typeof error === 'object' && 'code' in error
          ? String((error as { code: string }).code) === 'EMAIL_NOT_VERIFIED'
          : false;
      if (isEmailNotVerified) {
        setResendCooldown(RESEND_COOLDOWN_SECONDS);
      }
      openErrorModal(t('Erro no login'), t(getAuthErrorMessage(error, 'email')), isEmailNotVerified);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendVerification = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      openErrorModal(
        t('Campos obrigatórios'),
        t('Preencha e-mail e senha.'),
        true,
      );
      return;
    }

    if (resendCooldown > 0 || isResendingVerification) {
      return;
    }

    try {
      setIsResendingVerification(true);
      setResendFeedback('');
      await resendResponsavelEmailVerification(normalizedEmail, password);
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
      setResendFeedback(t('Novo link enviado.'));
    } catch (error) {
      setResendFeedback('');
      openErrorModal(t('Erro'), t(getAuthErrorMessage(error, 'email')), true);
    } finally {
      setIsResendingVerification(false);
    }
  };

  const handleContinue = () => {
    setShowSuccessModal(false);
    router.push('./tela_home_responsavel');
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
            <Text style={styles.backButtonText}>{t('Voltar')}</Text>
          </TouchableOpacity>
          <Image
            source={require('../../../assets/images/logo.jpeg')}
            style={styles.logo}
            contentFit="contain"
          />

          <Text style={styles.title}>{t('Entre Agora')}</Text>
          <Text style={styles.subtitle}>
            {t('Por favor entre na sua conta para')}{'\n'}{t('continuar usando nosso app')}
          </Text>

          <View style={styles.form}>
            <TextInput
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={(value) => {
                setEmail(value);
                if (showErrorModal) {
                  setShowErrorModal(false);
                }
                setCanResendVerification(false);
              }}
              placeholder={t('Email')}
              placeholderTextColor="#737373"
              style={styles.input}
              value={email}
            />

            <PasswordInput
              onChangeText={(value) => {
                setPassword(value);
                if (showErrorModal) {
                  setShowErrorModal(false);
                }
                setCanResendVerification(false);
              }}
              placeholder={t('Senha')}
              fieldStyle={styles.input}
              inputStyle={styles.passwordInputText}
              showToggle={false}
              visible={isPasswordVisible}
              value={password}
            />

            <View style={styles.passwordActionsRow}>
              <PasswordVisibilityToggle
                visible={isPasswordVisible}
                onPress={() => setIsPasswordVisible((current) => !current)}
              />

              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => router.push('./tela_recuperar_senha_responsavel')}
                style={styles.forgotPasswordWrapper}>
                <Text style={styles.forgotPasswordText}>{t('Recuperar senha')}</Text>
              </TouchableOpacity>
            </View>

            {errorMessage ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            ) : null}

            <TouchableOpacity
              activeOpacity={0.6}
              onPress={handleLogin}
              disabled={isSubmitting}
              style={styles.buttonWrapper}>
              <LinearGradient
                colors={['#2E6BFF', '#0047FF']}
                end={{ x: 1, y: 0.5 }}
                start={{ x: 0, y: 0.5 }}
                style={styles.button}>
                <Text style={styles.buttonText}>{isSubmitting ? t('Entrando...') : t('Entrar')}</Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>{t('ou')}</Text>
              <View style={styles.dividerLine} />
            </View>

            <ResponsavelGoogleSignInButton
              disabled={isSubmitting}
              onBusyChange={setIsSubmitting}
              onError={(message) => openErrorModal('Google', t(message))}
              onSuccess={(user) => {
                setErrorMessage('');
                setShowErrorModal(false);
                updateProfile({
                  nome: user.nome,
                  usuario: user.nome,
                  email: user.email,
                  photoUri: user.fotoPerfil ?? null,
                  authProvider: 'google',
                });
                setShowSuccessModal(true);
              }}
            />

            <View style={styles.signupRow}>
              <Text style={styles.signupText}>{t('Não possui uma conta?')}</Text>
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => router.push('./tela_cadastro_responsavel')}
                style={styles.signupLinkWrapper}>
                <Text style={styles.signupHighlight}>{t('Cria uma agora')}</Text>
              </TouchableOpacity>
            </View>
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

            {resendFeedback ? <Text style={styles.resendFeedback}>{resendFeedback}</Text> : null}

            {canResendVerification ? (
              <TouchableOpacity
                activeOpacity={0.75}
                disabled={resendCooldown > 0 || isResendingVerification}
                onPress={handleResendVerification}
                style={[
                  styles.modalResendButton,
                  (resendCooldown > 0 || isResendingVerification) &&
                    styles.modalResendButtonDisabled,
                ]}>
                <Text style={styles.modalResendButtonText}>
                  {isResendingVerification
                    ? t('Reenviando...')
                    : resendCooldown > 0
                      ? `${t('Reenviar link em')} ${resendCooldown}s`
                      : t('Reenviar link')}
                </Text>
              </TouchableOpacity>
            ) : null}

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setShowErrorModal(false)}
              style={styles.modalErrorButton}>
              <Text style={styles.modalButtonText}>{t('Fechar')}</Text>
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
            <View style={styles.modalIconWrap}>
              <Text style={styles.modalIcon}>✓</Text>
            </View>
            <Text style={styles.modalTitle}>{t('Login feito')}</Text>
            <Text style={styles.modalText}>{t('Pode continuar.')}</Text>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleContinue}
              style={styles.modalButton}>
              <Text style={styles.modalButtonText}>{t('Continuar')}</Text>
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
  passwordInputText: {
    fontSize: 16,
    color: '#151515',
  },
  passwordActionsRow: {
    minHeight: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: -8,
    marginBottom: 34,
  },
  errorBox: {
    borderRadius: 14,
    backgroundColor: '#FFE5E5',
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
  },
  errorText: {
    color: '#B42318',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  forgotPasswordWrapper: {
    minHeight: 28,
    justifyContent: 'center',
  },
  forgotPasswordText: {
    fontSize: 11,
    color: '#3C3C3C',
    textDecorationLine: 'underline',
  },
  buttonWrapper: {
    alignItems: 'center',
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
    width: '100%',
    maxWidth: 320,
    alignSelf: 'center',
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
  modalIcon: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0C4DFF',
  },
  modalErrorIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 999,
    backgroundColor: '#FFE5E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  modalErrorIcon: {
    fontSize: 24,
    fontWeight: '800',
    color: '#D92D20',
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
  resendFeedback: {
    fontSize: 13,
    lineHeight: 18,
    color: '#0C4DFF',
    textAlign: 'center',
    marginTop: -8,
    marginBottom: 14,
  },
  modalButton: {
    minWidth: 150,
    minHeight: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0C4DFF',
    paddingHorizontal: 18,
  },
  modalErrorButton: {
    minWidth: 150,
    minHeight: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D92D20',
    paddingHorizontal: 18,
  },
  modalResendButton: {
    width: '100%',
    minHeight: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF3FF',
    paddingHorizontal: 18,
    marginTop: -4,
    marginBottom: 12,
  },
  modalResendButtonDisabled: {
    opacity: 0.58,
  },
  modalResendButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0C4DFF',
  },
  modalButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
