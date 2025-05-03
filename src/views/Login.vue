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

          <!-- NO password for now-->
          <!-- <ion-item>
            <ion-input
              labelPlacement="stacked"
              label="Password"
              v-model="password"
              name="password"
              type="password"
              required
            ></ion-input>
          </ion-item> -->
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
import { loginRequest } from "@/services/loginService";

const username = ref("");
const password = ref("");
const submitted = ref(false);

const showToast = ref(false);
const toastMessage = ref("");

// const canSubmit = computed(
//   () => username.value.trim() !== "" && password.value.trim() !== ""
// );

const canSubmit = computed(
  () => username.value.trim() !== ""
);

const store = useStore(); // Obtén el store

const navigateToQr = async () => {
  menuController.enable(true);
  await router.push({ name: 'schedule' });
};

async function login() {
  try {
    const response = await loginRequest(username.value)
    if (response) {
      const userData = { userName: username.value, role: response[0].role, userId: response[0].id };
      console.log("User data:", userData); // Verifica los datos del usuario
      store.dispatch('user/logIn', userData);
      localStorage.setItem('userRole', userData.role);
      localStorage.setItem('userId', userData.userId);
      navigateToQr();
    } else {
      toastMessage.value = "Invalid username or password.";
      showToast.value = true;
    }
  } catch (error) {
    console.error("Login error:", error);
    toastMessage.value = "An error occurred during login.";
    showToast.value = true;
  }
}
    

const onLogin = () => {
  submitted.value = true;

  if (canSubmit.value) {
    login();
  } else {
    toastMessage.value = "Please fill in all fields.";
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