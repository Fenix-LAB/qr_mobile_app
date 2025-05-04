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
          <ion-label>Info</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="map" href="/tabs/map" v-if="isAdmin || isSuperAdmin">
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
  IonIcon,
} from '@ionic/vue';
import {
  qrCodeOutline,
  receiptOutline,
  personCircleOutline,
  optionsOutline,
  informationCircle,
  idCardOutline,
} from 'ionicons/icons';
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex'; // Importa el store de Vuex

export default {
  components: {
    IonPage,
    IonTabs,
    IonRouterOutlet,
    IonTabBar,
    IonTabButton,
    IonLabel,
    IonIcon,
  },
  setup() {
    console.log("Tabs component mounted");
    const store = useStore();

    // Recuperar el rol del localStorage al cargar la página
    onMounted(() => {
      const userRole = localStorage.getItem('userRole');
      console.log("User role from localStorage:", userRole);
      if (userRole) {
        store.commit('user/setRole', userRole); // Actualizar el estado de Vuex
      }
    });

    // Computed properties para verificar el rol del usuario
    const isAdmin = computed(() => store.state.user.role === 'admin');
    const isSuperAdmin = computed(() => store.state.user.role === 'superadmin');

    return {
      qrCodeOutline,
      receiptOutline,
      personCircleOutline,
      optionsOutline,
      isAdmin,
      isSuperAdmin,
      informationCircle,
      idCardOutline,
    };
  },
};
</script>