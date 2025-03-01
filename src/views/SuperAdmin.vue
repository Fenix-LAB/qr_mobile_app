<template>
    <ion-page>
      <ion-header :translucent="true">
        <ion-toolbar>
          <ion-title>Super Admin</ion-title>
        </ion-toolbar>
      </ion-header>
  
      <ion-content :fullscreen="true" class="ion-padding">
        <!-- Sección de creación de fraccionamientos -->
        <ion-card>
          <ion-card-header>
            <ion-card-title>Crear Fraccionamiento</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-item>
              <ion-label position="stacked">Nombre del Fraccionamiento</ion-label>
              <ion-input v-model="newFraccionamiento.name" placeholder="Nombre"></ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="stacked">Descripción</ion-label>
              <ion-textarea v-model="newFraccionamiento.description" placeholder="Descripción"></ion-textarea>
            </ion-item>
            <ion-button expand="full" @click="createFraccionamiento">Crear</ion-button>
          </ion-card-content>
        </ion-card>
  
        <!-- Sección de fraccionamientos -->
        <ion-card>
          <ion-card-header>
            <ion-card-title>Fraccionamientos</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-list>
              <ion-item v-for="(fracc, index) in visibleFraccionamientos" :key="index">
                <ion-label>
                  <h2>{{ fracc.name }}</h2>
                  <p>{{ fracc.description }}</p>
                </ion-label>
              </ion-item>
            </ion-list>
            <ion-button v-if="fraccionamientos.length > 3" expand="full" @click="showAllFraccionamientos">
              {{ showAllFracc ? "Mostrar menos" : "Ver todos" }}
            </ion-button>
          </ion-card-content>
        </ion-card>
  
        <!-- Sección de usuarios -->
        <ion-card>
          <ion-card-header>
            <ion-card-title>Usuarios</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-list>
              <ion-item v-for="(user, index) in visibleUsers" :key="index">
                <ion-label>
                  <h2>{{ user.name }}</h2>
                  <p>{{ user.email }}</p>
                </ion-label>
              </ion-item>
            </ion-list>
            <ion-button v-if="users.length > 5" expand="full" @click="showAllUsers">
              {{ showAllUsersFlag ? "Mostrar menos" : "Ver todos" }}
            </ion-button>
          </ion-card-content>
        </ion-card>
      </ion-content>
    </ion-page>
  </template>

<script setup lang="ts">
import { ref, computed } from "vue";
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
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonButton,
  IonList,
} from "@ionic/vue";

// Datos de ejemplo para fraccionamientos y usuarios
const fraccionamientos = ref([
  { name: "Fraccionamiento 1", description: "Descripción 1" },
  { name: "Fraccionamiento 2", description: "Descripción 2" },
  { name: "Fraccionamiento 3", description: "Descripción 3" },
  { name: "Fraccionamiento 4", description: "Descripción 4" },
]);

const users = ref([
  { name: "Usuario 1", email: "usuario1@example.com" },
  { name: "Usuario 2", email: "usuario2@example.com" },
  { name: "Usuario 3", email: "usuario3@example.com" },
  { name: "Usuario 4", email: "usuario4@example.com" },
  { name: "Usuario 5", email: "usuario5@example.com" },
  { name: "Usuario 6", email: "usuario6@example.com" },
]);

// Estado para el nuevo fraccionamiento
const newFraccionamiento = ref({
  name: "",
  description: "",
});

// Estado para controlar la visibilidad de todos los elementos
const showAllFracc = ref(false);
const showAllUsersFlag = ref(false);

// Lógica para crear un fraccionamiento
const createFraccionamiento = () => {
  if (newFraccionamiento.value.name && newFraccionamiento.value.description) {
    fraccionamientos.value.push({
      name: newFraccionamiento.value.name,
      description: newFraccionamiento.value.description,
    });
    newFraccionamiento.value.name = "";
    newFraccionamiento.value.description = "";
  }
};

// Lógica para mostrar todos los fraccionamientos
const showAllFraccionamientos = () => {
  showAllFracc.value = !showAllFracc.value;
};

// Lógica para mostrar todos los usuarios
const showAllUsers = () => {
  showAllUsersFlag.value = !showAllUsersFlag.value;
};

// Computed para mostrar solo algunos fraccionamientos
const visibleFraccionamientos = computed(() => {
  return showAllFracc.value ? fraccionamientos.value : fraccionamientos.value.slice(0, 3);
});

// Computed para mostrar solo algunos usuarios
const visibleUsers = computed(() => {
  return showAllUsersFlag.value ? users.value : users.value.slice(0, 5);
});
</script>

<style scoped>
ion-card {
  margin-bottom: 20px;
}

ion-button {
  margin-top: 10px;
}
</style>