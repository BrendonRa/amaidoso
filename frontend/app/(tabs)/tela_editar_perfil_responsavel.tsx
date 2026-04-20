import { Feather, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function TelaEditarPerfilResponsavel() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.blueSection}>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => router.push('/tela_home_responsavel')}
            style={styles.backButton}>
            <Feather name="arrow-left" size={18} color="#111111" />
            <Text style={styles.backText}>Voltar</Text>
          </TouchableOpacity>

          <View style={styles.avatar}>
            <Ionicons name="person-outline" size={72} color="#5A429B" />
          </View>

          <Text style={styles.profileName}>Fulano da Silva</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Nome Completo</Text>
              <Text style={styles.infoValue}>Fulano da Silva</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Nome de Usuário</Text>
              <Text style={styles.infoValue}>Fulano da Silva</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Data de nascimento</Text>
              <Text style={styles.infoValue}>--/--/--</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>email</Text>
              <Text style={styles.infoValue}>fulanosilva2002@gmail.com</Text>
            </View>

            <View style={[styles.infoRow, styles.lastInfoRow]}>
              <Text style={styles.infoLabel}>Senha</Text>
              <Text style={styles.infoValue}>A1234678!</Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => router.push('/tela_edicao_perfil_responsavel')}
              style={styles.editButton}>
              <Feather name="edit-2" size={16} color="#FFFFFF" />
              <Text style={styles.editButtonText}>Editar</Text>
            </TouchableOpacity>
          </View>
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

          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => router.push('/tela_config_responsavel')}
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
  blueSection: {
    flex: 1,
    backgroundColor: '#2456F5',
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 22,
  },
  backButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  backText: {
    color: '#111111',
    fontSize: 16,
    fontWeight: '500',
  },
  avatar: {
    width: 94,
    height: 94,
    borderRadius: 47,
    backgroundColor: '#E9D9FF',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 4,
    marginBottom: 14,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 22,
  },
  infoCard: {
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  infoRow: {
    borderBottomWidth: 1,
    borderBottomColor: '#2F2F2F',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  lastInfoRow: {
    borderBottomWidth: 0,
    paddingBottom: 16,
  },
  infoLabel: {
    fontSize: 11,
    color: '#2B2B2B',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#121212',
  },
  editButton: {
    alignSelf: 'center',
    marginTop: -12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1F63FF',
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 20,
    gap: 6,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
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
  navLabel: {
    marginTop: 4,
    fontSize: 12,
    color: '#1A1A1A',
  },
});
