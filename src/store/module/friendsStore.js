import axios from "axios"

axios
export const friendsStore = {

    state: () => ({
        textBtnFfriend: "Добавить в друзья",
        isFriend: false,
        // notificationAddFriends: [], //заявки в друзья или друзья
        usersFriendsMe: [], //пользователи которые хотят дружить со мной
        usersMyFriends: [], //массив моих друзей
        isFriendShow: "allFriends", //какую вкладку показывать - все друзья или заявки
    }),

    getters: {
        getTextBtnFfriend: (state) => state.textBtnFfriend,
        getIsFriend: (state) => state.isFriend,
        // getNotificationAddFriends: (state) => state.notificationAddFriends,
        getUsersFriendsMe: (state) => state.usersFriendsMe,
        getUsersMyFriends: (state) => state.usersMyFriends,
        getIsFriendShow: (state) => state.isFriendShow
    },

    mutations: {
        setTextBtnFfriend(state, value) {
            state.textBtnFfriend = value;
        },

        //показываеть или нет кнопку добавить в друзья
        setIsFriend(state, bool) {
            state.isFriend = bool;
        },

        // setNotificationAddFriends(state, value) {
        //     state.notificationAddFriends = value
        // },

        setUsersFriendsMe(state, users) {
            state.usersFriendsMe = users;
        },

        setUsersMyFriends(state, users) {
            state.usersMyFriends = users;
        },

        setIsFriendShow(state, value) {
            state.isFriendShow = value
        }


    },

    actions: {
        //добавление в друзья
        async ADD_FRIEND({ commit }, id) {
            try {
                await axios.post("http://localhost:8000/add_friend", { id })
                    .then(function(res) {
                        console.log(res.data)
                        commit("setTextBtnFfriend", res.data);
                    })
            } catch (err) {
                console.log(err)
            }
        },

        //принять заявку в друзья
        async AGREE_ADD_FRIEND_USER({ getters, commit, dispatch }, id) {
            try {
                await axios.put("http://localhost:8000/add_friends_me", { id })
                    .then(function() {
                        const users = getters.getUsersFriendsMe.filter(user => user.id != id)
                        commit("setUsersFriendsMe", users);

                        dispatch("GET_USER_MY_FRIENDS");
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
                            commit("setIsFriend", false);
                        } else if (res.data === "Добавить в друзья") {
                            commit("setIsFriend", true);
                            commit("setTextBtnFfriend", res.data);
                        } else if (res.data === "Заявка отправлена") {
                            commit("setTextBtnFfriend", res.data);
                            commit("setIsFriend", true)
                        } else if (res.data === "Рассмотреть заявку") {
                            commit("setTextBtnFfriend", res.data);
                            commit("setIsFriend", true)
                        }

                    })
            } catch (err) {
                console.log(err)
            }
        },

        //проверка на приглашение в друзья или друзья
        // async CHECK_CONFIRM_FRIEND({ commit }) {
        //     try {
        //         await axios.get("http://localhost:8000/check_confirm_friends")
        //             .then(function(res) {
        //                 if (res.data.length === 0) {
        //                     console.log("Новых заявок в друзья нет")
        //                 } else {
        //                     commit("setNotificationAddFriends", res.data)
        //                     console.log(res.data);
        //                 }
        //             })
        //     } catch (err) {
        //         console.log(err)
        //     }
        // },

        //получить пользователей отправивших мне заявку в друзья
        async GET_USER_ADD_FRIENDS_ME({ commit }) {
            try {
                await axios.get("http://localhost:8000/add_friends_me")
                    .then(function(res) {
                        console.log(res.data)
                        commit("setUsersFriendsMe", res.data);
                    })
            } catch (err) {
                console.log(err)
            }
        },

        //получить пользователей которые являются моими друзьями
        async GET_USER_MY_FRIENDS({ commit }) {
            try {
                await axios.get("http://localhost:8000/my_friends")
                    .then(function(res) {
                        commit("setUsersMyFriends", res.data);
                        console.log(res.data)
                    })
            } catch (err) {
                console.log(err)
            }
        },


    },


    namespaced: true,
}