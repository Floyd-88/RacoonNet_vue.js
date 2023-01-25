export const modalStore = {

    state: () => ({
        modal: "",
    }),

    getters: {
        getModal: (state) => state.modal,
        getUser: (state, getters, rootState, rootGetters) => {
            return rootGetters["authorizationStore/getUser"]
        }
    },

    mutations: {
        showModalTrue(state) {
            state.modal = true;
        },
        setNotShowModalWindow(state) {
            state.modal = false;
        }
    },

    actions: {
        async closeModule({ commit, getters }) {
            commit("setNotShowModalWindow");
            commit('editProfileStore/setEditingUser', getters.getUser, { root: true });
        }
    },

    namespaced: true,
}