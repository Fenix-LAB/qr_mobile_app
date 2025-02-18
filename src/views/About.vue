<template>
  <ion-page>
    <ion-content>
      <ion-header class="ion-no-border">
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-menu-button></ion-menu-button>
          </ion-buttons>
          <ion-buttons slot="end">
            <ion-button id="popover-button">
              <ion-icon slot="icon-only" :icon="ellipsisHorizontal"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>

      <div class="about-header">
        <!-- Instead of loading an image each time the select changes, use opacity to transition them -->
        <!-- Add a image for each location (now just a placeholder) -->
        <div class="about-image seattle" :style="{ opacity: '1' }"></div>
      </div>

      <div class="about-info">
        <h3 class="ion-padding-top ion-padding-start">
          {{ fraccionamientoActual.name }}
        </h3>

        <p class="ion-padding-start ion-padding-end">
          {{ fraccionamientoActual.description }}
        </p>

        <h3 class="ion-padding-top ion-padding-start">Details</h3>

        <ion-list lines="none">
          <ion-item>
            <ion-select label="Seleccionar" v-model="fraccionamientoActual.name" @ionChange="handleFraccionamientoChange">
              <ion-select-option v-for="fraccionamiento in fraccionamientosList" :value="fraccionamiento.name">
                {{ fraccionamiento.name }}
              </ion-select-option>
            </ion-select>
          </ion-item>
          <ion-item>
            <ion-label>Ubicación</ion-label>
            <ion-text slot="end">{{ fraccionamientoActual.location }}</ion-text>
          </ion-item>
        </ion-list>

        <!-- Boton para registrarse en un fraccionamiento-->

        <ion-button id="popover-button-selec" expand="block">
          Vincular
        </ion-button>

        <!-- Popover con combo box -->
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
      <ion-popover trigger="popover-button" :dismiss-on-select="true">
        <ion-content> </ion-content>
      </ion-popover>
    </ion-content>
  </ion-page>
</template>

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

.about-header .madison {
  background-image: url("../../public/assets/img/about/madison.jpg");
}

.about-header .austin {
  background-image: url("../../public/assets/img/about/austin.jpg");
}

.about-header .chicago {
  background-image: url("../../public/assets/img/about/chicago.jpg");
}

.about-header .seattle {
  background-image: url("../../public/assets/img/about/seattle.jpg");
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

.about-info ion-list {
  padding-top: 0;
}

.about-info p {
  color: var(--ion-color-dark);

  line-height: 130%;
}

.about-info ion-icon {
  margin-inline-end: 32px;
}

#date-input-popover {
  --offset-y: -var(--ion-safe-area-bottom);
  --max-width: 90%;
  --width: 336px;
}

/*
 * iOS Only
 */

.ios .about-info {
  --ion-padding: 19px;
}

.ios .about-info h3 {
  font-weight: 700;
}
</style>

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
  IonDatetime,
  IonItem,
  IonText,
  IonSelect,
  IonSelectOption,
  popoverController,
} from "@ionic/vue";

import { ellipsisHorizontal } from "ionicons/icons";

import { ref, watch, onMounted } from "vue";
import router from "@/router";
import { obtenerFraccionamientoActual, obtenerFraccionamientosUsurio, actulizarFraccionamientoActualUsuario} from "@/services/fraccionamientosService";

const selectOptions = {
  header: "Select a Location",
};

const fraccionamientos = ref<
  { id: number; name: string; location: string; description: string }[]
>([]);
const fraccionamientoActual = ref<{
  id: number;
  name: string;
  location: string;
  description: string;
}>({
  id: 0,
  name: "",
  location: "",
  description: "",
});
const fraccionamientosList = ref<
  { id: number; name: string; location: string; description: string }[]
>([]);

const cargarFraccionamientos = async () => {
  console.log("Cargando fraccionamientos..."); // Depuración
  try {
    const response = await obtenerFraccionamientoActual(1);
    console.log("Respuesta API:", response); // Depuración

    console.log("Fraccionamientos cargados:", response); // Depuración

    if (response) {
      // fraccionamientos.value = response.user_frac_associations.map(assoc => assoc.frac);
      fraccionamientos.value = response.frac; // Asegurar que sea el array correcto

      fraccionamientoActual.value = {
        id: response.frac.id,
        name: response.frac.name,
        location: response.frac.location,
        description: response.frac.description,
      };

      console.log(
        "Fraccionamiento actual name:",
        fraccionamientoActual.value.name
      ); // Correct
    }
  } catch (error) {
    console.error("Error cargando fraccionamientos", error);
  }
};

onMounted(cargarFraccionamientos);

const cargarTodosFraccionamientosDisponibles = async () => {
  console.log("Cargando fraccionamientos disponibles..."); // Depuración
  try {
    const response = await obtenerFraccionamientosUsurio(1);
    console.log("Respuesta API:", response); // Depuración

    // console.log("Fraccionamientos disponibles cargados:", response.length); // Depuración

    if (response && response.length > 0) {
      
      for (let i = 0; i < response.length; i++) {
        fraccionamientosList.value.push({
          id: response[i].frac.id,
          name: response[i].frac.name,
          location: response[i].frac.location,
          description: response[i].frac.description,
        });
      }


      // fraccionamientosList.value = response; // No funciona

      console.log("Fraccionamientos disponibles:", fraccionamientosList.value); // Correct
    }
  } catch (error) {
    console.error("Error cargando fraccionamientos disponibles", error);
  }
}

onMounted(cargarTodosFraccionamientosDisponibles);

const handleFraccionamientoChange = (event: CustomEvent) => {
  const selectedFraccionamiento = event.detail.value;
  console.log("Fraccionamiento seleccionado:", selectedFraccionamiento); // Depuración

  // Buscar el fraccionamiento seleccionado en fraccionamientosList
  const fraccionamiento = fraccionamientosList.value.find(
    (frac) => frac.name === selectedFraccionamiento
  );

  console.log("Fraccionamiento encontrado:", fraccionamiento); // Depuración
  console.log("Fraccionamiento id encontrado:", fraccionamiento?.id); // Depuración

  // Actualizar el fraccionamiento actual
  const response = actualizarFraccionamientoActual(1, fraccionamiento?.id || 0);
  console.log("Respuesta actualización:", response); // Depuración

  if (fraccionamiento) {
    fraccionamientoActual.value = {
      id: fraccionamiento.id,
      name: fraccionamiento.name,
      location: fraccionamiento.location,
      description: fraccionamiento.description,
    };
  }
};

const actualizarFraccionamientoActual = async (userId: number, fracId: number) => {
  console.log("Actualizando fraccionamiento actual..."); // Depuración
  try {
    console.log("Fraccionamiento id:", fracId); // Depuración
    const response = await actulizarFraccionamientoActualUsuario(userId, fracId);
    console.log("Respuesta API:", response); // Depuración

    console.log("Fraccionamiento actualizado:", response); // Depuración

    if (response) {
      console.log("Fraccionamiento actualizado:", response); // Depuración
    }
  } catch (error) {
    console.error("Error actualizando fraccionamiento actual", error);
  }
};

const close = async (url: string) => {
  const popover = await popoverController.getTop();
  if (popover) {
    window.open(url, "_blank");
    await popover.dismiss();
  }
};

const support = async () => {
  const popover = await popoverController.getTop();
  if (popover) {
    router.push("/support");
    await popover.dismiss();
  }
};

// watch(location, (newLocation: string, oldLocation: string) => {
//   const aboutImages = document.querySelectorAll<HTMLElement>('.about-image');
//   aboutImages.forEach((image) => {
//     const city = image.classList[1];
//     image.style.opacity = newLocation === city ? '1' : '0';
//   });
// });

// Lista de fraccionamientos (simulada)
// const fraccionamientoss = ref([
//   { id: 1, name: "Las Palmas" },
//   { id: 2, name: "La Vista" },
//   { id: 3, name: "Lomas Verdes" },
//   { id: 4, name: "Jardines del Valle" },
// ]);

// Estado para el fraccionamiento seleccionado
const selectedFraccionamiento = ref<string | null>(null);

// Función para manejar el registro
const registrar = () => {
  if (selectedFraccionamiento.value) {
    console.log(`Registrado en: ${selectedFraccionamiento.value}`);
    alert(`Te has registrado en: ${selectedFraccionamiento.value}`);
  } else {
    alert("Por favor selecciona un fraccionamiento.");
  }
};
</script>
