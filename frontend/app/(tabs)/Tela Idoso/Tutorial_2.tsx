import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from "react-native";

type Props = {
  goToTutorial: () => void;
};

export default function HomeScreen({ goToTutorial }: Props) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f2f2f2" }}>

      {/*  TOPO */}
      <View style={{ flex: 1 }}>
        <View
          style={{
            height: 100,
            backgroundColor: "#FF9230",
            justifyContent: "center",
            paddingHorizontal: 20,
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: 18,
              fontWeight: "bold",
            }}
          >
            Olá, Oswaldo Teixeira
          </Text>
        </View>
      </View>

      {/* 🔸 MEIO */}
      <View
        style={{
          flex: 2,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: "85%",
            backgroundColor: "#fff",
            padding: 25,
            borderRadius: 20,
            elevation: 5,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              textAlign: "center",
              marginBottom: 20,
            }}
          >
            Esta é a tela inicial onde aparecerá as próximas tarefas
          </Text>

          <TouchableOpacity
            onPress={goToTutorial}
            style={{
              backgroundColor: "#FF9230",
              paddingVertical: 14,
              borderRadius: 25,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontWeight: "bold",
              }}
            >
              Avançar
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/*  BARRA INFERIOR (3 BOTÕES) */}
      <View
        style={{
          height: 80,
          backgroundColor: "#fff",
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          borderTopWidth: 1,
          borderTopColor: "#ddd",
        }}
      >
        {/* BOTÃO 1 */}
        <TouchableOpacity onPress={() => console.log("Mudanças")}>
          <Image
            source={require("../../../assets/images/mudancas.png")}
            style={{ width: 28, height: 28 }}
          />
        </TouchableOpacity>

        {/* BOTÃO 2 */}
        <TouchableOpacity onPress={() => console.log("Home")}>
          <Image
            source={require("../../../assets/images/home.png")}
            style={{ width: 28, height: 28 }}
          />
        </TouchableOpacity>

        {/* BOTÃO 3 */}
        <TouchableOpacity onPress={() => console.log("Configurações")}>
          <Image
            source={require("../../../assets/images/config.png")}
            style={{ width: 28, height: 28 }}
          />
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}
