// import Vue from "vue"
// import Vuex from 'vuex'
import {createStore} from "vuex";
import axios from 'axios';

// Vue.use(Vuex);

export default createStore({
    state: {
        status: '',
        token: localStorage.getItem('token') || '',
        user : {}
    },

    getters : {
        isLoggedIn: state => !!state.token,
        authStatus: state => state.status,
    },
    mutations: {
        auth_request(state){
            state.status = 'loading';
        },
        auth_success(state, token, user){
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
                        const token = "resp.data.token";
                        const user = JSON.stringify(resp.data.user);

                            if(token !== null && user !== null) {
                                localStorage.setItem('token', token);
                                localStorage.setItem('user', user);

                                axios.defaults.headers.common['Authorization'] = token //?????????????????

                                commit('auth_success', token, user);
                                resolve(resp);
                            }
                    })
                    .catch(err => {
                        commit('auth_error');
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        reject(err);
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

                            commit('auth_success', token, user);
                            resolve(resp);
                        }
                    })
                    .catch(err => {
                        commit('auth_error', err);
                        localStorage.removeItem('token')
                        reject(err);
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

    }
})