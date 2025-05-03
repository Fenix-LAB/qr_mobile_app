<template>
  <ion-page>
    <ion-content class="ion-padding">
      <div class="login-logo">
        <img src="./../../public/assets/img/shield.png" alt="App logo" />
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
        </ion-list>

        <ion-row responsive-sm class="ion-padding">
          <ion-col>
            <ion-button :disabled="!canSubmit" type="submit" expand="block">
              Login
            </ion-button>
          </ion-col>
          <ion-col>
            <ion-button
              :disabled="!canSubmit"
              @click="onSignup"
              color="light"
              expand="block"
            >
              Signup
            </ion-button>
          </ion-col>
        </ion-row>
      </form>
      
      <ion-toast
        :is-open="showToast"
        :message="toastMessage"
        :duration="2000"
        @didDismiss="showToast = false"
      ></ion-toast>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import {
  IonPage,
  IonContent,
  IonList,
  IonItem,
  IonInput,
  IonButton,
  IonRow,
  IonCol,
  IonToast,
} from "@ionic/vue";
import { useStore } from 'vuex';
import router from '@/router';
import { loginRequest } from "@/services/loginService";
import { menuController } from '@ionic/core';

// Estado del formulario
const username = ref("");
const submitted = ref(false);
const showToast = ref(false);
const toastMessage = ref("");

// Store y utilidades
const store = useStore();

// Comprobación de formulario válido
const canSubmit = computed(() => username.value.trim() !== "");

// Navegación
const navigateToQr = async () => {
  await menuController.enable(true);
  await router.push({ name: 'schedule' });
};

// Manejo del login
const login = async () => {
  try {
    const response = await loginRequest(username.value);
    if (response && response.length > 0) {
      const userData = { 
        userName: username.value, 
        role: response[0].role, 
        userId: response[0].id 
      };

      console.log("Data saved in Vuex:", userData);
      
      // Guardar en Vuex
      store.dispatch('user/logIn', userData);
      
      // Persistir en localStorage
      localStorage.setItem('userData', JSON.stringify({
        userName: userData.userName,
        role: userData.role,
        userId: userData.userId,
        loggedIn: true,
        lastLogin: new Date().toISOString()
      }));
      
      console.log("User data saved in localStorage:", localStorage.getItem('userData'));
      navigateToQr();
    } else {
      showError("Invalid username or password.");
    }
  } catch (error) {
    console.error("Login error:", error);
    showError("An error occurred during login.");
  }
};

// Mostrar errores
const showError = (message: string) => {
  toastMessage.value = message;
  showToast.value = true;
};

// Verificar sesión existente al cargar
onMounted(() => {
  const userData = localStorage.getItem('userData');
  if (userData) {
    const parsedData = JSON.parse(userData);
    if (parsedData.loggedIn) {
      // Auto-login si hay sesión guardada
      username.value = parsedData.userName;
      navigateToQr();
    }
  }
});

// Event handlers
const onLogin = () => {
  submitted.value = true;
  if (canSubmit.value) {
    login();
  } else {
    showError("Please enter a username.");
  }
};

const onSignup = () => {
  toastMessage.value = "Signup functionality coming soon!";
  showToast.value = true;
  username.value = "";
};
</script>

<style scoped>
.login-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100vh;
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