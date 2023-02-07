import axios from "axios";

axios
export const showFullPhotoStore = {

    state: () => ({
        isModalFullSize: false, //открытие модального окна с фото по клику на фото
        indexPhoto: 0, //ключ массива с фото для слайдера
        isShowFullAvaPhoto: false //открытие модального окна для редактирования автарки
    }),

    getters: {
        getIsModalFullSize: (state) => state.isModalFullSize,
        getIndexPhoto: (state) => state.indexPhoto,
        getAllPhotosMyPage: (state, _, rootState) => rootState.loadPhotoStore.isModalAllPhotos,
        getShowFullAvaPhoto: (state) => state.isShowFullAvaPhoto
    },

    mutations: {
        //открытие-закрытие модального окна
        setIsModalFullSize(state, bool) {
            state.isModalFullSize = bool;
            // if (bool === false) {
            //     document.body.style.overflow = "auto";
            // }
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

        setShowFullAvaPhoto(state, bool) {
            state.isShowFullAvaPhoto = bool
        }

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

        //закрытие картинки по которой кликнули
        closeModalFullSize({ commit, getters }, bool) {
            commit("setIsModalFullSize", bool);
            if (bool === false && getters.getAllPhotosMyPage === false) {
                document.body.style.overflow = "auto";
            }
        },

    },



    namespaced: true
}