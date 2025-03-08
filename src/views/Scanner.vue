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
      <ion-text v-if="scannedData">Código escaneado: {{ scannedData }}</ion-text>

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
import {
  flashlightOutline,
} from "ionicons/icons";
import { BarcodeScanner, SupportedFormat } from '@capacitor-community/barcode-scanner';

const scannedData = ref<string | null>(null);
const flashlightIcon = ref(flashlightOutline); // Icono de la linterna
const isFlashlightOn = ref(false); // Estado de la linterna

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
      console.log("Código escaneado:", result.content);
    } else {
      console.log("No se detectó ningún código.");
    }
  } catch (error) {
    console.error("Error al escanear:", error);
  }
}

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

// Manejo de ciclo de vida
onMounted(() => {
  startScanning();
});

onBeforeUnmount(() => {
  stopScanning();
});

// Manejo de eventos sociales
const openSocial = (network: string) => {
  console.log(`Posting to ${network}`);
};
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

/* Estilos específicos para esta vista */
.scanner-content {
  --background: transparent !important; /* Fondo transparente */
  --ion-background-color: transparent !important; /* Anular el fondo de Ionic */
}

/* 🔥 Asegura que el video de la cámara no afecte otras vistas */
body:not(.scanner-active) {
  background: transparent !important; /* Fondo transparente */
}

/* Estilos para el modo oscuro */
.ion-palette-dark .camera-container,
.ion-palette-dark .camera-overlay,
.ion-palette-dark .corner {
  background: transparent !important; /* Fondo transparente en modo oscuro */
}

.ion-palette-dark .camera-overlay {
  border-color: rgba(255, 255, 255, 0.7); /* Mantener el borde visible en modo oscuro */
}

.ion-palette-dark .corner {
  border-color: white; /* Mantener las esquinas visibles en modo oscuro */
}

.ion-palette-dark .scanner-content {
  --background: transparent !important; /* Fondo transparente en modo oscuro */
  --ion-background-color: transparent !important; /* Anular el fondo de Ionic en modo oscuro */
}

.ion-palette-dark body:not(.scanner-active) {
  background: transparent !important; /* Fondo transparente en modo oscuro */
}
</style>