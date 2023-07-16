export const modalStore = {

    state: () => ({
        modal: "",
    }),

    getters: {
        getModal: (state) => state.modal,
    },

    mutations: {
        showModalTrue(state) {
            state.modal = true;
        },
        setNotShowModalWindow(state) {
            state.modal = false;
        }
    },
    namespaced: true,
}