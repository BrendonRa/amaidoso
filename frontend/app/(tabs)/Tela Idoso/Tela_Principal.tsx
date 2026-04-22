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

export default function HomeScreen({ goToHome }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Olá, Oswaldo Teixeira</Text>

        <View style={styles.headerRight}>
          <TouchableOpacity>
            <Text style={{ fontSize: 18 }}>↗</Text>
          </TouchableOpacity>

          <Image
            source={{ uri: "https://wallpapers.com/images/hd/funny-old-man-pictures-29zq8pp6pi1gcap8.jpg" }}
            style={styles.avatar}
          />
        </View>
      </View>

      {/* CARDS */}
      <View style={styles.content}>
        <Card title="Lembretes" />
        <Card title="Confirmar Medicações" />
        <Card title="Anotações" />
      </View>

      {/* 🔻 BARRA INFERIOR (SEUS ÍCONES) */}
      <View style={styles.footer}>
        {/* BOTÃO 1 */}
        <TouchableOpacity onPress={() => console.log("Mudanças")}>
          <Image
            source={require("../../../assets/images/mudancas.png")}
            style={styles.icon}
          />
        </TouchableOpacity>

        {/* BOTÃO 2 */}
        <TouchableOpacity onPress={goToHome} style={styles.homeButton}>
          <Image
            source={require("../../../assets/images/home.png")}
            style={styles.icon}
          />
        </TouchableOpacity>

        {/* BOTÃO 3 */}
        <TouchableOpacity onPress={() => console.log("Configurações")}>
          <Image
            source={require("../../../assets/images/config.png")}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

/* COMPONENTE CARD */
function Card({ title }: { title: string }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}

/* STYLES */
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

  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  /* CONTENT */
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    gap: 20,
  },

  /* CARD */
  card: {
    backgroundColor: "#e6e6e6",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
  },

  cardTitle: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "500",
  },

  button: {
    backgroundColor: "#f58220",
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 20,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },

  /* FOOTER */
  footer: {
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
