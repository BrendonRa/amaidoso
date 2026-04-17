import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert,
} from "react-native";

type Props = {
  goToHome: () => void;
};

export default function TutorialScreen({ goToHome }: Props) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f2f2f2" }}>

      {/* 🔝 TOPO */}
      <View style={{ flex: 1 }}>
        <View
          style={{
            height: 100,
            backgroundColor: "#F4A261",
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
              marginBottom: 25,
            }}
          >
            Parece que essa é a sua primeira vez aqui, deseja realizar o tutorial?
          </Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <TouchableOpacity onPress={goToHome}>
              <Text>Não, obrigado</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => Alert.alert("Tutorial", "Iniciar tutorial")}
              style={{
                backgroundColor: "#FF9230",
                paddingVertical: 14,
                paddingHorizontal: 25,
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
                Sim
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* 🔻 BARRA INFERIOR (3 BOTÕES) */}
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
            source={require("../../assets/images/mudancas.png")}
            style={{ width: 28, height: 28 }}
          />
        </TouchableOpacity>

        {/* BOTÃO 2 */}
        <TouchableOpacity onPress={goToHome}>
          <Image
            source={require("../../assets/images/home.png")}
            style={{ width: 28, height: 28 }}
          />
        </TouchableOpacity>

        {/* BOTÃO 3 */}
        <TouchableOpacity onPress={() => console.log("Configurações")}>
          <Image
            source={require("../../assets/images/config.png")}
            style={{ width: 28, height: 28 }}
          />
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}