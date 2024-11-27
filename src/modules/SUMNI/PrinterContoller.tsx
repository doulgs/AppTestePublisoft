import { NativeModules } from "react-native";

// Importando o módulo nativo
const { SunmiPrinterModule } = NativeModules;

// Tipos de Status da Impressora
type PrinterStatus = 0 | -1 | -2 | -3 | number;

// Definição de Tipos para Melhor Tipagem
interface PrinterContoller {
  printText: (text: string) => Promise<void>;
  printBase64Image: (base64Image: string) => Promise<void>;
  getPrinterStatus: () => Promise<PrinterStatus>;
  isPrinterReady: () => Promise<boolean>;
}

// Implementação das Funções da Impressora
const PrinterContoller: PrinterContoller = {
  /**
   * Imprime um texto simples na impressora.
   * @param text Texto a ser impresso.
   */
  async printText(text: string): Promise<void> {
    try {
      await SunmiPrinterModule.printText(text);
      console.log("[PrinterContoller] Texto impresso com sucesso.");
    } catch (error) {
      console.error("[PrinterContoller] Erro ao imprimir texto:", error);
      throw error;
    }
  },

  /**
   * Imprime uma imagem em formato Base64 na impressora.
   * @param base64Image String da imagem em Base64.
   */
  async printBase64Image(base64Image: string): Promise<void> {
    try {
      await SunmiPrinterModule.printBase64Image(base64Image);
      console.log("[PrinterContoller] Imagem impressa com sucesso.");
    } catch (error) {
      console.error("[PrinterContoller] Erro ao imprimir imagem:", error);
      throw error;
    }
  },

  /**
   * Obtém o status atual da impressora.
   * @returns Status da impressora.
   */
  async getPrinterStatus(): Promise<PrinterStatus> {
    try {
      const status: PrinterStatus = await SunmiPrinterModule.printerStatus();
      console.log(`[PrinterContoller] Status da impressora: ${status}`);
      return status;
    } catch (error) {
      console.error("[PrinterContoller] Erro ao obter status da impressora:", error);
      throw error;
    }
  },

  /**
   * Verifica se a impressora está pronta para uso.
   * @returns True se a impressora estiver pronta; False caso contrário.
   */
  async isPrinterReady(): Promise<boolean> {
    try {
      const status = await PrinterContoller.getPrinterStatus();
      const isReady = status === 0;
      console.log(`[PrinterContoller] Impressora pronta: ${isReady}`);
      return isReady;
    } catch (error) {
      console.error("[PrinterContoller] Erro ao verificar se a impressora está pronta:", error);
      return false;
    }
  },
};

export default PrinterContoller;
