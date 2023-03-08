import axios from "axios";

export const commentsPost = {

    state: () => ({
        isShowWriteComment: false, //показывать комментарии с textarea
        commentPost: "", //текст комментария
        commentsArray: [] //массив комментариев к посту
    }),

    getters: {
        getIsShowWriteComment: state => state.isShowWriteComment,
        getCommentPost: state => state.commentPost,
        getCommentsArray: state => state.commentsArray
    },

    mutations: {
        setIsShowWriteComment(state) {
            state.isShowWriteComment = !state.isShowWriteComment;
        },

        setCommentPost(state, text) {
            state.commentPost = text
        },

        setCommentsArray(state, value) {
            state.commentsArray = value
        }
    },

    actions: {
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
                        console.log(state.commentsArray);
                    }
                });
            } catch (err) {
                console.error(err);
            }
        }
    },


    namespaced: true,
}