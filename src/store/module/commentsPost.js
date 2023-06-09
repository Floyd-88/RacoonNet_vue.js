import axios from "axios";
import SocketioService from "../../services/socketio.service";

export const commentsPost = {

    state: () => ({
        isShowWriteComment: true, //показывать комментарии с textarea
        commentPost: "", //текст комментария
        underCommentPost: "", //текст комментария под комментарием
        commentsArray: [], //массив комментариев к посту
        commentsCommentArray: [], //массив комментариев к комментариям
        usersLikesPost: [], //пользователи лайкнувшие пост
        showModalBlockUsersLikesPost: false, //показывать блок с пользователями лайкнувшими пост

        // commentText: "",
        // underCommentText: "",
    }),

    getters: {
        getIsShowWriteComment: state => state.isShowWriteComment,
        getCommentPost: state => state.commentPost,
        getUnderCommentPost: state => state.underCommentPost,
        getCommentsArray: state => state.commentsArray,
        getCommentsCommentArray: state => state.commentsCommentArray,
        getUsersLikesPost: state => state.usersLikesPost,
        getShowModalBlockUsersLikesPost: state => state.showModalBlockUsersLikesPost,

        // getUnderCommentText: state => state.underCommentText
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

        setUsersLikesPost(state, value) {
            state.usersLikesPost = value
        },

        setShowModalBlockUsersLikesPost(state, bool) {
            state.showModalBlockUsersLikesPost = bool
        },

        // setUnderCommentText(state, text) {
        //     state.underCommentText = text;
        // }
    },

    actions: {
        //сохранение комментария к посту в базу данных
        async SAVE_COMMENTS_POST({
            dispatch,
            commit,
            state
        }, newCommentsPost) {

            let date = await dispatch("postsMyPageStore/newDate", null, {
                root: true
            });
            newCommentsPost.date = await date,

                await axios.post('http://localhost:8000/load_comments_post.js', newCommentsPost)
                .then(function(response) {
                    commit("setCommentsArray", [response.data, ...state.commentsArray]);

                    // commit("setAddPosts", response.data);
                    // commit("setCountPosts", 1);
                    // commit("setCommentsArray", [...state.commentsArray, state.commentPost]);
                    // commit("setCommentPost", "")

                    //отправляем уведомление адресату без перезагрузки страницы
                    SocketioService.sendNotice(response.data.authorPost, cb => {
                        console.log(cb);
                    });
                })
                .catch(function(error) {
                    console.log("Ошибка при написании комментария: " + error);
                });
        },

        //сохранение комментария к комментарию в базу данных
        async SAVE_UNDER_COMMENTS_POST({
            dispatch,
            commit,
            state
        }, newCommentsComment) {

            let date = await dispatch("postsMyPageStore/newDate", null, {
                root: true
            });
            newCommentsComment.date = await date,


                await axios.post('http://localhost:8000/load_comments_comment.js', newCommentsComment)
                .then(function(response) {
                    // console.log(response.data);
                    commit("setCommentsCommentArray", [response.data, ...state.commentsCommentArray]);

                    // commit("setAddPosts", response.data);
                    // commit("setCountPosts", 1);
                    // commit("setCommentsArray", [...state.commentsArray, state.commentPost]);
                    // commit("setCommentPost", "")

                    //отправляем уведомление адресату без перезагрузки страницы
                    SocketioService.sendNotice(newCommentsComment.author_comment_comment || response.data.author_comment_id, cb => {
                        console.log(cb);
                    });
                })
                .catch(function(error) {
                    console.log("Ошибка при написании комментария: " + error);
                });
        },

        //загрузка комментариев из БД
        async LOAD_COMMENTS_POST({
            state,
            commit
        }, body) {
            return new Promise((resolve, reject) => {

                axios.get('http://localhost:8000/load_comments_post.js', {
                        params: {
                            userID: body.userID,
                            postID: body.postID.slice((body.postID.length - 20), body.postID.length)
                        }
                    }).then((response) => {
                        if (response.data.length > 0) {
                            commit("setCommentsArray", [...state.commentsArray, ...response.data]);
                        }
                        resolve(response)
                    })
                    .catch((err) => {
                        reject(err)
                    })
            })
        },

        //загрузка комментариев из БД к конкретному посту
        async LOAD_COMMENTS_ONE_POST({
            state,
            commit,
            dispatch
        }, id) {
            try {
                await axios.get('http://localhost:8000/load_comments_one_post.js', {
                    params: {
                        postID: id
                    }
                }).then((response) => {
                    if (response.data.length > 0) {
                        commit("setCommentsArray", [...state.commentsArray, ...response.data]);

                        response.data.forEach(comment => {
                            if (comment.id) {
                                dispatch("LOAD_COMMENTS_COMMENT_ONE_POST", comment.id);
                            }
                        });
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

        //загрузка комментариев к комментариям из БД
        async LOAD_COMMENTS_COMMENT({
            state,
            commit
        }, body) {
            try {
                await axios.get('http://localhost:8000/load_comments_comment.js', {
                    params: {
                        userID: body.userID,
                        postID: body.postID
                    }
                }).then((response) => {
                    if (response.data.length > 0) {
                        commit("setCommentsCommentArray", [...state.commentsCommentArray, ...response.data]);
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

        //загрузка комментариев к комментариям из БД к конкретному посту
        async LOAD_COMMENTS_COMMENT_ONE_POST({
            state,
            commit
        }, id) {
            try {
                await axios.get('http://localhost:8000/load_comments_comment_one_post.js', {
                    params: {
                        postID: id
                    }
                }).then((response) => {
                    if (response.data.length > 0) {
                        commit("setCommentsCommentArray", [...state.commentsCommentArray, ...response.data]);
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

        //удаление комментария к комментарию
        async DELETE_COMMENTS_COMMENT({
            commit
        }, paramsComment) {
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
        async DELETE_COMMENTS_POST({
            commit
        }, paramsComment) {
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

        },

        async GET_USER_LIKES_POST({
            commit
        }, post) {
            try {
                await axios.get('http://localhost:8000/get_users_likes', {
                    params: {
                        postID: post.id
                    }
                }).then((response) => {
                    commit("setUsersLikesPost", response.data)
                })
            } catch (err) {
                if (err.code === "ERR_CANCELED") {
                    console.log("Загрузка была отменена")
                } else {
                    console.log(err)
                }
            }
        }

    },




    namespaced: true,
}