import axios from "axios";
import SocketioService from "../../services/socketio.service";


export const messageStore = {

    state: () => ({
        modalWriteMessage: false,
        messageUser: "", //текст сообщения
        arrayDialogs: [],
        arrayMessages: [],
        countNewMessage: "",
        isNewMessageNotify: false

    }),
    getters: {
        getModalWriteMessage: (state) => state.modalWriteMessage,
        getMessageUser: (state) => state.messageUser,
        getArrayDialogs: (state) => state.arrayDialogs,
        getArrayMessages: (state) => state.arrayMessages,
        getCountNewMessage: (state) => state.countNewMessage,
        userAva: (state, _, rootState) => rootState.authorizationStore.user.ava,
        getIsNewMessageNotify: (state) => state.isNewMessageNotify

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
        },
        setArrayMessagesUnread(state) {
            state.arrayMessages.map(message => message.unread = 0)
        },

        setCountNewMessage(state, count) {
            state.countNewMessage = count;
        },

        setIsNewMessageNotify(state, bool) {
            state.isNewMessageNotify = bool;
        }

    },

    actions: {
        //сохранение сообщений в базе данных
        async WRITE_MESSAGE_USER({ state, commit, dispatch }, addresseeID) {

            let date = await dispatch("postsMyPageStore/newDate", null, { root: true });

            let message = {
                destinationID: addresseeID,
                textMessage: state.messageUser,
                date: date
            }
            try {
                commit("setMessageUser", "");
                commit("setModalWriteMessage", false);

                await axios.post("http://localhost:8000/user_message", message)
                    .then(function(res) {

                        //отпраляем сообщение на сервер для передачи его адресату через сокет
                        let newMessage = res.data[0];
                        newMessage.destinationID = addresseeID;
                        SocketioService.sendMessage(newMessage, cb => {
                            console.log(cb);
                        });

                        commit("setArrayMessages", [...state.arrayMessages, newMessage]);
                        // state.arrayMessages.push(resp.data)
                    })

            } catch (err) {
                console.log(err)
            }
        },

        //получение всех диалогов пользователя
        async LOAD_DIALOGS({ commit }, body) {
            try {
                await axios.get("http://localhost:8000/user_dialogs", { params: body })
                    .then(function(resp) {
                        commit("setArrayDialogs", resp.data);
                        // let count = resp.data.reduce((accum, item) => accum + item.unread, 0);
                        // commit("setCountNewMessage", count)
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
                        console.log(resp.data)
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
                    .then(function() {
                        state.arrayMessages = state.arrayMessages.filter(message => message.id !== id);
                    })
            } catch (err) {
                console.log(err)
            }
        },

        //удаление диалога
        async DELETE_DIALOGS({ state, commit }, id) {
            try {
                let dialogs_params = {
                    dialogsID: id,
                }

                await axios.put("http://localhost:8000/user_messages", dialogs_params)
                    .then(function(resp) {
                        let dialogs = state.arrayDialogs.filter(dialog => dialog.convId !== resp.data.id);
                        commit("setArrayDialogs", dialogs);
                    })
                state.messageUser
            } catch (err) {
                console.log(err)
            }
        },

        //обновление флагов непрочитанных сообщений после выхода из переписки
        async UPDATE_FLAGS_UNREAD_MESSAGE({ getters, commit }, conv_id) {
            try {
                await axios.put("http://localhost:8000/unread_messages", { conv_id })
                    .then(function(res) {
                        getters.getArrayDialogs.map((dialog) => {
                            if (dialog.convId === conv_id) {
                                dialog.unread = 0
                            }
                        })
                        commit("setCountNewMessage", getters.getCountNewMessage - res.data.count)
                    })
            } catch (err) {
                console.log(err)
            }
        },

        //обновление диалогов без перезагрузки через сокеты
        UPDATE_DIALOGS_SOCKETS({ state, commit }, data) {
            state.arrayDialogs.map((dialog) => {
                if (dialog.convId == data.conv_id) {
                    dialog.message = data.message,
                        dialog.date = data.date,
                        dialog.id = data.id,
                        dialog.ava = data.ava,
                        dialog.name = data.name,
                        dialog.surname = data.surname,
                        dialog.unread += 1
                }
            });

            if (!state.arrayDialogs.some(i => i.convId === data.conv_id)) {
                const newDialog = {
                    convId: data.conv_id,
                    message: data.message,
                    date: data.date,
                    isShowBtnDelete: false,
                    id: data.id,
                    ava: data.ava,
                    name: data.name,
                    surname: data.surname,
                    unread: 1,
                    sender: data.sender,
                    userID: data.sender
                }
                commit("setArrayDialogs", [newDialog, ...state.arrayDialogs]);
            }

            state.arrayDialogs.sort((a, b) => {
                if (a.unread) { return b.id - a.id }
            });
        },
    },



    namespaced: true,
}