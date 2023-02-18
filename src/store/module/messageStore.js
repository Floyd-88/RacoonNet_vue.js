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
        async WRITE_MESSAGE_USER({ state, commit }, userID) {
            let message = {
                destinationID: userID,
                textMessage: state.messageUser,
            }
            try {
                await axios.post("http://localhost:8000/user_message", message)
                    .then(function(res) {
                        console.log(res.data)
                            // state.arrayMessages.push(resp.data)
                            // console.log(state.arrayMessages)
                        commit("setMessageUser", "")
                        commit("setModalWriteMessage", false)
                    })
            } catch (err) {
                console.log(err)
            }
        },

        // async LOAD_MESSAGES({ state, commit }, userID) {
        //     // let message = {
        //     //     destinationID: userID,
        //     //     textMessage: state.messageUser,
        //     // }
        //     try {
        //         await axios.get("http://localhost:8000/user_message")
        //             .then(function(resp) {


        //                 // state.arrayMessages.push(resp.data)
        //                 console.log(state.arrayMessages)
        //                     // commit("setMessageUser", "")
        //                     // commit("setModalWriteMessage", false)
        //             })
        //     } catch (err) {
        //         console.log(err)
        //     }
        // },


    },

    namespaced: true,
}