import { Text, View, StyleSheet } from "react-native";

function Home() {
  return (
    <View style={styles.container}>
      <Text>Aplicativo para testes da Publisoft</Text>
    </View>
  );
}

export { Home };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5FCFF",
  },
});
