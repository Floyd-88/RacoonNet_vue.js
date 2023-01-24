import axios from "axios"

export const editProfileStore = {

    state: () => ({
        showPassword: false,
        new_password: "",
        new_password_confirmation: "",
        old_password: "",
        double_password: false,
    }),
    getters: {

        getShowPassword(state) {
            return state.showPassword
        },
        getNew_password(state) {
            return state.new_password
        },
        getNew_password_confirmation(state) {
            return state.new_password_confirmation
        },
        getOld_password(state) {
            return state.old_password
        },
        getDouble_password(state) {
            return state.double_password
        },

        getUserEmail(state, _, rootState) {
            return rootState.authorizationStore.user.email;
        },
        getUserID(state, _, rootState) {
            return rootState.authorizationStore.user.userID;
        },
    },

    mutations: {
        setOpenChangePassword(state) {
            state.showPassword = true;
        },
        setCloseChangePassword(state) {
            state.showPassword = false;
            state.new_password = "",
                state.new_password_confirmation = "",
                state.old_password = "",
                state.double_password = false
        },
        setCheckPassword(state) {
            state.double_password = state.new_password !== state.new_password_confirmation;

        },
        setOld_password(state, password) {
            state.old_password = password
        },
        setNew_password(state, password) {
            state.new_password = password
        },
        setNew_password_confirmation(state, password) {
            state.new_password_confirmation = password
        },
    },

    actions: {
        //редактирование профиля
        updateProfile({ getters }, user) {
            return new Promise((resolve, reject) => {

                let url = "http://localhost:8000/register";
                user.id = getters.getUserID;

                axios({ url: url, data: user, method: 'PUT' })
                    .then(resp => {
                        const user = resp.data.user;
                        if (user !== null) {
                            localStorage.setItem('user', JSON.stringify(user));
                            window.location.href = '/';
                        }
                    })
                    .catch(err => {
                        // commit('auth_error', err);
                        reject(err.response.data);
                    })
            })
        },

        //обновление пароля
        updatePasword({ getters }, user) {
            return new Promise((resolve, reject) => {
                let url = "http://localhost:8000/password";

                user.email = getters.getUserEmail
                user.userID = getters.getUserID

                axios({ url: url, data: user, method: 'PUT' })
                    .then((resp) => {
                        console.log(resp);
                        resolve(resp);
                    })
                    .catch((err) => {
                        reject(err.response.data)
                    })
            })
        },

    },



    namespaced: true,
}