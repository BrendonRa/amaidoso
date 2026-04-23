import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Animated, Modal, Pressable, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import IdosoBottomNav from './IdosoBottomNav';

export default function TelaConfiguracaoIdoso() {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);
  const [showEditWarning, setShowEditWarning] = React.useState(false);
  const thumbAnim = React.useRef(new Animated.Value(1)).current;

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
    setShowEditWarning(true);
  };

  const toggleNotifications = () => {
    setNotificationsEnabled((prev) => !prev);
  };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    router.push('./tela_inicio1');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>DEFINIÇÕES</Text>

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
        visible={showEditWarning}
        onRequestClose={() => setShowEditWarning(false)}>
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={() => setShowEditWarning(false)} />
          <View style={styles.modalCard}>
            <View style={styles.modalIconWrap}>
              <Feather name="lock" size={24} color="#F58220" />
            </View>
            <Text style={styles.modalTitle}>Permissão necessária</Text>
            <Text style={styles.modalText}>Você não tem permissão para editar o perfil. Somente o responsável pode fazer essa alteração.</Text>

            <View style={styles.modalActions}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setShowEditWarning(false)}
                style={styles.modalPrimaryButton}>
                <Text style={styles.modalPrimaryText}>Entendi</Text>
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
            <Text style={styles.modalText}>Ao continuar, voce voltara para a tela de inicio.</Text>

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
