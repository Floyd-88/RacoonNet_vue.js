export const galleryStore = {
    state: () => ({
        selectedLoadThemaPhoto: "", //выбранная категория фотографии при загрузки
        isShowCat: false, //отображение блока с категориями
        checkedCat: [], //выбранные категории при фильтрации
        arrayFilterPhotos: [], //массив фотографий полсе фильтрации

        isNotCat: false //отображать надпись об отсутствии фотографий по выбранной категории
    }),

    getters: {
        getSelectedLoadThemaPhoto: (state) => state.selectedLoadThemaPhoto,
        getIsShowCat: (state) => state.isShowCat,
        getCheckedCat: (state) => state.checkedCat,
        getArrayFilterPhotos: (state) => state.arrayFilterPhotos,
        getIsNotCat: (state) => state.isNotCat,

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
        },

        setIsNotCat(state, value) {
            state.isNotCat = value;
        },


    },

    actions: {
        async GET_PHOTO_FILTER_THEMA({ state, commit, rootGetters }) {
            commit("setIsNotCat", false);

            let allPhotos = rootGetters["loadPhotoStore/getAllPhotosMyPage"];
            await commit("setArrayFilterPhotos", allPhotos);

            let categoryPhotos = await state.arrayFilterPhotos.filter((photo) => {
                if (state.checkedCat.length > 0) {
                    return state.checkedCat.includes(photo.category);
                } else {
                    return photo
                }
            });
            await commit("setArrayFilterPhotos", categoryPhotos);

            if (categoryPhotos.length === 0) {
                commit("setIsNotCat", true);
            }
        },

        async GET_PHOTO_NOT_FILTER({ commit, rootGetters }) {
            commit("setCheckedCat", []);
            commit("setIsShowCat", false);
            commit("loadPhotoStore/setLimitAllPhotoRemove", null, {
                root: true
            })
            let allPhotos = rootGetters["loadPhotoStore/getAllPhotosMyPage"];
            await commit("setArrayFilterPhotos", allPhotos);

        }
    },

    namespaced: true

}