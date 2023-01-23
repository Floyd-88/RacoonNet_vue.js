import axios from "axios";

export const authorizationStore = {
    state: () => ({
        status: '',
        token: localStorage.getItem('token') || '', //получаем токен создаваемый при авторизации
        user: JSON.parse(localStorage.getItem('user')) || {}, //получаем данные юзера при авторизаци
        editingUser: JSON.parse(localStorage.getItem('user')) || {},
    }),
    getters: {
        isLoggedIn: state => !!state.token, //показываем кнопку выход в header

        getUser: (state) => state.user,
        getEditingUser: (state) => state.editingUser,

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
        auth_success(state, {user, token}) {
            state.status = 'success';
            state.token = token;
            state.user = user;
        },
        setEditingUser(state, user){
            state.editingUser.name = user.name
            state.editingUser.surname = user.surname
            state.editingUser.country = user.country
            state.editingUser.email = user.email
            state.editingUser.city = user.city
            state.editingUser.year_user = user.year_user
            state.editingUser.month_user = user.month_user
            state.editingUser.day_user = user.day_user
            state.editingUser.selectedGender = user.selectedGender
        },
        auth_error(state) {
            state.status = 'error';
        },
        logout(state) {
            state.status = '';
            state.token = '';
        },

        setUser(state) {
            if(state.editingUser.name) state.user.name = state.editingUser.name;
            if(state.editingUser.surname) state.user.surname = state.editingUser.surname;
            if(state.editingUser.country) state.user.country = state.editingUser.country;
            if(state.editingUser.email) state.user.email = state.editingUser.email;
            if(state.editingUser.city) state.user.city = state.editingUser.city;
            if(state.editingUser.year_user) state.user.year_user = state.editingUser.year_user;
            if(state.editingUser.month_user) state.user.month_user = state.editingUser.month_user;
            if(state.editingUser.day_user) state.user.day_user = state.editingUser.day_user;
            if(state.editingUser.selectedGender) state.user.selectedGender = state.editingUser.selectedGender;
        },
        // setUserUpdate(state, user) {
        //   state.user.
        // },

        // редактирование профиля пользователя
        setName(state, name) {
            state.editingUser.name = name;
        },
        setSurname(state, surname) {
            state.editingUser.surname = surname;
        },
        setCountry(state, country) {
            state.editingUser.country = country;
        },
        setEmail(state, email) {
            state.editingUser.email = email;
        },
        setCity(state, city) {
            state.editingUser.city = city;
        },
        setYear(state, year) {
            state.editingUser.year_user = year;
        },
        setMonth(state, month) {
            state.editingUser.month_user = month;
        },
        setDay(state, day) {
            state.editingUser.day_user = day;
        },
        setGender(state, gender) {
            state.editingUser.selectedGender = gender;
        },
    },
    actions: {
        login({commit}, user) {
            return new Promise((resolve, reject) => {
                commit('auth_request')
                axios({url: 'http://localhost:8000/login', data: user, method: 'POST'})
                    .then(resp => {
                        const token = resp.data.token;
                        const user = resp.data.user;

                        if (token !== null && user !== null) {
                            localStorage.setItem('token', token);
                            localStorage.setItem('user', JSON.stringify(user));

                            axios.defaults.headers.common['Authorization'] = token //?????????????????

                            commit('auth_success', {user, token});
                            commit('setEditingUser', user);
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

        register({commit}, user) {
            return new Promise((resolve, reject) => {
                commit('auth_request')

                let url = "http://localhost:8000/register";
                if (user.is_admin === '1') {
                    url = "http://localhost:8000/register-admin";
                }
                axios({url: url, data: user, method: 'POST'})
                    .then(resp => {
                        const token = resp.data.token;
                        const user = resp.data.user;

                        if (token !== null && user !== null) {
                            localStorage.setItem('token', token);
                            localStorage.setItem('user', JSON.stringify(user));

                            axios.defaults.headers.common['Authorization'] = token; //???????????????????????

                            commit('auth_success', {user, token});
                            commit('setEditingUser', user);
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

        logout({commit}) {
            return new Promise((resolve) => {
                commit('logout');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                delete axios.defaults.headers.common['Authorization'];
                resolve();
            })
        },

        updateProfile({commit, state}, user) {
            return new Promise((resolve, reject) => {
                commit('auth_request')

                let url = "http://localhost:8000/register";
                user.id = state.user.userID;

                axios({url: url, data: user, method: 'PUT'})
                    .then(resp => {
                        // const token = resp.data.token;
                        const user = resp.data.user;

                        if (user !== null) {
                            // localStorage.setItem('token', token);
                            localStorage.setItem('user', JSON.stringify(user));

                            // axios.defaults.headers.common['Authorization'] = token; //???????????????????????

                            // commit('auth_success', {user});
                            // commit('setEditingUser', user);
                            resolve(resp);
                            window.location.href = '/'
                        }
                    })
                    .catch(err => {
                        commit('auth_error', err);
                        // localStorage.removeItem('token')
                        reject(err.response.data);
                    })
            })
        }


    },

    namespaced: true,
}