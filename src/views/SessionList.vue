<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">

      <!-- Sección de escaneo de QR -->
      <ion-header>
        <ion-toolbar>
          <ion-title>Escanear QR</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-content class="ion-padding">
        <!-- Cuadro de la cámara (siempre visible) -->
        <div class="camera-overlay">
          <p>Apunta al código QR</p>
        </div>

        <!-- Botón debajo del cuadro -->
        <ion-button expand="full" @click="scanQR">Escanear QR</ion-button>

        <ion-text v-if="scannedData">Código escaneado: {{ scannedData }}</ion-text>
      </ion-content>

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
import { ref } from "vue";
import {
  IonPage,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonButton,
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
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

// Variables reactivas
const scannedData = ref<string | null>(null);

// Función para escanear QR
async function checkPermissions() {
  const status = await BarcodeScanner.checkPermission({ force: true });

  if (status.granted) {
    return true;
  } else if (status.denied) {
    console.error("Permiso de cámara denegado permanentemente.");
  } else {
    console.error("Permiso de cámara no concedido.");
  }
  return false;
}

async function scanQR() {
  try {
    const hasPermission = await checkPermissions();
    if (!hasPermission) {
      console.error("No se tienen permisos de cámara.");
      return;
    }

    // Hacer que la cámara sea visible en el fondo
    document.querySelector("body")?.classList.add("scanner-active");

    BarcodeScanner.hideBackground();
    await BarcodeScanner.prepare();

    console.log("Preparación de cámara exitosa");

    const result = await BarcodeScanner.startScan();
    if (result.hasContent) {
      scannedData.value = result.content;
      console.log("Código escaneado:", result.content);
    } else {
      console.log("No se detectó ningún código.");
    }

    // Quitar la clase después del escaneo
    document.querySelector("body")?.classList.remove("scanner-active");
    BarcodeScanner.showBackground();

  } catch (error) {
    console.error("Error al iniciar el escaneo:", error);
    document.querySelector("body")?.classList.remove("scanner-active");
    BarcodeScanner.showBackground();
  }
}



// Manejo de eventos
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
</style>
