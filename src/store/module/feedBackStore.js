import axios from "axios";

export const feedBackStore = {

    state: () => ({
        isModalFeedBack: false,
        messageFeedBack: {
            selectedCause: "",
            title: "",
            description: "",
        },
    }),

    getters: {
        getisModalFeedBack: (state) => state.isModalFeedBack,
        getMessageFeedBack: (state) => state.messageFeedBack,

    },

    mutations: {
        setIsModalFeedBack(state, bool) {
            state.isModalFeedBack = bool;
        },

        setMessageFeedBackSelectedCause(state, value) {
            state.messageFeedBack.selectedCause = value
        },
        setMessageFeedBackTitle(state, value) {
            state.messageFeedBack.title = value
        },
        setMessageFeedBackDescription(state, value) {
            state.messageFeedBack.description = value
        }

    },

    actions: {
        async SEND_MESSAGE_PROBLEM_USER({
            getters,
            commit
        }) {

            await axios.post('http://localhost:8000/problem_user', {
                    cause: getters.getMessageFeedBack.selectedCause,
                    title: getters.getMessageFeedBack.title,
                    description: getters.getMessageFeedBack.description,
                })
                .then(function() {
                    commit("setIsModalFeedBack", false);
                    commit("setMessageFeedBackSelectedCause", "");
                    commit("setMessageFeedBackTitle", "");
                    commit("setMessageFeedBackDescription", "");
                })
                .catch(function(error) {
                    console.log(error)
                    commit("setIsModalFeedBack", false);
                    commit("setMessageFeedBackSelectedCause", "");
                    commit("setMessageFeedBackTitle", "");
                    commit("setMessageFeedBackDescription", "");
                })
        }

    },

    namespaced: true,
}