import axios from "axios";
export const authorizationStore = {
    state: () => ({
        status: "success",
        token: localStorage.getItem('token') || '', //получаем токен создаваемый при авторизации
        user: {}, //получаем данные юзера при авторизаци
        errorLogin: "", //ошибка возникающая при вводе неверного пароля или почты
        isForgetPassword: true, //показывать ввод логина и пароля или восстановление пароля
        messageEmailPassword: "", //сообщение о восстановлении пароля
        isShowMenu: false, //показывать бургер-меню
    }),

    getters: {
        getToken: (state) => state.token,
        getStatus: (state) => state.status,
        isLoggedIn: (state) => !!state.token, //показываем кнопку выход в header
        getUser: (state) => state.user,
        getErrorLogin: (state) => state.errorLogin,
        getIsForgetPassword: (state) => state.isForgetPassword,
        getMessageEmailPassword: (state) => state.messageEmailPassword,
        getIsShowMenu: (state) => state.isShowMenu,

    },

    mutations: {
        auth_request(state, status) {
            state.status = status;
        },

        auth_success(state, token) {
            state.status = 'success';
            state.token = token;
        },

        auth_error(state) {
            state.status = 'error';
        },

        //при выходе обнуляем
        logout(state) {
            state.status = '';
            state.token = '';
            state.user = {};
        },

        setErrorLogin(state, error) {
            state.errorLogin = error
        },

        setUser(state, user) {
            state.user = user;
        },

        setUserEdit(state, user) {
            state.user.name = user.name;
            state.user.surname = user.surname;
            state.user.city = user.city;
            state.user.country = user.country;
            state.user.day_user = user.day_user;
            state.user.month_user = user.month_user;
            state.user.year_user = user.year_user;
            state.user.selectedGender = user.selectedGender;
        },

        setUserAva(state, ava) {
            state.user.ava = ava;
        },

        setUserEditProfile(state, bool) {
            state.user.is_editProfile = bool;
        },

        setIsForgetPassword(state, bool) {
            state.isForgetPassword = bool;
        },

        setMessageEmailPassword(state, value) {
            state.messageEmailPassword = value;
        },

        setIsShowMenu(state) {
            state.isShowMenu = !state.isShowMenu;
        },

        setIsShowMenuClose(state) {
            state.isShowMenu = false;
        },
    },

    actions: {
        //авторизация зарегистрированого юзера
        login({
            commit
        }, user) {
            return new Promise((resolve, reject) => {
                commit('auth_request', 'loading')
                axios({
                        url: 'http://localhost:8000/login',
                        data: user,
                        method: 'POST'
                    })
                    .then(resp => {
                        const token = resp.data.token;
                        const refreshToken = resp.data.refreshToken;
                        const user = resp.data.user;

                        if (token !== null && user !== null) {
                            localStorage.setItem('token', token);
                            localStorage.setItem('refreshToken', refreshToken);

                            localStorage.setItem('user', JSON.stringify(user));

                            commit('auth_success', token);
                            resolve(resp);
                        }
                    })
                    .catch((err) => {
                        commit('auth_error');
                        localStorage.removeItem('token');
                        localStorage.removeItem('refreshToken');
                        localStorage.removeItem('user');
                        reject(err);
                    })
            })
        },

        //выход из профиля
        logout({
            commit
        }) {
            return new Promise((resolve) => {
                if (localStorage.getItem('refreshToken')) {
                    axios({
                        url: "http://localhost:8000/del_refresh_token",
                        data: {
                            refreshToken: localStorage.getItem('refreshToken')
                        },
                        method: "POST"
                    })
                }

                commit('logout');
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');
                delete axios.defaults.headers.common['Authorization'];
                resolve();
            })
        },

        //получение данных по пользователю
        loadUser({
            commit
        }, id) {
            return new Promise((resolve, reject) => {
                commit("auth_request", "loading")

                axios({
                        url: "http://localhost:8000/load_user",
                        data: id,
                        method: "POST"
                    })
                    .then(resp => {
                        const user = resp.data.user;

                        if (user !== null) {

                            commit("setUser", user)
                            commit("editProfileStore/setEditingUser", user, {
                                root: true
                            });
                            commit("postsMyPageStore/setPostText", "", {
                                root: true
                            })

                            commit("auth_request", "success")
                            resolve(resp);
                        }
                    })
                    .catch((err) => {
                        reject(err);
                    })
            })
        },

        //отправка почты для восстановление пароля
        RESSTORE_PASSWORD_USER(context, email) {
            return new Promise((resolve, reject) => {
                axios({
                        url: "http://localhost:8000/restore_password",
                        data: email,
                        method: "POST"
                    })
                    .then(resp => {
                        resolve(resp);
                    })
                    .catch((err) => {
                        reject(err);
                    })
            })
        },

        //обновление токена
        UPDATE_TOKEN({
            commit,
            dispatch
        }) {
            commit("auth_request", "loading")
            return new Promise((resolve, reject) => {
                if (localStorage.getItem('refreshToken')) {
                    axios({
                            url: "http://localhost:8000/refresh",
                            data: {
                                refreshToken: localStorage.getItem('refreshToken')
                            },
                            method: "POST"
                        })
                        .then(response => {
                            const token = response.data.token;

                            if (token !== null) {
                                localStorage.setItem('token', token);
                                commit("auth_request", "success")
                                resolve(response)
                            } else {
                                dispatch("logout");
                                this.$router.push('/');
                            }
                        })
                        .catch((err) => {
                            if (err) {
                                if (err.code !== "ERR_CANCELED") {
                                    dispatch("logout")
                                }
                                reject(err);
                            }
                        })
                } else {
                    dispatch("logout");
                }

            })
        },

    },

    namespaced: true,
}