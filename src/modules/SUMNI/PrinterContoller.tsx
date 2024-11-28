import { NativeModules } from "react-native";

// Importando o módulo nativo
const { SunmiPrinterModule } = NativeModules;

// Tipos de Status da Impressora
type PrinterStatus = 0 | -1 | -2 | -3 | number;

// Definição de Tipos para Melhor Tipagem
interface PrinterController {
  printCustomText: (text: string, fontSize: number, alignment: number) => Promise<void>;
  printCustomImage: (base64Image: string, maxWidth: number) => Promise<void>;
  getPrinterStatus: () => Promise<PrinterStatus>;
  isPrinterReady: () => Promise<boolean>;
}

// Implementação das Funções da Impressora
const PrinterController: PrinterController = {
  /**
   * Imprime texto com opções de personalização.
   * @param text Texto a ser impresso.
   * @param fontSize Tamanho da fonte.
   * @param alignment Alinhamento do texto (0: esquerda, 1: centro, 2: direita).
   */
  async printCustomText(text: string, fontSize: number, alignment: number): Promise<void> {
    try {
      await SunmiPrinterModule.printCustomText(text, fontSize, alignment);
      console.log("[PrinterController] Texto personalizado impresso com sucesso.");
    } catch (error) {
      console.error("[PrinterController] Erro ao imprimir texto personalizado:", error);
      throw error;
    }
  },

  /**
   * Imprime uma imagem em formato Base64 com largura personalizada.
   * @param base64Image String da imagem em Base64.
   * @param maxWidth Largura máxima da imagem.
   */
  async printCustomImage(base64Image: string, maxWidth: number): Promise<void> {
    try {
      await SunmiPrinterModule.printCustomImage(base64Image, maxWidth);
      console.log("[PrinterController] Imagem personalizada impressa com sucesso.");
    } catch (error) {
      console.error("[PrinterController] Erro ao imprimir imagem personalizada:", error);
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
      console.log(`[PrinterController] Status da impressora: ${status}`);
      return status;
    } catch (error) {
      console.error("[PrinterController] Erro ao obter status da impressora:", error);
      throw error;
    }
  },

  /**
   * Verifica se a impressora está pronta para uso.
   * @returns True se a impressora estiver pronta; False caso contrário.
   */
  async isPrinterReady(): Promise<boolean> {
    try {
      const status = await PrinterController.getPrinterStatus();
      const isReady = status === 0;
      console.log(`[PrinterController] Impressora pronta: ${isReady}`);
      return isReady;
    } catch (error) {
      console.error("[PrinterController] Erro ao verificar se a impressora está pronta:", error);
      return false;
    }
  },
};

export default PrinterController;
