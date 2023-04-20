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

        countFriends: 0, //с какого пользователя начинать вести счет
        limitFriends: 7, // лимит пользователей на странице

        searchFriend: {
            name: "", //имя в фильтре поиска
            surname: "", //фамилия в фильтре поиска
            country: "", //страна в фильтре поиска
            city: "", //город в фильтре поиска
            ageAfter: "", //возраст от в фильтре поиска
            ageBefore: "", //возраст до в фильтре поиска
            sex: "" //пол в фильтре поиска
        }
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
        getNameFriendUser: (state) => state.nameFriendUser,

        getSearchFriendName: (state) => state.searchFriend.name,
        getSearchFriendSurname: (state) => state.searchFriend.surname,
        getSearchFriendCountry: (state) => state.searchFriend.country,
        getSearchFriendCity: (state) => state.searchFriend.city,
        getSearchFriendAgeAfter: (state) => state.searchFriend.ageAfter,
        getSearchFriendAgeBefore: (state) => state.searchFriend.ageBefore,
        getSearchFriendSex: (state) => state.searchFriend.sex,


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
        },


        setSearchFriendName(state, value) {
            state.searchFriend.name = value;
        },
        setSearchFriendSurname(state, value) {
            state.searchFriend.surname = value;
        },
        setSearchFriendCountry(state, value) {
            state.searchFriend.country = value;
        },
        setSearchFriendCity(state, value) {
            state.searchFriend.city = value;
        },
        setSearchFriendAgeAfter(state, value) {
            state.searchFriend.ageAfter = value;
        },
        setSearchFriendAgeBefore(state, value) {
            state.searchFriend.ageBefore = value;
        },
        setSearchFriendSex(state, value) {
            state.searchFriend.sex = value;
        },

        setSearchFriend(state) {
            state.searchFriend.name = ""
            state.searchFriend.surname = ""
            state.searchFriend.country = ""
            state.searchFriend.city = ""
            state.searchFriend.ageAfter = ""
            state.searchFriend.ageBefore = ""
            state.searchFriend.sex = ""
        },

        setCountFriends(state, count) {
            state.countFriends += count
        },
        setCountFriendsNull(state) {
            state.countFriends = 0;
        },

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
            commit,
            state
        }, id) {
            try {
                await axios.get("http://localhost:8000/my_friends", {
                        params: {
                            id,
                            _count: state.countFriends,
                            _limit: state.limitFriends,
                        }
                    })
                    .then(function(res) {
                        commit("setUsersMyFriends", [...state.usersMyFriends, ...res.data]);
                        commit("setUsersMyFriendsFilter", [...state.usersMyFriendsFilter, ...res.data]);
                        if (res.data.length > 0) {
                            commit("setCountFriends", 7);
                        }
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