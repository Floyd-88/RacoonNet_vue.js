export const galleryStore = {
    state: () => ({
        selectedLoadThemaPhoto: "", //выбранная категория фотографии при загрузки
        isShowCat: false, //отображение блока с категориями
        checkedCat: [], //выбранные категории при фильтрации
        arrayFilterPhotos: [], //массив фотографий полсе фильтрации
    }),

    getters: {
        getSelectedLoadThemaPhoto: (state) => state.selectedLoadThemaPhoto,
        getIsShowCat: (state) => state.isShowCat,
        getCheckedCat: (state) => state.checkedCat,
        getArrayFilterPhotos: (state) => state.arrayFilterPhotos,
    },

    mutations: {
        setSelectedLoadThemaPhoto(state, cat) {
            state.selectedLoadThemaPhoto = cat;
        },

        setIsShowCat(state) {
            state.isShowCat = !state.isShowCat;
        },

        setCheckedCat(state, value) {
            state.checkedCat = value
        },

        setArrayFilterPhotos(state, value) {
            state.arrayFilterPhotos = value;
        },
        removeArrayFilterPhotos(state, id) {
            state.arrayFilterPhotos = state.arrayFilterPhotos.filter(photo => photo.id !== id);
        }


    },

    actions: {
        async GET_PHOTO_FILTER_THEMA({ state, commit, rootGetters }) {
            let allPhotos = rootGetters["loadPhotoStore/getAllPhotosMyPage"];
            await commit("setArrayFilterPhotos", allPhotos);

            let categoryPhotos = await state.arrayFilterPhotos.filter((photo) => {
                if (state.checkedCat.length > 0) {
                    return state.checkedCat.includes(photo.category)
                } else {
                    return photo
                }
            });
            await commit("setArrayFilterPhotos", categoryPhotos);
        },

        async GET_PHOTO_NOT_FILTER({ commit, rootGetters }) {
            commit("setCheckedCat", []);
            let allPhotos = rootGetters["loadPhotoStore/getAllPhotosMyPage"];
            await commit("setArrayFilterPhotos", allPhotos);

        }
    },

    namespaced: true

}