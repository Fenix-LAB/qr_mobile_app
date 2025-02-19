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
      <!-- Cuadro de la cámara (siempre visible en esta vista) -->
      <div class="camera-overlay">
        <p>Apunta al código QR</p>
      </div>

      <!-- Texto del código escaneado -->
      <ion-text v-if="scannedData">Código escaneado: {{ scannedData }}</ion-text>

      <!-- FAB de redes sociales -->
      <ion-fab slot="fixed" vertical="bottom" horizontal="end">
        <ion-fab-button>
          <ion-icon :icon="shareSocial"></ion-icon>
        </ion-fab-button>
        <ion-fab-list side="top">
          <ion-fab-button color="vimeo" @click="openSocial('Vimeo')">
            <ion-icon :icon="logoVenmo"></ion-icon>
          </ion-fab-button>
          <ion-fab-button color="google" @click="openSocial('Google+')">
            <ion-icon :icon="logoGoogle"></ion-icon>
          </ion-fab-button>
          <ion-fab-button color="twitter" @click="openSocial('Twitter')">
            <ion-icon :icon="logoTwitter"></ion-icon>
          </ion-fab-button>
          <ion-fab-button color="facebook" @click="openSocial('Facebook')">
            <ion-icon :icon="logoFacebook"></ion-icon>
          </ion-fab-button>
        </ion-fab-list>
      </ion-fab>
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
  IonFab,
  IonFabButton,
  IonFabList,
  IonText
} from "@ionic/vue";
import {
  shareSocial,
  logoVenmo,
  logoGoogle,
  logoTwitter,
  logoFacebook
} from "ionicons/icons";
import { BarcodeScanner } from "@capacitor-community/barcode-scanner";

const scannedData = ref<string | null>(null);

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

    document.body.classList.add("scanner-active");
    BarcodeScanner.hideBackground();
    await BarcodeScanner.prepare();

    console.log("Cámara activada en el background");

    const result = await BarcodeScanner.startScan();
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
  BarcodeScanner.stopScan();
  console.log("Cámara desactivada");
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
.camera-overlay {
  width: 100%;
  height: 50vh;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  font-size: 18px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  border-radius: 10px;
  margin-bottom: 10px;
  position: relative;
  z-index: 10;
}

/* Estilos específicos para esta vista */
.scanner-content {
  --background: transparent;
  --ion-background-color: transparent;
}
</style>
