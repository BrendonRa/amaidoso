import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { signOut } from 'firebase/auth';
import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useIdosoProfile } from '@/contexts/idoso-profile-context';
import { getAuthErrorMessage } from '@/lib/firebase-auth-service';
import { getFirebaseAuth } from '@/lib/firebase';
import { updateCurrentIdosoPhoto } from '@/lib/idoso-data-service';
import IdosoBottomNav from './IdosoBottomNav';

export default function TelaConfiguracaoIdoso() {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);
  const [showPhotoModal, setShowPhotoModal] = React.useState(false);
  const [savingPhoto, setSavingPhoto] = React.useState(false);
  const thumbAnim = React.useRef(new Animated.Value(1)).current;
  const { profile, updateProfile, clearProfile } = useIdosoProfile();
  const photoUri =
    profile?.fotoPerfil && profile.fotoPerfil !== 'imagem_padrao.png' ? profile.fotoPerfil : null;

  React.useEffect(() => {
    Animated.timing(thumbAnim, {
      toValue: notificationsEnabled ? 1 : 0,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [notificationsEnabled, thumbAnim]);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const handleEditProfile = () => {
    setShowPhotoModal(true);
  };

  const pickProfilePhoto = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permissão necessária', 'Permita acessar suas fotos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      base64: true,
      quality: 0.45,
    });

    if (result.canceled || !result.assets.length) {
      return;
    }

    const asset = result.assets[0];
    const photoValue = asset.base64
      ? `data:${asset.mimeType ?? 'image/jpeg'};base64,${asset.base64}`
      : asset.uri;

    await saveProfilePhoto(photoValue);
  };

  const saveProfilePhoto = async (uri: string | null) => {
    try {
      setSavingPhoto(true);
      await updateCurrentIdosoPhoto(uri);
      updateProfile({ fotoPerfil: uri || 'imagem_padrao.png' });
      setShowPhotoModal(false);
    } catch (error) {
      Alert.alert('Erro', getAuthErrorMessage(error, 'email'));
    } finally {
      setSavingPhoto(false);
    }
  };

  const toggleNotifications = () => {
    setNotificationsEnabled((prev) => !prev);
  };

  const handleConfirmLogout = async () => {
    setShowLogoutModal(false);
    try {
      await signOut(getFirebaseAuth());
    } catch {
      // segue fluxo
    }
    clearProfile();
    router.push('./tela_inicio1');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>DEFINIÇÕES</Text>
        {profile ? (
          <View style={styles.profileSummary}>
            {photoUri ? (
              <Image source={{ uri: photoUri }} style={styles.profileSummaryImage} />
            ) : (
              <Ionicons name="person-circle-outline" size={42} color="#F58220" />
            )}
            <View style={styles.profileSummaryText}>
              <Text style={styles.profileName}>{profile.nome || 'Idoso'}</Text>
              <Text style={styles.profileCpf}>CPF: {profile.cpf}</Text>
            </View>
          </View>
        ) : null}

        <View style={styles.list}>
          <TouchableOpacity activeOpacity={0.6} onPress={handleEditProfile} style={styles.itemCard}>
            <Text style={styles.itemLabel}>Editar Perfil</Text>
            <Feather name="user" size={20} color="#202020" />
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.6} style={styles.itemCard}>
            <Text style={styles.itemLabel}>Idioma</Text>
            <Ionicons name="language-outline" size={22} color="#202020" />
          </TouchableOpacity>

          <View style={styles.itemCard}>
            <Text style={styles.itemLabel}>Notificações</Text>
            <Pressable
              onPress={toggleNotifications}
              style={[
                styles.toggleButton,
                notificationsEnabled ? styles.toggleOn : styles.toggleOff,
              ]}>
              <Animated.View
                style={[
                  styles.toggleThumb,
                  {
                    transform: [
                      {
                        translateX: thumbAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [2, 24],
                        }),
                      },
                    ],
                  },
                ]}
              />
            </Pressable>
          </View>

          <TouchableOpacity activeOpacity={0.6} style={styles.itemCard}>
            <Text style={styles.itemLabel}>Ajuda</Text>
            <Feather name="help-circle" size={21} color="#202020" />
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.6} style={styles.itemCard}>
            <Text style={styles.itemLabel}>Sobre</Text>
            <MaterialCommunityIcons name="dots-horizontal" size={22} color="#202020" />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.6}
            onPress={handleLogout}
            style={styles.logoutButton}>
            <Text style={styles.logoutText}>Sair</Text>
            <Feather name="log-out" size={22} color="#202020" />
          </TouchableOpacity>
        </View>

        <IdosoBottomNav activeTab="config" />
      </View>

      <Modal
        animationType="fade"
        transparent
        visible={showPhotoModal}
        onRequestClose={() => setShowPhotoModal(false)}>
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={() => setShowPhotoModal(false)} />
          <View style={styles.modalCard}>
            <View style={styles.photoPreview}>
              {photoUri ? (
                <Image source={{ uri: photoUri }} style={styles.photoPreviewImage} />
              ) : (
                <Ionicons name="person-outline" size={62} color="#F58220" />
              )}
            </View>
            <Text style={styles.modalTitle}>Editar foto</Text>
            <Text style={styles.modalText}>Aqui voce altera sua foto.</Text>

            <View style={styles.modalStackActions}>
              <TouchableOpacity
                activeOpacity={0.8}
                disabled={savingPhoto}
                onPress={pickProfilePhoto}
                style={styles.modalFullPrimaryButton}>
                {savingPhoto ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.modalPrimaryText}>Escolher foto</Text>
                )}
              </TouchableOpacity>

              {photoUri ? (
                <TouchableOpacity
                  activeOpacity={0.8}
                  disabled={savingPhoto}
                  onPress={() => void saveProfilePhoto(null)}
                  style={styles.modalFullSecondaryButton}>
                  <Text style={styles.modalSecondaryText}>Remover foto</Text>
                </TouchableOpacity>
              ) : null}

              <TouchableOpacity
                activeOpacity={0.8}
                disabled={savingPhoto}
                onPress={() => setShowPhotoModal(false)}
                style={styles.modalFullGhostButton}>
                <Text style={styles.modalGhostText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent
        visible={showLogoutModal}
        onRequestClose={() => setShowLogoutModal(false)}>
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={() => setShowLogoutModal(false)} />
          <View style={styles.modalCard}>
            <View style={styles.modalIconWrap}>
              <Feather name="log-out" size={24} color="#A43232" />
            </View>
            <Text style={styles.modalTitle}>Deseja sair da conta?</Text>
            <Text style={styles.modalText}>Voce voltara ao inicio.</Text>

            <View style={styles.modalActions}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setShowLogoutModal(false)}
                style={styles.modalSecondaryButton}>
                <Text style={styles.modalSecondaryText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleConfirmLogout}
                style={styles.modalPrimaryButton}>
                <Text style={styles.modalPrimaryText}>Sair</Text>
              </TouchableOpacity>
            </View>
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
    paddingTop: 26,
  },
  title: {
    fontSize: 31,
    fontWeight: '800',
    color: '#101010',
    textAlign: 'center',
    marginBottom: 36,
  },
  list: {
    flex: 1,
    paddingHorizontal: 14,
  },
  profileSummary: {
    marginHorizontal: 14,
    marginBottom: 18,
    borderRadius: 16,
    backgroundColor: '#FFF3E8',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  profileSummaryImage: {
    width: 42,
    height: 42,
    borderRadius: 999,
    backgroundColor: '#FFE4CC',
  },
  profileSummaryText: {
    flex: 1,
  },
  profileName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1D1D1D',
  },
  profileCpf: {
    marginTop: 2,
    fontSize: 13,
    color: '#5C5C5C',
  },
  itemCard: {
    minHeight: 54,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 4,
  },
  itemLabel: {
    fontSize: 16,
    color: '#1D1D1D',
  },
  logoutButton: {
    minHeight: 54,
    borderRadius: 16,
    backgroundColor: '#FF9D9D',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    marginTop: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 4,
  },
  logoutText: {
    fontSize: 16,
    color: '#1D1D1D',
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
    paddingBottom: 18,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 8,
  },
  modalIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 999,
    backgroundColor: '#FFD9D9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  photoPreview: {
    width: 116,
    height: 116,
    borderRadius: 999,
    backgroundColor: '#FFF3E8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    overflow: 'hidden',
  },
  photoPreviewImage: {
    width: '100%',
    height: '100%',
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
    marginBottom: 22,
  },
  modalActions: {
    width: '100%',
    flexDirection: 'row',
    gap: 10,
  },
  modalStackActions: {
    width: '100%',
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
    backgroundColor: '#F58220',
  },
  modalPrimaryText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modalFullPrimaryButton: {
    width: '100%',
    minHeight: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F58220',
  },
  modalFullSecondaryButton: {
    width: '100%',
    minHeight: 46,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F58220',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  modalFullGhostButton: {
    width: '100%',
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalGhostText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#666666',
  },
  toggleButton: {
    width: 52,
    height: 28,
    borderRadius: 999,
    padding: 3,
    justifyContent: 'center',
  },
  toggleOn: {
    backgroundColor: '#F58220',
  },
  toggleOff: {
    backgroundColor: '#E6E6E6',
  },
  toggleThumb: {
    width: 22,
    height: 22,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
  },
  thumbOn: {
    backgroundColor: '#FFFFFF',
  },
  thumbOff: {
    backgroundColor: '#FFFFFF',
  },
});
