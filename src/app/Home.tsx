import { Text, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CustomButton } from "../components/CustomButton";
import { useNavigation } from "@react-navigation/native";

function Home() {
  const { navigate } = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <CustomButton
          title="Area de testes de Impressão"
          onPress={() => navigate("PrintManager")}
          icon={<Ionicons name="print" size={20} color="#fff" />}
          iconPosition="right"
          variant="solid"
        />
      </View>

      <View style={styles.content}>
        <CustomButton
          title="Area de testes do End-Points"
          onPress={() => navigate("ApiManager")}
          icon={<Ionicons name="git-network" size={20} color="#fff" />}
          iconPosition="right"
          variant="solid"
        />
      </View>
    </View>
  );
}

export { Home };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    backgroundColor: "#F5FCFF",
  },
  content: {
    padding: 8,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: "#ccc",
  },
  title: {
    fontSize: 20,
  },
});
