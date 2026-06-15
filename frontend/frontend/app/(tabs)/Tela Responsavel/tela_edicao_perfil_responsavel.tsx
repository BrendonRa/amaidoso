import { Feather, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import {
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useResponsavelProfile } from '@/contexts/responsavel-profile-context';
import { PasswordInput, PasswordVisibilityToggle } from '@/components/password-input';
import {
  getCurrentResponsavelAuthProvider,
  getAuthErrorMessage,
  requestResponsavelEmailChange,
  updateCurrentResponsavelProfile,
} from '@/lib/firebase-auth-service';
import { BirthDateInput } from '@/components/birth-date-input';

export default function TelaEdicaoPerfilResponsavel() {
  const { profile, updateProfile } = useResponsavelProfile();
  const [showConfirmModal, setShowConfirmModal] = React.useState(false);
  const [showEmailSentModal, setShowEmailSentModal] = React.useState(false);
  const [pendingEmail, setPendingEmail] = React.useState(profile.email);
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmNewPassword, setConfirmNewPassword] = React.useState('');
  const [showNewPasswords, setShowNewPasswords] = React.useState(false);
  const [formError, setFormError] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const authProvider =
    profile.authProvider !== 'unknown' ? profile.authProvider : getCurrentResponsavelAuthProvider();
  const shouldAskCurrentPassword = authProvider !== 'google';
  const isChangingEmail = pendingEmail.trim().toLowerCase() !== profile.email.trim().toLowerCase();
  const shouldCreatePassword = authProvider === 'google' && isChangingEmail;

  const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  async function pickImage() {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Permita acessar suas fotos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      base64: true,
      quality: 0.45,
    });

    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];
      const photoValue = asset.base64
        ? `data:${asset.mimeType ?? 'image/jpeg'};base64,${asset.base64}`
        : asset.uri;
      updateProfile({ photoUri: photoValue });
    }
  }

  const handleConfirmChanges = () => {
    const normalizedNewEmail = pendingEmail.trim().toLowerCase();
    const currentEmail = profile.email.trim().toLowerCase();

    if (!normalizedNewEmail) {
      setFormError('Digite seu e-mail.');
      return;
    }

    if (!isValidEmail(normalizedNewEmail)) {
      setFormError('Digite um e-mail valido.');
      return;
    }

    if (normalizedNewEmail !== currentEmail && shouldAskCurrentPassword && !currentPassword) {
      setFormError('Digite sua senha.');
      return;
    }

    if (normalizedNewEmail !== currentEmail && shouldCreatePassword) {
      if (!newPassword || !confirmNewPassword) {
        setFormError('Digite e confirme a senha.');
        return;
      }

      if (newPassword.length < 6) {
        setFormError('Use pelo menos 6 caracteres.');
        return;
      }

      if (newPassword !== confirmNewPassword) {
        setFormError('As senhas nao sao iguais.');
        return;
      }
    }

    setFormError('');
    setShowConfirmModal(true);
  };

  const handleProceed = async () => {
    const normalizedNewEmail = pendingEmail.trim().toLowerCase();
    const currentEmail = profile.email.trim().toLowerCase();

    try {
      setIsSubmitting(true);

      await updateCurrentResponsavelProfile({
        nome: profile.nome,
        usuario: profile.usuario,
        nascimento: profile.nascimento,
        fotoPerfil: profile.photoUri,
      });

      if (normalizedNewEmail !== currentEmail) {
        await requestResponsavelEmailChange(
          normalizedNewEmail,
          shouldAskCurrentPassword ? currentPassword : undefined,
          shouldCreatePassword ? newPassword : undefined,
        );
        setShowConfirmModal(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        if (shouldCreatePassword) {
          updateProfile({ authProvider: 'password' });
        }
        setShowEmailSentModal(true);
        return;
      }

      setShowConfirmModal(false);
      router.push('./tela_editar_perfil_responsavel');
    } catch (error) {
      setShowConfirmModal(false);
      Alert.alert(
        'Erro',
        getAuthErrorMessage(error, authProvider === 'google' ? 'google' : 'email'),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView
          bounces={false}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.avatarWrapper}>
            <TouchableOpacity activeOpacity={0.8} onPress={pickImage} style={styles.avatar}>
              {profile.photoUri ? (
                <Image source={{ uri: profile.photoUri }} style={styles.avatarImage} />
              ) : (
                <Ionicons name="person-outline" size={58} color="#5A429B" />
              )}
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.6} onPress={pickImage} style={styles.cameraButton}>
              <Feather name="image" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.formCard}>
            <View style={styles.fieldBlock}>
              <Text style={styles.label}>Nome</Text>
              <TextInput
                onChangeText={(value) => updateProfile({ nome: value })}
                style={styles.input}
                value={profile.nome}
              />
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.label}>Nome de Usuário</Text>
              <TextInput
                onChangeText={(value) => updateProfile({ usuario: value })}
                style={styles.input}
                value={profile.usuario}
              />
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.label}>Data de Nascimento</Text>
              <BirthDateInput
                containerStyle={styles.profileDateInput}
                onChangeText={(value) => updateProfile({ nascimento: value })}
                value={profile.nascimento}
              />
            </View>

            <View style={[styles.fieldBlock, styles.emailFieldBlock]}>
              <View style={styles.emailHeaderRow}>
                <View style={styles.emailIconWrap}>
                  <Feather name="mail" size={18} color="#0C4DFF" />
                </View>
                <View style={styles.emailHeaderText}>
                  <Text style={styles.emailLabel}>E-mail de acesso</Text>
                  <Text style={styles.emailHint}>
                    {authProvider === 'google'
                      ? 'Para trocar, crie uma senha.'
                      : 'Para trocar, digite sua senha.'}
                  </Text>
                </View>
              </View>
              <TextInput
                autoCapitalize="none"
                keyboardType="email-address"
                onChangeText={(value) => {
                  setPendingEmail(value);
                  if (formError) {
                    setFormError('');
                  }
                  if (value.trim().toLowerCase() === profile.email.trim().toLowerCase()) {
                    setNewPassword('');
                    setConfirmNewPassword('');
                  }
                }}
                placeholder="seuemail@exemplo.com"
                placeholderTextColor="#7A86A8"
                style={[styles.input, styles.emailInput]}
                value={pendingEmail}
              />
            </View>

            {shouldAskCurrentPassword ? (
              <View style={styles.fieldBlock}>
                <Text style={styles.label}>Senha atual para alterar e-mail</Text>
                <PasswordInput
                  onChangeText={(value) => {
                    setCurrentPassword(value);
                    if (formError) {
                      setFormError('');
                    }
                  }}
                  placeholder="Digite sua senha atual"
                  placeholderTextColor="#777777"
                  fieldStyle={styles.input}
                  inputStyle={styles.passwordInputText}
                  iconColor="#777777"
                  value={currentPassword}
                />
              </View>
            ) : shouldCreatePassword ? (
              <View style={styles.passwordSetupBox}>
                <View style={styles.passwordSetupHeader}>
                  <Feather name="key" size={16} color="#0C4DFF" />
                  <Text style={styles.passwordSetupTitle}>Crie uma senha para o novo acesso</Text>
                </View>
                <Text style={styles.passwordSetupText}>
                  Use esta senha no proximo login.
                </Text>
                <PasswordInput
                  onChangeText={(value) => {
                    setNewPassword(value);
                    if (formError) {
                      setFormError('');
                    }
                  }}
                  placeholder="Nova senha (min. 6 caracteres)"
                  placeholderTextColor="#777777"
                  containerStyle={styles.passwordInput}
                  fieldStyle={styles.input}
                  inputStyle={styles.passwordInputText}
                  iconColor="#777777"
                  showToggle={false}
                  visible={showNewPasswords}
                  value={newPassword}
                />
                <PasswordInput
                  onChangeText={(value) => {
                    setConfirmNewPassword(value);
                    if (formError) {
                      setFormError('');
                    }
                  }}
                  placeholder="Confirmar nova senha"
                  placeholderTextColor="#777777"
                  containerStyle={styles.confirmPasswordInput}
                  fieldStyle={styles.input}
                  inputStyle={styles.passwordInputText}
                  iconColor="#777777"
                  showToggle={false}
                  visible={showNewPasswords}
                  value={confirmNewPassword}
                />
                <PasswordVisibilityToggle
                  iconColor="#777777"
                  visible={showNewPasswords}
                  onPress={() => setShowNewPasswords((current) => !current)}
                  style={styles.sharedPasswordToggle}
                />
              </View>
            ) : (
              <View style={styles.googleNotice}>
                <Feather name="info" size={16} color="#0C4DFF" />
                <Text style={styles.googleNoticeText}>
                  Para trocar o e-mail, crie uma senha.
                </Text>
              </View>
            )}

            {formError ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{formError}</Text>
              </View>
            ) : null}
          </View>

          <TouchableOpacity
            activeOpacity={0.6}
            onPress={handleConfirmChanges}
            style={styles.confirmButton}>
            <Feather name="chevron-down" size={18} color="#FFFFFF" />
            <Text style={styles.confirmText}>Confirmar Alteração</Text>
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.bottomBar}>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => router.push('./tela_painel_responsavel')}
            style={styles.navItem}>
            <Feather name="edit-3" size={24} color="#121212" />
            <Text style={styles.navLabel}>Painel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => router.push('./tela_home_responsavel')}
            style={styles.navItem}>
            <Image source={require('../../../assets/images/home.png')} style={styles.navIcon} />
            <Text style={styles.navLabel}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => router.push('./tela_config_responsavel')}
            style={styles.navItem}>
            <View style={styles.activePill}>
              <Feather name="settings" size={24} color="#121212" />
            </View>
            <Text style={styles.navLabel}>Configurações</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        animationType="fade"
        transparent
        visible={showConfirmModal}
        onRequestClose={() => setShowConfirmModal(false)}>
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={() => setShowConfirmModal(false)} />
          <View style={styles.modalCard}>
            <View style={styles.modalIconWrap}>
              <Feather name="check" size={24} color="#0C4DFF" />
            </View>
            <Text style={styles.modalTitle}>Confirmar alterações</Text>
            <Text style={styles.modalText}>
              {pendingEmail.trim().toLowerCase() !== profile.email.trim().toLowerCase()
                ? authProvider === 'google'
                  ? 'Enviaremos um link para o novo e-mail.'
                  : 'Enviaremos um link para o novo e-mail.'
                : 'Salvar alteracoes?'}
            </Text>

            <View style={styles.modalActions}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => setShowConfirmModal(false)}
                style={styles.modalSecondaryButton}>
                <Text style={styles.modalSecondaryText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleProceed}
                disabled={isSubmitting}
                style={styles.modalPrimaryButton}>
                <Text style={styles.modalPrimaryText}>
                  {isSubmitting ? 'Enviando...' : 'Confirmar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent
        visible={showEmailSentModal}
        onRequestClose={() => setShowEmailSentModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalIconWrap}>
              <Feather name="mail" size={24} color="#0C4DFF" />
            </View>
            <Text style={styles.modalTitle}>Confirme o novo e-mail</Text>
            <Text style={styles.modalText}>Abra o e-mail e toque no link.</Text>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => {
                setShowEmailSentModal(false);
                router.push('./tela_editar_perfil_responsavel');
              }}
              style={styles.singleModalButton}>
              <Text style={styles.modalPrimaryText}>Entendi</Text>
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
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingTop: 18,
    paddingHorizontal: 14,
    paddingBottom: 24,
  },
  avatarWrapper: {
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#E9D9FF',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cameraButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1F63FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -18,
    marginLeft: 72,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  formCard: {
    borderRadius: 16,
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 10,
    paddingVertical: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  fieldBlock: {
    marginBottom: 6,
  },
  emailFieldBlock: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#9DBBFF',
    backgroundColor: '#EEF4FF',
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 12,
    marginTop: 4,
    marginBottom: 10,
  },
  emailHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  emailIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emailHeaderText: {
    flex: 1,
  },
  emailLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0B2F86',
  },
  emailHint: {
    marginTop: 2,
    fontSize: 12,
    lineHeight: 16,
    color: '#304A7A',
  },
  emailInput: {
    borderColor: '#0C4DFF',
    borderWidth: 1.5,
    fontSize: 15,
    fontWeight: '700',
  },
  googleNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    borderRadius: 12,
    backgroundColor: '#EDF4FF',
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
  },
  googleNoticeText: {
    flex: 1,
    color: '#26466F',
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '600',
  },
  passwordSetupBox: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#B7CCFF',
    backgroundColor: '#F5F8FF',
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 8,
  },
  passwordSetupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  passwordSetupTitle: {
    flex: 1,
    color: '#0B2F86',
    fontSize: 14,
    fontWeight: '800',
  },
  passwordSetupText: {
    color: '#304A7A',
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '600',
    marginBottom: 10,
  },
  passwordInput: {
    marginBottom: 8,
  },
  confirmPasswordInput: {
    marginBottom: 0,
  },
  sharedPasswordToggle: {
    marginBottom: 8,
  },
  passwordInputText: {
    fontSize: 15,
    color: '#151515',
  },
  errorBox: {
    borderRadius: 12,
    backgroundColor: '#FFE5E5',
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 4,
  },
  errorText: {
    color: '#B42318',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  label: {
    fontSize: 12,
    color: '#3A3A3A',
    marginBottom: 4,
  },
  input: {
    minHeight: 44,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4E4E4',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#111111',
    textAlignVertical: 'center',
  },
  profileDateInput: {
    minHeight: 44,
    marginBottom: 0,
  },
  confirmButton: {
    alignSelf: 'center',
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1F63FF',
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 4,
  },
  confirmText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  bottomBar: {
    height: 82,
    borderTopWidth: 1,
    borderTopColor: '#151515',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingBottom: 6,
  },
  navItem: {
    minWidth: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIcon: {
    width: 26,
    height: 26,
    resizeMode: 'contain',
  },
  navLabel: {
    marginTop: 4,
    fontSize: 12,
    color: '#1A1A1A',
  },
  activePill: {
    width: 52,
    height: 30,
    borderRadius: 999,
    backgroundColor: '#9AB8FF',
    alignItems: 'center',
    justifyContent: 'center',
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
  modalActions: {
    width: '100%',
    flexDirection: 'row',
    gap: 10,
  },
  modalSecondaryButton: {
    flex: 1,
    minHeight: 46,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D8D8D8',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  modalSecondaryText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333333',
  },
  modalPrimaryButton: {
    flex: 1,
    minHeight: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0C4DFF',
  },
  singleModalButton: {
    minWidth: 150,
    minHeight: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0C4DFF',
    paddingHorizontal: 18,
  },
  modalPrimaryText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
