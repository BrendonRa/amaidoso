import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { signOut } from 'firebase/auth';
import React from 'react';
import { Animated, Image, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { languageOptions, useLanguage, type AppLanguage } from '@/contexts/language-context';
import { useResponsavelProfile } from '@/contexts/responsavel-profile-context';
import { getFirebaseAuth } from '@/lib/firebase';

const RESPONSAVEL_NOTIFICATIONS_KEY = '@amaidoso:responsavel-notifications-enabled';

export default function TelaConfigResponsavel() {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);
  const [showLanguageModal, setShowLanguageModal] = React.useState(false);
  const thumbAnim = React.useRef(new Animated.Value(1)).current;
  const { profile } = useResponsavelProfile();
  const { language, setLanguage, t } = useLanguage();
  const photoUri =
    profile.photoUri && profile.photoUri !== 'imagem_padrao.png' ? profile.photoUri : null;

  React.useEffect(() => {
    Animated.timing(thumbAnim, {
      toValue: notificationsEnabled ? 1 : 0,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [notificationsEnabled, thumbAnim]);

  React.useEffect(() => {
    void AsyncStorage.getItem(RESPONSAVEL_NOTIFICATIONS_KEY)
      .then((value) => {
        if (value != null) {
          setNotificationsEnabled(value === 'true');
        }
      })
      .catch(() => undefined);
  }, []);

  const toggleNotifications = async () => {
    const nextEnabled = !notificationsEnabled;
    setNotificationsEnabled(nextEnabled);
    await AsyncStorage.setItem(RESPONSAVEL_NOTIFICATIONS_KEY, String(nextEnabled));
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const handleSelectLanguage = async (nextLanguage: AppLanguage) => {
    await setLanguage(nextLanguage);
    setShowLanguageModal(false);
  };

  const handleConfirmLogout = async () => {
    setShowLogoutModal(false);
    try {
      await signOut(getFirebaseAuth());
    } catch {
      // continua fluxo de saída mesmo se signOut falhar
    }
    router.push('../Tela Idoso/tela_inicio1');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>{t('configuration')}</Text>

        <View style={styles.profileSummary}>
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.profileSummaryImage} />
          ) : (
            <Ionicons name="person-circle-outline" size={42} color="#5A429B" />
          )}
          <View style={styles.profileSummaryText}>
            <Text style={styles.profileName}>{profile.nome || t('responsible')}</Text>
            <Text style={styles.profileEmail}>{t('email')}: {profile.email || '-'}</Text>
          </View>
        </View>

        <View style={styles.list}>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => router.push('./tela_editar_perfil_responsavel')}
            style={styles.itemCard}>
            <Text style={styles.itemLabel}>{t('editProfile')}</Text>
            <Feather name="user" size={20} color="#202020" />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => setShowLanguageModal(true)}
            style={styles.itemCard}>
            <Text style={styles.itemLabel}>{t('language')}</Text>
            <View style={styles.itemRight}>
              <Text style={styles.itemValue}>
                {languageOptions.find((option) => option.code === language)?.label}
              </Text>
              <Ionicons name="language-outline" size={22} color="#202020" />
            </View>
          </TouchableOpacity>

          <View style={styles.itemCard}>
            <Text style={styles.itemLabel}>{t('notifications')}</Text>
            <Pressable
              onPress={() => void toggleNotifications()}
              style={[styles.toggleButton, notificationsEnabled ? styles.toggleOn : styles.toggleOff]}
            >
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

          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => router.push('./tela_ajuda_responsavel')}
            style={styles.itemCard}>
            <Text style={styles.itemLabel}>{t('help')}</Text>
            <Feather name="help-circle" size={21} color="#202020" />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => router.push('./tela_sobre_responsavel')}
            style={styles.itemCard}>
            <Text style={styles.itemLabel}>{t('about')}</Text>
            <MaterialCommunityIcons name="dots-horizontal" size={22} color="#202020" />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.6}
            onPress={handleLogout}
            style={styles.logoutButton}>
            <Text style={styles.logoutText}>{t('logout')}</Text>
            <Feather name="log-out" size={22} color="#202020" />
          </TouchableOpacity>
        </View>

        <View style={styles.bottomBar}>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => router.push('./tela_painel_responsavel')}
            style={styles.navItem}>
            <Feather name="edit-3" size={24} color="#121212" />
            <Text style={styles.navLabel}>{t('panel')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => router.push('./tela_home_responsavel')}
            style={styles.navItem}>
            <Image source={require('../../../assets/images/home.png')} style={styles.navIcon} />
            <Text style={styles.navLabel}>{t('home')}</Text>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.6} style={styles.navItem}>
            <View style={styles.activePill}>
              <Feather name="settings" size={24} color="#121212" />
            </View>
            <Text style={styles.navLabel}>{t('configuration')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        animationType="fade"
        transparent
        visible={showLanguageModal}
        onRequestClose={() => setShowLanguageModal(false)}>
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={() => setShowLanguageModal(false)} />
          <View style={styles.modalCard}>
            <View style={styles.languageIconWrap}>
              <Ionicons name="language-outline" size={26} color="#0C4DFF" />
            </View>
            <Text style={styles.modalTitle}>{t('languageTitle')}</Text>
            <Text style={styles.modalText}>{t('languageDescription')}</Text>

            <View style={styles.languageOptions}>
              {languageOptions.map((option) => {
                const selected = option.code === language;

                return (
                  <TouchableOpacity
                    activeOpacity={0.85}
                    key={option.code}
                    onPress={() => void handleSelectLanguage(option.code)}
                    style={[styles.languageOption, selected ? styles.languageOptionSelected : null]}>
                    <Text
                      style={[
                        styles.languageOptionText,
                        selected ? styles.languageOptionTextSelected : null,
                      ]}>
                      {option.label}
                    </Text>
                    {selected ? <Feather name="check" size={20} color="#0C4DFF" /> : null}
                  </TouchableOpacity>
                );
              })}
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
            <Text style={styles.modalTitle}>{t('logoutQuestion')}</Text>
            <Text style={styles.modalText}>{t('logoutText')}</Text>

            <View style={styles.modalActions}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setShowLogoutModal(false)}
                style={styles.modalSecondaryButton}>
                <Text style={styles.modalSecondaryText}>{t('cancel')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleConfirmLogout}
                style={styles.modalPrimaryButton}>
                <Text style={styles.modalPrimaryText}>{t('logout')}</Text>
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
    backgroundColor: '#EEF4FF',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  profileSummaryImage: {
    width: 42,
    height: 42,
    borderRadius: 999,
    backgroundColor: '#E9D9FF',
  },
  profileSummaryText: {
    flex: 1,
  },
  profileName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1D1D1D',
  },
  profileEmail: {
    marginTop: 2,
    fontSize: 13,
    color: '#5C5C5C',
  },
  itemCard: {
    minHeight: 44,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    marginBottom: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  itemLabel: {
    fontSize: 15,
    color: '#1C1C1C',
  },
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  itemValue: {
    fontSize: 13,
    color: '#5C5C5C',
  },
  logoutButton: {
    minHeight: 44,
    borderRadius: 16,
    backgroundColor: '#FF9595',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    marginTop: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutText: {
    fontSize: 15,
    color: '#1C1C1C',
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
  languageIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 999,
    backgroundColor: '#E7EFFF',
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
    marginBottom: 22,
  },
  modalActions: {
    width: '100%',
    flexDirection: 'row',
    gap: 10,
  },
  languageOptions: {
    width: '100%',
    gap: 10,
  },
  languageOption: {
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D8D8D8',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
  },
  languageOptionSelected: {
    borderColor: '#0C4DFF',
    backgroundColor: '#EEF4FF',
  },
  languageOptionText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333333',
  },
  languageOptionTextSelected: {
    color: '#0C4DFF',
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
    backgroundColor: '#E26D6D',
  },
  modalPrimaryText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  toggleButton: {
    width: 52,
    height: 28,
    borderRadius: 999,
    padding: 3,
    justifyContent: 'center',
  },
  toggleOn: {
    backgroundColor: '#9AB8FF',
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
});
