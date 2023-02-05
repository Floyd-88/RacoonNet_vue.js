import axios from "axios";

export const authorizationStore = {
    state: () => ({
        email: '',
        password: '',
        status: '',
        token: localStorage.getItem('token') || '', //получаем токен создаваемый при авторизации
        user: JSON.parse(localStorage.getItem('user')) || {}, //получаем данные юзера при авторизаци
        errorLogin: "", //ошибка возникающая при вводе неверного пароля или почты
    }),

    getters: {
        getEmail: (state) => state.email,
        getPassword: (state) => state.password,

        isLoggedIn: (state) => !!state.token, //показываем кнопку выход в header

        getUser: (state) => state.user,

        getErrorLogin: (state) => state.errorLogin,

        //вычисляет возраст пользователя
        age: (state) => {
            const today = new Date();
            const birthday = state.user.year_user + "-" + state.user.month_user + "-" + state.user.day_user;
            const birthDate = new Date(birthday);
            const age = today.getFullYear() - birthDate.getFullYear();
            if (
                today.getMonth() < birthDate.getMonth() || (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())
            ) {
                return age - 1;
            }
            return age;
        },
    },

    mutations: {
        auth_request(state) {
            state.status = 'loading';
        },
        auth_success(state, { user, token }) {
            state.status = 'success';
            state.token = token;
            state.user = user;
        },
        auth_error(state) {
            state.status = 'error';
        },

        //при выходе обнуляем
        logout(state) {
            state.status = '';
            state.token = '';
        },

        setErrorLogin(state, error) {
            state.errorLogin = error
        },

        //двухстороннее связывание
        setEmail(state, email) {
            state.email = email;
        },
        setPassword(state, password) {
            state.password = password;
        }

    },

    actions: {
        //авторизация зарегистрированого юзера
        login({ commit }, user) {
            return new Promise((resolve, reject) => {
                commit('auth_request')
                axios({ url: 'http://localhost:8000/login', data: user, method: 'POST' })
                    .then(resp => {
                        const token = resp.data.token;
                        const user = resp.data.user;

                        if (token !== null && user !== null) {
                            localStorage.setItem('token', token);
                            localStorage.setItem('user', JSON.stringify(user));

                            axios.defaults.headers.common['Authorization'] = token //?????????????????

                            // commit('auth_success', { user, token });
                            // commit('editProfileStore/setEditingUser', user, { root: true });
                            resolve(resp);
                        }
                    })
                    .catch((err) => {
                        commit('auth_error');
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        reject(err.response.data);
                    })
            })
        },

        //выход из профиля
        logout({ commit }) {
            return new Promise((resolve) => {
                commit('logout');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                delete axios.defaults.headers.common['Authorization'];
                resolve();
            })
        },

    },

    namespaced: true,
}