<template>
    <ion-page>
      <ion-header>
        <ion-toolbar color="tertiary">
          <ion-buttons slot="start">
            <ion-back-button default-href="/admin/fraccionamientos" color="light"></ion-back-button>
          </ion-buttons>
          <ion-title>Nuevo Acceso</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="createAccess" :disabled="!isFormValid" strong>
              <ion-icon slot="start" :icon="qrCodeOutline"></ion-icon>
              Generar QRs
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
  
      <ion-content class="ion-padding" color="light">
        <div class="form-container">
          <!-- Header ilustrativo -->
          <div class="form-header">
            <ion-icon :icon="walkOutline" color="tertiary"></ion-icon>
            <h2>Configurar nuevo acceso</h2>
            <p>Registra un nuevo punto de acceso para el fraccionamiento</p>
          </div>
  
          <!-- Formulario principal -->
          <ion-list lines="none" class="form-list">
            <!-- Nombre del acceso -->
            <ion-item fill="outline" class="form-item">
              <ion-icon slot="start" :icon="pricetagOutline" color="medium"></ion-icon>
              <ion-label position="floating">Nombre del acceso</ion-label>
              <ion-input
                v-model="accessData.name"
                placeholder=""
                required
                clear-input
              ></ion-input>
            </ion-item>
  
            <!-- Dispositivo IoT -->
            <ion-card class="iot-card">
              <ion-card-header>
                <ion-card-title>
                  <ion-icon :icon="hardwareChipOutline" color="tertiary"></ion-icon>
                  Dispositivo IoT
                </ion-card-title>
                <ion-card-subtitle>Selecciona un dispositivo registrado</ion-card-subtitle>
              </ion-card-header>
              
              <ion-card-content>
                <!-- Selector de dispositivos -->
                <ion-item fill="outline" class="form-item">
                  <ion-icon slot="start" :icon="hardwareChipOutline" color="medium"></ion-icon>
                  <ion-label></ion-label>
                  <ion-select 
                    v-model="iotDevice.serialNumber" 
                    interface="popover"
                    placeholder="Selecciona un dispositivo"
                    required
                  >
                    <ion-select-option 
                      v-for="device in availableDevices" 
                      :key="device.id" 
                      :value="device.serialNumber"
                    >
                      {{ device.name }} ({{ device.serialNumber }})
                    </ion-select-option>
                  </ion-select>
                </ion-item>

                <div class="device-preview" v-if="iotDevice.serialNumber">
                  <ion-chip color="success">
                    <ion-icon :icon="checkmarkCircleOutline"></ion-icon>
                    <ion-label>{{ getSelectedDeviceName() }}</ion-label>
                  </ion-chip>
                  <ion-text color="medium">
                    <small>Dispositivo seleccionado</small>
                  </ion-text>
                </div>
              </ion-card-content>
            </ion-card>
          </ion-list>
  
          <!-- Sección de ayuda -->
          <div class="help-section">
            <ion-accordion-group>
              <ion-accordion value="help">
                <ion-item slot="header" color="tertiary">
                  <ion-icon :icon="informationCircleOutline" slot="start"></ion-icon>
                  <ion-label>¿Cómo generar los QRs?</ion-label>
                </ion-item>
                <div class="accordion-content" slot="content">
                  <p>Para generar los QRs de acceso, completa el formulario con el nombre del acceso y selecciona un dispositivo IoT registrado.</p>
                  <p>Una vez que presiones "Generar QRs", se crearán dos códigos QR: uno para entrada y otro para salida.</p>
                  <ol>
                    <li>El QR de entrada permite registrar la llegada al fraccionamiento.</li>
                    <li>El QR de salida permite registrar la salida del fraccionamiento.</li>
                  </ol>
                  <ion-img src="/assets/img/qr/acceso.png" alt="Ejemplo de QRs generados"></ion-img>
                </div>
              </ion-accordion>
            </ion-accordion-group>
          </div>
        </div>

  
        <!-- Modal para mostrar QRs generados -->
        <ion-modal 
          :is-open="showQRModal" 
          @didDismiss="showQRModal = false"
          class="qr-modal"
        >
          <ion-header>
            <ion-toolbar color="tertiary">
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
                  <img :src="generatedQrs.entry" alt="QR Entrada" v-if="generatedQrs.entry">
                  <ion-skeleton-text v-else animated style="width: 200px; height: 200px"></ion-skeleton-text>
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
                  <img :src="generatedQrs.exit" alt="QR Salida" v-if="generatedQrs.exit">
                  <ion-skeleton-text v-else animated style="width: 200px; height: 200px"></ion-skeleton-text>
                </div>
                <ion-button expand="block" @click="downloadQr(generatedQrs.exit, 'salida')" color="danger">
                  <ion-icon slot="start" :icon="downloadOutline"></ion-icon>
                  Descargar salida
                </ion-button>
              </div>
            </div>
  
            <ion-button expand="block" @click="finishProcess" class="finish-btn">
              <ion-icon slot="start" :icon="checkmarkDoneOutline"></ion-icon>
              Finalizar proceso
            </ion-button>
          </ion-content>
        </ion-modal>
      </ion-content>
    </ion-page>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import {
    IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
    IonButton, IonIcon, IonButtons, IonBackButton,
    IonItem, IonLabel, IonInput, IonList, IonCard,
    IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
    IonChip, IonText, IonModal, IonAccordion, IonAccordionGroup,
    IonSkeletonText, IonImg, IonSelect, IonSelectOption, toastController
  } from '@ionic/vue';
  import {
    qrCodeOutline, walkOutline, pricetagOutline,
    hardwareChipOutline, checkmarkCircleOutline,
    downloadOutline, enterOutline, exitOutline,
    checkmarkDoneOutline, informationCircleOutline
  } from 'ionicons/icons';

import { obtenerDispositivosDisponibles, crearAcceso, obtenerNombreFraccionamiento } from '@/services/newAccessService'; // Asegúrate de tener estos servicios implementados

  const router = useRouter();
  const route = useRoute();
  const fracId = route.params.fraccId;
  console.log('Fraccionamiento ID:', fracId);
  // Datos del formulario
  const accessData = ref({
    name: '',
  });
  
  const iotDevice = ref({
    serialNumber: '',
  });
  
  const availableDevices = ref<{
    id: string,
    name: string,
    serialNumber: string
  }[]>([]);
  
  const generatedQrs = ref({
    entry: '',
    exit: ''
  });
  
  const showQRModal = ref(false);

  // Lista de dispositivos disponibles
  const fetchAvailableDevices = async () => {
    try {
      const response = await obtenerDispositivosDisponibles();
      availableDevices.value = response.map((device: any) => ({
        id: device.id,
        name: device.device_name,
        serialNumber: device.serial_number
      }));
      console.log('Dispositivos disponibles:', availableDevices.value);
    } catch (error) {
      const toast = await toastController.create({
        message: 'Error al cargar dispositivos IoT',
        duration: 2000,
        color: 'danger'
      });
      await toast.present();
    }
  };

  // Crear string de QR para el dispositivo seleccionado
  const createQrString = async (access_name: string, device_name: string, frac_id: number, is_entry: boolean) => {

    // Obtenemos el nombre del fraccionamiento
    const frac_name = await obtenerNombreFraccionamiento(frac_id);
    console.log('Nombre del fraccionamiento:', frac_name);

    return `${frac_name.name}-${access_name}-${device_name}-${is_entry ? 'ENTRADA' : 'SALIDA'}`;
  };
  
  // Método para obtener nombre y id del dispositivo seleccionado
  const getSelectedDeviceName = () => {
    const device = availableDevices.value.find(d => d.serialNumber === iotDevice.value.serialNumber);
    return device ? { name: device.name, id: device.id } : { name: 'Desconocido', id: '' };
  };

  // Validación del formulario
  const isFormValid = computed(() => {
    // return accessData.value.name && iotDevice.value.serialNumber;
    return accessData.value.name.trim() !== '' && iotDevice.value.serialNumber.trim() !== '';
  });
  
  // Crear el acceso y generar QRs
  const createAccess = async () => {
    try {
      // Crear acceso
      // console.log('Creando acceso con datos:', {
      //   name: accessData.value.name,
      //   iot_device_id: getSelectedDeviceName().id,
      //   frac_id: fracId
      // });
      const response = await crearAcceso(
        accessData.value.name,
        getSelectedDeviceName().id,
        Number(fracId)
      );

      if (response.errors) {
        const toast = await toastController.create({
          message: 'Error al crear el acceso',
          duration: 2000,
          color: 'danger'
        });
        await toast.present();
        throw new Error('Error al crear el acceso');
      }

      // Generar QRs
      const qrStringEntry = await createQrString(
        accessData.value.name,
        getSelectedDeviceName().name,
        Number(fracId),
        true
      );
      const qrStringExit = await createQrString(
        accessData.value.name,
        getSelectedDeviceName().name,
        Number(fracId),
        false
      );
      // Datos simulados
      generatedQrs.value = {
        entry: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + qrStringEntry,
        exit: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + qrStringExit
      };
  
      showQRModal.value = true;
      
    } catch (error) {
      const toast = await toastController.create({
        message: 'Error creando el acceso',
        duration: 2000,
        color: 'danger'
      });
      await toast.present();
    }
  };

  // Cargar dispositivos disponibles al montar el componente
  onMounted(() => {
    fetchAvailableDevices();
  });
  
  // Descargar QR individual
  const downloadQr = (qrData: string, type: string) => {
    const link = document.createElement('a');
    link.href = qrData;
    link.download = `QR_${type}_${accessData.value.name.replace(/\s+/g, '_')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Descargar ambos QRs
  const downloadAllQrs = () => {
    if (generatedQrs.value.entry) downloadQr(generatedQrs.value.entry, 'entrada');
    if (generatedQrs.value.exit) downloadQr(generatedQrs.value.exit, 'salida');
  };
  
  // Finalizar proceso
  const finishProcess = () => {
    showQRModal.value = false;
    router.push('/admin/fraccionamientos');
  };
  </script>
  
  <style scoped>
  /* Tus estilos existentes se mantienen igual */
  .form-container {
    max-width: 800px;
    margin: 0 auto;
  }
  
  .form-header {
    text-align: center;
    margin-bottom: 24px;
  }
  
  .form-header ion-icon {
    font-size: 48px;
    margin-bottom: 12px;
  }
  
  .form-header h2 {
    font-weight: 600;
    color: var(--ion-color-tertiary);
  }
  
  .form-header p {
    color: var(--ion-color-medium);
    margin-top: 4px;
  }
  
  .form-list {
    background: transparent;
  }
  
  .form-item {
    margin-bottom: 16px;
    border-radius: 12px;
    --background: white;
  }
  
  .iot-card {
    margin: 20px 0;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .device-preview {
    margin-top: 16px;
    text-align: center;
  }
  
  .help-section {
    margin-top: 32px;
  }
  
  .accordion-content {
    padding: 16px;
    background: var(--ion-color-light);
  }
  
  .accordion-content ol {
    padding-left: 20px;
  }
  
  .accordion-content ion-img {
    max-width: 300px;
    margin: 16px auto 0;
    border: 1px solid var(--ion-color-medium-shade);
    border-radius: 8px;
  }
  
  .qr-modal .toolbar-title {
    text-align: center;
  }
  
  .qr-display {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 32px;
    margin-bottom: 24px;
  }
  
  .qr-section {
    text-align: center;
  }
  
  .qr-section h3 {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-bottom: 16px;
  }
  
  .qr-container {
    display: flex;
    justify-content: center;
    margin-bottom: 16px;
  }
  
  .qr-container img {
    width: 200px;
    height: 200px;
    border: 1px solid var(--ion-color-medium);
    padding: 8px;
    background: white;
  }
  
  .finish-btn {
    margin-top: 24px;
  }
  
  @media (max-width: 768px) {
    .qr-display {
      grid-template-columns: 1fr;
    }
  }
  </style>