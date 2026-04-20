import React, { useState } from "react";
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

export default function ConfirmarMedicacoesScreen({ goToHome }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Olá, Oswaldo Teixeira</Text>

        <Image
          source={{ uri: "https://i.pravatar.cc/100" }}
          style={styles.avatar}
        />
      </View>

      {/* LISTA */}
      <View style={styles.content}>
        <MedItem nome="Metformina 850 mg" hora="14:10" />
        <MedItem nome="Donepezila 10 mg" hora="15:10" />
        <MedItem nome="Fluoxetina 20 mg" hora="16:10" />
        <MedItem nome="Sertralina 50 mg" hora="16:10" />
      </View>

      {/* AVISO */}
      <View style={styles.warningBox}>
        <Text style={styles.warningText}>
          As confirmações serão excluídas automaticamente após 30 min da sua
          confirmação!!!
        </Text>
      </View>

      {/* BARRA INFERIOR */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => console.log("Mudanças")}>
          <Image
            source={require("../../assets/images/mudancas.png")}
            style={styles.iconImg}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={goToHome} style={styles.homeButton}>
          <Image
            source={require("../../assets/images/home.png")}
            style={styles.iconImg}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => console.log("Configurações")}>
          <Image
            source={require("../../assets/images/config.png")}
            style={styles.iconImg}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

/* ITEM MEDICAÇÃO */
function MedItem({ nome, hora }: { nome: string; hora: string }) {
  const [status, setStatus] = useState<"like" | "dislike" | null>(null);

  return (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.cardText}>{nome}</Text>

        <View style={styles.actions}>
          {/* 👍 */}
          <TouchableOpacity onPress={() => setStatus("like")}>
            <Text
              style={[
                styles.icon,
                status === "like" && styles.likeActive,
              ]}
            >
              👍
            </Text>
          </TouchableOpacity>

          {/* 👎 */}
          <TouchableOpacity onPress={() => setStatus("dislike")}>
            <Text
              style={[
                styles.icon,
                status === "dislike" && styles.dislikeActive,
              ]}
            >
              👎
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.time}>{hora}</Text>
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

  /* CARD */
  card: {
    backgroundColor: "#e6e6e6",
    borderRadius: 15,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
  },

  cardText: {
    fontSize: 14,
    marginBottom: 5,
  },

  actions: {
    flexDirection: "row",
    gap: 10,
  },

  icon: {
    fontSize: 18,
    color: "#000",
  },

  likeActive: {
    color: "green",
  },

  dislikeActive: {
    color: "red",
  },

  time: {
    fontSize: 14,
    marginLeft: 10,
  },

  /* WARNING */
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

  /* FOOTER */
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

  iconImg: {
    width: 28,
    height: 28,
  },

  homeButton: {
    backgroundColor: "#f4a261",
    padding: 10,
    borderRadius: 20,
  },
});