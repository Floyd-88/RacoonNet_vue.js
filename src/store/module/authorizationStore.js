import axios from "axios";
import SocketioService from "../../services/socketio.service";

export const authorizationStore = {
    state: () => ({
        status: "",
        token: localStorage.getItem('token') || '', //получаем токен создаваемый при авторизации
        user: {}, //получаем данные юзера при авторизаци
        errorLogin: "", //ошибка возникающая при вводе неверного пароля или почты
        isForgetPassword: true, //показывать ввод логина и пароля или восстановление пароля
        messageEmailPassword: "", //сообщение о восстановлении пароля
        isShowMenu: false, //показывать бургер-меню
    }),

    getters: {
        getToken: (state) => state.token,
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
        auth_success(state, {
            token
        }) {
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

                            window.location.href = `/id${user.userID}`;


                            //записываем токен во все заголовки отправляемые на сервер
                            // axios.defaults.headers.common['Authorization'] = token;

                            // commit('auth_success', {
                            //     // user,
                            //     token
                            // });

                            // вызываем метод для отправки сообщения всем участникам комнаты
                            // SocketioService.setupSocketConnection();
                            // console.log("connected")

                            // SocketioService.subscribeToMessages((err) => {
                            //     if (err) return console.log(err)
                            //         // this.setArrayMessages([...this.getArrayMessages, data])
                            // });


                            // resolve(resp);

                            // window.location.href = `/id${user.userID}`;

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
                axios({
                        url: "http://localhost:8000/del_refresh_token",
                        data: { refreshToken: localStorage.getItem('refreshToken') },
                        method: "POST"
                    }).then(resp => {
                        console.log(resp)
                    })
                    .catch((err) => {
                        console.log(err)
                    })
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
                            commit("auth_request", "success")
                            commit("editProfileStore/setEditingUser", user, {
                                root: true
                            });
                            commit("postsMyPageStore/setPostText", "", { root: true })

                            //при открытии профиля сохраняем информацию об id в комнате
                            SocketioService.sendUserID(id.id, cb => {
                                console.log(cb);
                            });

                            resolve(resp);
                        }
                    })
                    .catch((err) => {
                        // commit('auth_error');
                        // localStorage.removeItem('token');
                        // localStorage.removeItem('user');
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
        UPDATE_TOKEN({ commit }) {

            return new Promise((resolve) => {
                axios({
                        url: "http://localhost:8000/refresh",
                        data: { refreshToken: localStorage.getItem('refreshToken') },
                        method: "POST"
                    })
                    .then(response => {
                        const token = response.data.token;

                        if (token !== null) {
                            localStorage.setItem('token', token);
                            resolve(response)
                        }
                    })
                    .catch((err) => {
                        if (err) {
                            commit('logout');
                            localStorage.removeItem('token');
                            localStorage.removeItem('refreshToken');
                            localStorage.removeItem('user');
                            delete axios.defaults.headers.common['Authorization'];
                            return window.location.href = '/'
                        }
                    })
            })
        },

    },

    namespaced: true,
}