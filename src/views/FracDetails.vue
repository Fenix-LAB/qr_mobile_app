<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/admin/fraccionamientos"></ion-back-button>
        </ion-buttons>
        <ion-title>Detalle de Fraccionamiento</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="confirmDelete" color="danger">
            <ion-icon slot="icon-only" :icon="trashOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <!-- Información editable del fraccionamiento -->
      <ion-card>
        <ion-card-header>
          <ion-card-title>
            <ion-icon :icon="businessOutline" color="primary"></ion-icon>
            Información General
          </ion-card-title>
        </ion-card-header>
        
        <ion-card-content>
          <ion-item>
            <ion-icon slot="start" :icon="pricetagOutline" color="medium"></ion-icon>
            <ion-input v-model="fraccionamiento.nombre" label="Nombre" label-placement="floating"></ion-input>
          </ion-item>

          <ion-item>
            <ion-icon slot="start" :icon="locationOutline" color="medium"></ion-icon>
            <ion-input v-model="fraccionamiento.ubicacion" label="Ubicación" label-placement="floating"></ion-input>
          </ion-item>

          <ion-item>
            <ion-icon slot="start" :icon="documentTextOutline" color="medium"></ion-icon>
            <ion-textarea v-model="fraccionamiento.descripcion" label="Descripción" label-placement="floating" rows="3"></ion-textarea>
          </ion-item>

          <ion-button expand="block" @click="guardarCambios" color="primary">
            <ion-icon slot="start" :icon="saveOutline"></ion-icon>
            Guardar Cambios
          </ion-button>
        </ion-card-content>
      </ion-card>

      <!-- Lista de accesos -->
      <ion-card>
        <ion-card-header>
          <ion-card-title>
            <ion-icon :icon="gitNetworkOutline" color="primary"></ion-icon>
            Accesos Registrados
          </ion-card-title>
          <ion-button slot="end" size="small" router-link="/newaccess">
            <ion-icon slot="start" :icon="addOutline"></ion-icon>
            Nuevo Acceso
          </ion-button>
        </ion-card-header>

        <ion-card-content>
          <ion-list>
            <ion-item v-for="acceso in fraccionamiento.accesos" :key="acceso.id">
              <ion-icon slot="start" :icon="hardwareChipOutline" color="secondary"></ion-icon>
              <ion-label>
                <h2>{{ acceso.nombre }}</h2>
                <p>Dispositivo: {{ acceso.dispositivo.nombre }} ({{ acceso.dispositivo.serialNumber }})</p>
              </ion-label>
              <ion-button slot="end" fill="clear" @click="regenerarQRs(acceso.id)">
                <ion-icon :icon="refreshOutline" color="warning"></ion-icon>
              </ion-button>
              <ion-button slot="end" fill="clear" @click="editarAcceso(acceso.id)">
                <ion-icon :icon="createOutline" color="primary"></ion-icon>
              </ion-button>
            </ion-item>
          </ion-list>

          <div v-if="fraccionamiento.accesos.length === 0" class="empty-access">
            <ion-icon :icon="warningOutline" color="medium"></ion-icon>
            <p>No hay accesos registrados para este fraccionamiento</p>
          </div>
        </ion-card-content>
      </ion-card>

      <!-- Modal para regenerar QRs -->
      <ion-modal 
        :is-open="showQRModal" 
        @didDismiss="showQRModal = false"
        class="qr-modal"
      >
        <ion-header>
          <ion-toolbar color="primary">
            <ion-title>QRs Generados</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="downloadAllQrs">
                <ion-icon slot="start" :icon="downloadOutline"></ion-icon>
                Descargar ambos
              </ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        
        <ion-content class="ion-padding">
          <div class="qr-display">
            <div class="qr-section">
              <h3>
                <ion-icon :icon="enterOutline" color="success"></ion-icon>
                QR Entrada
              </h3>
              <div class="qr-container">
                <img :src="generatedQrs.entry" alt="QR Entrada">
              </div>
              <ion-button expand="block" @click="downloadQr(generatedQrs.entry, 'entrada')" color="success">
                <ion-icon slot="start" :icon="downloadOutline"></ion-icon>
                Descargar entrada
              </ion-button>
            </div>

            <div class="qr-section">
              <h3>
                <ion-icon :icon="exitOutline" color="danger"></ion-icon>
                QR Salida
              </h3>
              <div class="qr-container">
                <img :src="generatedQrs.exit" alt="QR Salida">
              </div>
              <ion-button expand="block" @click="downloadQr(generatedQrs.exit, 'salida')" color="danger">
                <ion-icon slot="start" :icon="downloadOutline"></ion-icon>
                Descargar salida
              </ion-button>
            </div>
          </div>

          <ion-button expand="block" @click="showQRModal = false" class="finish-btn">
            <ion-icon slot="start" :icon="checkmarkDoneOutline"></ion-icon>
            Finalizar
          </ion-button>
        </ion-content>
      </ion-modal>

      <!-- Modal de confirmación para eliminar -->
      <ion-modal :is-open="showDeleteModal" @didDismiss="showDeleteModal = false">
        <ion-header>
          <ion-toolbar color="danger">
            <ion-title>Confirmar Eliminación</ion-title>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <h3>¿Estás seguro de eliminar este fraccionamiento?</h3>
          <p>Todos los accesos y dispositivos asociados también serán eliminados.</p>
          
          <ion-button expand="block" color="danger" @click="eliminarFraccionamiento">
            <ion-icon slot="start" :icon="trashOutline"></ion-icon>
            Confirmar Eliminación
          </ion-button>
          <ion-button expand="block" fill="outline" @click="showDeleteModal = false">
            Cancelar
          </ion-button>
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonItem, IonInput, IonTextarea, IonButton, IonIcon,
  IonList, IonLabel, IonModal, IonButtons, IonBackButton
} from '@ionic/vue';
import {
  businessOutline, pricetagOutline, locationOutline,
  documentTextOutline, saveOutline, trashOutline,
  gitNetworkOutline, addOutline, hardwareChipOutline,
  refreshOutline, createOutline, warningOutline,
  downloadOutline, enterOutline, exitOutline,
  checkmarkDoneOutline
} from 'ionicons/icons';
import { obtenerFraccionamientoPorId ,
         actualizarFraccionamiento,
} from '@/services/fracDetails';
import { id } from 'date-fns/locale';

// Definición de tipos
type Dispositivo = {
  id: number;
  nombre: string;
  serialNumber: string;
};

type Acceso = {
  id: number;
  nombre: string;
  dispositivo: Dispositivo;
  qrEntry: string;
  qrExit: string;
};

type Fraccionamiento = {
  id: number;
  nombre: string;
  ubicacion: string;
  descripcion: string;
  accesos: Acceso[];
};

type GeneratedQRs = {
  entry: string;
  exit: string;
};

const route = useRoute();
const router = useRouter();

const fraccionamiento = ref<Fraccionamiento>({
  id: 0,
  nombre: '',
  ubicacion: '',
  descripcion: '',
  accesos: []
});

const showQRModal = ref<boolean>(false);
const showDeleteModal = ref<boolean>(false);
const generatedQrs = ref<GeneratedQRs>({
  entry: '',
  exit: ''
});

// Obtener datos del fraccionamiento
const obtenerDetalleFraccionamiento = async (id: number): Promise<void> => {
  try {
    // Ejemplo de llamada API:
    // const response = await api.getFraccionamiento(id);
    // fraccionamiento.value = response.data;

    // Respuesta de graph ql (info ofiicial):
    // {
        // "data": {
        //     "qr_shield_frac": [
        //     {
        //         "id": 1,
        //         "name": "Lomas Verdes",
        //         "location": "Av. San Juan, Colonia ABC, Puebla",
        //         "description": "Fraccionamiento CU BUAP",
        //         "iot_devices": [
        //         {
        //             "access_group": {
        //             "name": "Acceso Prueba 1",
        //             "qr_entry": null,
        //             "qr_exit": null,
        //             "id": 2
        //             },
        //             "device_name": "RED-IOT-RASP-0001",
        //             "serial_number": "123456789",
        //             "id": 1
        //         },
        //         {
        //             "access_group": {
        //             "name": "Prueba 2",
        //             "qr_entry": null,
        //             "qr_exit": null,
        //             "id": 3
        //             },
        //             "device_name": "RED-IOT-RASP-2UIU-0002",
        //             "serial_number": "213312UIU",
        //             "id": 2
        //         },
        //         {
        //             "access_group": {
        //             "name": "Acceso Prueba 3",
        //             "qr_entry": null,
        //             "qr_exit": null,
        //             "id": 4
        //             },
        //             "device_name": "RED-IOT-RASP-0003",
        //             "serial_number": "123456HJK",
        //             "id": 3
        //         },
        //         {
        //             "access_group": {
        //             "name": "Acceso Prueba 5",
        //             "qr_entry": null,
        //             "qr_exit": null,
        //             "id": 5
        //             },
        //             "device_name": "RED-IOT-RASP-0004",
        //             "serial_number": "1234",
        //             "id": 4
        //         }
        //         ]
        //     }
        //     ]
        // }
        // }
    
    const response = await obtenerFraccionamientoPorId(id);
    fraccionamiento.value = response.map((response: any) => ({
        id: response.id,
        nombre: response.name,
        ubicacion: response.location,
        descripcion: response.description,
        accesos: response.iot_devices.map((device: any) => ({
            id: device.id,
            nombre: device.access_group.name,
            dispositivo: {
            id: device.id,
            nombre: device.device_name,
            serialNumber: device.serial_number
            },
            qrEntry: device.access_group.qr_entry || '',
            qrExit: device.access_group.qr_exit || ''
        }))
        }))[0];

    
    // Datos de ejemplo (eliminar en producción):
    // fraccionamiento.value = {
    //   id: 1,
    //   nombre: 'Las Lomas',
    //   ubicacion: 'Av. Principal 123',
    //   descripcion: 'Fraccionamiento residencial de lujo',
    //   accesos: [
    //     {
    //       id: 1,
    //       nombre: 'Portón Principal',
    //       dispositivo: {
    //         id: 1,
    //         nombre: 'IoT-Gate-001',
    //         serialNumber: 'SN123456'
    //       },
    //       qrEntry: 'https://api.qrserver.com/v1/create-qr-code/?data=ENTRADA-1',
    //       qrExit: 'https://api.qrserver.com/v1/create-qr-code/?data=SALIDA-1'
    //     },
    //     {
    //       id: 2,
    //       nombre: 'Entrada Sur',
    //       dispositivo: {
    //         id: 2,
    //         nombre: 'IoT-Gate-002',
    //         serialNumber: 'SN789012'
    //       },
    //       qrEntry: 'https://api.qrserver.com/v1/create-qr-code/?data=ENTRADA-2',
    //       qrExit: 'https://api.qrserver.com/v1/create-qr-code/?data=SALIDA-2'
    //     }
    //   ]
    // };
  } catch (error) {
    console.error('Error obteniendo detalle:', error);
  }
};

// Guardar cambios del fraccionamiento
const guardarCambios = async (): Promise<void> => {
  try {
    // Ejemplo de llamada API:
    // await api.actualizarFraccionamiento(fraccionamiento.value.id, {
    //   nombre: fraccionamiento.value.nombre,
    //   ubicacion: fraccionamiento.value.ubicacion,
    //   descripcion: fraccionamiento.value.descripcion
    // });

    await actualizarFraccionamiento(
        fraccionamiento.value.id,
        fraccionamiento.value.nombre,
        fraccionamiento.value.ubicacion,
        fraccionamiento.value.descripcion
    );

    console.log('Cambios guardados:', fraccionamiento.value);
  } catch (error) {
    console.error('Error guardando cambios:', error);
  }
};

// Regenerar QRs para un acceso
const regenerarQRs = async (accesoId: number): Promise<void> => {
  try {
    // Ejemplo de llamada API:
    // const response = await api.regenerarQRs(accesoId);
    // generatedQrs.value = {
    //   entry: response.data.qrEntry,
    //   exit: response.data.qrExit
    // };
    
    // Datos de ejemplo (eliminar en producción):
    generatedQrs.value = {
      entry: `https://api.qrserver.com/v1/create-qr-code/?data=ENTRADA-NEW-${accesoId}`,
      exit: `https://api.qrserver.com/v1/create-qr-code/?data=SALIDA-NEW-${accesoId}`
    };
    
    showQRModal.value = true;
  } catch (error) {
    console.error('Error regenerando QRs:', error);
  }
};

// Editar acceso
const editarAcceso = (accesoId: number): void => {
  router.push(`/acceso/${accesoId}/editar`);
};

// Confirmar eliminación
const confirmDelete = (): void => {
  showDeleteModal.value = true;
};

// Eliminar fraccionamiento
const eliminarFraccionamiento = async (): Promise<void> => {
  try {
    // Ejemplo de llamada API:
    // await api.eliminarFraccionamiento(fraccionamiento.value.id);
    // router.push('/admin/fraccionamientos');
    
    console.log('Fraccionamiento eliminado:', fraccionamiento.value.id);
    router.push('/admin/fraccionamientos');
  } catch (error) {
    console.error('Error eliminando fraccionamiento:', error);
  }
};

// Descargar QR individual
const downloadQr = (qrData: string, type: string): void => {
  const link = document.createElement('a');
  link.href = qrData;
  link.download = `QR_${type}_${fraccionamiento.value.nombre.replace(/\s+/g, '_')}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Descargar ambos QRs
const downloadAllQrs = (): void => {
  if (generatedQrs.value.entry) downloadQr(generatedQrs.value.entry, 'entrada');
  if (generatedQrs.value.exit) downloadQr(generatedQrs.value.exit, 'salida');
};

onMounted(() => {
  const id = Number(route.params.id);
  console.log('ID del fraccionamiento:', id);
  if (id) {
    obtenerDetalleFraccionamiento(id);
  }
});
</script>

<style scoped>
ion-card {
  margin-bottom: 20px;
}

.empty-access {
  text-align: center;
  padding: 20px;
  color: var(--ion-color-medium);
}

.empty-access ion-icon {
  font-size: 48px;
  margin-bottom: 10px;
}

.qr-display {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.qr-section {
  text-align: center;
}

.qr-container {
  margin: 15px 0;
}

.qr-container img {
  width: 200px;
  height: 200px;
  border: 1px solid #ddd;
  padding: 5px;
  background: white;
}

.finish-btn {
  margin-top: 20px;
}

@media (max-width: 768px) {
  .qr-display {
    grid-template-columns: 1fr;
  }
}
</style>