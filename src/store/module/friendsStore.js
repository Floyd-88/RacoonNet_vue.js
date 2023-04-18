import axios from "axios"

axios
export const friendsStore = {

    state: () => ({
        textBtnFfriend: "Добавить в друзья",
        isFriend: false,
        titleFriend: "Друзья", //заголовок на странице друзей
        usersFriendsMe: [], //пользователи которые хотят дружить со мной
        usersFriendsFromMe: [], //пользователи с которыми я хочу дружить
        usersMyFriends: [], //массив моих друзей
        usersMyFriendsFilter: [], //массив моих друзей отфильтрованный по имени
        searchUsersFriends: [], //массив пользователй при поиске
        isFriendShow: "allFriends", //какую вкладку показывать - все друзья или заявки
        nameFriendUser: "", //имя друга в поле поиска среди друзей 
    }),

    getters: {
        getTextBtnFfriend: (state) => state.textBtnFfriend,
        getIsFriend: (state) => state.isFriend,
        getTitleFriend: (state) => state.titleFriend,
        // getNotificationAddFriends: (state) => state.notificationAddFriends,
        getUsersFriendsMe: (state) => state.usersFriendsMe,
        getUsersMyFriends: (state) => state.usersMyFriends,
        getUsersMyFriendsFilter: (state) => {
            return state.usersMyFriendsFilter.filter((users) => users.name.toLowerCase().includes(state.nameFriendUser.toLowerCase()) || users.surname.toLowerCase().includes(state.nameFriendUser.toLowerCase()));
        },
        getSearchUsersFriends: (state) => state.searchUsersFriends,
        getIsFriendShow: (state) => state.isFriendShow,
        getUsersFriendsFromMe: (state) => state.usersFriendsFromMe,
        getNameFriendUser: (state) => state.nameFriendUser
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

        setTitleFriend(state, value) {
            state.titleFriend = value
        },

        setUsersFriendsMe(state, users) {
            state.usersFriendsMe = users;
        },

        setUsersMyFriends(state, users) {
            state.usersMyFriends = users;
        },
        setUsersMyFriendsFilter(state, users) {
            state.usersMyFriendsFilter = users;
        },

        setSearchUsersFriends(state, users) {
            state.searchUsersFriends = users;
        },

        setIsFriendShow(state, value) {
            state.isFriendShow = value;
        },

        setUsersFriendsFromMe(state, users) {
            state.usersFriendsFromMe = users;
        },

        setNameFriendUser(state, value) {
            state.nameFriendUser = value;
        }


    },

    actions: {
        //добавление в друзья
        async ADD_FRIEND({
            commit
        }, id) {
            console.log(id)
            try {
                await axios.post("http://localhost:8000/add_friend", {
                        id
                    })
                    .then(function(res) {
                        console.log(res.data)
                        commit("setTextBtnFfriend", res.data);
                    })
            } catch (err) {
                console.log(err)
            }
        },

        //принять заявку в друзья
        async AGREE_ADD_FRIEND_USER({
            getters,
            commit,
            dispatch
        }, id) {
            try {
                await axios.put("http://localhost:8000/add_friends_me", {
                        id
                    })
                    .then(function() {
                        const users = getters.getUsersFriendsMe.filter(user => user.id != id)
                        commit("setUsersFriendsMe", users);
                        console.log(id)
                        dispatch("GET_USER_MY_FRIENDS", JSON.parse(localStorage.getItem('user')).userID);
                    })
            } catch (err) {
                console.log(err)
            }
        },

        //проверка на заявку в друзья после обновления страницы
        async CHECK_REQUEST_FRIEND({
            commit
        }, id) {
            try {
                await axios.get("http://localhost:8000/check_request_friend", {
                        params: {
                            id
                        }
                    })
                    .then(function(res) {
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
                        } else {
                            commit("setTextBtnFfriend", res.data);
                        }

                    })
            } catch (err) {
                console.log(err)
            }
        },

        //получить пользователей отправивших мне заявку в друзья
        async GET_USER_ADD_FRIENDS_ME({
            commit
        }) {
            try {
                await axios.get("http://localhost:8000/add_friends_me")
                    .then(function(res) {
                        commit("setUsersFriendsMe", res.data);
                    })
            } catch (err) {
                console.log(err)
            }
        },

        //получить пользователей котрым я отправил заявку в друзья
        async GET_USER_ADD_FRIENDS_FROM_ME({
            commit
        }) {
            try {
                await axios.get("http://localhost:8000/add_friends_from_me")
                    .then(function(res) {
                        console.log(res.data)
                        commit("setUsersFriendsFromMe", res.data);
                    })
            } catch (err) {
                console.log(err)
            }
        },

        //получить пользователей которые являются моими друзьями
        async GET_USER_MY_FRIENDS({
            commit
        }, id) {
            try {
                await axios.get("http://localhost:8000/my_friends", { params: { id } })
                    .then(function(res) {
                        commit("setUsersMyFriends", res.data);
                        commit("setUsersMyFriendsFilter", res.data);
                    })
            } catch (err) {
                console.log(err)
            }
        },

        //удалить друга
        async DELETE_FRIEND({ state, commit }, params) {
            try {
                await axios.delete("http://localhost:8000/delete_friends", { data: { params } })
                    .then(function() {
                        console.log(params.id)
                        if (state.usersMyFriends) {
                            let friends = state.usersMyFriends.filter(user => user.id !== params.id);
                            commit("setUsersMyFriends", friends)
                        }

                        if (state.usersMyFriendsFilter) {
                            let friendsFilter = state.usersMyFriendsFilter.filter(user => user.id !== params.id);
                            commit("setUsersMyFriendsFilter", friendsFilter)
                        }

                        if (state.usersFriendsMe) {
                            let friendsMe = state.usersFriendsMe.filter(user => user.id !== params.id)
                            commit("setUsersFriendsMe", friendsMe)
                        }

                        if (state.usersFriendsFromMe) {
                            let friendsFromMe = state.usersFriendsFromMe.filter(user => user.id !== params.id)
                            commit("setUsersFriendsFromMe", friendsFromMe)
                        }

                    })
            } catch (err) {
                console.log(err)
            }
        },

        //поиск пользователей
        async SEARCH_USERS_FRIENDS({ commit }, params) {
            try {
                //если возрастной диапазон не указан, по умолчанию от 0 до 100
                (!params.ageAfter) ? params.ageAfter = 0: params.ageAfter;
                (!params.ageBefore) ? params.ageBefore = 100: params.ageBefore;

                await axios.get("http://localhost:8000/search_friends", { params })
                    .then(function(res) {
                        commit("setTitleFriend", "Поиск друзей");
                        commit("setSearchUsersFriends", res.data)
                        console.log(res.data)
                    })
            } catch (err) {
                console.log(err)
            }
        }
    },

    namespaced: true,
}