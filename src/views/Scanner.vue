<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Escanear QR</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="scanner-content">
      <!-- Pantalla de escaneo -->
      <div v-if="!scanResult">
        <!-- Contenedor para el video de la cámara -->
        <div id="camera-container" class="camera-container">
          <!-- Overlay con esquinas -->
          <div class="camera-overlay">
            <div class="corner top-left"></div>
            <div class="corner top-right"></div>
            <div class="corner bottom-left"></div>
            <div class="corner bottom-right"></div>
          </div>
        </div>

        <!-- Botón de la linterna -->
        <div class="flashlight-button-container">
          <ion-button @click="toggleFlashlight" class="flashlight-button">
            <ion-icon :icon="flashlightIcon"></ion-icon>
          </ion-button>
        </div>

        <!-- Texto del código escaneado -->
        <!-- <ion-text v-if="scannedData">Código escaneado: {{ scannedData }}</ion-text> -->
      </div>

      <!-- Pantalla de éxito -->
      <div v-if="scanResult === 'success'" class="result-screen success">
        <ion-icon :icon="checkmarkCircle" class="result-icon"></ion-icon>
        <h2>¡Éxito!</h2>
        <p>El código QR se ha procesado correctamente</p>
        <ion-button @click="resetScanner">OK</ion-button>
      </div>

      <!-- Pantalla de error -->
      <div v-if="scanResult === 'error'" class="result-screen error">
        <ion-icon :icon="closeCircle" class="result-icon"></ion-icon>
        <h2>Error</h2>
        <p>Hubo un problema al procesar el código QR </p>
        <p>Mensaje: {{ scanServiceResponse }}</p>
        <ion-button @click="resetScanner">OK</ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import {
  IonPage,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonIcon,
  IonContent,
  IonText,
  IonButton,
} from "@ionic/vue";
import { flashlightOutline, checkmarkCircle, closeCircle } from "ionicons/icons";
import { BarcodeScanner, SupportedFormat } from '@capacitor-community/barcode-scanner';
import { scannerRequestAccess } from "@/services/scannerService"; // Asegúrate de que esta ruta sea correcta

const scannedData = ref<string | null>(null);
const flashlightIcon = ref(flashlightOutline); // Icono de la linterna
const isFlashlightOn = ref(false); // Estado de la linterna
const scanResult = ref<"success" | "error" | null>(null); // Estado del resultado del escaneo
const scanServiceResponse = ref<any>(null); // Respuesta del servicio

// test consumir servicio
// const serviceResponse = await consumeService("Lomas Verdes");
// console.log("Respuesta del servicio:", serviceResponse.data.qrRequestAccess.message);
// console.log("Código de estado:", serviceResponse.data.qrRequestAccess.statusCode);

// Función para verificar permisos
async function checkPermissions() {
  const status = await BarcodeScanner.checkPermission({ force: true });

  if (status.granted) return true;

  if (status.denied) {
    console.error("Permiso de cámara denegado permanentemente.");
  } else {
    console.error("Permiso de cámara no concedido.");
  }

  return false;
}

// Función para iniciar el escaneo automáticamente
async function startScanning() {
  try {
    const hasPermission = await checkPermissions();
    if (!hasPermission) return;

    // Activar cámara solo en esta vista
    document.body.classList.add("scanner-active");
    BarcodeScanner.hideBackground();
    await BarcodeScanner.prepare();

    console.log("Cámara activada en el background");

    const result = await BarcodeScanner.startScan({ targetedFormats: [SupportedFormat.QR_CODE] });
    if (result.hasContent) {
      scannedData.value = result.content;
      // console.log("Código escaneado:", result.content);

      const serviceResponse = await consumeService(result.content);
      if (serviceResponse.data.qrRequestAccess.message) {
        scanResult.value = "success"; // Mostrar pantalla de éxito
      } else {
        scanResult.value = "error"; // Mostrar pantalla de error
        scanServiceResponse.value = serviceResponse.data.qrRequestAccess.message; // Guardar mensaje de error
      }
    } else {
      console.log("No se detectó ningún código.");
    }
  } catch (error) {
    console.error("Error al escanear:", error);
    scanResult.value = "error"; // Mostrar pantalla de error en caso de excepción
  }
}

// Función para consumir el servicio (simulación)
async function consumeService(qrData: string) {
  // Llamada al servicio para solicitar acceso requerido Id de usuario y string QR
  const cleanedData = clearScannedData(qrData); // Limpiar el código escaneado
  if (!cleanedData) {
    console.error("Código escaneado inválido.");
    scanResult.value = "error"; // Mostrar pantalla de error
    return;
  }
  const userId = 1;
  scanServiceResponse.value = qrData; // Guardar el código escaneado
  const response = await scannerRequestAccess(cleanedData, userId);
  return response;
}

// Función para resetear el escáner
const resetScanner = () => {
  scanResult.value = null; // Volver a la pantalla de escaneo
  scannedData.value = null; // Limpiar el código escaneado
  startScanning(); // Reiniciar el escáner
};

// Función para detener el escáner al salir de la página
async function stopScanning() {
  document.body.classList.remove("scanner-active");
  BarcodeScanner.showBackground();
  await BarcodeScanner.stopScan(); // 🔥 Asegura que el escáner se detiene completamente
  await BarcodeScanner.disableTorch(); // Apagar linterna si está activa
  console.log("Cámara desactivada");
}

// Función para encender/apagar la linterna
async function toggleFlashlight() {
  try {
    if (isFlashlightOn.value) {
      await BarcodeScanner.disableTorch();
      isFlashlightOn.value = false;
    } else {
      await BarcodeScanner.enableTorch();
      isFlashlightOn.value = true;
    }
  } catch (error) {
    console.error("Error al controlar la linterna:", error);
  }
}

function clearScannedData(scannedData: string | null) {
  // eliminar espacios en blanco al inicio y final
  return scannedData ? scannedData.trim() : null;
}

// Manejo de ciclo de vida
onMounted(() => {
  startScanning();
});

onBeforeUnmount(() => {
  stopScanning();
});
</script>

<style scoped>
/* Estilos generales */
.camera-container {
  width: 100%;
  height: 50vh;
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background: transparent !important; /* Fondo transparente */
  margin-top: 120px; /* Mover el cuadro más abajo */
}

.camera-overlay {
  width: 70%; /* Tamaño reducido */
  height: 70%; /* Tamaño reducido */
  position: relative;
  border: 4px solid rgba(255, 255, 255, 0.7); /* Borde más grueso y menos transparente */
  background: transparent !important; /* Fondo transparente */
}

.corner {
  position: absolute;
  width: 30px; /* Aumentamos el tamaño de las esquinas */
  height: 30px; /* Aumentamos el tamaño de las esquinas */
  border: 4px solid white; /* Borde más grueso */
  background: transparent !important; /* Fondo transparente */
}

.corner.top-left {
  top: 0;
  left: 0;
  border-right: none;
  border-bottom: none;
}

.corner.top-right {
  top: 0;
  right: 0;
  border-left: none;
  border-bottom: none;
}

.corner.bottom-left {
  bottom: 0;
  left: 0;
  border-right: none;
  border-top: none;
}

.corner.bottom-right {
  bottom: 0;
  right: 0;
  border-left: none;
  border-top: none;
}

.flashlight-button-container {
  display: flex;
  justify-content: center;
  margin-top: 40px; /* Mover el botón más abajo */
}

.flashlight-button {
  --background: rgba(255, 255, 255, 0.9); /* Fondo sólido con poca transparencia */
  --border-radius: 50%;
  --padding-start: 0;
  --padding-end: 0;
  --padding-top: 0;
  --padding-bottom: 0;
  width: 50px;
  height: 50px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); /* Sombra para darle profundidad */
}

.flashlight-button ion-icon {
  color: black; /* Cambiar el color del icono a negro */
}

/* Estilos para las pantallas de resultado */
.result-screen {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  text-align: center;
}

.result-screen.success {
  background-color: #4caf50; /* Fondo verde */
  color: white;
}

.result-screen.error {
  background-color: #f44336; /* Fondo rojo */
  color: white;
}

.result-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

/* Estilos específicos para esta vista */
.scanner-content {
  --background: transparent !important; /* Fondo transparente */
  --ion-background-color: transparent !important; /* Anular el fondo de Ionic */
}

/* 🔥 Asegura que el video de la cámara no afecte otras vistas */
body:not(.scanner-active) {
  background: transparent !important; /* Fondo transparente */
}
</style>