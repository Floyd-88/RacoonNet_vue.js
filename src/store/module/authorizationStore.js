import axios from "axios";

export const authorizationStore = {
       state: () => ({
        status: '',
        token: localStorage.getItem('token') || '', //получаем токен создаваемый при авторизации
        user: JSON.parse(localStorage.getItem('user')) || {}, //получаем данные юзера при авторизации
    }),
    getters : {
        isLoggedIn: state => !!state.token, //показываем кнопку выход в header
        // authStatus: state => state.status,
        getUser: state => state.user,
    },
    mutations: {
        auth_request(state){
            state.status = 'loading';
        },
        auth_success(state, {user, token}){
            state.status = 'success';
            state.token = token;
            state.user = user;
        },
        auth_error(state){
            state.status = 'error';
        },
        logout(state){
            state.status = '';
            state.token = '';
        },
    },
    actions: {
        login({commit}, user){
            return new Promise((resolve, reject) => {
                commit('auth_request')
                axios({url: 'http://localhost:8000/login', data: user, method: 'POST' })
                    .then(resp => {
                        const token = resp.data.token;
                        const user = resp.data.user;

                        if(token !== null && user !== null) {
                            localStorage.setItem('token', token);
                            localStorage.setItem('user', JSON.stringify(user));

                            axios.defaults.headers.common['Authorization'] = token //?????????????????

                            commit('auth_success', {user, token});
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

        register({commit}, user){
            return new Promise((resolve, reject) => {
                commit('auth_request')

                let url = "http://localhost:8000/register";
                if (user.is_admin === '1') {
                    url = "http://localhost:8000/register-admin";
                }
                axios({url: url, data: user, method: 'POST' })
                    .then(resp => {
                        const token = resp.data.token;
                        const user = resp.data.user;

                        if(token !== null && user !== null) {
                            localStorage.setItem('token', token);
                            localStorage.setItem('user', JSON.stringify(user));

                            axios.defaults.headers.common['Authorization'] = token; //???????????????????????

                            commit('auth_success', {user, token});
                            resolve(resp);
                        }
                    })
                    .catch(err => {
                        commit('auth_error', err);
                        localStorage.removeItem('token')
                        reject(err.response.data);
                    })
            })
        },

        logout({commit}){
            return new Promise((resolve) => {
                commit('logout');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                delete axios.defaults.headers.common['Authorization'];
                resolve();
            })
        }

    },

    namespaced: true,
}