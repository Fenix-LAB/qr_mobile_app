// store/modules/user.ts
import { Module } from 'vuex';

export interface User {
  pictureLocation: string | null;
  userName: string | null;
  isAuthenticated: boolean;
  hasSeenTutorial: boolean;
  role: string; // Nuevo campo para el rol
}

const defaultState: User = {
  pictureLocation: null,
  userName: null,
  isAuthenticated: false,
  hasSeenTutorial: false,
  role: 'user', // Valor por defecto
};

const userStore: Module<User, {}> = {
  namespaced: true, // Asegúrate de que esto esté presente
  state: defaultState,
  mutations: {
    sawTutorial(state) {
      state.hasSeenTutorial = true;
    },
    logIn(state, payload: { userName: string; role?: string }) {
      state.userName = payload.userName;
      state.isAuthenticated = true;
      state.role = payload.role || 'user'; // Asignar el rol si está presente
    },
    logOut(state) {
      Object.assign(state, defaultState);
    },
    updateUserPicture(state, pictureLocation: string) {
      state.pictureLocation = pictureLocation;
    },
    setHasSeenTutorial(state, value: boolean) {
      state.hasSeenTutorial = value;
    },
    setRole(state, role: string) {
      state.role = role; // Mutación para actualizar el rol
    },
  },
  actions: {
    sawTutorial({ commit }) {
      commit('sawTutorial');
    },
    logIn({ commit }, payload: { userName: string; role?: string }) {
      setTimeout(() => {
        commit('logIn', payload);
      }, 50);
    },
    logOut({ commit }) {
      setTimeout(() => {
        commit('logOut');
      }, 50);
    },
    updateUserPicture({ commit }, pictureLocation: string) {
      setTimeout(() => {
        commit('updateUserPicture', pictureLocation);
      }, 50);
    },
    setHasSeenTutorial({ commit }, value: boolean) {
      commit('setHasSeenTutorial', value);
    },
    updateRole({ commit }, role: string) {
      commit('setRole', role); // Acción para actualizar el rol
    },
  },
};

export default userStore; // Exporta el módulo correctamente