<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Super Admin</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <!-- Sección de acciones principales -->
      <div class="action-grid">
        <!-- Resumen rápido (opcional) -->
        <ion-card>
          <ion-card-header>
            <ion-card-title>Resumen del Sistema</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <div class="stats-grid">
              <div class="stat-item">
                <ion-icon :icon="businessOutline" size="large"></ion-icon>
                <h3>{{ fraccionamientos.length }}</h3>
                <p>Fraccionamientos</p>
              </div>
              <div class="stat-item">
                <ion-icon :icon="peopleOutline" size="large"></ion-icon>
                <h3>{{ users.length }}</h3>
                <p>Usuarios</p>
              </div>
              <div class="stat-item">
                <ion-icon :icon="radioOutline" size="large"></ion-icon>
                <h3>24</h3>
                <p>IoT Devices</p>
              </div>
            </div>
          </ion-card-content>
        </ion-card>

        <!-- Tarjeta para crear fraccionamientos -->
        <ion-card class="action-card">
          <ion-card-header>
            <ion-icon :icon="businessOutline" size="large" color="primary"></ion-icon>
            <ion-card-title>Fraccionamientos</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <p>Administra y crea nuevos fraccionamientos en el sistema</p>
            <ion-button expand="block" class="action-button" router-link="/tabs/createfrac">
              Gestionar
              <ion-icon slot="end" :icon="arrowForwardOutline"></ion-icon>
            </ion-button>
          </ion-card-content>
        </ion-card>

        <!-- Tarjeta para usuarios -->
        <ion-card class="action-card">
          <ion-card-header>
            <ion-icon :icon="peopleOutline" size="large" color="primary"></ion-icon>
            <ion-card-title>Usuarios</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <p>Administra usuarios y sus permisos en el sistema</p>
            <ion-button expand="block" router-link="/admin/usuarios" class="action-button">
              Gestionar
              <ion-icon slot="end" :icon="arrowForwardOutline"></ion-icon>
            </ion-button>
          </ion-card-content>
        </ion-card>

        <!-- Tarjeta para configuración -->
        <ion-card class="action-card">
          <ion-card-header>
            <ion-icon :icon="settingsOutline" size="large" color="primary"></ion-icon>
            <ion-card-title>Configuración</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <p>Configuración global del sistema y preferencias</p>
            <ion-button expand="block" router-link="/admin/configuracion" class="action-button">
              Gestionar
              <ion-icon slot="end" :icon="arrowForwardOutline"></ion-icon>
            </ion-button>
          </ion-card-content>
        </ion-card>
      </div>

      
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonButtons,
  IonMenuButton,
} from "@ionic/vue";
import {
  businessOutline,
  peopleOutline,
  settingsOutline,
  arrowForwardOutline,
  radioOutline,
} from "ionicons/icons";

import { useRouter } from "vue-router";

const router = useRouter();

// Datos de ejemplo (puedes reemplazar con datos reales)
const fraccionamientos = ref([
  { name: "Fraccionamiento 1", description: "Descripción 1" },
  { name: "Fraccionamiento 2", description: "Descripción 2" },
  { name: "Fraccionamiento 3", description: "Descripción 3" },
]);

const users = ref([
  { name: "Usuario 1", email: "usuario1@example.com" },
  { name: "Usuario 2", email: "usuario2@example.com" },
  { name: "Usuario 3", email: "usuario3@example.com" },
]);



const NavigateToFraccionamientos = async () => {
  // Lógica para navegar a la página de fraccionamientos
  await router.push({ name: "CreateFrac" });
};
</script>

<style scoped>
.action-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.action-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  text-align: center;
}

.action-card ion-card-header {
  flex: 0 0 auto;
}

.action-card ion-card-content {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
}

.action-card p {
  flex-grow: 1;
  color: var(--ion-color-medium);
}

.action-button {
  margin-top: auto;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  text-align: center;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-item h3 {
  margin: 8px 0;
  font-size: 1.5rem;
  font-weight: bold;
}

.stat-item p {
  margin: 0;
  color: var(--ion-color-medium);
  font-size: 0.9rem;
}
</style>