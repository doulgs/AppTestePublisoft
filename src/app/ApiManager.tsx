import React from "react";
import { ActivityIndicator, Button, ScrollView, StyleSheet, Text, ToastAndroid, View } from "react-native";
import { getToken } from "../services/getToken";
import { getTicket } from "../services/getTicket";

function ApiManager() {
  const [isLoading, setIsLoading] = React.useState(false); // Estado para armazenar o token
  const [token, setToken] = React.useState(""); // Estado para armazenar o token
  const [responseResult, setResponseResult] = React.useState(""); // Estado para armazenar o status da impressora

  async function handleObterToken() {
    setIsLoading(true);
    const resultToken = await getToken();

    if (resultToken) {
      setToken("Token obtido com sucesso");
      ToastAndroid.show("Token obtido com sucesso", ToastAndroid.SHORT);
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    ToastAndroid.show("Falha ao obter Token", ToastAndroid.SHORT);
  }

  async function handleConsultarReimpressao() {
    setIsLoading(true);
    console.log("TesteHandleConsultarReimpressao");
    const resultTicket = await getTicket();

    if (resultTicket.IsValid) {
      console.log(resultTicket);
      setResponseResult("Ticket obtido com sucesso");
      ToastAndroid.show("Ticket obtido com sucesso", ToastAndroid.SHORT);
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    ToastAndroid.show("Falha ao obter Ticket", ToastAndroid.SHORT);
  }

  return isLoading ? (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <ActivityIndicator size={52} />
    </View>
  ) : (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Obtem o token para consulta */}
      <View style={styles.statusContainer}>
        <Button title="Obter Token" onPress={handleObterToken} />
        {token && <Text style={styles.status}>{token}</Text>}
      </View>

      {/* Verificar Status da Impressora */}
      <View style={styles.statusContainer}>
        <Button title="Consultar Reimpressao" onPress={handleConsultarReimpressao} />
        {responseResult && <Text style={styles.status}>{responseResult}</Text>}
      </View>
    </ScrollView>
  );
}

export { ApiManager };

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  label: {
    fontSize: 16,
    marginTop: 20,
    marginBottom: 5,
    color: "#555",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: "#fff",
    fontSize: 14,
  },
  statusContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  status: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
});
