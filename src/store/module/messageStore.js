// import axios from "axios"

import axios from "axios";

export const messageStore = {

    state: () => ({
        modalWriteMessage: false,
        messageUser: "", //текст сообщения
        arrayDialogs: [],
        arrayMessages: [],

    }),
    getters: {
        getModalWriteMessage: (state) => state.modalWriteMessage,
        getMessageUser: (state) => state.messageUser,
        getArrayDialogs: (state) => state.arrayDialogs,
        getArrayMessages: (state) => state.arrayMessages,

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
        },

        setArrayDialogs(state, value) {
            state.arrayDialogs = value;
        },

        setArrayMessages(state, value) {
            state.arrayMessages = value;
        }

    },

    actions: {
        //сохранение сообщений в базе данных
        async WRITE_MESSAGE_USER({ state, commit, dispatch }, userID) {

            let date = await dispatch("postsMyPageStore/newDate", null, { root: true });

            let message = {
                destinationID: userID,
                textMessage: state.messageUser,
                date: date
            }
            try {
                commit("setMessageUser", "")
                commit("setModalWriteMessage", false)
                await axios.post("http://localhost:8000/user_message", message)
                    .then(function() {

                        // state.arrayMessages.push(resp.data)
                        // console.log(state.arrayMessages)

                    })
            } catch (err) {
                console.log(err)
            }
        },

        //получение всех диалогов пользователя
        async LOAD_DIALOGS({ commit }) {
            // let user = {
            // destinationID: userID,
            // textMessage: state.messageUser,
            // }
            try {
                await axios.get("http://localhost:8000/user_dialogs")
                    .then(function(resp) {
                        commit("setArrayDialogs", resp.data)
                            // console.log(state.arrayDialogs)
                            // console.log(state.arrayMessages)
                            // commit("setMessageUser", "")
                            // commit("setModalWriteMessage", false)
                    })
            } catch (err) {
                console.log(err)
            }
        },

        //получение переписки с конкретным пользователем
        async LOAD_MESSAGES_USER({ commit }, id) {
            try {
                await axios.get("http://localhost:8000/user_messages", {
                        params: { user_companion: id }
                    })
                    .then(function(resp) {
                        commit("setArrayMessages", resp.data);
                    })
            } catch (err) {
                console.log(err)
            }
        },

        //удаление сообщения
        async DELETE_MESSAGES({ state }, id) {
            try {
                let message_params = {
                    deleteID: id,
                }
                await axios.delete("http://localhost:8000/user_messages", { data: message_params })
                    .then(function(resp) {
                        console.log(resp)
                        state.arrayMessages = state.arrayMessages.filter(message => message.id !== id);
                    })
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