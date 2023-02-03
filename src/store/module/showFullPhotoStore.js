import axios from "axios";

axios
export const showFullPhotoStore = {

    state: () => ({
        isModalFullSize: false,
        indexPhoto: 0,
    }),

    getters: {
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
        async fullSizePhoto({ commit }, body) {
            const bool = body.bool;
            const index = body.elem;

            commit("setIsModalFullSize", bool);
            commit("setIndexPhoto", index);
            document.body.style.overflow = "hidden";
        },

    },

    namespaced: true
}