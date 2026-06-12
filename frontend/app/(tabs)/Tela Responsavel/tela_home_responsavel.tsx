import { Feather, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
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
import { SafeAreaView, SafeAreaView as SafeAreaInsetsView } from 'react-native-safe-area-context';

import {
  BirthDateInput,
  formatDateForStorage,
  parseDateDisplay,
} from '@/components/birth-date-input';
import { useAppAlert } from '@/components/app-alert';
import { PasswordInput, PasswordVisibilityToggle } from '@/components/password-input';
import { useLanguage } from '@/contexts/language-context';
import { useResponsavelProfile } from '@/contexts/responsavel-profile-context';
import { createIdosoForResponsavel, getAuthErrorMessage } from '@/lib/firebase-auth-service';
import { subscribeIdososForCurrentResponsavel, type IdosoResumo } from '@/lib/idoso-data-service';

export default function TelaHomeResponsavel() {
  const { showError, showSuccess, showWarning } = useAppAlert();
  const { profile } = useResponsavelProfile();
  const { t } = useLanguage();
  const [idosos, setIdosos] = React.useState<IdosoResumo[] | null>(null);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [nomeIdoso, setNomeIdoso] = React.useState('');
  const [cpfIdoso, setCpfIdoso] = React.useState('');
  const [dataNasc, setDataNasc] = React.useState('');
  const [senhaIdoso, setSenhaIdoso] = React.useState('');
  const [confirmSenhaIdoso, setConfirmSenhaIdoso] = React.useState('');
  const [showSenhaIdoso, setShowSenhaIdoso] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    return subscribeIdososForCurrentResponsavel(setIdosos, () => setIdosos([]));
  }, []);

  const formatCpfDisplay = (digits: string) => {
    const d = digits.replace(/\D/g, '').slice(0, 11);
    if (d.length <= 3) {
      return d;
    }
    if (d.length <= 6) {
      return `${d.slice(0, 3)}.${d.slice(3)}`;
    }
    if (d.length <= 9) {
      return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
    }
    return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
  };

  const openCadastroIdosoModal = () => {
    setNomeIdoso('');
    setCpfIdoso('');
    setDataNasc('');
    setSenhaIdoso('');
    setConfirmSenhaIdoso('');
    setShowSenhaIdoso(false);
    setModalVisible(true);
  };

  const handleCadastrarIdoso = async () => {
    const nome = nomeIdoso.trim();
    const cpfDigits = cpfIdoso.replace(/\D/g, '');
    const birthDate = parseDateDisplay(dataNasc.trim());

    if (!nome || cpfDigits.length !== 11 || !dataNasc.trim() || !senhaIdoso || !confirmSenhaIdoso) {
      showWarning(t('Campos obrigatórios'), t('Preencha todos os campos.'));
      return;
    }
    if (senhaIdoso.length < 6) {
      showWarning(t('Senha'), t('Use pelo menos 6 caracteres.'));
      return;
    }
    if (senhaIdoso !== confirmSenhaIdoso) {
      showWarning(t('Senha'), t('As senhas nao sao iguais.'));
      return;
    }
    if (!birthDate) {
      showWarning(t('Data'), t('Digite uma data valida.'));
      return;
    }

    try {
      setSaving(true);
      await createIdosoForResponsavel({
        cpfDigits,
        nomeIdoso: nome,
        dataNascimento: formatDateForStorage(birthDate),
        senha: senhaIdoso,
      });
      setModalVisible(false);
      setNomeIdoso('');
      setCpfIdoso('');
      setDataNasc('');
      setSenhaIdoso('');
      setConfirmSenhaIdoso('');
      setShowSenhaIdoso(false);
      showSuccess(t('Tudo certo'), t('Idoso cadastrado.'));
    } catch (e) {
      showError(t('Erro'), t(getAuthErrorMessage(e, 'email')));
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView edges={['left', 'right']} style={styles.safeArea}>
      <View style={styles.container}>
        <SafeAreaInsetsView edges={['top']} style={styles.headerSafeArea}>
          <View style={styles.header}>
            <Text style={styles.greeting}>{t('Olá')}, {profile.nome.split(' ')[0] || 'Fulano'}</Text>

            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => router.push('./tela_editar_perfil_responsavel')}
              style={styles.avatar}>
              {profile.photoUri ? (
                <Image source={{ uri: profile.photoUri }} style={styles.avatarImage} />
              ) : (
                <Ionicons name="person" size={18} color="#1F1F1F" />
              )}
            </TouchableOpacity>
          </View>
        </SafeAreaInsetsView>

        <View style={styles.content}>
          {idosos === null ? (
            <ActivityIndicator size="large" color="#1456FF" />
          ) : idosos.length === 0 ? (
            <>
              <Text style={styles.emptyText}>{t('Nenhum Idoso cadastrado!')}</Text>
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={openCadastroIdosoModal}
                style={styles.addButton}>
                <Text style={styles.addButtonText}>+ {t('Cadastrar idoso')}</Text>
              </TouchableOpacity>
            </>
          ) : (
            <FlatList
              data={idosos}
              keyExtractor={(item) => item.uid}
              contentContainerStyle={styles.idosoList}
              ListHeaderComponent={<Text style={styles.sectionTitle}>{t('Toque em um idoso para abrir os cuidados')}</Text>}
              renderItem={({ item }) => (
                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={() =>
                    router.push({
                      pathname: './tela_detalhes_idoso_responsavel',
                      params: { idosoUid: item.uid },
                    })
                  }
                  style={styles.idosoCard}>
                  <View style={styles.idosoAvatar}>
                    {item.fotoPerfil && item.fotoPerfil !== 'imagem_padrao.png' ? (
                      <Image source={{ uri: item.fotoPerfil }} style={styles.idosoAvatarImage} />
                    ) : (
                      <Ionicons name="person" size={24} color="#1456FF" />
                    )}
                  </View>
                  <View style={styles.idosoInfo}>
                    <Text style={styles.idosoName}>{item.nomeIdoso || t('Sem nome')}</Text>
                    <Text style={styles.idosoMeta}>CPF: {formatCpfDisplay(item.cpf)}</Text>
                    <Text style={styles.idosoMeta}>{t('Nascimento')}: {item.dataNascimento || '-'}</Text>
                  </View>
                  <Feather name="chevron-right" size={22} color="#1456FF" />
                </TouchableOpacity>
              )}
            />
          )}
        </View>

        <View style={styles.bottomBar}>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => router.push('./tela_painel_responsavel')}
            style={styles.navItem}>
            <Feather name="edit-3" size={24} color="#121212" />
            <Text style={styles.navLabel}>{t('panel')}</Text>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.6} style={styles.navItem}>
            <View style={styles.homeActive}>
              <Image source={require('../../../assets/images/home.png')} style={styles.navIcon} />
            </View>
            <Text style={styles.navLabel}>{t('home')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => router.push('./tela_config_responsavel')}
            style={styles.navItem}>
            <Feather name="settings" size={24} color="#121212" />
            <Text style={styles.navLabel}>{t('configuration')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        animationType="fade"
        transparent
        visible={modalVisible}
        onRequestClose={() => !saving && setModalVisible(false)}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={() => !saving && setModalVisible(false)} />
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{t('Cadastrar idoso')}</Text>
            <Text style={styles.modalHint}>
              {t('O idoso vai entrar com CPF e senha.')}
            </Text>
            <TextInput
              placeholder={t('Nome completo')}
              placeholderTextColor="#737373"
              style={styles.modalInput}
              value={nomeIdoso}
              onChangeText={setNomeIdoso}
            />
            <TextInput
              keyboardType="number-pad"
              maxLength={14}
              placeholder="CPF"
              placeholderTextColor="#737373"
              style={styles.modalInput}
              value={formatCpfDisplay(cpfIdoso)}
              onChangeText={(t) => setCpfIdoso(t.replace(/\D/g, '').slice(0, 11))}
            />
            <BirthDateInput
              containerStyle={styles.modalDateInput}
              onChangeText={setDataNasc}
              placeholder={t('Data de nascimento')}
              value={dataNasc}
            />
            <PasswordInput
              placeholder={t('Senha (mín. 6 caracteres)')}
              containerStyle={styles.modalPasswordField}
              fieldStyle={styles.modalInput}
              inputStyle={styles.passwordInputText}
              showToggle={false}
              visible={showSenhaIdoso}
              value={senhaIdoso}
              onChangeText={setSenhaIdoso}
            />
            <PasswordInput
              placeholder={t('Confirmar senha')}
              containerStyle={styles.confirmModalPasswordField}
              fieldStyle={styles.modalInput}
              inputStyle={styles.passwordInputText}
              showToggle={false}
              visible={showSenhaIdoso}
              value={confirmSenhaIdoso}
              onChangeText={setConfirmSenhaIdoso}
            />
            <PasswordVisibilityToggle
              visible={showSenhaIdoso}
              onPress={() => setShowSenhaIdoso((current) => !current)}
              style={styles.modalPasswordToggle}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                disabled={saving}
                onPress={() => setModalVisible(false)}
                style={styles.modalBtnSecondary}>
                <Text style={styles.modalBtnSecondaryText}>{t('Cancelar')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={saving}
                onPress={() => void handleCadastrarIdoso()}
                style={styles.modalBtnPrimary}>
                {saving ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.modalBtnPrimaryText}>{t('Salvar')}</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
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
  headerSafeArea: {
    backgroundColor: '#1456FF',
  },
  header: {
    height: 84,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  greeting: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F0D9B5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 28,
    gap: 20,
  },
  sectionTitle: {
    marginBottom: 14,
    fontSize: 15,
    fontWeight: '700',
    color: '#555555',
    textAlign: 'center',
  },
  idosoList: {
    paddingBottom: 22,
  },
  idosoCard: {
    minHeight: 96,
    borderRadius: 14,
    backgroundColor: '#F4F7FF',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: '#D7E1FF',
    marginBottom: 12,
  },
  idosoAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  idosoAvatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  idosoInfo: {
    flex: 1,
  },
  idosoName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#151515',
  },
  idosoMeta: {
    marginTop: 2,
    fontSize: 13,
    color: '#555555',
  },
  emptyText: {
    marginTop: 'auto',
    fontSize: 16,
    fontWeight: '600',
    color: '#707070',
    textAlign: 'center',
  },
  addButton: {
    alignSelf: 'center',
    marginBottom: 'auto',
    backgroundColor: '#1456FF',
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 999,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
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
  homeActive: {
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
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111',
    marginBottom: 8,
  },
  modalHint: {
    fontSize: 12,
    color: '#555',
    marginBottom: 14,
    lineHeight: 17,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#C8C8C8',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    marginBottom: 10,
    color: '#151515',
  },
  passwordInputText: {
    fontSize: 15,
    color: '#151515',
  },
  modalDateInput: {
    marginBottom: 10,
  },
  modalPasswordField: {
    marginBottom: 10,
  },
  confirmModalPasswordField: {
    marginBottom: 0,
  },
  modalPasswordToggle: {
    marginBottom: 10,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8,
  },
  modalBtnSecondary: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  modalBtnSecondaryText: {
    color: '#444',
    fontWeight: '600',
  },
  modalBtnPrimary: {
    backgroundColor: '#1456FF',
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 12,
    minWidth: 100,
    alignItems: 'center',
  },
  modalBtnPrimaryText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
