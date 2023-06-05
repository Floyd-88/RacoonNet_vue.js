import axios from "axios";
import SocketioService from "../../services/socketio.service";

export const commentsPhoto = {

    state: () => ({
        // isShowWriteComment: false, //показывать комментарии с textarea
        commentPhoto: "", //текст комментария
        commentsPhotoArray: [], //массив комментариев к фотографии
        isFocusComment: false, //если фокус не сделан на поле ввода комментария 
        usersLikesPhoto: [], //пользователи лайкнувшие фото
        showModalBlockUsersLikesPhoto: false //показывать блок с пользователями лайкнувшими фото 
    }),

    getters: {
        // getIsShowWriteComment: state => state.isShowWriteComment,
        getCommentPhoto: state => state.commentPost,
        getCommentsPhotoArray: state => state.commentsPhotoArray,
        getIsFocusComment: state => state.isFocusComment,
        getUsersLikesPhoto: state => state.usersLikesPhoto,
        getShowModalBlockUsersLikesPhoto: state => state.showModalBlockUsersLikesPhoto
    },

    mutations: {
        // setIsShowWriteComment(state) {
        //     state.isShowWriteComment = !state.isShowWriteComment;
        // },

        setCommentPhoto(state, text) {
            state.commentPhoto = text
        },

        setCommentsPhotoArray(state, value) {
            state.commentsPhotoArray = value
        },

        //удалить комментарий к посту
        setRemoveCommentsPhoto(state, id) {
            state.commentsPhotoArray = state.commentsPhotoArray.filter(comment => comment.id !== id);
        },

        setIsFocusComment(state, value) {
            state.isFocusComment = value
        },

        setUsersLikesPhoto(state, value) {
            state.usersLikesPhoto = value
        },

        setShowModalBlockUsersLikesPhoto(state, bool) {
            state.showModalBlockUsersLikesPhoto = bool
        }
    },

    actions: {
        //сохранение комментария к фотографии в базу данных
        async SAVE_COMMENTS_PHOTO({ dispatch, commit, state }, newCommentsPhoto) {

            let date = await dispatch("postsMyPageStore/newDate", null, { root: true });
            newCommentsPhoto.date = await date,

                await axios.post('http://localhost:8000/load_comments_photo.js', newCommentsPhoto)
                .then(function(response) {
                    commit("setCommentsPhotoArray", [...state.commentsPhotoArray, response.data]);

                    // commit("setAddPosts", response.data);
                    // commit("setCountPosts", 1);
                    // commit("setCommentsArray", [...state.commentsArray, state.commentPost]);
                    // commit("setCommentPost", "")

                    console.log(response.data)
                    console.log(newCommentsPhoto)
                        //отправляем уведомление адресату без перезагрузки страницы
                    SocketioService.sendNotice(response.data.userID, cb => {
                        console.log(cb);
                    });
                })
                .catch(function(error) {
                    console.log("Ошибка при написании комментария: " + error);
                });
        },

        //загрузка комментариев из БД
        async LOAD_COMMENTS_PHOTO({
            state,
            commit
        }, id) {
            try {
                // console.log(id)
                await axios.get('http://localhost:8000/load_comments_photo.js', {
                    params: {
                        photoID: id
                    }
                }).then((response) => {
                    if (response.data.length > 0) {
                        commit("setCommentsPhotoArray", [...state.commentsPhotoArray, ...response.data]);
                    }
                });
            } catch (err) {
                if (err.code === "ERR_CANCELED") {
                    console.log("Загрузка была отменена")
                } else {
                    console.log(err)
                }
            }
        },

        //удаление комментария к посту
        async DELETE_COMMENTS_PHOTO({ commit }, paramsComment) {
            try {

                commit("setRemoveCommentsPhoto", paramsComment.commentID)
                await axios.delete('http://localhost:8000/load_comments_photo.js', {
                    data: paramsComment
                }).then((response) => {
                    console.log(response.data);
                })
            } catch (err) {
                console.log(err)
            }
        },

        async GET_USER_LIKES_PHOTO({ commit }, photo) {
            try {
                let photo_id = photo.id;
                if (photo.photoID) {
                    photo_id = photo.photoID;
                }
                await axios.get('http://localhost:8000/get_users_likes_photo', {
                    params: {
                        photoID: photo_id
                    }
                }).then((response) => {
                    commit("setUsersLikesPhoto", response.data)
                })
            } catch (err) {
                console.log(err)
            }
        }
    },

    namespaced: true,
}