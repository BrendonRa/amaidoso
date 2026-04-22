import { router } from 'expo-router';
import React from 'react';
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import IdosoBottomNav from './IdosoBottomNav';

const cards = [
  { title: 'Lembretes', route: './tela_lembretes' },
  { title: 'Confirmar Medicacoes', route: './tela_medicacao' },
  { title: 'Anotacoes' },
] as const;

export default function TelaPrincipalIdoso() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Ola, Oswaldo Teixeira</Text>

        <Image
          source={{ uri: 'https://wallpapers.com/images/hd/funny-old-man-pictures-29zq8pp6pi1gcap8.jpg' }}
          style={styles.avatar}
        />
      </View>

      <View style={styles.content}>
        {cards.map((card) => (
          <View key={card.title} style={styles.card}>
            <Text style={styles.cardTitle}>{card.title}</Text>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => {
                if (card.route) {
                  router.push(card.route);
                }
              }}
              style={styles.button}>
              <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <IdosoBottomNav activeTab="home" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  header: {
    backgroundColor: '#F58220',
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 24,
  },
  card: {
    backgroundColor: '#E6E6E6',
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#121212',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#F58220',
    paddingVertical: 7,
    paddingHorizontal: 18,
    borderRadius: 999,
    minWidth: 74,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
