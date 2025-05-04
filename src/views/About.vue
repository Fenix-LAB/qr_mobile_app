<template>
  <ion-page>
    <ion-content>
      <!-- Cabecera -->
      <ion-header class="ion-no-border">
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-menu-button></ion-menu-button>
          </ion-buttons>
          <ion-title>Fraccionamientos</ion-title>
        </ion-toolbar>
      </ion-header>

      <!-- Imagen de cabecera -->
      <div class="about-header">
        <div class="about-image seattle" :style="{ opacity: '1' }"></div>
      </div>

      <!-- Contenedor de información -->
      <div class="about-info">
        <!-- Título "Tus fraccionamientos" -->
        <h3 class="ion-padding-top ion-padding-start">Tus fraccionamientos</h3>

        <!-- Lista de fraccionamientos -->
        <ion-list lines="none">
          <ion-item v-for="(fraccionamiento, index) in fraccionamientos" :key="index">
            <ion-label>
              <h2>{{ fraccionamiento.name }}</h2>
              <p>{{ fraccionamiento.location }}</p>
              <p>{{ fraccionamiento.description }}</p>
            </ion-label>
          </ion-item>
        </ion-list>

        <!-- Botón para vincular nuevo fraccionamiento -->
        <div class="ion-text-center ion-padding">
          <ion-button expand="block" @click="cargarFraccionamientosDisponibles">
            Vincular Fraccionamiento
          </ion-button>
        </div>

        <!-- Popover para vincular fraccionamiento -->
        <ion-popover :is-open="fraccionamientosDisponibles.length > 0">
          <ion-content>
            <ion-list>
              <ion-item>
                <ion-label>Selecciona un fraccionamiento</ion-label>
                <ion-select v-model="selectedFraccionamiento">
                  <ion-select-option v-for="(fraccionamiento, index) in fraccionamientosDisponibles" :key="index"
                    :value="fraccionamiento.name">
                    {{ fraccionamiento.name }}
                  </ion-select-option>
                </ion-select>
              </ion-item>
            </ion-list>
            <ion-button expand="full" @click="registrar">Registrar</ion-button>
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
  IonList,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
} from "@ionic/vue";
import { useStore } from 'vuex';
import { ref, onMounted, onActivated, computed } from "vue";
import { obtenerFraccionamientosUsuario, actulizarFraccionamientoActualUsuario, obtenerFraccionamientosDisponibles } from "@/services/fraccionamientosService";

const store = useStore();

// Estado para la lista de fraccionamientos del usuario
const fraccionamientos = ref<{ id: number; name: string; location: string; description: string }[]>([]);

// Estado para la lista de fraccionamientos disponibles para vincular
const fraccionamientosDisponibles = ref<{ id: number; name: string }[]>([]);

// Estado para el fraccionamiento seleccionado en el popover
const selectedFraccionamiento = ref<string | null>(null);

const userId = computed(() => store.state.user.id);
// Cargar los fraccionamientos del usuario
const cargarFraccionamientos = async () => {
  // ID del usuario almacenado en localStorage (puedes cambiarlo según tu lógica de autenticación)
  try {
    const response = await obtenerFraccionamientosUsuario(userId.value); // Usar el ID del usuario
    console.log(response);
    if (response && response.length > 0) {
      fraccionamientos.value = response.map((assoc: any) => ({
        name: assoc.name,
        location: assoc.location,
        description: assoc.description,
      }));
    }
  } catch (error) {
    console.error("Error cargando fraccionamientos del usuario", error);
  }
};

// Cargar los fraccionamientos disponibles para vincular
const cargarFraccionamientosDisponibles = async () => {
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const userId = userData.userId;
  try {
    const response = await obtenerFraccionamientosDisponibles(userId); // Usar el ID del usuario
    if (response && response.length > 0) {
      fraccionamientosDisponibles.value = response.map((frac: any) => ({
        id: frac.id,
        name: frac.name,
      }));
    }
  } catch (error) {
    console.error("Error cargando fraccionamientos disponibles", error);
  }
};

// Función para registrar un fraccionamiento
const registrar = async () => {
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const userId = userData.userId;
  if (selectedFraccionamiento.value) {
    try {
      const fraccionamiento = fraccionamientosDisponibles.value.find(
        (frac) => frac.name === selectedFraccionamiento.value
      );
      if (fraccionamiento) {
        await actulizarFraccionamientoActualUsuario(userId, fraccionamiento.id); // Cambia el ID según el usuario
        alert(`Te has registrado en: ${selectedFraccionamiento.value}`);
        cargarFraccionamientos(); // Recargar la lista de fraccionamientos
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
  cargarFraccionamientos();
  cargarFraccionamientosDisponibles();
});

onActivated(() => {
  cargarFraccionamientos(); // Recargar al activar la vista
});
</script>

<style scoped>
/* Estilos para la cabecera */
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

/* Estilos para la imagen de cabecera */
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

/* Estilos para el contenedor de información */
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

/* Estilos para la lista de fraccionamientos */
ion-list {
  padding-top: 0;
}

ion-item {
  --padding-start: 16px;
  --padding-end: 16px;
}

ion-label h2 {
  font-weight: bold;
}

ion-label p {
  color: var(--ion-color-medium);
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