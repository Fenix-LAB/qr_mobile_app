<template>
  <ion-page>
    <!-- <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Login</ion-title>
      </ion-toolbar>
    </ion-header> -->

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
/* Centrar el contenido */
.login-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 500vh; /* Ocupa toda la altura de la pantalla */
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

import router from '@/router';

const username = ref("");
const password = ref("");
const submitted = ref(false);

const usernameValid = true;
const passwordValid = true;

const showToast = ref(false);
const toastMessage = ref("");

const canSubmit = computed(
  () => username.value.trim() !== "" && password.value.trim() !== ""
);

const navigateToSchedule = async () => {
  menuController.enable(true);
  // await storage.set('ion_did_tutorial', true);
  await router.push({ name: 'schedule' });
};

const onLogin = () => {
  submitted.value = true;
  // if (usernameValid && passwordValid) {
  // }
  if (username.value === "admin" && password.value === "admin") {
    // Redirigir a /schedule si las credenciales son correctas
    navigateToSchedule();
  } else {
    // Mostrar un mensaje de error si las credenciales son incorrectas
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
