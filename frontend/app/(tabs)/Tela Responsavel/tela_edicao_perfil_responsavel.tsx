import { Feather, Ionicons } from '@expo/vector-icons';
import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import {
  Image,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { useResponsavelProfile } from '@/contexts/responsavel-profile-context';

function formatDate(date: Date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear());
  return `${day}/${month}/${year}`;
}

function parseDateString(value: string) {
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return null;

  const day = Number(match[1]);
  const month = Number(match[2]) - 1;
  const year = Number(match[3]);
  const date = new Date(year, month, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

export default function TelaEdicaoPerfilResponsavel() {
  const { profile, updateProfile } = useResponsavelProfile();
  const [showConfirmModal, setShowConfirmModal] = React.useState(false);
  const [showDatePicker, setShowDatePicker] = React.useState(false);

  async function pickImage() {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Permita o acesso à galeria para selecionar uma foto.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      updateProfile({ photoUri: result.assets[0].uri });
    }
  }

  const handleConfirmChanges = () => {
    setShowConfirmModal(true);
  };

  const handleProceed = () => {
    setShowConfirmModal(false);
    router.push('./tela_editar_perfil_responsavel');
  };

  const handleBirthChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, '').slice(0, 8);
    let maskedValue = digitsOnly;

    if (digitsOnly.length > 2) {
      maskedValue = `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2)}`;
    }

    if (digitsOnly.length > 4) {
      maskedValue = `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2, 4)}/${digitsOnly.slice(4)}`;
    }

    updateProfile({ nascimento: maskedValue });
  };

  const openCalendar = () => {
    setShowDatePicker(true);
  };

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (event.type === 'dismissed') {
      setShowDatePicker(false);
      return;
    }

    if (selectedDate) {
      updateProfile({ nascimento: formatDate(selectedDate) });
    }

    if (Platform.OS !== 'ios') {
      setShowDatePicker(false);
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
              <View style={styles.dateInputRow}>
                <TextInput
                  keyboardType="number-pad"
                  maxLength={10}
                  onChangeText={handleBirthChange}
                  placeholder="dd/mm/aaaa"
                  style={[styles.input, styles.dateInput]}
                  value={profile.nascimento}
                />
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={openCalendar}
                  style={styles.calendarButton}>
                  <Feather name="calendar" size={18} color="#0C4DFF" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                autoCapitalize="none"
                keyboardType="email-address"
                onChangeText={(value) => updateProfile({ email: value })}
                style={styles.input}
                value={profile.email}
              />
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.label}>Senha</Text>
              <TextInput
                onChangeText={(value) => updateProfile({ senha: value })}
                secureTextEntry
                style={styles.input}
                value={profile.senha}
              />
            </View>
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
              Tem certeza que deseja confirmar as alterações feitas no perfil?
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
                style={styles.modalPrimaryButton}>
                <Text style={styles.modalPrimaryText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent
        visible={showDatePicker}
        onRequestClose={() => setShowDatePicker(false)}>
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={() => setShowDatePicker(false)} />
          <View style={styles.calendarCard}>
            <Text style={styles.calendarTitle}>Selecione sua data de nascimento</Text>

            <DateTimePicker
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              maximumDate={new Date()}
              mode="date"
              onChange={handleDateChange}
              value={parseDateString(profile.nascimento) ?? new Date(2000, 0, 1)}
            />

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setShowDatePicker(false)}
              style={styles.calendarCloseButton}>
              <Text style={styles.calendarCloseText}>Fechar</Text>
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
  dateInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateInput: {
    flex: 1,
  },
  calendarButton: {
    width: 44,
    minHeight: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CFE0FF',
    backgroundColor: '#EFF5FF',
    alignItems: 'center',
    justifyContent: 'center',
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
  modalPrimaryText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  calendarCard: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 18,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 8,
  },
  calendarTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#161616',
    textAlign: 'center',
    marginBottom: 16,
  },
  calendarCloseButton: {
    alignSelf: 'center',
    minWidth: 120,
    minHeight: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0C4DFF',
    paddingHorizontal: 18,
  },
  calendarCloseText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
