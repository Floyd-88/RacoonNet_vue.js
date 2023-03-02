import axios from "axios"

axios
export const friendsStore = {

    state: () => ({
        textBtnFfriend: "Добавить в друзья",
        isFriend: false,
        notificationAddFriends: []
    }),

    getters: {
        getTextBtnFfriend: (state) => state.textBtnFfriend,
        getIsFriend: (state) => state.isFriend,
        getNotificationAddFriends: (state) => state.notificationAddFriends
    },

    mutations: {
        setTextBtnFfriend(state, value) {
            state.textBtnFfriend = value;
        },

        //показываеть или нет кнопку добавить в друзья
        setIsFriend(state, bool) {
            state.isFriend = bool;
        },

        setNotificationAddFriends(state, value) {
            state.notificationAddFriends = value
        }


    },

    actions: {
        //добавление в друзья
        async ADD_FRIEND({ commit }, id) {
            try {
                await axios.post("http://localhost:8000/add_friend", { id })
                    .then(function(res) {
                        // console.log(res.data)
                        commit("setTextBtnFfriend", res.data);
                    })
            } catch (err) {
                console.log(err)
            }
        },

        //проверка на заявку в друзья после обновления страницы
        async CHECK_REQUEST_FRIEND({ commit }, id) {
            try {
                await axios.get("http://localhost:8000/check_request_friend", { params: { id } })
                    .then(function(res) {
                        console.log(res.data)
                        if (res.data === "Это Ваш друг") {
                            commit("setIsFriend", true)
                        } else {
                            commit("setTextBtnFfriend", res.data);
                        }

                    })
            } catch (err) {
                console.log(err)
            }
        },

        //проверка на приглашение в друзья
        async CHECK_CONFIRM_FRIEND({ commit }) {
            try {
                await axios.get("http://localhost:8000/check_confirm_friends")
                    .then(function(res) {
                        if (res.data.length === 0) {
                            console.log("Новых заявок в друзья нет")
                        } else {
                            commit("setNotificationAddFriends", res.data)
                            console.log(res.data);
                        }

                    })
            } catch (err) {
                console.log(err)
            }
        },

    },


    namespaced: true,
}