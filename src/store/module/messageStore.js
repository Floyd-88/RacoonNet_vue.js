// import axios from "axios"

import axios from "axios";

export const messageStore = {

    state: () => ({
        modalWriteMessage: false,
        messageUser: "", //текст сообщения
        arrayMessages: []

    }),
    getters: {
        getModalWriteMessage: (state) => state.modalWriteMessage,
        getMessageUser: (state) => state.messageUser,
        getArrayMessages: (state) => state.arrayMessages

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
        //сохранение сообщений в базе данных
        async WRITE_MESSAGE_USER({ state, commit }, userID) {
            let message = {
                destinationID: userID,
                textMessage: state.messageUser,
            }
            try {
                commit("setMessageUser", "")
                commit("setModalWriteMessage", false)
                await axios.post("http://localhost:8000/user_message", message)
                    .then(function(res) {
                        console.log(res.data)
                            // state.arrayMessages.push(resp.data)
                            // console.log(state.arrayMessages)

                    })
            } catch (err) {
                console.log(err)
            }
        },

        //получение всех диалогов пользователя
        async LOAD_DIALOGS() {
            // let user = {
            // destinationID: userID,
            // textMessage: state.messageUser,
            // }
            try {
                await axios.get("http://localhost:8000/user_dialogs")
                    .then(function(resp) {
                        console.log(resp.data)

                        // state.arrayMessages.push(resp.data)
                        // console.log(state.arrayMessages)
                        // commit("setMessageUser", "")
                        // commit("setModalWriteMessage", false)
                    })
            } catch (err) {
                console.log(err)
            }
        },

        //получение переписки с конкретным пользователем
        async LOAD_MESSAGES_USER({ state }, id) {
            try {
                await axios.get("http://localhost:8000/user_messages", {
                        params: { user_companion: id }
                    })
                    .then(function(resp) {
                        console.log(resp)
                    })
                state.messageUser

            } catch (err) {
                console.log(err)
            }
        },

        //удаление сообщения
        async DELETE_MESSAGES({ state }) {
            try {
                let message_params = {
                    deleteID: 125,
                    // userID: 1,
                }
                await axios.delete("http://localhost:8000/user_messages", { data: message_params })
                    .then(function(resp) {
                        console.log(resp)
                    })

                state.messageUser
            } catch (err) {
                console.log(err)
            }
        },

        //удаление диалога
        async DELETE_DIALOGS({ state }) {
            try {
                let dialogs_params = {
                    dialogsID: 32,
                }

                await axios.put("http://localhost:8000/user_messages", dialogs_params)
                    .then(function(resp) {
                        console.log(resp)
                    })
                state.messageUser
            } catch (err) {
                console.log(err)
            }
        }


    },

    namespaced: true,
}