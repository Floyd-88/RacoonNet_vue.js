export const feedBackStore = {

    state: () => ({
        isModalFeedBack: false,
    }),

    getters: {
        getisModalFeedBack: (state) => state.isModalFeedBack,

    },

    mutations: {
        setIsModalFeedBack(state, bool) {
            state.isModalFeedBack = bool;
        }

    },

    actions: {


    },

    namespaced: true,
}