import axios from "axios";

export const commentsPhoto = {

    state: () => ({
        // isShowWriteComment: false, //показывать комментарии с textarea
        commentPhoto: "", //текст комментария
        commentsPhotoArray: [], //массив комментариев к фотографии
    }),

    getters: {
        // getIsShowWriteComment: state => state.isShowWriteComment,
        getCommentPhoto: state => state.commentPost,
        getCommentsPhotoArray: state => state.commentsPhotoArray,
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
    },

    actions: {
        //сохранение комментария к посту в базу данных
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
                console.error(err);
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
        }
    },

    namespaced: true,
}