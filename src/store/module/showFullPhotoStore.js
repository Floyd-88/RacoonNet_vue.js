import axios from "axios";

axios
export const showFullPhotoStore = {

    state: () => ({
        isModalFullSize: false, //открытие модального окна с фото по клику на фото
        indexPhoto: 0, //ключ массива с фото для слайдера
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
        },

    },

    actions: {
        //открыте картинки по которой кликнули
        async fullSizePhoto({ commit }, body) {
            const bool = body.bool;
            const index = body.elem;
            const id = body.id;

            commit("setIsModalFullSize", bool);
            commit("setIndexPhoto", index);
            commit('loadPhotoStore/setPhotoId', id, { root: true });

            document.body.style.overflow = "hidden";
        },

    },

    namespaced: true
}