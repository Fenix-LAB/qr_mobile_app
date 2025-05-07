<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-back-button default-href="/admin"></ion-back-button>
          </ion-buttons>
          <ion-title>Nuevo Fraccionamiento</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="confirmCreation" :disabled="!isFormValid">
              Confirmar
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
  
      <ion-content class="ion-padding">
        <!-- Información básica del fraccionamiento -->
        <ion-card>
          <ion-card-header>
            <ion-card-title>Información Básica</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-item>
              <ion-label position="stacked">Nombre *</ion-label>
              <ion-input v-model="fraccionamiento.nombre" required></ion-input>
            </ion-item>
  
            <ion-item>
              <ion-label position="stacked">Descripción *</ion-label>
              <ion-textarea v-model="fraccionamiento.descripcion" required></ion-textarea>
            </ion-item>
  
            <ion-item>
              <ion-label position="stacked">Ubicación *</ion-label>
              <ion-input v-model="fraccionamiento.ubicacion" required></ion-input>
            </ion-item>
          </ion-card-content>
        </ion-card>
  
        <!-- Dispositivos IoT disponibles -->
        <ion-card>
          <ion-card-header>
            <ion-card-title>Dispositivos IoT</ion-card-title>
            <ion-button size="small" @click="showNewDeviceModal = true">
              <ion-icon slot="start" :icon="addOutline"></ion-icon>
              Nuevo Dispositivo
            </ion-button>
          </ion-card-header>
          <ion-card-content>
            <ion-list v-if="dispositivos.length > 0">
              <ion-item v-for="dispositivo in dispositivos" :key="dispositivo.id">
                <ion-label>
                  <h3>{{ dispositivo.nombre }}</h3>
                  <p>{{ dispositivo.numero_serial }}</p>
                </ion-label>
                <ion-checkbox 
                  :checked="isDeviceSelected(dispositivo.id)"
                  @ionChange="toggleDeviceSelection(dispositivo.id)"
                ></ion-checkbox>
              </ion-item>
            </ion-list>
            <div v-else class="empty-state">
              <ion-text color="medium">No hay dispositivos registrados</ion-text>
            </div>
          </ion-card-content>
        </ion-card>
  
        <!-- Accesos configurados -->
        <ion-card>
          <ion-card-header>
            <ion-card-title>Accesos Configurados</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-list>
              <ion-item v-for="(acceso, index) in accesosConfigurados" :key="index">
                <ion-label>
                  <h3>Acceso {{ index + 1 }}</h3>
                  <p>Dispositivo: {{ getDeviceName(acceso.dispositivo_id) }}</p>
                </ion-label>
                <ion-button slot="end" color="danger" @click="removeAccess(index)">
                  <ion-icon :icon="trashOutline"></ion-icon>
                </ion-button>
              </ion-item>
            </ion-list>
  
            <ion-button 
              expand="block" 
              @click="addAccess" 
              :disabled="dispositivosSeleccionados.length === 0"
              class="add-button"
            >
              <ion-icon slot="start" :icon="addOutline"></ion-icon>
              Agregar Acceso
            </ion-button>
          </ion-card-content>
        </ion-card>
  
        <!-- Modal para nuevo dispositivo IoT -->
        <ion-modal :is-open="showNewDeviceModal" @didDismiss="showNewDeviceModal = false">
          <ion-header>
            <ion-toolbar>
              <ion-title>Nuevo Dispositivo IoT</ion-title>
              <ion-buttons slot="end">
                <ion-button @click="showNewDeviceModal = false">Cancelar</ion-button>
              </ion-buttons>
            </ion-toolbar>
          </ion-header>
          <ion-content class="ion-padding">
            <ion-item>
              <ion-label position="stacked">Nombre *</ion-label>
              <ion-input v-model="nuevoDispositivo.nombre" required></ion-input>
            </ion-item>
  
            <ion-item>
              <ion-label position="stacked">Número de Serie *</ion-label>
              <ion-input v-model="nuevoDispositivo.numero_serial" required></ion-input>
            </ion-item>
  
            <ion-button 
              expand="block" 
              <!-- @click="createDevice"  -->
              :disabled="!nuevoDispositivo.nombre || !nuevoDispositivo.numero_serial"
            >
              Guardar Dispositivo
            </ion-button>
          </ion-content>
        </ion-modal>
  
        <!-- Modal para mostrar QRs -->
        <ion-modal :is-open="showQRModal" @didDismiss="showQRModal = false">
          <ion-header>
            <ion-toolbar>
              <ion-title>QRs Generados</ion-title>
              <ion-buttons slot="end">
                <ion-button @click="showQRModal = false">Cerrar</ion-button>
              </ion-buttons>
            </ion-toolbar>
          </ion-header>
          <ion-content class="ion-padding qr-container">
            <div class="qr-section">
              <h3>QR de Entrada</h3>
              <img :src="qrEntrada" alt="QR Entrada" class="qr-image">
              <ion-button expand="block" @click="downloadQR(qrEntrada, 'entrada')">
                Descargar QR Entrada
              </ion-button>
            </div>
  
            <div class="qr-section">
              <h3>QR de Salida</h3>
              <img :src="qrSalida" alt="QR Salida" class="qr-image">
              <ion-button expand="block" @click="downloadQR(qrSalida, 'salida')">
                Descargar QR Salida
              </ion-button>
            </div>
          </ion-content>
        </ion-modal>
      </ion-content>
    </ion-page>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import {
    IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonItem, IonLabel, IonInput, IonTextarea, IonButton,
    IonList, IonCheckbox, IonIcon, IonButtons, IonBackButton,
    IonModal, IonText
  } from '@ionic/vue';
  import { addOutline, trashOutline } from 'ionicons/icons';
//   import { 
//     crearFraccionamiento,
//     crearDispositivoIoT,
//     vincularAccesos,
//     obtenerDispositivosIoT
//   } from '@/services/fraccionamientoService';
  
  // Datos del fraccionamiento
  const fraccionamiento = ref({
    nombre: '',
    descripcion: '',
    ubicacion: ''
  });
  
  // Dispositivos IoT
  const dispositivos = ref<any[]>([]);
  const dispositivosSeleccionados = ref<number[]>([]);
  
  // Accesos configurados
  const accesosConfigurados = ref<any[]>([]);
  
  // Nuevo dispositivo IoT
  const showNewDeviceModal = ref(false);
  const nuevoDispositivo = ref({
    nombre: '',
    numero_serial: ''
  });
  
  // QRs generados
  const showQRModal = ref(false);
  const qrEntrada = ref('');
  const qrSalida = ref('');
  
  // Validación del formulario
  const isFormValid = computed(() => {
    return fraccionamiento.value.nombre && 
           fraccionamiento.value.descripcion && 
           fraccionamiento.value.ubicacion &&
           accesosConfigurados.value.length > 0;
  });
  
  // Cargar dispositivos al montar el componente
  onMounted(async () => {
    // try {
    //   const response = await obtenerDispositivosIoT();
    //   dispositivos.value = response.data;
    // } catch (error) {
    //   console.error('Error cargando dispositivos:', error);
    // }
  });
  
  // Métodos para dispositivos
  const isDeviceSelected = (id: number) => {
    return dispositivosSeleccionados.value.includes(id);
  };
  
  const toggleDeviceSelection = (id: number) => {
    const index = dispositivosSeleccionados.value.indexOf(id);
    if (index > -1) {
      dispositivosSeleccionados.value.splice(index, 1);
    } else {
      dispositivosSeleccionados.value.push(id);
    }
  };
  
  const createDevice = async () => {
    console.log('Creando nuevo dispositivo:', nuevoDispositivo.value);
    // try {
    //   const response = await crearDispositivoIoT(nuevoDispositivo.value);
    //   dispositivos.value.push(response.data);
    //   nuevoDispositivo.value = { nombre: '', numero_serial: '' };
    //   showNewDeviceModal.value = false;
    // } catch (error) {
    //   console.error('Error creando dispositivo:', error);
    // }
  };
  
  // Métodos para accesos
  const addAccess = () => {
    dispositivosSeleccionados.value.forEach(dispositivoId => {
      if (!accesosConfigurados.value.some(a => a.dispositivo_id === dispositivoId)) {
        accesosConfigurados.value.push({
          dispositivo_id: dispositivoId,
          tipo: 'entrada' // Puedes hacer esto configurable si necesitas diferentes tipos
        });
      }
    });
    dispositivosSeleccionados.value = [];
  };
  
  const removeAccess = (index: number) => {
    accesosConfigurados.value.splice(index, 1);
  };
  
  const getDeviceName = (id: number) => {
    const dispositivo = dispositivos.value.find(d => d.id === id);
    return dispositivo ? dispositivo.nombre : 'Desconocido';
  };
  
  // Confirmación final
  const confirmCreation = async () => {
    console.log('Fraccionamiento:', fraccionamiento.value);
    // try {
    //   // 1. Crear el fraccionamiento
    //   const fraccResponse = await crearFraccionamiento(fraccionamiento.value);
    //   const fraccId = fraccResponse.data.id;
      
    //   // 2. Vincular los accesos
    //   const vinculacionResponse = await vincularAccesos({
    //     fraccionamiento_id: fraccId,
    //     accesos: accesosConfigurados.value
    //   });
      
    //   // 3. Mostrar QRs
    //   qrEntrada.value = vinculacionResponse.data.qr_entrada;
    //   qrSalida.value = vinculacionResponse.data.qr_salida;
    //   showQRModal.value = true;
      
    // } catch (error) {
    //   console.error('Error en el proceso de creación:', error);
    // }
  };
  
  // Descargar QRs
  const downloadQR = (qrData: string, tipo: string) => {
    const link = document.createElement('a');
    link.href = qrData;
    link.download = `qr_${tipo}_${fraccionamiento.value.nombre}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  </script>
  
  <style scoped>
  .empty-state {
    text-align: center;
    padding: 20px;
  }
  
  .add-button {
    margin-top: 16px;
  }
  
  .qr-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .qr-section {
    margin-bottom: 32px;
    width: 100%;
  }
  
  .qr-image {
    width: 200px;
    height: 200px;
    margin: 16px 0;
    border: 1px solid #ddd;
    padding: 8px;
    background: white;
  }
  </style>