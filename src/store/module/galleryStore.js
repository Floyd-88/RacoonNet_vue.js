export const galleryStore = {
    state: () => ({
        selectedLoadThemaPhoto: "", //выбранная категория фотографии при загрузки
        isShowCat: false, //отображение блока с категориями
        checkedCat: [], //выбранные категории при фильтрации
    }),

    getters: {
        getSelectedLoadThemaPhoto: (state) => state.selectedLoadThemaPhoto,
        getIsShowCat: (state) => state.isShowCat,
        getCheckedCat: (state) => state.checkedCat,
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
        }
    },

    actions: {

    },

    namespaced: true

}