package br.com.publisoft.appdemopublisoft

import android.util.Base64
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.os.RemoteException
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.sunmi.peripheral.printer.InnerPrinterCallback
import com.sunmi.peripheral.printer.InnerPrinterManager
import com.sunmi.peripheral.printer.SunmiPrinterService
import com.sunmi.peripheral.printer.InnerResultCallback

class SunmiPrinterModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private var printerService: SunmiPrinterService? = null

    override fun getName(): String {
        return "SunmiPrinterModule"
    }

    // Callback para vincular/desvincular serviço
    private val printerCallback = object : InnerPrinterCallback() {
        override fun onConnected(service: SunmiPrinterService?) {
            printerService = service
            println("[SUNMI PRINTER] Serviço de impressora conectado.")
        }

        override fun onDisconnected() {
            printerService = null
            println("[SUNMI PRINTER] Serviço de impressora desconectado.")
        }
    }

    init {
        println("[SUNMI PRINTER] Tentando vincular o serviço da impressora...")
        bindPrinterService(reactContext)
    }

    private fun bindPrinterService(context: ReactApplicationContext) {
        try {
            InnerPrinterManager.getInstance().bindService(context, printerCallback)
            println("[SUNMI PRINTER] Serviço vinculado com sucesso.")
        } catch (e: Exception) {
            println("[SUNMI PRINTER] Erro ao vincular serviço: ${e.message}")
            e.printStackTrace()
        }
    }

    @ReactMethod
    fun printText(text: String, promise: Promise) {
        if (printerService == null) {
            val errorMsg = "[SUNMI PRINTER] Erro: Serviço de impressora não conectado."
            println(errorMsg)
            promise.reject("ERRO_IMPRESSORA", errorMsg)
            return
        }

        try {
            printerService?.printText("$text\n", object : InnerResultCallback() {
                override fun onRunResult(isSuccess: Boolean) {
                    println("[SUNMI PRINTER] Resultado da impressão de texto: $isSuccess")
                    if (isSuccess) {
                        promise.resolve("Texto impresso com sucesso!")
                    } else {
                        promise.reject("ERRO_IMPRESSAO", "Falha ao imprimir texto.")
                    }
                }

                override fun onReturnString(result: String) {}
                override fun onRaiseException(code: Int, msg: String) {
                    println("[SUNMI PRINTER] Exceção durante impressão de texto: Código $code, Mensagem $msg")
                }

                override fun onPrintResult(code: Int, msg: String) {
                    println("[SUNMI PRINTER] Resultado final da impressão de texto: Código $code, Mensagem $msg")
                }
            })
        } catch (e: RemoteException) {
            val errorMsg = "[SUNMI PRINTER] Erro ao imprimir texto: ${e.message}"
            println(errorMsg)
            promise.reject("ERRO_IMPRESSAO", errorMsg, e)
        }
    }

    @ReactMethod
    fun printBase64Image(base64String: String, promise: Promise) {
        if (printerService == null) {
            val errorMsg = "[SUNMI PRINTER] Erro: Serviço de impressora não conectado."
            println(errorMsg)
            promise.reject("ERRO_IMPRESSORA", errorMsg)
            return
        }

        try {
            val decodedBytes = Base64.decode(base64String, Base64.DEFAULT)
            val bitmap = BitmapFactory.decodeByteArray(decodedBytes, 0, decodedBytes.size)

            if (bitmap != null) {
                printerService?.printBitmap(bitmap, object : InnerResultCallback() {
                    override fun onRunResult(isSuccess: Boolean) {
                        println("[SUNMI PRINTER] Resultado da impressão de imagem: $isSuccess")
                        if (isSuccess) {
                            promise.resolve("Imagem impressa com sucesso!")
                        } else {
                            promise.reject("ERRO_IMAGEM", "Falha ao imprimir a imagem.")
                        }
                    }

                    override fun onReturnString(result: String) {}
                    override fun onRaiseException(code: Int, msg: String) {
                        println("[SUNMI PRINTER] Exceção durante impressão de imagem: Código $code, Mensagem $msg")
                    }

                    override fun onPrintResult(code: Int, msg: String) {
                        println("[SUNMI PRINTER] Resultado final da impressão de imagem: Código $code, Mensagem $msg")
                    }
                })
            } else {
                promise.reject("ERRO_IMAGEM", "Falha ao decodificar a imagem Base64.")
            }
        } catch (e: Exception) {
            val errorMsg = "[SUNMI PRINTER] Erro ao imprimir imagem: ${e.message}"
            println(errorMsg)
            promise.reject("ERRO_IMAGEM", errorMsg, e)
        }
    }

    @ReactMethod
    fun printerStatus(promise: Promise) {
        if (printerService == null) {
            val errorMsg = "[SUNMI PRINTER] Erro: Serviço de impressora não conectado."
            println(errorMsg)
            promise.reject("ERRO_IMPRESSORA", errorMsg)
            return
        }

        try {
            val status = printerService?.updatePrinterState()
            println("[SUNMI PRINTER] Status da impressora: $status")
            promise.resolve(status)
        } catch (e: RemoteException) {
            val errorMsg = "[SUNMI PRINTER] Erro ao obter status da impressora: ${e.message}"
            println(errorMsg)
            promise.reject("ERRO_STATUS", errorMsg, e)
        }
    }

    override fun onCatalystInstanceDestroy() {
        super.onCatalystInstanceDestroy()
        try {
            printerService?.let {
                InnerPrinterManager.getInstance().unBindService(reactApplicationContext, printerCallback)
                println("[SUNMI PRINTER] Serviço de impressora desvinculado com sucesso.")
            }
        } catch (e: Exception) {
            println("[SUNMI PRINTER] Erro ao desvincular o serviço de impressora: ${e.message}")
            e.printStackTrace()
        }
    }

    override fun canOverrideExistingModule(): Boolean {
        return true
    }
}
