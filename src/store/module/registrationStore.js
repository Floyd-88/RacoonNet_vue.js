import axios from "axios";

export const registrationStore = {
    state: () => ({
        userRegister: {
            name: "",
            surname: "",
            email: "",
            password: "",
            password_confirmation: "",
            country: "",
            city: "",
            is_admin: null,
            selectedDay: "",
            selectedMonth: "",
            selectedYear: "",
            selectedGender: "",
        },
        double_email: false,
        double_password: false, //проверка на идентичность нового пароля и new_password_confirmation
        arrMonth: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],

    }),

    getters: {
        getUserRegister: (state) => state.userRegister,
        getDouble_email: (state) => state.double_email,
        getDouble_password: (state) => state.double_password,
        getArrMonth: (state) => state.arrMonth,

        //в поле option доступны года от 1900 до текущего
        years() {
            const year = new Date().getFullYear()
            return Array.from({ length: year - 1900 }, (value, index) => year - index)
        },
    },

    mutations: {
        //проверка задублирование эл. почты
        setDouble_email(state, bool) {
            state.double_email = bool
        },
        //проверка на совпадения пароля и проверочного пароля
        setCheckPassword(state) {
            state.double_password = state.userRegister.password !== state.userRegister.password_confirmation;
        },


        //двухсторонне связывание
        setUserRegisterName(state, name) {
            state.userRegister.name = name;
        },
        setUserRegisterSurname(state, surname) {
            state.userRegister.surname = surname;
        },
        setUserRegisterCountry(state, country) {
            state.userRegister.country = country;
        },
        setUserRegisterEmail(state, email) {
            state.userRegister.email = email;
        },
        setUserRegisterPassword(state, password) {
            state.userRegister.password = password;
        },
        setUserRegisterPasswordConfirmation(state, password_confirmation) {
            state.userRegister.password_confirmation = password_confirmation;
        },
        setUserRegisterCity(state, city) {
            state.userRegister.city = city;
        },
        setUserRegisterYear(state, year) {
            state.userRegister.selectedYear = year;
        },
        setUserRegisterMonth(state, month) {
            state.userRegister.selectedMonth = month;
        },
        setUserRegisterDay(state, day) {
            state.userRegister.selectedDay = day;
        },
        setUserRegisterGender(state, gender) {
            state.userRegister.selectedGender = gender;
        },

    },

    actions: {
        //регистрация нового юзера
        register({ commit }, user) {
            return new Promise((resolve, reject) => {
                commit('authorizationStore/auth_request', null, { root: true });

                let url = "http://localhost:8000/register";
                if (user.is_admin === '1') {
                    url = "http://localhost:8000/register-admin";
                }
                axios({ url: url, data: user, method: 'POST' })
                    .then(resp => {
                        const token = resp.data.token;
                        const user = resp.data.user;

                        if (token !== null && user !== null) {
                            localStorage.setItem('token', token);
                            localStorage.setItem('user', JSON.stringify(user));

                            axios.defaults.headers.common['Authorization'] = token; //???????????????????????

                            commit('authorizationStore/auth_success', { user, token }, { root: true });
                            commit('editProfileStore/setEditingUser', user, { root: true });
                            resolve(resp);
                        }
                    })
                    .catch(err => {
                        commit('editProfileStore/auth_error', err, { root: true });
                        localStorage.removeItem('token')
                        reject(err.response.data);
                    })
            })
        },

    },

    namespaced: true,
}