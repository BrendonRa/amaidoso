import { Feather, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Alert,
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
  displayDateToStorage,
  storageDateToDisplay,
} from '@/components/birth-date-input';
import { PasswordInput, PasswordVisibilityToggle } from '@/components/password-input';
import { useLanguage } from '@/contexts/language-context';
import { useResponsavelProfile } from '@/contexts/responsavel-profile-context';
import {
  createIdosoForResponsavel,
  getAuthErrorMessage,
  updateIdosoForResponsavel,
} from '@/lib/firebase-auth-service';
import { subscribeIdososForCurrentResponsavel } from '@/lib/idoso-data-service';

type IdosoItem = {
  uid: string;
  nomeIdoso: string;
  cpf: string;
  dataNascimento: string;
  fotoPerfil: string | null;
  responsavelId: string;
};

function formatCpfDisplay(digits: string) {
  const d = digits.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

export default function TelaPainelResponsavel() {
  const { profile } = useResponsavelProfile();
  const { t } = useLanguage();
  const [idosos, setIdosos] = React.useState<IdosoItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [editing, setEditing] = React.useState<IdosoItem | null>(null);
  const [nomeIdoso, setNomeIdoso] = React.useState('');
  const [cpfIdoso, setCpfIdoso] = React.useState('');
  const [dataNasc, setDataNasc] = React.useState('');
  const [senhaIdoso, setSenhaIdoso] = React.useState('');
  const [confirmSenhaIdoso, setConfirmSenhaIdoso] = React.useState('');
  const [showSenhaIdoso, setShowSenhaIdoso] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    return subscribeIdososForCurrentResponsavel(
      (nextIdosos) => {
        setIdosos(nextIdosos);
        setLoading(false);
      },
      (e) => {
        Alert.alert(t('Erro'), t(getAuthErrorMessage(e, 'email')));
        setIdosos([]);
        setLoading(false);
      },
    );
  }, [t]);

  const openCreateModal = () => {
    setEditing(null);
    setNomeIdoso('');
    setCpfIdoso('');
    setDataNasc('');
    setSenhaIdoso('');
    setConfirmSenhaIdoso('');
    setShowSenhaIdoso(false);
    setModalVisible(true);
  };

  const openEditModal = (idoso: IdosoItem) => {
    setEditing(idoso);
    setNomeIdoso(idoso.nomeIdoso);
    setCpfIdoso(idoso.cpf);
    setDataNasc(storageDateToDisplay(idoso.dataNascimento));
    setSenhaIdoso('');
    setConfirmSenhaIdoso('');
    setShowSenhaIdoso(false);
    setModalVisible(true);
  };

  const closeModal = () => {
    if (!saving) {
      setModalVisible(false);
    }
  };

  const handleSave = async () => {
    const nome = nomeIdoso.trim();
    const cpfDigits = cpfIdoso.replace(/\D/g, '');
    const storageDate = displayDateToStorage(dataNasc.trim());

    if (!nome || cpfDigits.length !== 11 || !dataNasc.trim()) {
      Alert.alert(t('Campos obrigatórios'), t('Preencha todos os campos.'));
      return;
    }
    if (!storageDate) {
      Alert.alert(t('Data'), t('Digite uma data valida.'));
      return;
    }
    if (!editing && senhaIdoso.length < 6) {
      Alert.alert(t('Senha'), t('Use pelo menos 6 caracteres.'));
      return;
    }
    if (!editing && senhaIdoso !== confirmSenhaIdoso) {
      Alert.alert(t('Senha'), t('As senhas nao sao iguais.'));
      return;
    }

    try {
      setSaving(true);
      if (editing) {
        await updateIdosoForResponsavel({
          idosoUid: editing.uid,
          nomeIdoso: nome,
          dataNascimento: storageDate,
          fotoPerfil: editing.fotoPerfil,
        });
      } else {
        await createIdosoForResponsavel({
          cpfDigits,
          nomeIdoso: nome,
          dataNascimento: storageDate,
          senha: senhaIdoso,
        });
      }
      setModalVisible(false);
      Alert.alert(t('Tudo certo'), editing ? t('Perfil atualizado.') : t('Idoso cadastrado.'));
    } catch (e) {
      Alert.alert(t('Erro'), t(getAuthErrorMessage(e, 'email')));
    } finally {
      setSaving(false);
    }
  };

  const renderIdoso = ({ item }: { item: IdosoItem }) => (
    <TouchableOpacity activeOpacity={0.75} onPress={() => openEditModal(item)} style={styles.idosoCard}>
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
        <Text style={styles.idosoMeta}>{t('Nascimento')}: {storageDateToDisplay(item.dataNascimento) || '-'}</Text>
      </View>
      <Feather name="edit-2" size={20} color="#1456FF" />
    </TouchableOpacity>
  );

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

        <View style={styles.topActions}>
          <Text style={styles.sectionTitle}>{t('Idosos cadastrados')}</Text>
          <TouchableOpacity activeOpacity={0.75} onPress={openCreateModal} style={styles.addPersonButton}>
            <Ionicons name="person-add-outline" size={24} color="#1A1A1A" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {loading ? (
            <ActivityIndicator size="large" color="#1456FF" />
          ) : idosos.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>{t('Nenhum Idoso cadastrado!')}</Text>
              <TouchableOpacity activeOpacity={0.75} onPress={openCreateModal} style={styles.emptyButton}>
                <Text style={styles.emptyButtonText}>{t('Cadastrar idoso')}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={idosos}
              keyExtractor={(item) => item.uid}
              renderItem={renderIdoso}
              contentContainerStyle={styles.listContent}
            />
          )}
        </View>

        <View style={styles.bottomBar}>
          <TouchableOpacity activeOpacity={0.6} style={styles.navItem}>
            <View style={styles.activePill}>
              <Feather name="edit-3" size={24} color="#121212" />
            </View>
            <Text style={styles.navLabel}>{t('panel')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => router.push('./tela_home_responsavel')}
            style={styles.navItem}>
            <Image source={require('../../../assets/images/home.png')} style={styles.navIcon} />
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

      <Modal animationType="fade" transparent visible={modalVisible} onRequestClose={closeModal}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={closeModal} />
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{editing ? t('Editar idoso') : t('Cadastrar idoso')}</Text>
            <Text style={styles.modalHint}>
              {editing
                ? t('CPF e senha definem o login e não são alterados por aqui.')
                : t('O idoso vai entrar no app usando este CPF e senha.')}
            </Text>
            <TextInput
              placeholder={t('Nome completo')}
              placeholderTextColor="#737373"
              style={styles.modalInput}
              value={nomeIdoso}
              onChangeText={setNomeIdoso}
            />
            <TextInput
              editable={!editing}
              keyboardType="number-pad"
              maxLength={14}
              placeholder="CPF"
              placeholderTextColor="#737373"
              style={[styles.modalInput, editing && styles.inputDisabled]}
              value={formatCpfDisplay(cpfIdoso)}
              onChangeText={(t) => setCpfIdoso(t.replace(/\D/g, '').slice(0, 11))}
            />
            <BirthDateInput
              containerStyle={styles.modalDateInput}
              onChangeText={setDataNasc}
              placeholder={t('Data de nascimento')}
              value={dataNasc}
            />
            {!editing ? (
              <>
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
              </>
            ) : null}
            <View style={styles.modalActions}>
              <TouchableOpacity disabled={saving} onPress={closeModal} style={styles.modalBtnSecondary}>
                <Text style={styles.modalBtnSecondaryText}>{t('Cancelar')}</Text>
              </TouchableOpacity>
              <TouchableOpacity disabled={saving} onPress={() => void handleSave()} style={styles.modalBtnPrimary}>
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
  topActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#151515',
  },
  addPersonButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#A9BEFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 18,
  },
  listContent: {
    paddingBottom: 18,
    gap: 12,
  },
  idosoCard: {
    minHeight: 92,
    borderRadius: 14,
    backgroundColor: '#F4F7FF',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: '#D7E1FF',
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
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#707070',
    textAlign: 'center',
  },
  emptyButton: {
    borderRadius: 999,
    backgroundColor: '#1456FF',
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
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
  activePill: {
    width: 52,
    height: 30,
    borderRadius: 999,
    backgroundColor: '#9AB8FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navLabel: {
    marginTop: 4,
    fontSize: 12,
    color: '#1A1A1A',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalCard: {
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    padding: 18,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#151515',
    textAlign: 'center',
  },
  modalHint: {
    marginTop: 6,
    marginBottom: 14,
    fontSize: 13,
    lineHeight: 18,
    color: '#666666',
    textAlign: 'center',
  },
  modalInput: {
    height: 52,
    borderWidth: 1,
    borderColor: '#B8B8B8',
    borderRadius: 14,
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#151515',
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
  },
  passwordInputText: {
    fontSize: 15,
    color: '#151515',
  },
  modalDateInput: {
    marginBottom: 12,
  },
  modalPasswordField: {
    marginBottom: 12,
  },
  confirmModalPasswordField: {
    marginBottom: 0,
  },
  modalPasswordToggle: {
    marginBottom: 12,
  },
  inputDisabled: {
    backgroundColor: '#EFEFEF',
    color: '#555555',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 4,
  },
  modalBtnSecondary: {
    minWidth: 96,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#A8A8A8',
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalBtnSecondaryText: {
    color: '#333333',
    fontWeight: '700',
  },
  modalBtnPrimary: {
    minWidth: 96,
    borderRadius: 999,
    backgroundColor: '#1456FF',
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalBtnPrimaryText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
});
