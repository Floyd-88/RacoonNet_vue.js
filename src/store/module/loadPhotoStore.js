import axios from "axios";

export const loadPhotoStore = {

    state: () => ({
        myPhotosMyPage: [],
        allPhotos: [],
        countPhoto: 0,
        limitPhoto: 0,
        isModalAllPhotos: false,

        isModalLoadPhoto: false,
        messageLoadPhoto: "",
        arrayLoadImage: [],
        urlsImages: [],
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
            if (bool === false) {
                state.limitPhoto = 0;
                state.allPhotos = [];
                document.body.style.overflow = "auto"
            }
        },

        setCountPhoto: function(state) {
            state.countPhoto = state.allPhotos.length;
        },

        setLimitPhoto: function(state) {
            state.limitPhoto = 16;
        },

        setArrayLoadImage(state, value) {
            state.arrayLoadImage = value;
        },

        removeArrayLoadImage(state, name) {
            state.arrayLoadImage = state.arrayLoadImage.filter(elem => elem.name != name);
        },

        setMessageLoadPhoto(state, value) {
            state.messageLoadPhoto = value;
        },

        setUrlsImages(state, value) {
            state.urlsImages.push(value);
        },

        removeUrlsImages(state, name) {
            state.urlsImages = state.urlsImages.filter(elem => elem.name != name);

        },



    },

    actions: {
        //получить последнии фотографии на главное странице
        async loadPhotos({
            getters,
            commit
        }) {
            try {
                await axios.get('http://localhost:8000/upload_photo', {
                    params: {
                        _count: 0,
                        _limit: 8,
                        userID: getters.getUserID
                    }
                }).then((response) => {
                    commit("setMyPhotosMyPage", response.data)
                });
            } catch (err) {
                console.log(err);
            }
        },


        //получить все фотографии в модальном окне
        async loadAllPhotos({
            state,
            getters,
            commit
        }) {
            document.body.style.overflow = "hidden"
            commit("setIsModalAllPhotos", true);
            try {
                await axios.get('http://localhost:8000/upload_photo', {
                    params: {
                        _count: state.countPhoto,
                        _limit: state.limitPhoto,
                        userID: getters.getUserID
                    }
                }).then((response) => {
                    commit("setAllMyPhotosMyPage", [...state.allPhotos, ...response.data]);
                });
            } catch (err) {
                console.log(err);
            }
        },

        //удаление картинки на предпросмотре перед загрузкой
        removePreviewImage({ commit }, name) {
            console.log(1111)

            commit("removeArrayLoadImage", name);
            commit("removeUrlsImages", name);
        },

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
    },



    namespaced: true
}