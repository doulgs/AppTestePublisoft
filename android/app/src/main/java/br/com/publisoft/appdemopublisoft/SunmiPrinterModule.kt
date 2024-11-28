
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
    fun printCustomText(text: String, fontSize: Float, alignment: Int, blankLines: Int, promise: Promise) {
        if (printerService == null) {
            promise.reject("ERRO_IMPRESSORA", "[SUNMI PRINTER] Serviço de impressora não conectado.")
            return
        }

        try {
            printerService?.apply {
                setAlignment(alignment, object : InnerResultCallback() {
                    override fun onRunResult(isSuccess: Boolean) {}
                    override fun onReturnString(result: String) {}
                    override fun onRaiseException(code: Int, msg: String) {}
                    override fun onPrintResult(code: Int, msg: String) {}
                })

                setFontSize(fontSize, object : InnerResultCallback() {
                    override fun onRunResult(isSuccess: Boolean) {}
                    override fun onReturnString(result: String) {}
                    override fun onRaiseException(code: Int, msg: String) {}
                    override fun onPrintResult(code: Int, msg: String) {}
                })

                printText("$text", object : InnerResultCallback() {
                    override fun onRunResult(isSuccess: Boolean) {
                        if (isSuccess) {
                            lineWrap(blankLines, promise)
                        } else {
                            promise.reject("ERRO_IMPRESSAO", "Erro ao imprimir texto.")
                        }
                    }

                    override fun onReturnString(result: String) {}
                    override fun onRaiseException(code: Int, msg: String) {}
                    override fun onPrintResult(code: Int, msg: String) {}
                })
            }
        } catch (e: RemoteException) {
            promise.reject("ERRO_IMPRESSAO", "Erro ao imprimir: ${e.message}")
        }
    }

    @ReactMethod
    fun printCustomImage(base64String: String, maxWidth: Int, blankLines: Int, promise: Promise) {
        if (printerService == null) {
            promise.reject("ERRO_IMPRESSORA", "[SUNMI PRINTER] Serviço de impressora não conectado.")
            return
        }

        try {
            val decodedBytes = Base64.decode(base64String, Base64.DEFAULT)
            val originalBitmap = BitmapFactory.decodeByteArray(decodedBytes, 0, decodedBytes.size)
            val resizedBitmap = Bitmap.createScaledBitmap(
                originalBitmap,
                maxWidth,
                (originalBitmap.height * maxWidth / originalBitmap.width),
                true
            )

            printerService?.printBitmap(resizedBitmap, object : InnerResultCallback() {
                override fun onRunResult(isSuccess: Boolean) {
                    if (isSuccess) {
                        lineWrap(blankLines, promise)
                    } else {
                        promise.reject("ERRO_IMAGEM", "Erro ao imprimir imagem.")
                    }
                }

                override fun onReturnString(result: String) {}
                override fun onRaiseException(code: Int, msg: String) {}
                override fun onPrintResult(code: Int, msg: String) {}
            })
        } catch (e: Exception) {
            promise.reject("ERRO_IMAGEM", "Erro ao processar imagem: ${e.message}")
        }
    }

    private fun lineWrap(lines: Int, promise: Promise) {
        try {
            printerService?.lineWrap(lines, object : InnerResultCallback() {
                override fun onRunResult(isSuccess: Boolean) {
                    if (isSuccess) {
                        promise.resolve("Operação de impressão concluída com sucesso!")
                    } else {
                        promise.reject("ERRO_BUFFER", "Erro ao limpar buffer de impressão.")
                    }
                }

                override fun onReturnString(result: String) {}
                override fun onRaiseException(code: Int, msg: String) {}
                override fun onPrintResult(code: Int, msg: String) {}
            })
        } catch (e: RemoteException) {
            promise.reject("ERRO_BUFFER", "Erro ao mover papel: ${e.message}")
        }
    }

    @ReactMethod
    fun printerStatus(promise: Promise) {
        if (printerService == null) {
            promise.reject("ERRO_IMPRESSORA", "[SUNMI PRINTER] Serviço de impressora não conectado.")
            return
        }

        try {
            val status = printerService?.updatePrinterState()
            promise.resolve(status)
        } catch (e: RemoteException) {
            promise.reject("ERRO_STATUS", "Erro ao obter status da impressora: ${e.message}")
        }
    }

    override fun onCatalystInstanceDestroy() {
        super.onCatalystInstanceDestroy()
        try {
            printerService?.let {
                InnerPrinterManager.getInstance().unBindService(reactApplicationContext, printerCallback)
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    override fun canOverrideExistingModule(): Boolean {
        return true
    }
}
