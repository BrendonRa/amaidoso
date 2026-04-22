import { Feather, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useResponsavelProfile } from '@/contexts/responsavel-profile-context';

export default function TelaPainelResponsavel() {
  const { profile } = useResponsavelProfile();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Olá, {profile.nome.split(' ')[0] || 'Fulano'}</Text>

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

        <View style={styles.topActions}>
          <TouchableOpacity activeOpacity={0.6} style={styles.iconButton}>
            <Feather name="edit-3" size={24} color="#1A1A1A" />
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.6} style={styles.addPersonButton}>
            <Ionicons name="person-add-outline" size={24} color="#1A1A1A" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.emptyText}>Nenhum Idoso cadastrado!</Text>
        </View>

        <View style={styles.bottomBar}>
          <TouchableOpacity activeOpacity={0.6} style={styles.navItem}>
            <View style={styles.activePill}>
              <Feather name="edit-3" size={24} color="#121212" />
            </View>
            <Text style={styles.navLabel}>Painel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => router.push('./tela_home_responsavel')}
            style={styles.navItem}>
            <Ionicons name="home-outline" size={26} color="#121212" />
            <Text style={styles.navLabel}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => router.push('./tela_config_responsavel')}
            style={styles.navItem}>
            <Feather name="settings" size={24} color="#121212" />
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
  },
  header: {
    height: 84,
    backgroundColor: '#1456FF',
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
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 20,
    paddingTop: 26,
  },
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPersonButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#A9BEFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#707070',
    textAlign: 'center',
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
