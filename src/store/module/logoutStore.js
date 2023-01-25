import axios from "axios";

export const authorizationStore = {
    state: () => ({}),

    getters: {

    },

    mutations: {
        logout(rootGetters) {
            rootGetters.authorizationStore.status = '';
            rootGetters.authorizationStore.token = '';
        },

    },

    actions: {
        //выход из профиля
        logout({ commit }) {
            return new Promise((resolve) => {
                commit('logout');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                delete axios.defaults.headers.common['Authorization'];
                resolve();
            })
        },
    },

    namespaced: true,
}