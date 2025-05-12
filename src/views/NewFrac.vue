<template>
    <ion-page>
      <ion-header>
        <ion-toolbar color="primary">
          <ion-buttons slot="start">
            <ion-back-button default-href="/admin/fraccionamientos" color="light"></ion-back-button>
          </ion-buttons>
          <ion-title>Nuevo Fraccionamiento</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="submitForm" :disabled="!isFormValid" strong>
              <ion-icon slot="start" :icon="checkmarkOutline"></ion-icon>
              Guardar
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
  
      <ion-content class="ion-padding" color="light">
        <div class="form-container">
          <!-- Header ilustrativo -->
          <div class="form-header">
            <ion-icon :icon="homeOutline" color="primary"></ion-icon>
            <h2>Crear nuevo fraccionamiento</h2>
            <p>Completa la información básica para registrar un nuevo fraccionamiento en el sistema</p>
          </div>
  
          <!-- Formulario -->
          <ion-list lines="none" class="form-list">
            <!-- Nombre -->
            <ion-item fill="outline" class="form-item">
              <ion-icon slot="start" :icon="businessOutline" color="medium"></ion-icon>
              <ion-label position="floating">Nombre del fraccionamiento</ion-label>
              <ion-input
                v-model="form.nombre"
                placeholder="Ej. Villas del Bosque"
                required
                clear-input
              ></ion-input>
            </ion-item>
  
            <!-- Ubicación -->
            <ion-item fill="outline" class="form-item">
              <ion-icon slot="start" :icon="locationOutline" color="medium"></ion-icon>
              <ion-label position="floating">Ubicación</ion-label>
              <ion-input
                v-model="form.ubicacion"
                placeholder="Ej. Av. Principal #123, Col. Centro"
                required
                clear-input
              ></ion-input>
            </ion-item>
  
            <!-- Descripción -->
            <ion-item fill="outline" class="form-item">
              <ion-icon slot="start" :icon="documentTextOutline" color="medium"></ion-icon>
              <ion-label position="floating">Descripción</ion-label>
              <ion-textarea
                v-model="form.descripcion"
                placeholder="Describe las características principales del fraccionamiento"
                rows="4"
                required
              ></ion-textarea>
            </ion-item>
          </ion-list>
  
          <!-- Tips adicionales -->
          <div class="form-tips">
            <ion-chip color="medium" outline>
              <ion-icon :icon="informationCircleOutline"></ion-icon>
              <ion-label>Revisa que los datos sean correctos</ion-label>
            </ion-chip>
            
            <ion-chip color="medium" outline>
              <ion-icon :icon="informationCircleOutline"></ion-icon>
              <ion-label>Podrás agregar accesos después</ion-label>
            </ion-chip>
          </div>
        </div>
      </ion-content>
    </ion-page>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue';
  import {
    IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
    IonButton, IonIcon, IonButtons, IonBackButton,
    IonItem, IonLabel, IonInput, IonTextarea, IonList,
    IonChip
  } from '@ionic/vue';
  import {
    checkmarkOutline, homeOutline, businessOutline,
    locationOutline, documentTextOutline,
    informationCircleOutline
  } from 'ionicons/icons';
  
  const form = ref({
    nombre: '',
    ubicacion: '',
    descripcion: ''
  });
  
  const isFormValid = computed(() => {
    return form.value.nombre && form.value.ubicacion && form.value.descripcion;
  });
  
  const submitForm = async () => {
    try {
      console.log('Formulario enviado:', form.value);
      // Aquí iría la llamada a tu API:
      // const response = await crearFraccionamiento(form.value);
      // console.log('Fraccionamiento creado:', response);
      
      // Redirigir después de crear
      // router.push('/admin/fraccionamientos');
    } catch (error) {
      console.error('Error al crear fraccionamiento:', error);
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
    margin-bottom: 32px;
  }
  
  .form-header ion-icon {
    font-size: 48px;
    margin-bottom: 16px;
  }
  
  .form-header h2 {
    font-weight: 600;
    color: var(--ion-color-primary);
  }
  
  .form-header p {
    color: var(--ion-color-medium);
    margin-top: 8px;
  }
  
  .form-list {
    background: transparent;
  }
  
  .form-item {
    margin-bottom: 16px;
    border-radius: 12px;
    --background: white;
  }
  
  .form-tips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: center;
    margin-top: 24px;
  }
  
  @media (max-width: 768px) {
    .form-tips {
      flex-direction: column;
    }
  }
  </style>