import { NativeModules } from "react-native";

// Importando o módulo nativo
const { SunmiPrinterModule } = NativeModules;

// Tipos de Status da Impressora
type PrinterStatus =
  | 0 // Impressora pronta
  | 1 // Sem papel
  | 2 // Sobreaquecimento
  | 3 // Tampa aberta
  | -1 // Impressora não conectada
  | -2 // Comunicação anormal
  | -3 // Atualização de firmware necessária
  | number; // Outros códigos personalizados

// Interfaces para Tipagem
interface PrintTextParams {
  text: string;
  fontSize: number;
  alignment: 0 | 1 | 2; // Alinhamento: 0 (esquerda), 1 (centro), 2 (direita)
  blankLines?: number; // Linhas em branco após o texto
}

interface PrintImageParams {
  base64Image: string;
  maxWidth: number;
  blankLines?: number; // Linhas em branco após a imagem
}

// Interface do Controlador de Impressora
interface PrinterController {
  printCustomText: (params: PrintTextParams) => Promise<void>;
  printCustomImage: (params: PrintImageParams) => Promise<void>;
  getPrinterStatus: () => Promise<PrinterStatus>;
  isPrinterReady: () => Promise<boolean>;
}

// Implementação do Controlador de Impressora
const PrinterController: PrinterController = {
  /**
   * Imprime texto com opções de personalização.
   * @param params Parâmetros para impressão de texto.
   */
  async printCustomText({ text, fontSize, alignment, blankLines = 0 }: PrintTextParams): Promise<void> {
    try {
      await SunmiPrinterModule.printCustomText(text, fontSize, alignment, blankLines);
      console.log("[PrinterController] Texto personalizado impresso com sucesso.");
    } catch (error) {
      console.error("[PrinterController] Erro ao imprimir texto personalizado:", error);
      throw error;
    }
  },

  /**
   * Imprime uma imagem em formato Base64 com largura personalizada.
   * @param params Parâmetros para impressão de imagem.
   */
  async printCustomImage({ base64Image, maxWidth, blankLines = 0 }: PrintImageParams): Promise<void> {
    try {
      await SunmiPrinterModule.printCustomImage(base64Image, maxWidth, blankLines);
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
