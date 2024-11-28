import PrinterController from "../modules/SUMNI/PrinterContoller";
import React, { useState } from "react";
import { imageBase64 } from "../assets/base64";
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
  ToastAndroid,
  ActivityIndicator,
} from "react-native";

import { mockData } from "../mock/mockData";
import { getTicket } from "../services/getTicket";

function PrintManager() {
  const [isLoading, setIsLoading] = React.useState(false); // Estado para armazenar o token
  const [textToPrint, setTextToPrint] = useState(""); // Estado para armazenar o texto a ser impresso
  const [base64Image, setBase64Image] = useState(""); // Estado para armazenar a imagem Base64
  const [printerStatus, setPrinterStatus] = useState<string | null>(null); // Estado para exibir o status da impressora

  // Função para imprimir texto
  const handlePrintText = async () => {
    if (!textToPrint.trim()) {
      Alert.alert("Erro", "Por favor, insira algum texto para imprimir.");
      return;
    }
    try {
      await PrinterController.printCustomText({
        text: textToPrint,
        fontSize: 24,
        alignment: 1, // Centro
        blankLines: 10,
      });
      Alert.alert("Sucesso", "Texto impresso com sucesso!");
    } catch (error) {
      Alert.alert("Erro", `Falha ao imprimir texto: ${error}`);
    }
  };

  // Função para imprimir uma imagem Base64
  const handlePrintImage = async () => {
    const imageToPrint = base64Image.trim() || imageBase64.trim();
    if (!imageToPrint) {
      Alert.alert("Erro", "Por favor, insira uma string Base64 válida.");
      return;
    }

    if (mockData.IsValid) {
      for (const image of mockData.Data) {
        try {
          await PrinterController.printCustomImage({
            base64Image: image.Base64,
            maxWidth: 380,
            blankLines: 2,
          });
        } catch (error) {
          ToastAndroid.show(`Erro, Falha ao imprimir imagem: ${error}`, ToastAndroid.SHORT);
        }
      }
      return;
    }
    Alert.alert("Houver uma Falha", "Por favor, verifique a função [handlePrintImage]");
  };

  // Função para imprimir uma imagem Base64
  const handlePrintImageApi = async () => {
    setIsLoading(true);
    const resultTicket = await getTicket();

    if (!resultTicket.IsValid) {
      setIsLoading(false);
      Alert.alert("Erro", "Por favor, insira uma string Base64 válida.");
      return;
    }

    if (resultTicket.IsValid) {
      for (const image of resultTicket.Data) {
        try {
          await PrinterController.printCustomImage({
            base64Image: image.base64,
            maxWidth: 380,
            blankLines: 2,
          });
        } catch (error) {
          ToastAndroid.show(`Erro, Falha ao imprimir imagem: ${error}`, ToastAndroid.SHORT);
        }
      }
      setIsLoading(false);
      return;
    }
    Alert.alert("Houver uma Falha", "Por favor, verifique a função [handlePrintImage]");
    setIsLoading(false);
  };

  // Função para verificar o status da impressora
  const handleCheckPrinterStatus = async () => {
    try {
      const status = await PrinterController.getPrinterStatus();
      let statusMessage;
      switch (status) {
        case 0:
          statusMessage = "Impressora pronta.";
          break;
        case 1:
          statusMessage = "Sem papel.";
          break;
        case 2:
          statusMessage = "Sobreaquecimento.";
          break;
        case 3:
          statusMessage = "Tampa aberta.";
          break;
        default:
          statusMessage = `Status desconhecido (${status}).`;
      }
      setPrinterStatus(statusMessage);
    } catch (error) {
      Alert.alert("Erro", `Erro ao verificar o status da impressora: ${error}`);
    }
  };

  return isLoading ? (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <ActivityIndicator size={52} />
    </View>
  ) : (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Verificar Status da Impressora */}
      <View style={styles.statusContainer}>
        <Button title="Verificar Status da Impressora" onPress={handleCheckPrinterStatus} />
        {printerStatus && <Text style={styles.status}>{printerStatus}</Text>}
      </View>

      {/* Imprimir Texto */}
      <Text style={styles.label}>Texto para impressão:</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o texto a ser impresso"
        value={textToPrint}
        onChangeText={setTextToPrint}
        multiline
      />
      <Button title="Imprimir Texto" onPress={handlePrintText} />

      {/* Imprimir Imagem Base64 */}
      <Text style={styles.label}>Imagem Base64:</Text>
      <TextInput
        style={styles.input}
        placeholder="Cole a string Base64 aqui"
        value={base64Image}
        onChangeText={setBase64Image}
        multiline
      />
      <Button title="Imprimir Imagem" onPress={handlePrintImage} />
      <Text style={styles.label}>Imagem Base64 da API:</Text>
      <Button title="Imprimir Imagens da API" onPress={handlePrintImageApi} />
    </ScrollView>
  );
}

export { PrintManager };

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
