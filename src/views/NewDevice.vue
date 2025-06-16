<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/admin/devices" color="light"></ion-back-button>
        </ion-buttons>
        <ion-title>Registrar Dispositivo IoT</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="registerDevice" :disabled="!serialNumber.trim()" strong>
            <ion-icon slot="start" :icon="saveOutline"></ion-icon>
            Registrar
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding" color="light">
      <div class="form-container">
        <!-- Header ilustrativo -->
        <div class="form-header">
          <ion-icon :icon="hardwareChipOutline" color="primary" class="header-icon"></ion-icon>
          <h2>Nuevo Dispositivo IoT</h2>
          <p>Registra un nuevo dispositivo para controlar accesos</p>
        </div>

        <!-- Formulario -->
        <ion-card class="form-card">
          <ion-card-content>
            <!-- Número de serie -->
            <ion-item fill="outline" class="form-item">
              <ion-icon slot="start" :icon="barcodeOutline" color="medium"></ion-icon>
              <ion-label position="floating">Número de serie *</ion-label>
              <ion-input
                v-model="serialNumber"
                placeholder=""
                required
                clear-input
                @ionInput="validateSerial"
              ></ion-input>
            </ion-item>

            <!-- Información adicional -->
            <div class="info-section">
              <ion-text color="medium">
                <p>El número de serie se encuentra en la parte posterior del dispositivo</p>
              </ion-text>
              <ion-img src="/assets/img/qr/rasp_serial_number.png" alt="Ubicación número de serie" class="serial-image"></ion-img>
            </div>

            <!-- Previsualización del nombre -->
            <div v-if="assignedName" class="preview-section">
              <ion-item lines="none">
                <ion-icon slot="start" :icon="informationCircleOutline" color="success"></ion-icon>
                <ion-label>
                  <h3>Nombre asignado:</h3>
                  <ion-chip color="success" outline>
                    <ion-icon :icon="checkmarkCircleOutline"></ion-icon>
                    <ion-label>{{ assignedName }}</ion-label>
                  </ion-chip>
                </ion-label>
              </ion-item>
              <ion-text color="medium">
                <small>Este nombre se asignará automáticamente al dispositivo</small>
              </ion-text>
            </div>
          </ion-card-content>
        </ion-card>

        <!-- Tips de seguridad -->
        <div class="security-tips">
          <ion-card color="warning">
            <ion-card-header>
              <ion-card-title>
                <ion-icon :icon="warningOutline"></ion-icon>
                Recomendaciones de seguridad
              </ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <ion-list lines="none">
                <ion-item>
                  <ion-icon slot="start" :icon="lockClosedOutline" color="warning"></ion-icon>
                  <ion-label class="ion-text-wrap">
                    Mantén el número de serie en un lugar seguro
                  </ion-label>
                </ion-item>
                <ion-item>
                  <ion-icon slot="start" :icon="shieldCheckmarkOutline" color="warning"></ion-icon>
                  <ion-label class="ion-text-wrap">
                    Verifica que el dispositivo sea original antes de registrarlo
                  </ion-label>
                </ion-item>
              </ion-list>
            </ion-card-content>
          </ion-card>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { toastController } from '@ionic/vue';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButton, IonIcon, IonButtons, IonBackButton,
  IonItem, IonLabel, IonInput, IonCard, IonCardContent,
  IonCardHeader, IonCardTitle, IonText, IonChip,
  IonList, IonImg
} from '@ionic/vue';
import {
  saveOutline, hardwareChipOutline, barcodeOutline,
  informationCircleOutline, checkmarkCircleOutline,
  warningOutline, lockClosedOutline, shieldCheckmarkOutline
} from 'ionicons/icons';
import  { obtenerDispositivosIoT, crearDispositivoIoT } from '@/services/newDeviceService'; // Asegúrate de tener estas funciones en tu API

const router = useRouter();
const serialNumber = ref('');
const assignedName = ref('');

const validateSerial = () => {
  // Limpiar el nombre asignado si cambian el serial
  assignedName.value = '';
};

const getLastDeviceName = async () => {
  try {
    // Simulación de llamada a API para obtener el último dispositivo registrado
    // const lastDevice = await obtenerDispositivosIoT();
    const response = await obtenerDispositivosIoT();
    if (response && response.length > 0) {
      // Aquí deberías extraer el nombre del último dispositivo
      // Por ejemplo, si el último dispositivo tiene un campo 'name'
      console.log('Último dispositivo:', response[0].device_name);
      return response[0].device_name; // Ajusta según tu estructura de datos
    }
    // En una implementación real, deberías obtener el último ID y generar un nombre basado en eso
    // Aquí simplemente retornamos un valor simulado
    // return 'IoT-0001'; // Simulación de nombre
  } catch (error) {
    console.error('Error al obtener el último dispositivo:', error);
    return '';
  }
};

const generateDeviceName = async () => {
  // Esta función crea el nombre del dispositivo basado en los nombres de serie y un ID incremental
  // Reglas de nombre: RED-IOT-RASP-XXXX (X es un número)
  if (!serialNumber.value) return '';
  
  // Ejemplo: IoT-{últimos 4 dígitos del serial}-{incremental}
  const lastDeviceName = await getLastDeviceName();
  const incrementalId = lastDeviceName ? parseInt(lastDeviceName.split('-').pop() || '0') + 1 : 1; //Property 'split' does not exist on type 'Promise<any>'
  // const serialPart = serialNumber.value.slice(-4); // Últimos 4 dígitos del número de serie
  return `RED-IOT-RASP-${incrementalId.toString().padStart(4, '0')}`;
};

const registerDevice = async () => {
  try {
    // Simulación de llamada a API
    // const response = await api.registerIoTDevice(serialNumber.value);
    
    // Crear novo dispositivo IoT
    assignedName.value = await generateDeviceName();

    // Llamar a la función para crear el dispositivo IoT
    console.log('Registrando dispositivo con nombre:', assignedName.value, 'y número de serie:', serialNumber.value);
    const response = await crearDispositivoIoT(assignedName.value, 'Raspberry Pi', serialNumber.value);

    if (response.errors) {
      console.error('Error al crear dispositivo:', response.errors);
      const toast = await toastController.create({
        message: 'Error al registrar dispositivo',
        duration: 3000,
        color: 'danger',
        position: 'top'
      });
      await toast.present();
      return;
    }

    // Mostrar feedback al usuario
    const toast = await toastController.create({
      message: 'Dispositivo registrado exitosamente',
      duration: 2000,
      color: 'success',
      position: 'top'
    });
    await toast.present();
    
    // Redirigir después de 2 segundos
    setTimeout(() => {
      router.push('/admin/devices');
    }, 2000);
    
  } catch (error) {
    const toast = await toastController.create({
      message: 'Error al registrar dispositivo',
      duration: 3000,
      color: 'danger',
      position: 'top'
    });
    await toast.present();
  }
};
</script>

<style scoped>
.form-container {
  max-width: 800px;
  margin: 0 auto;
}

.form-header {
  text-align: center;
  margin-bottom: 24px;
}

.header-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.form-header h2 {
  font-weight: 600;
  color: var(--ion-color-primary);
  margin-bottom: 8px;
}

.form-header p {
  color: var(--ion-color-medium);
}

.form-card {
  border-radius: 12px;
  margin-bottom: 24px;
}

.form-item {
  margin-bottom: 20px;
  border-radius: 12px;
  --background: white;
}

.info-section {
  margin: 24px 0;
  text-align: center;
}

.serial-image {
  max-width: 300px;
  margin: 16px auto 0;
  border: 1px solid var(--ion-color-medium-shade);
  border-radius: 8px;
}

.preview-section {
  background: rgba(var(--ion-color-success-rgb), 0.1);
  border-radius: 12px;
  padding: 16px;
  margin-top: 24px;
  text-align: center;
}

.security-tips {
  margin-top: 32px;
}

.security-tips ion-card {
  border-radius: 12px;
}

.security-tips ion-icon {
  margin-right: 8px;
}

@media (max-width: 768px) {
  .header-icon {
    font-size: 48px;
  }
  
  .serial-image {
    max-width: 100%;
  }
}
</style>