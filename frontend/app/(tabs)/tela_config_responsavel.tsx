import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

export default function TelaConfigResponsavel() {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>DEFINIÇÕES</Text>

        <View style={styles.list}>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => router.push('/tela_editar_perfil_responsavel')}
            style={styles.itemCard}>
            <Text style={styles.itemLabel}>Editar Perfil</Text>
            <Feather name="user" size={20} color="#202020" />
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.6} style={styles.itemCard}>
            <Text style={styles.itemLabel}>Idioma</Text>
            <Ionicons name="language-outline" size={22} color="#202020" />
          </TouchableOpacity>

          <View style={styles.itemCard}>
            <Text style={styles.itemLabel}>Notificações</Text>
            <Switch
              ios_backgroundColor="#D9D9D9"
              onValueChange={setNotificationsEnabled}
              thumbColor="#FFFFFF"
              trackColor={{ false: '#D9D9D9', true: '#9AB8FF' }}
              value={notificationsEnabled}
            />
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
            onPress={() => router.push('/tela_inicio1')}
            style={styles.logoutButton}>
            <Text style={styles.logoutText}>Sair</Text>
            <Feather name="log-out" size={22} color="#202020" />
          </TouchableOpacity>
        </View>

        <View style={styles.bottomBar}>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => router.push('/tela_painel_responsavel')}
            style={styles.navItem}>
            <Feather name="edit-3" size={24} color="#121212" />
            <Text style={styles.navLabel}>Painel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => router.push('/tela_home_responsavel')}
            style={styles.navItem}>
            <Ionicons name="home-outline" size={26} color="#121212" />
            <Text style={styles.navLabel}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.6} style={styles.navItem}>
            <View style={styles.activePill}>
              <Feather name="settings" size={24} color="#121212" />
            </View>
            <Text style={styles.navLabel}>Configurações</Text>
          </TouchableOpacity>
        </View>
      </View>
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
});
