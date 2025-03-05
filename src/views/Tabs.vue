<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>

      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="schedule" href="/tabs/schedule">
          <ion-icon :icon="qrCodeOutline" />
          <ion-label>QR</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="speakers" href="/tabs/speakers">
          <ion-icon :icon="receiptOutline" />
          <ion-label>Historial</ion-label>
        </ion-tab-button>

        <!-- <ion-tab-button tab="map" href="/tabs/map">
          <ion-icon :icon="location" />
          <ion-label>Map</ion-label>
        </ion-tab-button> -->

        <ion-tab-button tab="about" href="/tabs/about">
          <ion-icon :icon="informationCircle" />
          <ion-label>Mi Fraccionamiento</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="map" href="/tabs/map" v-if="isAdmin">
          <ion-icon :icon="optionsOutline" />
          <ion-label>Admin</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="superadmin" href="/tabs/superadmin" v-if="isSuperAdmin">
          <ion-icon :icon="idCardOutline" />
          <ion-label>Super Admin</ion-label>
        </ion-tab-button>

      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script lang="ts">
import {
  IonPage,
  IonTabs,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonLabel,
  IonIcon
} from '@ionic/vue';

import {
  calendar,
  people,
  location,
  informationCircle,
  qrCodeOutline,
  receiptOutline, 
  // person-circle-outline
  personCircleOutline,
  // id-card-outline
  idCardOutline,
  // options-outline
  optionsOutline,

} from 'ionicons/icons';
import { computed } from 'vue';
import { useStore } from 'vuex'; // Importa el store de Vuex

export default {
  components: {
    IonPage,
    IonTabs,
    IonRouterOutlet,
    IonTabBar,
    IonTabButton,
    IonLabel,
  },
  setup() {
    const store = useStore();

    // Computed property para verificar si el usuario es administrador
    const isAdmin = computed(() => store.state.user.role === 'admin');
    const isSuperAdmin = computed(() => store.state.user.role === 'superadmin');
    console.log('isAdmin', isAdmin.value);
    console.log('isSuperAdmin', isSuperAdmin.value);

    return {
      qrCodeOutline,
      receiptOutline,
      informationCircle,
      personCircleOutline,
      idCardOutline,
      optionsOutline,
      isAdmin, // Expone la propiedad computada al template
    };
  }
}
</script>