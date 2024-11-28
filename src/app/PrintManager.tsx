import PrinterContoller from "../modules/SUMNI/PrinterContoller";
import React, { useState } from "react";
import { imageBase64 } from "../assets/base64";
import { View, Text, Button, TextInput, StyleSheet, Alert, ScrollView } from "react-native";

function PrintManager() {
  const [textToPrint, setTextToPrint] = useState(""); // Estado para armazenar o texto a ser impresso
  const [base64Image, setBase64Image] = useState(""); // Estado para armazenar a imagem Base64
  const [printerStatus, setPrinterStatus] = useState<string | null>(null); // Estado para exibir o status da impressora

  // Função para imprimir texto
  const handlePrintText = async () => {
    if (!textToPrint.trim()) {
      Alert.alert("Erro", "Por favor, insira algum texto para imprimir.");
      return;
    }
    await PrinterContoller.printCustomText(textToPrint, 120, 1);
  };

  const handlePrintImage = async () => {
    if (!base64Image.trim()) {
      Alert.alert("Erro", "Por favor, insira uma string Base64 válida.");
      return;
    }
    await PrinterContoller.printCustomImage(base64Image, 384);
  };

  // Função para imprimir imagem em Base64
  const handlePrintImageBase64 = async () => {
    if (!imageBase64.trim()) {
      Alert.alert("Erro", "Por favor, verifique se a Base64 válida.");
      return;
    }

    const result = JSON.stringify(imageBase64);

    console.log("result", result);

    await PrinterContoller.printCustomImage(result, 384);
    await PrinterContoller.printCustomText("", 24, 1);
  };

  // Função para verificar o status da impressora
  const handleCheckPrinterStatus = async () => {
    try {
      const status = await PrinterContoller.getPrinterStatus();
      let statusMessage;
      switch (status) {
        case 0:
          statusMessage = "Impressora pronta.";
          break;
        case -1:
          statusMessage = "Erro desconhecido.";
          break;
        case -2:
          statusMessage = "Sem papel.";
          break;
        case -3:
          statusMessage = "Impressora superaquecida.";
          break;
        default:
          statusMessage = `Status desconhecido (${status}).`;
      }
      setPrinterStatus(statusMessage);
    } catch (error) {
      Alert.alert("Erro", `Erro ao verificar o status da impressora: ${error || error}`);
    }
  };

  return (
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

      {/* Imprimir Imagem Base64 */}
      <Text style={styles.label}>Imagem Base64:</Text>
      <Button title="Imprimir Base64" onPress={handlePrintImageBase64} />
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
