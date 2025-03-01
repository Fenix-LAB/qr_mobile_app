<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Dashboard de Administrador</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <!-- Sección de Usuarios -->
      <ion-card>
        <ion-card-header>
          <ion-card-title>Usuarios</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-list>
            <ion-item v-for="user in usuarios" :key="user.id">
              <ion-label>{{ user.nombre }}</ion-label>
              <ion-button @click="eliminarUsuario(user.id)" color="danger" fill="clear">
                <ion-icon :icon="trashOutline"></ion-icon>
              </ion-button>
            </ion-item>
          </ion-list>
        </ion-card-content>
      </ion-card>

      <!-- Sección de Solicitudes Pendientes -->
      <ion-card>
        <ion-card-header>
          <ion-card-title>Solicitudes Pendientes</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-list>
            <ion-item v-for="solicitud in solicitudesPendientes" :key="solicitud.id">
              <ion-label>{{ solicitud.nombre }}</ion-label>
              <ion-button @click="aceptarSolicitud(solicitud.id)" color="success" fill="clear">
                <ion-icon :icon="checkmarkOutline"></ion-icon>
              </ion-button>
              <ion-button @click="rechazarSolicitud(solicitud.id)" color="danger" fill="clear">
                <ion-icon :icon="closeOutline"></ion-icon>
              </ion-button>
            </ion-item>
          </ion-list>
        </ion-card-content>
      </ion-card>

      <!-- Sección de Eventos -->
      <ion-card>
        <ion-card-header>
          <ion-card-title>Eventos del Fraccionamiento</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-accordion-group>
            <ion-accordion v-for="evento in eventos" :key="evento.id">
              <ion-item slot="header">
                <ion-label>{{ evento.titulo }}</ion-label>
              </ion-item>
              <div slot="content">
                <p><strong>Usuario:</strong> {{ evento.usuario }}</p>
                <p><strong>Fecha:</strong> {{ evento.fecha }}</p>
                <p><strong>Tipo:</strong> {{ evento.tipo }}</p>
              </div>
            </ion-accordion>
          </ion-accordion-group>
        </ion-card-content>
      </ion-card>

      <!-- Sección de Editar Fraccionamiento -->
      <ion-card>
        <ion-card-header>
          <ion-card-title>Editar Información del Fraccionamiento</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-item>
            <ion-label position="stacked">Nombre</ion-label>
            <ion-input v-model="fraccionamiento.nombre"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="stacked">Descripción</ion-label>
            <ion-textarea v-model="fraccionamiento.descripcion"></ion-textarea>
          </ion-item>
          <ion-item>
            <ion-label position="stacked">Ubicación</ion-label>
            <ion-input v-model="fraccionamiento.ubicacion"></ion-input>
          </ion-item>
          <ion-button expand="block" @click="guardarCambios">Guardar Cambios</ion-button>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
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
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonAccordionGroup,
  IonAccordion,
  IonInput,
  IonTextarea,
} from "@ionic/vue";
import { ref } from "vue";
import { trashOutline, checkmarkOutline, closeOutline } from "ionicons/icons";

// Datos de ejemplo
const usuarios = ref([
  { id: 1, nombre: "Usuario 1" },
  { id: 2, nombre: "Usuario 2" },
  { id: 3, nombre: "Usuario 3" },
]);

const solicitudesPendientes = ref([
  { id: 1, nombre: "Solicitud 1" },
  { id: 2, nombre: "Solicitud 2" },
]);

const eventos = ref([
  { id: 1, titulo: "Evento 1", usuario: "Usuario 1", fecha: "2023-10-01", tipo: "Entrada" },
  { id: 2, titulo: "Evento 2", usuario: "Usuario 2", fecha: "2023-10-02", tipo: "Salida" },
]);

const fraccionamiento = ref({
  nombre: "Fraccionamiento Ejemplo",
  descripcion: "Descripción del fraccionamiento",
  ubicacion: "Ubicación del fraccionamiento",
});

// Funciones
const eliminarUsuario = (id: number) => {
  usuarios.value = usuarios.value.filter((user) => user.id !== id);
  console.log(`Usuario ${id} eliminado`);
};

const aceptarSolicitud = (id: number) => {
  solicitudesPendientes.value = solicitudesPendientes.value.filter((solicitud) => solicitud.id !== id);
  console.log(`Solicitud ${id} aceptada`);
};

const rechazarSolicitud = (id: number) => {
  solicitudesPendientes.value = solicitudesPendientes.value.filter((solicitud) => solicitud.id !== id);
  console.log(`Solicitud ${id} rechazada`);
};

const guardarCambios = () => {
  console.log("Cambios guardados:", fraccionamiento.value);
};
</script>

<style scoped>
ion-card {
  margin-bottom: 20px;
}

ion-card-header {
  background-color: var(--ion-color-light);
}

ion-card-title {
  font-size: 1.2rem;
  font-weight: bold;
}

ion-item {
  --padding-start: 0;
  --inner-padding-end: 0;
}

ion-button {
  margin: 0 5px;
}

ion-accordion-group {
  width: 100%;
}

ion-accordion ion-item {
  --padding-start: 16px;
}

ion-accordion div[slot="content"] {
  padding: 16px;
  background-color: var(--ion-color-light);
}
</style>