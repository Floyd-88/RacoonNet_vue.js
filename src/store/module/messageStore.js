// import axios from "axios"

import axios from "axios";

export const messageStore = {

    state: () => ({
        modalWriteMessage: false,
        messageUser: "",

    }),
    getters: {
        getModalWriteMessage: (state) => state.modalWriteMessage,
        getMessageUser: (state) => state.messageUser

    },

    mutations: {
        //открытие-закрытия модального окна с сообщением
        setModalWriteMessage(state, bool) {
            state.modalWriteMessage = bool;
            document.body.style.overflow = "hidden"

            if (bool === false) {
                document.body.style.overflow = "auto"
            }
        },

        setMessageUser(state, value) {
            state.messageUser = value;
        }

    },

    actions: {
        async WRITE_MESSAGE_USER({ state, commit }, userID) {
            let message = {
                id: userID,
                textMessage: state.messageUser,
            }
            try {
                await axios.post("http://localhost:8000/user_message", message)
                    .then(function(resp) {
                        console.log(resp.data)

                        commit("setMessageUser", "")
                        commit("setModalWriteMessage", false)
                    })
            } catch (err) {
                console.log(err)
            }
        },


    },

    namespaced: true,
}