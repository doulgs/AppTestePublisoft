import PrinterContoller from "../modules/SUMNI/PrinterContoller";
import React, { useState } from "react";
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
    await PrinterContoller.printText(textToPrint);
  };

  // Função para imprimir imagem em Base64
  const handlePrintImage = async () => {
    if (!base64Image.trim()) {
      Alert.alert("Erro", "Por favor, insira uma string Base64 válida.");
      return;
    }
    await PrinterContoller.printBase64Image(base64Image);
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
      <Text style={styles.header}>Tela de Impressão</Text>

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

      {/* Verificar Status da Impressora */}
      <View style={styles.statusContainer}>
        <Button title="Verificar Status da Impressora" onPress={handleCheckPrinterStatus} />
        {printerStatus && <Text style={styles.status}>{printerStatus}</Text>}
      </View>
    </ScrollView>
  );
}

export { PrintManager };

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
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
