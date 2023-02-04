import axios from "axios";

export const loadPhotoStore = {

    state: () => ({
        myPhotosMyPage: [], //фото которые показаны при загрузки страницы
        allPhotos: [], //все фото юзера
        isModalAllPhotos: false, //показывать-скрывать модальное окно со всеми фото
        isModalLoadPhoto: false, //показывать-скрывать модальное окно с загрузкой фото
        messageLoadPhoto: "", //сообщение возникающее при ошибки загрузки фото
        arrayLoadImage: [], //фотографии выбранные в окне загрузки
        urlsImages: [], //массив с исходными кодами картинок для их отображения в превью блоке

        idPhoto: "", //id фото из базы данных

        isModulePhotoRemove: false, //показывать-скрывать модальное окно с подтвержением удаления фото

        limitAllPhoto: 8, //количествофотографий отображаемых каждый раз при прокрутке вниз

    }),

    getters: {
        getUserID: (state, _, rootState) => rootState.authorizationStore.user.userID,
        getMyPhotosMyPage: (state) => state.myPhotosMyPage,
        getAllPhotosMyPage: (state) => state.allPhotos,
        getIsModalAllPhotos: (state) => state.isModalAllPhotos,
        getIsModalLoadPhoto: (state) => state.isModalLoadPhoto,
        getMessageLoadPhoto: (state) => state.messageLoadPhoto,
        getArrayLoadImage: (state) => state.arrayLoadImage,
        getUrlsImages: (state) => state.urlsImages,
        getIdPhoto: (state) => state.idPhoto,
        getModulePhotoRemove: (state) => state.isModulePhotoRemove,
        getLimitAllPhoto: (state) => state.limitAllPhoto,
    },

    mutations: {
        setMyPhotosMyPage(state, value) {
            state.myPhotosMyPage = value
        },

        setAllMyPhotosMyPage(state, value) {
            state.allPhotos = value
        },

        setIsModalLoadPhoto: function(state, bool) {
            state.isModalLoadPhoto = bool;
            document.body.style.overflow = "hidden"

            if (bool === false) {
                state.messageLoadPhoto = "";
                document.body.style.overflow = "auto"
            }
        },

        setIsModalAllPhotos: function(state, bool) {
            state.isModalAllPhotos = bool;
            document.body.style.overflow = "hidden"

            if (bool === false) {
                state.limitAllPhoto = 8;
                document.body.style.overflow = "auto"
            }
        },

        setArrayLoadImage(state, value) {
            state.arrayLoadImage = value;
        },

        removeArrayLoadImage(state, name) {
            state.arrayLoadImage = state.arrayLoadImage.filter(elem => elem.name != name);
        },

        setUrlsImages(state, value) {
            state.urlsImages.push(value);
        },

        removeUrlsImages(state, name) {
            state.urlsImages = state.urlsImages.filter(elem => elem.name != name);

        },

        setMessageLoadPhoto(state, value) {
            state.messageLoadPhoto = value;
        },

        //удаление картинки из массива
        removeAllPhotos(state, id) {
            state.allPhotos = state.allPhotos.filter(photo => photo.id !== id);
            state.myPhotosMyPage = state.myPhotosMyPage.filter(photo => photo.id !== id);
        },

        setPhotoId(state, id) {
            state.idPhoto = id;
        },

        setModulePhotoRemove(state, bool) {
            state.isModulePhotoRemove = bool;
        },

        setLimitAllPhoto(state, count) {
            state.limitAllPhoto += count
        }
    },

    actions: {
        //загрузка картинок на сервер
        addPhotoServer: function({ getters, commit }) {
            const formData = new FormData();

            for (let i = 0; i < getters.getArrayLoadImage.length; i++) {
                let file = getters.getArrayLoadImage[i];
                formData.append('files[' + i + ']', file);
            }
            formData.append('id', getters.getUserID);

            axios.post(
                    'http://localhost:8000/upload_photo',
                    formData, { headers: { 'Content-Type': 'multipart/form-data' } }
                ).then((res) => {
                    console.log(res.data);
                    commit("setArrayLoadImage", []);
                    commit("setUrlsImages", []);
                    commit("setIsModalLoadPhoto", false);
                    window.location.href = '/';
                })
                .catch((err) => {
                    console.log(err.response.data);
                    commit("setArrayLoadImage", []);
                    commit("setUrlsImages", []);
                    commit("setMessageLoadPhoto", err.response.data);
                })
        },

        //удаление картинки на предпросмотре перед загрузкой
        removePreviewImage({ commit }, name) {
            commit("removeArrayLoadImage", name);
            commit("removeUrlsImages", name);
        },

        //получить все фотографии в модальном окне
        async loadAllPhotos({
            getters,
            commit
        }) {
            try {
                await axios.get('http://localhost:8000/upload_all_photo', {
                    params: {
                        userID: getters.getUserID
                    }
                }).then((response) => {
                    commit("setMyPhotosMyPage", response.data);
                    commit("setAllMyPhotosMyPage", response.data);
                });
            } catch (err) {
                console.log(err);
            }
        },

        //удаление картинки
        async removePhoto({ commit, state, getters }, name) {
            commit("setModulePhotoRemove", false)

            if (state.allPhotos.length <= 1) {
                await commit("showFullPhotoStore/setIsModalFullSize", false, { root: true });
                await commit("setIsModalAllPhotos", false);
            }

            try {
                await axios.delete('http://localhost:8000/remove_photo', {
                    params: {
                        id: getters.getIdPhoto,
                        userID: getters.getUserID,
                        namePhoto: name,
                    }
                }).then((response) => {
                    commit("removeAllPhotos", getters.getIdPhoto);
                    console.log(response.data)
                });
            } catch (err) {
                console.log(err);
            }
        }
    },
    namespaced: true
}