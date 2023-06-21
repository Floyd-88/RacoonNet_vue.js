import axios from "axios";
import SocketioService from "../../services/socketio.service";


export const messageStore = {

    state: () => ({
        modalWriteMessage: false,
        messageUser: "", //текст сообщения
        arrayDialogs: [],
        arrayMessages: [],
        countNewMessage: "",
        isNewMessageNotify: false,

        countDialogs: 0, //с какого диалога начинать вести счет
        limitDialogs: 10, // лимит диалогов на странице

        countMessages: 0, // с какого сообщения начинать вести счет
        limitMessages: 10, // лимит сообщений на странице

        isUIloadMoreDialogs: false, //отображать индикатор загрузки
        isNotDialogs: false, //отображать надпись об отсутствии диалогов
        isUIloadMoreMessages: false, //отображать индикатор загрузки
        isNotMessages: false, //отображать надпись об отсутствии диалогов

        photosMessagesArray: [] //массив с фотографиями к сообщениям
    }),
    getters: {
        getModalWriteMessage: (state) => state.modalWriteMessage,
        getMessageUser: (state) => state.messageUser,
        getArrayDialogs: (state) => state.arrayDialogs,
        getArrayMessages: (state) => state.arrayMessages,
        getCountNewMessage: (state) => state.countNewMessage,
        userAva: (state, _, rootState) => rootState.authorizationStore.user.ava,
        getIsNewMessageNotify: (state) => state.isNewMessageNotify,

        getCountDialogs: (state) => state.countDialogs,

        getIsUIloadMoreDialogs: (state) => state.isUIloadMoreDialogs,
        getIsNotDialogs: (state) => state.isNotDialogs,
        getIsUIloadMoreMessages: (state) => state.isUIloadMoreMessages,
        getIsNotMessages: (state) => state.isNotMessages,

        getPhotosMessagesArray: (state) => state.photosMessagesArray
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

        setArrayDialogsConvID(state, id) {
            state.arrayDialogs.map((dialog) => {
                if (dialog.convId === id) {
                    dialog.unread = 0
                }
            })
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
        },

        setCountDialogs(state, count) {
            state.countDialogs += count
        },
        setCountDialogsNull(state) {
            state.countDialogs = 0;
        },

        setCountMessages(state, count) {
            state.countMessages += count
        },
        setCountMessagesNull(state) {
            state.countMessages = 0;
        },

        setIsUIloadMoreDialogs(state, bool) {
            state.isUIloadMoreDialogs = bool;
        },

        setIsNotDialogs(state, bool) {
            state.isNotDialogs = bool;
        },

        setIsUIloadMoreMessages(state, bool) {
            state.isUIloadMoreMessages = bool;
        },

        setIsNotMessages(state, bool) {
            state.isNotMessages = bool;
        },

        setPhotosMessagesArray(state, value) {
            state.photosMessagesArray = value;
        }

    },

    actions: {
        //сохранение сообщений в базе данных
        async WRITE_MESSAGE_USER({ state, commit, dispatch }, body) {

            let date = await dispatch("postsMyPageStore/newDate", null, { root: true });

            let message = {
                destinationID: body.addresseeID,
                textMessage: state.messageUser,
                date: date
            }

            message.photo = body.isPhoto;

            try {
                commit("setMessageUser", "");
                commit("setModalWriteMessage", false);

                await axios.post("http://localhost:8000/user_message", message)
                    .then(function(res) {
                        commit("setCountMessages", 1);

                        //отпраляем сообщение на сервер для передачи его адресату через сокет
                        let newMessage = res.data[0];
                        newMessage.destinationID = body.addresseeID;
                        SocketioService.sendMessage(newMessage, cb => {
                            console.log(cb);
                        });
                        commit("setArrayMessages", [...state.arrayMessages, newMessage]);
                        // state.arrayMessages.push(resp.data)


                    });

            } catch (err) {
                console.log(err)
            }
        },

        //получение всех диалогов пользователя
        async LOAD_DIALOGS({ commit, state }, body) {
            await commit("setIsNotDialogs", false);
            await commit("setIsUIloadMoreDialogs", true);

            return new Promise((resolve, reject) => {
                axios.get("http://localhost:8000/user_dialogs", {
                        params: {
                            body,
                            _count: state.countDialogs,
                            _limit: state.limitDialogs,
                        }
                    })
                    .then(function(resp) {
                        let dialogs = resp.data.sort((a, b) => b.unread - a.unread);
                        commit("setIsUIloadMoreDialogs", false);
                        commit("setArrayDialogs", [...state.arrayDialogs, ...dialogs]);
                        if (resp.data.length > 0) {
                            commit("setCountDialogs", 10);
                        } else {
                            commit("setIsNotDialogs", true);
                        }
                        // let count = resp.data.reduce((accum, item) => accum + item.unread, 0);
                        // commit("setCountNewMessage", count)
                        // commit("setMessageUser", "")
                        // commit("setModalWriteMessage", false)
                        resolve(resp);
                    })
                    .catch((err) => {
                        reject(err);
                    })
            })

        },

        //получение переписки с конкретным пользователем
        async LOAD_MESSAGES_USER({ commit, state, dispatch }, id) {
            await commit("setIsNotMessages", false);
            await commit("setIsUIloadMoreMessages", true);

            return new Promise((resolve) => {
                try {
                    axios.get("http://localhost:8000/user_messages", {
                            params: {
                                user_companion: id,
                                _count: state.countMessages,
                                _limit: state.limitMessages,
                            }
                        })
                        .then(async function(resp) {
                            commit("setIsUIloadMoreMessages", false);
                            if (resp.data !== "Переписка с данным пользователем отсутствует") {
                                let arrayMessage = resp.data.reverse();
                                commit("setArrayMessages", [...arrayMessage, ...state.arrayMessages]);
                                if (resp.data.length > 0) {
                                    commit("setCountMessages", 10);
                                } else {
                                    commit("setIsNotMessages", true);
                                }

                                await resp.data.forEach(async message => {
                                    if (message.photos === "1") {
                                        await dispatch("LOAD_MESSAGES_PHOTOS", { messageID: message.id });
                                    }
                                });
                                resolve(resp);
                            }
                        })
                } catch (err) {
                    console.log(err);
                }
            })

        },

        //удаление сообщения
        async DELETE_MESSAGES({ state }, body) {
            try {
                let message_params = {
                    deleteID: body.messageID,
                    photos: body.photos
                }

                await axios.delete("http://localhost:8000/user_messages", { data: message_params })
                    .then(function() {
                        state.arrayMessages = state.arrayMessages.filter(message => message.id !== body.messageID);
                    })
            } catch (err) {
                console.log(err)
            }
        },

        //удаление диалога
        async DELETE_DIALOGS({ state, commit }, body) {
            try {
                let dialogs_params = {
                    dialogsID: body.convID,
                    photos: body.photos
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
        async UPDATE_FLAGS_UNREAD_MESSAGE({ commit }, conv_id) {
            try {
                await axios.put("http://localhost:8000/unread_messages", { conv_id })
                    .then(function() {
                        commit("setArrayDialogsConvID", conv_id)
                            // commit("setCountNewMessage", getters.getCountNewMessage - res.data.count)
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

        //загрузка фотографий к сообщениям
        async LOAD_MESSAGES_PHOTOS({ commit, state }, params) {
            try {
                await axios.get('http://localhost:8000/message_photos.js', {
                    params
                }).then((response) => {
                    if (response.data.length > 0) {
                        commit("setPhotosMessagesArray", [...state.photosMessagesArray, ...response.data]);
                    }
                });
            } catch (err) {
                console.error(err);
            }
        }
    },



    namespaced: true,
}