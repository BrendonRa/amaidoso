import React from "react";
import { router } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import IdosoBottomNav from './IdosoBottomNav';

export default function LembretesScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Olá, Oswaldo Teixeira</Text>

        <Image
          source={{ uri: "https://wallpapers.com/images/hd/funny-old-man-pictures-29zq8pp6pi1gcap8.jpg" }}
          style={styles.avatar}
        />
      </View>

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => router.push('./tela_principal_idoso')}
        style={styles.backButton}>
        <Text style={styles.backButtonText}>Voltar</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Reminder text="Voce tem consulta às 16:00" />
        <Reminder text="Aniversario da Florinda 22/10" />
        <Reminder text="Ir no mercado comprar Tadalafila às 14h" />
        <Reminder text="Voce tem consulta às 16:00" />
      </View>

      {/* AVISO */}
      <View style={styles.warningBox}>
        <Text style={styles.warningText}>
          Todos os lembretes serão excluídos automaticamente após 30 min do seu
          Prazo final!!!
        </Text>
      </View>
      <IdosoBottomNav activeTab="home" />
    </SafeAreaView>
  );
}

/* ITEM DE LEMBRETE */
function Reminder({ text }: { text: string }) {
  return (
    <View style={styles.reminder}>
      <Text style={styles.reminderText}>{text}</Text>

      <TouchableOpacity>
        <Text style={{ fontSize: 16 }}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  backButton: {
    alignSelf: 'flex-start',
    marginHorizontal: 20,
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: '#FFE4CC',
  },
  backButtonText: {
    color: '#F58220',
    fontSize: 14,
    fontWeight: '700',
  },

  /* HEADER */
  header: {
    backgroundColor: "#f58220",
    padding: 16,
    paddingTop: 52,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  greeting: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  /* CONTENT */
  content: {
    padding: 20,
    gap: 15,
  },

  /* REMINDER */
  reminder: {
    backgroundColor: "#e6e6e6",
    borderRadius: 15,
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
  },

  reminderText: {
    fontSize: 14,
    flex: 1,
    marginRight: 10,
  },

  /* ALERTA */
  warningBox: {
    margin: 20,
    backgroundColor: "#ddd",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },

  warningText: {
    color: "red",
    fontSize: 12,
    textAlign: "center",
  },

});
