<template>
  <ion-page>
    <ion-content class="ion-padding">
      <div class="login-logo">
        <img src="./../../public/assets/img/shield.png" alt="Ionic logo" />
      </div>

      <form novalidate @submit.prevent="onLogin">
        <ion-list>
          <ion-item>
            <ion-input
              label="Username"
              labelPlacement="stacked"
              v-model="username"
              name="username"
              type="text"
              :spellcheck="false"
              autocapitalize="off"
              required
            ></ion-input>
          </ion-item>

          <ion-item>
            <ion-input
              labelPlacement="stacked"
              label="Password"
              v-model="password"
              name="password"
              type="password"
              required
            ></ion-input>
          </ion-item>
        </ion-list>

        <ion-row responsive-sm class="ion-padding">
          <ion-col>
            <ion-button :disabled="!canSubmit" type="submit" expand="block"
              >Login</ion-button
            >
          </ion-col>
          <ion-col>
            <ion-button
              :disabled="!canSubmit"
              @click="onSignup"
              color="light"
              expand="block"
              >Signup</ion-button
            >
          </ion-col>
        </ion-row>
      </form>
      <ion-toast
        :is-open="showToast"
        :message="toastMessage"
        :duration="2000"
      ></ion-toast>
    </ion-content>
  </ion-page>
</template>

<style scoped>
.login-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 500vh;
}

.login-logo {
  padding: 20px 0;
  min-height: 200px;
  text-align: center;
}

.login-logo img {
  max-width: 150px;
}

.list {
  margin-bottom: 0;
}
</style>

<script setup lang="ts">
import { computed, ref } from "vue";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonButton,
  IonContent,
  IonList,
  IonItem,
  IonTitle,
  IonRow,
  IonCol,
  IonInput,
  IonToast,
  menuController,
} from "@ionic/vue";
import { useStore } from 'vuex'; // Importa el store de Vuex
import router from '@/router';

const username = ref("");
const password = ref("");
const submitted = ref(false);

const showToast = ref(false);
const toastMessage = ref("");

const canSubmit = computed(
  () => username.value.trim() !== "" && password.value.trim() !== ""
);

const store = useStore(); // Obtén el store

const navigateToQr = async () => {
  menuController.enable(true);
  await router.push({ name: 'schedule' });
};

const onLogin = () => {
  submitted.value = true;

  if (username.value === "admin" && password.value === "admin") {
    // Credenciales de administrador
    store.dispatch('user/logIn', { userName: username.value, role: 'admin' }); // Asignar rol de admin
    navigateToQr();
  } else if (username.value === "user" && password.value === "user") {
    // Credenciales de usuario normal
    store.dispatch('user/logIn', { userName: username.value, role: 'user' }); // Asignar rol de user
    navigateToQr();
  } else if (username.value === "sadmin" && password.value === "sadmin") {
    // Credenciales de superadministrador
    store.dispatch('user/logIn', { userName: username.value, role: 'superadmin' }); // Asignar rol de superadmin
    navigateToQr();
  } else {
    // Credenciales incorrectas
    toastMessage.value = "Invalid username or password.";
    showToast.value = true;
  }
};

const onSignup = () => {
  toastMessage.value = "Successfully logged in!";
  showToast.value = true;

  username.value = "";
  password.value = "";
};
</script>