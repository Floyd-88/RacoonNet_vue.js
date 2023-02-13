import axios from "axios";
// import router from "@/router/router";

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

        avaPhoto: "",

    }),

    getters: {
        getUser: (state, _, rootState) => rootState.authorizationStore.user,
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
        getAvaPhoto: (state) => state.avaPhoto,

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
                state.urlsImages = [];
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
        },

        setAvaPhoto(state, value) {
            state.avaPhoto = value
        },
    },

    actions: {
        //загрузка автарки
        addAvaServer: function({
            getters
        }, img) {
            axios.post(
                    'http://localhost:8000/upload_ava', {
                        img: img,
                        nameAva: getters.getUser.ava,
                        id: getters.getUser.userID

                    }
                ).then(() => {
                    // commit("authorizationStore/setUserAva", res.data.ava, {
                    //     root: true
                    // })
                    // commit("showFullPhotoStore/setShowFullAvaPhoto", false, {
                    //     root: true
                    // });
                    // router.push(`/id${getters.getUser.userID}/info`)
                    // this.$router.push('/')
                    window.location.href = `/id${getters.getUser.userID}/info`;
                })
                .catch((err) => {

                    console.log(err);
                })
        },

        //загрузка картинок на сервер
        addPhotoServer: function({
            getters,
            commit
        }) {
            const formData = new FormData();

            for (let i = 0; i < getters.getArrayLoadImage.length; i++) {
                let file = getters.getArrayLoadImage[i];
                formData.append('files[' + i + ']', file);
            }
            formData.append('id', getters.getUser.userID);
            formData.append('email', getters.getUser.email);

            axios.post(
                    'http://localhost:8000/upload_photo',
                    formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                ).then(() => {
                    commit("setIsModalLoadPhoto", false);
                    // window.location.href = '/';
                })
                .catch((err) => {
                    console.log(err.response.data);
                    // commit("setArrayLoadImage", []);
                    // commit("setUrlsImages", []);
                    commit("setMessageLoadPhoto", err.response.data);
                })
        },

        //удаление картинки на предпросмотре перед загрузкой
        removePreviewImage({
            commit
        }, name) {
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
                        userID: getters.getUser.userID
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
        async removePhoto({
            commit,
            state,
            getters
        }, name) {
            commit("setModulePhotoRemove", false)

            if (state.allPhotos.length <= 1) {
                await commit("showFullPhotoStore/setIsModalFullSize", false, {
                    root: true
                });
                await commit("setIsModalAllPhotos", false);
            }

            try {
                await axios.delete('http://localhost:8000/remove_photo', {
                    params: {
                        id: getters.getIdPhoto,
                        userID: getters.getUser.userID,
                        namePhoto: name,
                    }
                }).then((response) => {
                    commit("removeAllPhotos", getters.getIdPhoto);
                    commit("showFullPhotoStore/setShowFullAvaPhoto", false, {
                        root: true
                    });
                    console.log(response.data)
                });
            } catch (err) {
                console.log(err);
            }
        },

        //удаление аватрки
        async removeAvaPhoto({
            getters,
            commit
        }) {
            try {
                await axios.put('http://localhost:8000/remove_ava_photo', {
                    userID: getters.getUser.userID,
                    email: getters.getUser.email,
                    nameAva: getters.getUser.ava
                }).then((res) => {
                    commit("showFullPhotoStore/setShowFullAvaPhoto", false, {
                        root: true
                    });
                    commit("setModulePhotoRemove", false)
                    localStorage.setItem('user', JSON.stringify(res.data.user));
                    // window.location.href = '/';
                });
            } catch (err) {
                console.log(err);
            }
        }
    },
    namespaced: true
}