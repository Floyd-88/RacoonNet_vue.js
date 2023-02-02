import axios from "axios";

axios
export const showFullPhotoStore = {

    state: () => ({
        arrayAllPhoto: [],
        isModalFullSize: false,
        indexPhoto: 0,
    }),

    getters: {
        getUserID: (state, _, rootState) => rootState.authorizationStore.user.userID,
        getArrayAllPhoto: (state) => state.arrayAllPhoto,

        getIsModalFullSize: (state) => state.isModalFullSize,
        getIndexPhoto: (state) => state.indexPhoto,

    },

    mutations: {
        //открытие-закрытие модального окна
        setIsModalFullSize(state, bool) {
            state.isModalFullSize = bool;
            if (bool === false) {
                document.body.style.overflow = "auto";
            }
        },

        //получение всех наименований фото юзера
        setArrayAllPhoto(state, value) {
            state.arrayAllPhoto = value;
        },

        //получение картинки по которой кликнули
        setIndexPhoto(state, elem) {
            state.indexPhoto = elem;
        },

        //преход на одну картинку аперед
        setNextIndexPhoto(state) {
            state.indexPhoto += 1;
        },

        //преход на одну картинку назад
        setPrevIndexPhoto(state) {
            state.indexPhoto -= 1;
        }
    },

    actions: {
        //открыте картинки по которой кликнули
        async fullSizePhoto({ getters, commit }, body) {
            const bool = body.bool;
            const index = body.elem;
            try {
                await axios.get('http://localhost:8000/upload_all_photo', {
                    params: {
                        userID: getters.getUserID
                    }
                }).then((response) => {
                    // console.log(response.data)
                    commit("setArrayAllPhoto", response.data)

                    commit("setIsModalFullSize", bool);
                    commit("setIndexPhoto", index);

                    document.body.style.overflow = "hidden";
                });
            } catch (err) {
                console.log(err);
            }
        },


    },




    namespaced: true
}