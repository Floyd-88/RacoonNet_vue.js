import axios from "axios";
export const removeUserStore = {

    state: () => ({
        moduleDelete: false,
        password: ""
    }),
    getters: {
        getModuleDelete: (state) => state.moduleDelete,
        getPassword: (state) => state.password,
        getUserEmail: (state, _, rootState) => rootState.authorizationStore.user.email,
        getUserID: (state, _, rootState) => rootState.authorizationStore.user.userID,

    },
    mutations: {
        setModuleDelete(state, bool) {
            state.moduleDelete = bool;
        },
        setPassword(state, password) {
            state.password = password;
        }
    },
    actions: {

        removeUser({
            getters,
            dispatch
        }, user) {
            return new Promise((resolve, reject) => {
                let url = "http://localhost:8000/delete_user";

                user.email = getters.getUserEmail;
                user.userID = getters.getUserID;
                axios({
                        url: url,
                        data: user,
                        method: 'DELETE'
                    })
                    .then((resp) => {
                        dispatch('authorizationStore/logout', null, { root: true })
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