import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";

type Props = {
  goToHome: () => void;
};

export default function LembretesScreen({ goToHome }: Props) {
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

      {/* LISTA */}
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

      {/* BARRA INFERIOR */}
      <View style={styles.footer}>
      
        <TouchableOpacity onPress={() => console.log("Mudanças")}>
          <Image
            source={require("../../assets/images/mudancas.png")}
            style={styles.icon}
          />
        </TouchableOpacity>

        
        <TouchableOpacity  style={styles.homeButton}>
          <Image
            source={require("../../assets/images/home.png")}
            style={styles.icon}
          />
        </TouchableOpacity>

        
        <TouchableOpacity onPress={() => console.log("Configurações")}>
          <Image
            source={require("../../assets/images/config.png")}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
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

  /* HEADER */
  header: {
    backgroundColor: "#f58220",
    padding: 16,
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

  /* Estilo parte de baixo */
  footer: {
    marginTop: "auto",
    height: 80,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },

  icon: {
    width: 28,
    height: 28,
  },

  homeButton: {
    backgroundColor: "#f4a261",
    padding: 10,
    borderRadius: 20,
  },
});