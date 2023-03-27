import axios from "axios";
// import SocketioService from "../../services/socketio.service";

export const authorizationStore = {
    state: () => ({
        status: "",
        token: localStorage.getItem('token') || '', //получаем токен создаваемый при авторизации
        user: {}, //получаем данные юзера при авторизаци
        errorLogin: "", //ошибка возникающая при вводе неверного пароля или почты
    }),

    getters: {
        getToken: (state) => state.token,
        isLoggedIn: (state) => !!state.token, //показываем кнопку выход в header
        getUser: (state) => state.user,
        getErrorLogin: (state) => state.errorLogin,
    },

    mutations: {
        auth_request(state, status) {
            state.status = status;
        },
        auth_success(state, {
            // user,
            token,
        }) {
            state.status = 'success';
            state.token = token;
            // state.user = user;
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
                        const user = resp.data.user;

                        if (token !== null && user !== null) {
                            localStorage.setItem('token', token);
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
                commit('logout');
                localStorage.removeItem('token');
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
                            resolve(resp);
                        }
                    })
                    .catch((err) => {
                        commit('auth_error');
                        // localStorage.removeItem('token');
                        // localStorage.removeItem('user');
                        reject(err);
                    })
            })
        },

    },

    namespaced: true,
}