<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/admin"></ion-back-button>
        </ion-buttons>
        <ion-title>Gestión de Fraccionamientos</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <!-- Lista de fraccionamientos -->
      <div v-if="fraccionamientos.length > 0">
        <ion-card 
          v-for="fracc in fraccionamientos" 
          :key="fracc.id" 
          class="fracc-card"
          @click="navigateToFraccionamiento(fracc.id)"
        >
          <ion-card-header>
            <ion-card-title>{{ fracc.nombre }}</ion-card-title>
            <ion-card-subtitle>{{ fracc.ubicacion }}</ion-card-subtitle>
          </ion-card-header>
          
          <ion-card-content>
            <p>{{ fracc.descripcion }}</p>
            
            <div class="access-info">
              <ion-icon :icon="qrCodeOutline" color="primary"></ion-icon>
              <span>{{ fracc.accesos.length }} acceso(s)</span>
              
              <ion-button 
                size="small" 
                @click.stop="navigateToAddAccess(fracc.id)"
                class="add-access-btn"
              >
                <ion-icon slot="start" :icon="addOutline"></ion-icon>
                Añadir acceso
              </ion-button>
            </div>
          </ion-card-content>
        </ion-card>
      </div>

      <!-- Mensaje cuando no hay fraccionamientos -->
      <div v-else class="empty-state">
        <ion-icon :icon="businessOutline" size="large" color="medium"></ion-icon>
        <h3>No hay fraccionamientos registrados</h3>
        <p>Comienza creando tu primer fraccionamiento</p>
      </div>

      <!-- Botón para crear nuevo fraccionamiento -->
      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button router-link="/tabs/newfrac">
          <ion-icon :icon="addOutline"></ion-icon>
        </ion-fab-button>
      </ion-fab>
      
      <!-- Botón para crear un dispositivo -->
      <ion-fab vertical="bottom" horizontal="start" slot="fixed">
        <ion-fab-button router-link="/tabs/newdevice">
          <ion-icon :icon="hardwareChipOutline"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
  IonButton, IonIcon, IonButtons, IonBackButton, IonFab, IonFabButton
} from '@ionic/vue';
import { addOutline, businessOutline, qrCodeOutline, hardwareChipOutline } from 'ionicons/icons';
import { obtenerFraccionamientos } from '@/services/superAdminService';

const router = useRouter();

const fraccionamientos = ref<{
  id: number;
  nombre: string;
  ubicacion: string;
  descripcion: string;
  accesos: { id: number}[];
}[]>([]);

const fetchAllFraccionamientos = async () => {
  const response = await obtenerFraccionamientos();
  console.log('Fraccionamientos obtenidos:', response);
  fraccionamientos.value = response.map((fracc: any) => ({
    id: fracc.id,
    nombre: fracc.name,
    ubicacion: fracc.location,
    descripcion: fracc.description,
    accesos: fracc.iot_devices || []
  }));
};

// Navegar a vista detallada del fraccionamiento
const navigateToFraccionamiento = (fraccId: number) => {
  // console.log('Navegando a fraccionamiento con ID:', fraccId); // undefined :(
  router.push({ name: 'fraccionamiento-details', params: { id: fraccId } });
};

// Navegar a añadir acceso (con stop propagation para evitar conflictos)
const navigateToAddAccess = (fraccId: number) => {
  router.push({ name: 'newaccess', params: { fraccId } });
};

onMounted(async () => {
  await fetchAllFraccionamientos();
});
</script>

<style scoped>
.fracc-card {
  margin-bottom: 16px;
  transition: transform 0.2s;
  cursor: pointer;
}

.fracc-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.access-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid var(--ion-color-light);
}

.add-access-btn {
  margin-left: auto;
  --padding-start: 8px;
  --padding-end: 8px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  text-align: center;
}

.empty-state h3 {
  margin-top: 16px;
  color: var(--ion-color-medium);
}

.empty-state p {
  color: var(--ion-color-medium-shade);
  margin-top: 4px;
}
</style>