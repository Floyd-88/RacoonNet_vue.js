import axios from "axios";

export const loadPhotoStore = {

    state: () => ({
        myPhotosMyPage: [],
        allPhotos: [],
        countPhoto: 0,
        limitPhoto: 0,

        isModalLoadPhoto: false,
        isModalAllPhotos: false,
    }),

    getters: {
        getUserID: (state, _, rootState) => rootState.authorizationStore.user.userID,
        getMyPhotosMyPage: (state) => state.myPhotosMyPage,

        getAllPhotosMyPage: (state) => state.allPhotos,


        getIsModalLoadPhoto: (state) => state.isModalLoadPhoto,
        getIsModalAllPhotos: (state) => state.isModalAllPhotos,


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
        },

        setIsModalAllPhotos: function(state, bool) {
            state.isModalAllPhotos = bool;
            if (bool === false) {
                state.limitPhoto = 0;
                state.allPhotos = [];
            }
        },

        setCountPhoto: function(state) {
            state.countPhoto = state.allPhotos.length;
        },

        setLimitPhoto: function(state) {
            state.limitPhoto = 16;
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
    },

    namespaced: true
}