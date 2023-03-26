import axios from "axios";

axios
export const showFullPhotoStore = {

    state: () => ({
        isModalFullSize: false, //открытие модального окна с фото по клику на фото
        indexPhoto: 0, //ключ массива с фото для слайдера
        isShowFullAvaPhoto: false, //открытие модального окна для редактирования автарки
        isEditAva: "", //загрузка аватарки или ее редактирование
        postID: "" //номер поста в которм есть фотографии
    }),

    getters: {
        getIsModalFullSize: (state) => state.isModalFullSize,
        getIndexPhoto: (state) => state.indexPhoto,
        getAllPhotosMyPage: (state, _, rootState) => rootState.loadPhotoStore.isModalAllPhotos,
        getShowFullAvaPhoto: (state) => state.isShowFullAvaPhoto,
        getEditAva: (state) => state.isEditAva,
        getPostID: (state) => state.postID
    },

    mutations: {
        //открытие-закрытие модального окна
        setIsModalFullSize(state, bool) {
            state.isModalFullSize = bool;
        },

        //получение картинки по которой кликнули
        setIndexPhoto(state, elem) {
            state.indexPhoto = elem;
        },

        //преход на одну картинку вперед
        setNextIndexPhoto(state) {
            state.indexPhoto += 1;
        },

        //преход на одну картинку назад
        setPrevIndexPhoto(state) {
            state.indexPhoto -= 1;
        },

        setShowFullAvaPhoto(state, bool) {
            state.isShowFullAvaPhoto = bool
        },

        setEditAva(state, load) {
            state.isEditAva = load;
        },

        setPostID(state, id) {
            state.postID = id;
        }

    },

    actions: {
        showFullAvaPhoto({ commit }, body) {
            commit("setShowFullAvaPhoto", body.bool);
            commit("setEditAva", body.load)
        },


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

        async FULL_SIZE_PHOTO_POST({ commit }, body) {
            const bool = body.bool;
            const index = body.elem;
            const id = body.id;

            commit("setIsModalFullSize", bool);
            commit("setIndexPhoto", index);
            commit('loadPhotoStore/setPhotoId', id, { root: true });
            commit('setPostID', body.postID);

            document.body.style.overflow = "hidden";
        },

        //закрытие картинки по которой кликнули
        closeModalFullSize({ commit, getters }, bool) {
            commit("setIsModalFullSize", bool);
            commit('setPostID', "");
            if (bool === false && getters.getAllPhotosMyPage === false) {
                document.body.style.overflow = "auto";
            }
        },

    },

    namespaced: true
}