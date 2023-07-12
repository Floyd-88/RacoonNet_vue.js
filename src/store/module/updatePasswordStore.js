import axios from "axios";

export const updatePasswordStore = {

    state: () => ({
        modulePassword: false, //показывать/не показывать окно с изменение пароля
        old_password: "",
        new_password: "",
        new_password_confirmation: "",
        double_new_password: false, //проверка на идентичность нового пароля и new_password_confirmation
        errorPassword: "", //ошибка возникающая при вводе неверного старого пароля
        modalSave: true //информационное окошко после сохранения пароля
    }),

    getters: {
        getModulePassword: (state) => state.modulePassword,
        getNew_password: (state) => state.new_password,
        getNew_password_confirmation: (state) => state.new_password_confirmation,
        getOld_password: (state) => state.old_password,
        getDouble_new_password: (state) => state.double_new_password,
        getUserEmail: (state, _, rootState) => rootState.authorizationStore.user.email,
        getUserID: (state, _, rootState) => rootState.authorizationStore.user.userID,
        getErrorPassword: (state) => state.errorPassword,
        getModalSave: (state) => state.modalSave
    },

    mutations: {
        setOpenChangePassword(state) {
            state.modulePassword = true;
        },
        setCloseChangePassword(state) {
            state.modulePassword = false;
            state.new_password = "",
                state.new_password_confirmation = "",
                state.old_password = "",
                state.double_password = false,
                state.errorPassword = "",
                state.modalSave = true
        },
        setCheckNewPassword(state) {
            state.double_new_password = state.new_password !== state.new_password_confirmation;
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
        setErrorPassword(state, error) {
            state.errorPassword = error
        },

        setModalSave(state, bool) {
            state.modalSave = bool
        }
    },

    actions: {
        //обновление пароля
        updatePasword({
            getters
        }, user) {
            return new Promise((resolve, reject) => {
                let url = "http://localhost:8000/password";

                // user.email = getters.getUserEmail
                user.id = getters.getUserID

                axios({
                        url: url,
                        data: user,
                        method: 'PUT'
                    })
                    .then((resp) => {
                        resolve(resp);
                    })
                    .catch((err) => {
                        reject(err.response.data)
                    })
            })
        },

        //обновление пароля при входе в свой профиль
        UPDATE_PASSWORD_RESTORE(context, pass) {
            return new Promise((resolve, reject) => {
                let url = "http://localhost:8000/update_password_restore";
                axios({
                        url: url,
                        data: pass,
                        method: 'PUT'
                    })
                    .then((resp) => {
                        resolve(resp);
                    })
                    .catch((err) => {
                        reject(err.response.data)
                    })
            })
        }
    },


    namespaced: true
}