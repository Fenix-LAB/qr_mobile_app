<template>
  <ion-page>
    <ion-content>
      <ion-header class="ion-no-border">
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-menu-button></ion-menu-button>
          </ion-buttons>
          <ion-title>Fraccionamientos</ion-title>
        </ion-toolbar>
      </ion-header>

      <div class="about-header">
        <div class="about-image seattle" :style="{ opacity: '1' }"></div>
      </div>

      <div class="about-info">
        <h3 class="ion-padding-top ion-padding-start">
          {{ fraccionamientoActual.name }}
        </h3>

        <p class="ion-padding-start ion-padding-end">
          {{ fraccionamientoActual.description }}
        </p>

        <h3 class="ion-padding-top ion-padding-start">Detalles</h3>

        <ion-list lines="none">
          <ion-item>
            <ion-label>Ubicación</ion-label>
            <ion-text slot="end">{{ fraccionamientoActual.location }}</ion-text>
          </ion-item>
        </ion-list>

        <!-- Botón para vincular fraccionamiento -->
        <div class="ion-text-center ion-padding">
          <ion-button id="popover-button-selec" expand="block">
            Vincular
          </ion-button>
        </div>

        <!-- Popover para vincular fraccionamiento -->
        <ion-popover trigger="popover-button-selec" :dismiss-on-select="true">
          <ion-content class="ion-padding">
            <ion-list>
              <ion-item>
                <ion-label>Seleccione Fraccionamiento</ion-label>
                <ion-select v-model="selectedFraccionamiento" placeholder="Seleccione uno">
                  <ion-select-option v-for="fraccionamiento in fraccionamientos" :key="fraccionamiento.id"
                    :value="fraccionamiento.name">
                    {{ fraccionamiento.name }}
                  </ion-select-option>
                </ion-select>
              </ion-item>
            </ion-list>
            <ion-button expand="block" @click="registrar">
              Registrar
            </ion-button>
          </ion-content>
        </ion-popover>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonButton,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPopover,
  IonToolbar,
  IonIcon,
  IonButtons,
  IonList,
  IonLabel,
  IonItem,
  IonText,
  IonSelect,
  IonSelectOption,
} from "@ionic/vue";

import { ref, onMounted } from "vue";
import { obtenerFraccionamientoActual, obtenerFraccionamientosUsurio, actulizarFraccionamientoActualUsuario } from "@/services/fraccionamientosService";

// Estado para el fraccionamiento actual
const fraccionamientoActual = ref({
  id: 0,
  name: "Cargando...",
  location: "",
  description: "",
});

// Estado para la lista de fraccionamientos disponibles
const fraccionamientos = ref<{ id: number; name: string }[]>([]);

// Estado para el fraccionamiento seleccionado en el popover
const selectedFraccionamiento = ref<string | null>(null);

// Cargar el fraccionamiento actual del usuario
const cargarFraccionamientoActual = async () => {
  try {
    const response = await obtenerFraccionamientoActual(1); // Cambia el ID según el usuario
    if (response) {
      fraccionamientoActual.value = {
        id: response.frac.id,
        name: response.frac.name,
        location: response.frac.location,
        description: response.frac.description,
      };
    }
  } catch (error) {
    console.error("Error cargando fraccionamiento actual", error);
  }
};

// Cargar los fraccionamientos disponibles para el usuario
const cargarFraccionamientosDisponibles = async () => {
  try {
    const response = await obtenerFraccionamientosUsurio(1); // Cambia el ID según el usuario
    if (response && response.length > 0) {
      fraccionamientos.value = response.map((assoc: any) => ({
        id: assoc.frac.id,
        name: assoc.frac.name,
      }));
    }
  } catch (error) {
    console.error("Error cargando fraccionamientos disponibles", error);
  }
};

// Función para registrar un fraccionamiento
const registrar = async () => {
  if (selectedFraccionamiento.value) {
    try {
      const fraccionamiento = fraccionamientos.value.find(
        (frac) => frac.name === selectedFraccionamiento.value
      );
      if (fraccionamiento) {
        await actulizarFraccionamientoActualUsuario(1, fraccionamiento.id); // Cambia el ID según el usuario
        alert(`Te has registrado en: ${selectedFraccionamiento.value}`);
        cargarFraccionamientoActual(); // Recargar el fraccionamiento actual
      }
    } catch (error) {
      console.error("Error registrando fraccionamiento", error);
    }
  } else {
    alert("Por favor selecciona un fraccionamiento.");
  }
};

// Cargar datos al montar el componente
onMounted(() => {
  cargarFraccionamientoActual();
  cargarFraccionamientosDisponibles();
});
</script>

<style scoped>
ion-toolbar {
  --background: transparent;
  --color: white;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
}

ion-toolbar ion-button,
ion-toolbar ion-back-button,
ion-toolbar ion-menu-button {
  --color: white;
}

.about-header {
  position: relative;
  width: 100%;
  height: 30%;
}

.about-header .about-image {
  position: absolute;
  inset: 0;
  transition: opacity 500ms ease-in-out;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  opacity: 0;
}

.about-header .seattle {
  background-image: url("../../public/assets/img/about/seattle.jpg");
  opacity: 1;
}

.about-info {
  position: absolute;
  margin-top: -10px;
  border-radius: 10px;
  background: var(--ion-background-color, #ffffff);
  width: 100%;
}

.about-info h3 {
  margin-top: 0;
}

.about-info p {
  color: var(--ion-color-dark);
  line-height: 130%;
}

.about-info ion-list {
  padding-top: 0;
}

.about-info ion-item {
  --padding-start: 16px;
  --padding-end: 16px;
}

.about-info ion-label {
  font-weight: bold;
}

.about-info ion-text {
  color: var(--ion-color-dark);
}

/* Estilos para el popover */
ion-popover {
  --width: 90%;
  --max-width: 400px;
}

ion-popover ion-content {
  padding: 16px;
}

ion-popover ion-button {
  margin-top: 16px;
}
</style>