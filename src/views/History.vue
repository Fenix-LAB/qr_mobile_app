<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Historial</ion-title>
      </ion-toolbar>
      <ion-toolbar>
        <ion-text color="medium" class="header-text">
          Solo se mostrarán los últimos 10 eventos
        </ion-text>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <!-- Lista de eventos -->
      <ion-list v-if="events.length > 0">
        <ion-item v-for="(event, index) in events" :key="index">
          <ion-label>
            <h2>{{ event.frac_name }}</h2>
            <p>{{ event.type === 'entry' ? 'Entrada' : 'Salida' }} - {{ event.datetime.split('T')[0] }} a las {{ event.datetime.split('T')[1].split('.')[0] }}</p>
          </ion-label>
        </ion-item>
      </ion-list>

      <!-- Mensaje cuando no hay eventos -->
      <div v-else class="empty-state">
        <ion-text color="medium">
          <p>No hay información disponible</p>
        </ion-text>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonTitle,
  IonText,
} from "@ionic/vue";
import { useStore } from 'vuex';
import { ref, onMounted, onActivated, computed, watch } from "vue";
import { obtenerHistorialesUsuario } from "@/services/historyService";

const events = ref<{ frac_name: string; type: string; datetime: string }[]>([]);
const store = useStore();


const fetchEvents = async () => {
  // const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  // const userId = userData.userId; // Ahora accedes desde el objeto
  const userId = computed(() => store.state.user.id);
  try {
    console.log("Fetching events for user ID:", userId.value);
    const response = await obtenerHistorialesUsuario(userId.value);
    events.value = response.map((assoc: any) => ({
      frac_name: assoc.frac.name,
      type: assoc.type,
      datetime: assoc.datetime,
    }));
    // Ordenar eventos por fecha y hora (mas reciente primero)
    events.value.sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime());
    if (events.value.length === 0) {
      console.log("No events found.");
    } else {
      console.log("Sorted events:", events.value);
    }
  } catch (error) {
    console.error("Error fetching events:", error);
  }
};

onMounted(() => {
  // recuperar el id del localStorage al cargar la página y seterlo en vuex
  const userId = localStorage.getItem('userId');
  console.log("User ID from localStorage:", userId);
  if (userId) {
    store.commit('user/setId', userId); // Actualizar el estado de Vuex
    console.log("User ID set in Vuex:", store.state.user.id);
  }
  fetchEvents();
});

onActivated(() => {
  fetchEvents();
});

watch(
  () => store.state.user.id,
  (id) => {
    if (id && id > 0) {
      fetchEvents();
    }
  },
  { immediate: true }
);
</script>

<style scoped>
/* Estilos para la lista de eventos */
ion-item {
  --padding-start: 16px;
  --padding-end: 16px;
  --padding-top: 8px;
  --padding-bottom: 8px;
}

h2 {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 4px;
}

p {
  font-size: 0.9rem;
  color: #666;
}

/* Estilos para el mensaje de estado vacío */
.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  text-align: center;
}

.empty-state ion-text {
  font-size: 1.2rem;
  color: #666;
}
</style>