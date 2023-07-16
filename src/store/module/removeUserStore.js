import axios from "axios";
export const removeUserStore = {

    state: () => ({
        moduleDelete: false,
        password: ""
    }),
    getters: {
        getModuleDelete: (state) => state.moduleDelete,
        getPassword: (state) => state.password,
        getUser: (state, _, rootState) => rootState.authorizationStore.user,
        allPhoto: (state, _, rootState) => rootState.loadPhotoStore.allPhotos,
        postPhoto: (state, _, rootState) => rootState.postsMyPageStore.photosPostsArray,

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

                user.id = getters.getUser.userID;
                user.allPhoto = [...getters.allPhoto, ...getters.postPhoto];
                user.nameAva = getters.getUser.ava

                axios({
                        url: url,
                        data: user,
                        method: 'DELETE'
                    })
                    .then((resp) => {
                        dispatch('authorizationStore/logout', null, {
                            root: true
                        })
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