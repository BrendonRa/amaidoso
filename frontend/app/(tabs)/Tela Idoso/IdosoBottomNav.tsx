import { router } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  activeTab?: 'home' | 'config';
};

export default function IdosoBottomNav({ activeTab = 'home' }: Props) {
  return (
    <View style={styles.bottomBar}>
      <TouchableOpacity activeOpacity={0.8} onPress={() => router.push('./tela_principal_idoso')} style={styles.navItem}>
        <View style={[styles.navIconButton, activeTab === 'home' && styles.homeButton]}>
          <Image source={require('../../../assets/images/home.png')} style={styles.navIcon} />
        </View>
        <Text style={styles.navLabel}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity activeOpacity={0.8} style={styles.navItem}>
        <View style={[styles.navIconButton, activeTab === 'config' && styles.homeButton]}>
          <Image source={require('../../../assets/images/config.png')} style={styles.navIcon} />
        </View>
        <Text style={styles.navLabel}>Configuracoes</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomBar: {
    marginTop: 'auto',
    height: 92,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#DDDDDD',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-evenly',
    paddingHorizontal: 36,
    paddingTop: 8,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIconButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
  },
  homeButton: {
    backgroundColor: '#F4A261',
  },
  navIcon: {
    width: 26,
    height: 26,
    resizeMode: 'contain',
  },
  navLabel: {
    marginTop: 2,
    fontSize: 12,
    color: '#2F2F2F',
    fontWeight: '500',
  },
});
