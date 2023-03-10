import axios from "axios";

export const commentsPost = {

    state: () => ({
        isShowWriteComment: false, //показывать комментарии с textarea
        commentPost: "", //текст комментария
        underCommentPost: "", //текст комментария под комментарием
        commentsArray: [], //массив комментариев к посту
        commentsCommentArray: [] //массив комментариев к комментариям
    }),

    getters: {
        getIsShowWriteComment: state => state.isShowWriteComment,
        getCommentPost: state => state.commentPost,
        getUnderCommentPost: state => state.underCommentPost,
        getCommentsArray: state => state.commentsArray,
        getCommentsCommentArray: state => state.commentsCommentArray
    },

    mutations: {
        setIsShowWriteComment(state) {
            state.isShowWriteComment = !state.isShowWriteComment;
        },

        setCommentPost(state, text) {
            state.commentPost = text
        },

        setUnderCommentPost(state, text) {
            state.underCommentPost = text
        },

        setCommentsArray(state, value) {
            state.commentsArray = value
        },

        setCommentsCommentArray(state, value) {
            state.commentsCommentArray = value
        },

        //удалить комментарий к коментарию
        setRemoveCommentsComment(state, id) {
            state.commentsCommentArray = state.commentsCommentArray.filter(comment => comment.id !== id);
        },

        //удалить комментарий к посту
        setRemoveCommentsPost(state, id) {
            state.commentsArray = state.commentsArray.filter(comment => comment.id !== id);
        },
    },

    actions: {
        //сохранение комментария к посту в базу данных
        async SAVE_COMMENTS_POST({ dispatch, commit, state }, newCommentsPost) {

            let date = await dispatch("postsMyPageStore/newDate", null, { root: true });
            newCommentsPost.date = await date,

                await axios.post('http://localhost:8000/load_comments_post.js', newCommentsPost)
                .then(function(response) {
                    console.log(response.data);
                    commit("setCommentsArray", [...state.commentsArray, response.data]);

                    // commit("setAddPosts", response.data);
                    // commit("setCountPosts", 1);
                    // commit("setCommentsArray", [...state.commentsArray, state.commentPost]);
                    // commit("setCommentPost", "")
                })
                .catch(function(error) {
                    console.log("Ошибка при написании комментария: " + error);
                });
        },

        //сохранение комментария к комментарию в базу данных
        async SAVE_UNDER_COMMENTS_POST({ dispatch, commit, state }, newCommentsComment) {

            let date = await dispatch("postsMyPageStore/newDate", null, { root: true });
            newCommentsComment.date = await date,

                await axios.post('http://localhost:8000/load_comments_comment.js', newCommentsComment)
                .then(function(response) {
                    console.log(response.data);
                    commit("setCommentsCommentArray", [...state.commentsCommentArray, response.data]);

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
        async LOAD_COMMENTS_POST({
            state,
            commit
        }, id) {
            try {
                await axios.get('http://localhost:8000/load_comments_post.js', {
                    params: {
                        postID: id
                    }
                }).then((response) => {
                    if (response.data.length > 0) {
                        commit("setCommentsArray", [...state.commentsArray, ...response.data]);
                    }
                });
            } catch (err) {
                console.error(err);
            }
        },

        //загрузка комментариев к комментариям из БД
        async LOAD_COMMENTS_COMMENT({
            state,
            commit
        }, id) {
            try {
                await axios.get('http://localhost:8000/load_comments_comment.js', {
                    params: {
                        postID: id
                    }
                }).then((response) => {
                    if (response.data.length > 0) {
                        commit("setCommentsCommentArray", [...state.commentsCommentArray, ...response.data]);
                    }
                });
            } catch (err) {
                console.error(err);
            }
        },

        //удаление комментария к комментарию
        async DELETE_COMMENTS_COMMENT({ commit }, paramsComment) {
            try {
                commit("setRemoveCommentsComment", paramsComment.commentID)
                await axios.delete('http://localhost:8000/load_comments_comment.js', {
                    data: paramsComment
                }).then((response) => {
                    console.log(response.data);
                })
            } catch (err) {
                console.log(err)
            }

        },

        //удаление комментария к посту
        async DELETE_COMMENTS_POST({ commit }, paramsComment) {
            try {
                commit("setRemoveCommentsPost", paramsComment.commentID)
                await axios.delete('http://localhost:8000/load_comments_post.js', {
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