import axios from "axios"
import SocketioService from "../../services/socketio.service";

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
        limitFriends: 8, // лимит пользователей на странице

        searchFriend: {
            name: "", //имя в фильтре поиска
            surname: "", //фамилия в фильтре поиска
            country: "", //страна в фильтре поиска
            city: "", //город в фильтре поиска
            ageAfter: "", //возраст от в фильтре поиска
            ageBefore: "", //возраст до в фильтре поиска
            sex: "" //пол в фильтре поиска
        },

        isUIloadMoreFriends: false, //отображать индикатор загрузки
        isNotFriends: false, //отображать надпись об отсутствии друзей
        isBtnsBlock: true, //отображать блок с кнопками в UserInfo
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

        getCountFriends: (state) => state.countFriends,

        getIsUIloadMoreFriends: (state) => state.isUIloadMoreFriends,
        getIsNotFriends: (state) => state.isNotFriends,
        getIsBtnsBlock: (state) => state.isBtnsBlock

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

        setIsUIloadMoreFriends(state, bool) {
            state.isUIloadMoreFriends = bool;
        },

        setIsNotFriends(state, bool) {
            state.isNotFriends = bool;
        },

        setIsBtnsBlock(state, bool) {
            state.isBtnsBlock = bool;
        },

        changeTextBTN(state, data) {
            if (data.text_notice === "пригласил Вас в друзья") {
                state.searchUsersFriends.map(user => {
                    if (data.userID === user.userID) {
                        user.type_user = 'мне отправили заявку';
                        user.id = data.friend_id;
                    }
                })
                state.textBtnFfriend = "Рассмотреть заявку"

            } else if (data.text_notice === "принял Вашу заявку в друзья") {
                state.searchUsersFriends.map(user => {
                    if (data.userID === user.userID) {
                        user.type_user = 'друзья';
                        user.textBTN = 'Удалить из друзей';
                        user.id = data.friend_id;
                    }
                })
                state.isFriend = false;
                state.usersFriendsFromMe = state.usersFriendsFromMe.filter(user => user.userID != data.userID);
                if (state.usersFriendsFromMe.length === 0 && state.isFriendShow === "friendsFromMe") {
                    state.isNotFriends = true;
                }

            } else if (data.text_notice === "Пользователь удален из ваших друзей") {
                state.searchUsersFriends.map(user => {
                    if (+data.userID === user.userID) {
                        user.type_user = null;
                        user.textBTN = 'Добавить в друзья';
                        user.id = null;
                    }
                })
                state.usersFriendsMe = state.usersFriendsMe.filter(user => user.userID != data.userID);

                if (state.usersFriendsMe.length === 0 && state.isFriendShow === "friendsMe") {
                    state.isNotFriends = true;
                }

                state.usersFriendsFromMe = state.usersFriendsFromMe.filter(user => user.userID != data.userID);
                if (state.usersFriendsFromMe.length === 0 && state.isFriendShow === "friendsFromMe") {
                    state.isNotFriends = true;
                }

                state.textBtnFfriend = "Добавить в друзья";
            }
        }

    },

    actions: {
        //добавление в друзья
        async ADD_FRIEND({
            commit,
            dispatch
        }, id) {
            try {
                let date = await dispatch("postsMyPageStore/newDate", null, {
                    root: true
                });
                await axios.post("http://localhost:8000/add_friend", {
                        id,
                        date
                    })
                    .then(function(res) {
                        commit("setTextBtnFfriend", res.data.status);

                        if (res.data.status === "Заявка отправлена") {
                            //отправляем уведомление адресату без перезагрузки страницы
                            SocketioService.sendNotice(id, cb => {
                                console.log(cb);
                            });
                        } else if (res.data.status === "Добавить в друзья") {
                            let addresseeID = {
                                    text_notice: "Пользователь удален из ваших друзей",
                                    id: id,
                                    userID: res.data.userID
                                }
                                //отправляем уведомление адресату без перезагрузки страницы
                            SocketioService.sendNotice(addresseeID, cb => {
                                console.log(cb);
                            });
                        }
                    })
            } catch (err) {
                console.log(err)
            }
        },

        //принять заявку в друзья
        async AGREE_ADD_FRIEND_USER({
            getters,
            commit,
            dispatch,
            state
        }, value) {
            try {
                let date = await dispatch("postsMyPageStore/newDate", null, {
                    root: true
                });
                await axios.put("http://localhost:8000/add_friends_me", {
                        id: value.id,
                        userID: value.userID,
                        date
                    })
                    .then(function() {
                        const users = getters.getUsersFriendsMe.filter(user => user.id != value.id)
                        commit("setUsersFriendsMe", users);
                        dispatch("GET_USER_MY_FRIENDS", JSON.parse(localStorage.getItem('user')).userID);

                        if (state.usersFriendsMe.length === 0 && state.isFriendShow === "friendsMe") {
                            state.isNotFriends = true;
                        }

                        //отправляем уведомление адресату без перезагрузки страницы
                        SocketioService.sendNotice(value.userID, cb => {
                            console.log(cb);
                        });
                        dispatch("noticeStore/GET_NEW_NOTICE", null, { root: true });
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
                commit('setIsBtnsBlock', false);
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
                            commit("setIsFriend", true);
                        } else if (res.data === "Рассмотреть заявку") {
                            commit("setTextBtnFfriend", res.data);
                            commit("setIsFriend", true);
                        } else {
                            commit("setTextBtnFfriend", res.data);
                        }

                        commit('setIsBtnsBlock', true);

                    })
            } catch (err) {
                if (err.code === "ERR_CANCELED") {
                    console.log("Загрузка была отменена")
                } else {
                    console.log(err)
                }
            }
        },

        //получить пользователей отправивших мне заявку в друзья
        async GET_USER_ADD_FRIENDS_ME({
            commit,
            state
        }) {
            await commit("setIsNotFriends", false);
            await commit("setIsUIloadMoreFriends", true);

            return new Promise((resolve, reject) => {
                axios.get("http://localhost:8000/add_friends_me", {
                        params: {
                            _count: state.countFriends,
                            _limit: state.limitFriends,
                        }
                    })
                    .then(function(res) {
                        commit("setIsUIloadMoreFriends", false);
                        commit("setUsersFriendsMe", [...state.usersFriendsMe, ...res.data]);

                        if (res.data.length > 0) {
                            commit("setCountFriends", 8);
                        } else {
                            commit("setIsNotFriends", true);
                        }
                        resolve(res);
                    })
                    .catch((err) => {
                        reject(err)
                    })
            })

        },


        //получить пользователей котрым я отправил заявку в друзья
        async GET_USER_ADD_FRIENDS_FROM_ME({
            commit,
            state
        }) {
            await commit("setIsNotFriends", false);
            await commit("setIsUIloadMoreFriends", true);
            try {
                await axios.get("http://localhost:8000/add_friends_from_me", {
                        params: {
                            _count: state.countFriends,
                            _limit: state.limitFriends,
                        }
                    })
                    .then(function(res) {
                        commit("setIsUIloadMoreFriends", false);
                        commit("setUsersFriendsFromMe", [...state.usersFriendsFromMe, ...res.data]);

                        if (res.data.length > 0) {
                            commit("setCountFriends", 8);
                        } else {
                            commit("setIsNotFriends", true);
                        }
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
            await commit("setIsNotFriends", false);
            await commit("setIsUIloadMoreFriends", true);
            try {
                await axios.get("http://localhost:8000/my_friends", {
                        params: {
                            id,
                            _count: state.countFriends,
                            _limit: state.limitFriends,
                        }
                    })
                    .then(function(res) {
                        commit("setIsUIloadMoreFriends", false);
                        commit("setUsersMyFriends", [...state.usersMyFriends, ...res.data]);
                        commit("setUsersMyFriendsFilter", [...state.usersMyFriendsFilter, ...res.data]);
                        if (res.data.length > 0) {
                            commit("setCountFriends", 8);
                        } else {
                            commit("setIsNotFriends", true);
                        }
                    })
            } catch (err) {
                if (err.code === "ERR_CANCELED") {
                    console.log("Загрузка была отменена")
                } else {
                    console.log(err)
                }
            }
        },

        //удалить друга
        async DELETE_FRIEND({
            state,
            commit,
            dispatch
        }, params) {
            return new Promise((resolve, reject) => {
                axios.delete("http://localhost:8000/delete_friends", {
                        data: {
                            params
                        }
                    })
                    .then(function(res) {
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

                            if (state.usersFriendsMe.length === 0 && state.isFriendShow === "friendsMe") {
                                state.isNotFriends = true;
                            }
                        }

                        if (state.usersFriendsFromMe) {
                            let friendsFromMe = state.usersFriendsFromMe.filter(user => user.id !== params.id)
                            commit("setUsersFriendsFromMe", friendsFromMe);

                            if (state.usersFriendsFromMe.length === 0 && state.isFriendShow === "friendsFromMe") {
                                state.isNotFriends = true;
                            }
                        }
                        dispatch("noticeStore/GET_NEW_NOTICE", null, { root: true });

                        let addresseeID = {
                                text_notice: res.data,
                                id: params.userID,
                                userID: params.query
                            }
                            //отправляем уведомление адресату без перезагрузки страницы
                        SocketioService.sendNotice(addresseeID, cb => {
                            console.log(cb);
                        });
                        resolve();
                    })
                    .catch((err) => {
                        console.log(err)
                        reject(err)
                    })
            })

        },

        //поиск пользователей
        async SEARCH_USERS_FRIENDS({
            commit,
            state
        }, params) {
            await commit("setUsersMyFriends", []);
            await commit("setUsersMyFriendsFilter", []);
            await commit("setIsNotFriends", false);
            await commit("setIsUIloadMoreFriends", true);
            try {
                //если возрастной диапазон не указан, по умолчанию от 0 до 100
                (!params.ageAfter) ? params.ageAfter = 0: params.ageAfter;
                (!params.ageBefore) ? params.ageBefore = 100: params.ageBefore;

                params._count = state.countFriends,
                    params._limit = state.limitFriends

                await commit("setTitleFriend", "Поиск друзей");
                await commit("setIsFriendShow", 'allFriends');

                await axios.get("http://localhost:8000/search_friends", {
                        params
                    })
                    .then(function(res) {
                        commit("setIsUIloadMoreFriends", false);
                        commit("setSearchUsersFriends", [...state.searchUsersFriends, ...res.data]);
                        if (res.data.length > 0) {
                            commit("setCountFriends", 8);
                        } else {
                            commit("setIsNotFriends", true);
                        }

                    })
            } catch (err) {
                console.log(err)
            }
        }
    },

    namespaced: true,
}