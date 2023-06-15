import axios from "axios";
import SocketioService from "../../services/socketio.service";
// import router from "@/router/router";
// const controller = new AbortController();
// const signal = controller.signal;

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

        limitAllPhoto: 8, //количество фотографий отображаемых каждый раз при прокрутке вниз

        avaPhoto: "",
        progressLoadPhoto: 0,
        request: null, //прерывание запроса

        likesPhoto: "", //количество лайков фото
        isLoadPhotoPost: "", //загрузка фотографий в пост
        isLoadPhotoMessage: "" //загрузка фотографий в сообщения


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
        getProgressLoadPhoto: (state) => state.progressLoadPhoto,
        getLikesPhoto: (state) => state.likesPhoto,
        getIsLoadPhotoPost: (state) => state.isLoadPhotoPost,
        getIsLoadPhotoMessage: (state) => state.isLoadPhotoMessage,


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
            if (bool === true) {
                document.body.style.overflow = "hidden"

            }
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

        setLimitAllPhotoRemove(state) {
            state.limitAllPhoto = 8;
        },

        setAvaPhoto(state, value) {
            state.avaPhoto = value
        },

        setProgressLoadPhoto(state, value) {
            state.progressLoadPhoto = value;
        },

        setLikesPhoto(state, value) {
            state.likesPhoto = value;
        },

        setIsLoadPhotoPost(state, bool) {
            state.isLoadPhotoPost = bool;
        },

        setIsLoadPhotoMessage(state, bool) {
            state.isLoadPhotoMessage = bool;
        },

        // setRequest(state, body) {
        //     state.request = body;
        // }
    },

    actions: {
        //загрузка автарки
        addAvaServer: function({
            getters,
            commit
        }, img) {
            axios.post(
                    'http://localhost:8000/upload_ava', {
                        img: img,
                        nameAva: getters.getUser.ava,
                        id: getters.getUser.userID

                    }, {
                        onUploadProgress: ProgressEvent => {
                            let progress = Math.round((ProgressEvent.loaded / ProgressEvent.total) * 100) + "%";
                            commit("setProgressLoadPhoto", progress);
                        },
                    }
                ).then((res) => {
                    commit("showFullPhotoStore/setShowFullAvaPhoto", false, {
                        root: true
                    });
                    commit("setIsModalLoadPhoto", false);
                    commit("showFullPhotoStore/setIsModalFullSize", false, {
                        root: true
                    });
                    commit("authorizationStore/setUserAva", res.data.ava, {
                        root: true
                    })
                    commit("setProgressLoadPhoto", 0);
                    // commit("setIsModalLoadPhoto", false);
                    // commit("showFullPhotoStore/setIsModalFullSize", false, {
                    //     root: true
                    // });
                    // commit("showFullPhotoStore/setShowFullAvaPhoto", false, {
                    //     root: true
                    // });
                    // router.push(`/id${getters.getUser.userID}/info`)
                    // this.$router.push('/')
                    // window.location.href = `/id${getters.getUser.userID}`;
                })
                .catch((err) => {
                    console.log(err);
                })
        },

        //загрузка картинок на сервер
        addPhotoServer: async function({
            getters,
            commit,
            state,
            rootGetters,
            dispatch
        }, body) {
            //остановка загрузки картинок
            const axiosSource = axios.CancelToken.source();
            state.request = {
                cancel: axiosSource.cancel
            };

            //сокрытие кнопки загрузить картинки после ее нажатия
            body.event.target.style.opacity = '0'

            const formData = new FormData();

            for (let i = 0; i < getters.getArrayLoadImage.length; i++) {
                let file = getters.getArrayLoadImage[i];
                formData.append('files[' + i + ']', file);
            }
            formData.append('id', body.addresseeID);
            // formData.append('id', JSON.parse(localStorage.getItem('user')).userID);

            //добавляем категорию к фотографии если она есть
            if (rootGetters["galleryStore/getSelectedLoadThemaPhoto"]) {
                formData.append('category', rootGetters["galleryStore/getSelectedLoadThemaPhoto"])
            }

            //проверяем отправлены ли фотографии через пост
            if (state.isLoadPhotoPost) {
                await dispatch("postsMyPageStore/addPost", state.isLoadPhotoPost, { root: true });
                const posts = rootGetters["postsMyPageStore/getPosts"];
                formData.append('postIDLast', posts[0].id);
            } else if (state.isLoadPhotoMessage) {
                await dispatch("messageStore/WRITE_MESSAGE_USER", { addresseeID: body.addresseeID, isPhoto: state.isLoadPhotoMessage }, { root: true });
                const messages = rootGetters["messageStore/getArrayMessages"]
                formData.append('dialogIDLast', messages[messages.length - 1].id)
            }
            return new Promise((resolve, reject) => {
                axios.post(
                        'http://localhost:8000/upload_photo',
                        formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            },

                            cancelToken: axiosSource.token,
                            onUploadProgress: ProgressEvent => {
                                let progress =
                                    Math.round((ProgressEvent.loaded / ProgressEvent.total) * 100) +
                                    "%";
                                commit("setProgressLoadPhoto", progress);
                            },
                        }
                    ).then((resp) => {
                        commit("setIsModalLoadPhoto", false);
                        commit("setProgressLoadPhoto", 0);
                        commit("setIsLoadPhotoPost", false);
                        commit("setIsLoadPhotoMessage", false);

                        resolve(resp.data);
                        // window.location.href = `/id${JSON.parse(getters.getUser.userID)}`;
                    })
                    .catch((err) => {
                        if (axios.isCancel(err)) {
                            console.info("Загрузка фотографий была прервана");
                            return
                        }
                        commit("setIsLoadPhotoPost", false);
                        commit("setIsLoadPhotoMessage", false);
                        commit("setArrayLoadImage", []);
                        commit("setUrlsImages", []);
                        commit("setMessageLoadPhoto", err);

                        reject(err);
                    })
            })
        },

        //остановка загрузки картиновк на сервер
        cancelLoadPhoto({
            state,
            commit
        }) {

            if (state.request) {
                state.request.cancel();
            }
            commit("setIsModalLoadPhoto", false)
            commit("setProgressLoadPhoto", 0)
        },

        //удаление картинки на предпросмотре перед загрузкой
        removePreviewImage({
            commit
        }, name) {
            commit("removeArrayLoadImage", name);
            commit("removeUrlsImages", name);
        },

        //получить все фотографии
        async loadAllPhotos({
            commit,
            // state
        }, id) {
            try {
                await axios.get('http://localhost:8000/upload_all_photo', {
                    params: {
                        id: id,
                    }
                }).then((response) => {
                    commit("setMyPhotosMyPage", response.data);
                    commit("setAllMyPhotosMyPage", response.data);
                    commit("galleryStore/setArrayFilterPhotos", response.data, {
                        root: true
                    });
                });
            } catch (err) {
                if (err.code === "ERR_CANCELED") {
                    console.log("Загрузка была отменена")
                } else {
                    console.log(err)
                }
            }
        },

        //удаление картинки
        async removePhoto({
            commit,
            state,
            getters,
            rootGetters
        }, body) {
            commit("setModulePhotoRemove", false)

            //если все картинки закончились
            if (state.allPhotos.length <= 1) {
                await commit("showFullPhotoStore/setIsModalFullSize", false, {
                    root: true
                });
                await commit("setIsModalAllPhotos", false);
            }

            //если закончились картинки в посте
            if (body.countPhotoPost <= 1 && rootGetters["postsMyPageStore/getPosts"].length > 0) {
                await commit("showFullPhotoStore/setIsModalFullSize", false, {
                    root: true
                });
                await commit("showFullPhotoStore/setPostID", "", { root: true });
                document.body.style.overflow = "auto";
            }

            //если закончились картинки по выбранной теме
            if (rootGetters["galleryStore/getArrayFilterPhotos"].length <= 1) {
                await commit("showFullPhotoStore/setIsModalFullSize", false, {
                    root: true
                });
                document.body.style.overflow = "auto";
            }

            if (!body.photoID) {
                try {
                    await axios.delete('http://localhost:8000/remove_photo', {
                        params: {
                            idPhoto: getters.getIdPhoto,
                            id: getters.getUser.userID,
                            namePhoto: body.name,
                        }
                    }).then(() => {
                        commit("removeAllPhotos", getters.getIdPhoto);
                        commit("postsMyPageStore/removePhotosPostsArray", getters.getIdPhoto, { root: true })
                        commit("showFullPhotoStore/setShowFullAvaPhoto", false, {
                            root: true
                        });
                        commit("galleryStore/removeArrayFilterPhotos", getters.getIdPhoto, {
                            root: true
                        })
                    });
                } catch (err) {
                    console.log(err);
                }
            } else {
                try {
                    await axios.put('http://localhost:8000/remove_photo_post', {
                        idPhoto: getters.getIdPhoto,
                        id: getters.getUser.userID
                    }).then(() => {
                        commit("postsMyPageStore/removePhotosPostsArray", getters.getIdPhoto, { root: true })
                        commit("showFullPhotoStore/setShowFullAvaPhoto", false, {
                            root: true
                        });
                        commit("galleryStore/removeArrayFilterPhotos", getters.getIdPhoto, {
                            root: true
                        });
                    });
                } catch (err) {
                    console.log(err);
                }
            }
        },

        //удаление аватрки
        async removeAvaPhoto({
            getters,
            commit
        }) {
            try {
                await axios.put('http://localhost:8000/remove_ava_photo', {
                    id: getters.getUser.userID,
                    nameAva: getters.getUser.ava
                }).then((res) => {
                    commit("authorizationStore/setUserAva", res.data.user.ava, {
                        root: true
                    });
                    commit("showFullPhotoStore/setShowFullAvaPhoto", false, {
                        root: true
                    });
                    commit("setModulePhotoRemove", false)
                    window.location.href = '/';
                });
            } catch (err) {
                console.log(err);
            }
        },


        //лайкнуть фото
        async SAVE_LIKE_COUNT_PHOTO({ commit, dispatch }, photoID) {
            try {
                photoID.date = await dispatch("postsMyPageStore/newDate", null, { root: true });

                await axios.post('http://localhost:8000/likes_photo', photoID)
                    .then((response) => {
                        commit("setLikesPhoto", response.data)

                        console.log(response.data)
                            //отправляем уведомление адресату без перезагрузки страницы
                        if (response.data.flag) {
                            SocketioService.sendNotice(response.data.likes.userID, cb => {
                                console.log(cb);
                            });
                        }
                    });
            } catch (err) {
                console.error(err);
            }
        },

    },
    namespaced: true
}