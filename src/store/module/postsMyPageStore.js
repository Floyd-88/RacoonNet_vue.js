import axios from "axios";

export const postsMyPageStore = {

    state: () => ({
        postText: "", //текст который отображается на странице
        id: "", //id конкретного поста
        beforePostText: "", //копия текста отображаемого на странице с которым мы работаем при редактировании
        modulePost: false, //отображение модального окна
        posts: [], //массив постов подгружаемый из базы данных
        countPosts: 0, //с какого поста начинать вести счет
        limitPosts: 10, //лимит постов на одной странице
        totalCount: 0, //всего страниц
        newsPostsFriends: [], //новостная лента от друзей
        countNews: 0, //с какой новости начинать вести счет
        limitNews: 10, // лимит новостей на странице
        likesPost: ""
    }),

    getters: {
        getPostText: state => state.postText,
        getBeforePostText: state => state.beforePostText,
        getModulePost: (state) => state.modulePost,
        getPosts: state => state.posts,
        getUser: (state, getters, rootState, rootGetters) => { //получаем ID авторизованного юзера
            return rootGetters["authorizationStore/getUser"]
        },
        getNewsPostsFriends: state => state.newsPostsFriends,
        getLikesPost: state => state.likesPost
    },

    mutations: {
        //при открытии модального окна сохраняем в state его id и текст поста
        setModulePost(state, {
            task,
            id,
            text
        }) {
            state.modulePost = task;
            state.id = id;
            state.beforePostText = text;
            document.body.style.overflow = "hidden"
        },
        //закрытие модального окна
        setCloseModulePost(state) {
            state.modulePost = false;
            document.body.style.overflow = "auto"
        },

        setPostText(state, post) {
            state.postText = post;
        },
        setBeforePostText(state, text) {
            state.beforePostText = text
        },

        setPosts(state, posts) {
            state.posts = posts;
        },
        setAddPosts(state, newPost) {
            state.posts.unshift(newPost);
            state.postText = "";
        },
        setLimitPosts(state) {
            state.limitPosts = 3;
        },
        setCountPosts(state, count) {
            state.countPosts += count;
        },
        setCountPostsNull(state) {
            state.countPosts = 0;
        },
        setRemovePost(state, id) {
            state.posts = state.posts.filter(post => post.id !== id);
        },

        setNewsPostsFriends(state, value) {
            state.newsPostsFriends = value
        },

        setCountNews(state, count) {
            state.countNews += count
        },
        setCountNewsNull(state) {
            state.countNews = 0;
        },

        setLikesPost(state, value) {
            state.likesPost = value
        }

    },

    actions: {
        //загрузка постов с базы данных
        async loadPostServer({
            state,
            commit
        }, id) {
            try {
                await axios.get('http://localhost:8000/dataBase.js', {
                    params: {
                        _count: state.countPosts,
                        _limit: state.limitPosts,
                        userID: id
                    }
                }).then((response) => {
                    if (response.data.length > 0) {
                        commit("setPosts", [...state.posts, ...response.data]);
                        commit("setCountPosts", 10);
                        console.log(state.posts)
                    }

                });
            } catch (err) {
                console.error(err);
            }
        },

        // добавление нового поста на мою страницу
        async addPost({
            dispatch,
            getters,
            commit
        }, postText) {
            const newPost = {
                id: getters.getUser.userID,
                postText: postText.trim(),
            }
            newPost.date = await dispatch("newDate"),

                await axios.post('http://localhost:8000/dataBase.js', newPost)
                .then(function(response) {
                    // newPost.id = response.data.user.postID;
                    // newPost.name = response.data.user.name;
                    // newPost.surname = response.data.user.surname;
                    // newPost.ava = response.data.user.ava


                    commit("setAddPosts", response.data);
                    commit("setCountPosts", 1);
                })
                .catch(function(error) {
                    console.log("Ошибка при добавлении поста: " + error);
                });
        },


        // изменение поста
        async editPost({
            state,
            dispatch,
            commit
        }) {
            const date = await dispatch("newDate");
            const [post] = state.posts.filter(post => post.id === state.id);
            post.date = "Изменено: " + date;
            commit("setCloseModulePost");
            post.postText = state.beforePostText; //при нажатии на кнопку сохранить, перезаписываем postText

            await axios.put('http://localhost:8000/dataBase.js', {
                    postText: post.postText,
                    date: "Изменено: " + date,
                    postID: post.id,
                    authorPost: post.authorPost
                })
                .then(function(response) {
                    console.log(response)
                })
                .catch(function(error) {
                    console.log("Ошибка при редактировании поста: " + error)
                })
        },

        //удаление поста
        async removePost({
            getters,
            commit,
            state
        }) {
            const [post] = state.posts.filter(post => post.id === state.id);
            commit("setRemovePost", state.id);
            commit("setCloseModulePost");
            let paramsBody = {
                postID: state.id,
                authorPost: post.authorPost,
                pageID: getters.getUser.userID
            }
            await axios.delete('http://localhost:8000/dataBase_delete', {
                    data: paramsBody
                })
                .then(function(response) {
                    console.log(response)
                })
                .catch(function(error) {
                    console.log(error)
                })
        },

        //функция устанавливает отредактированный формат даты и времени
        newDate() {
            const date = new Date();

            const result = date.toLocaleDateString(undefined, {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            })

            return result
        },


        //получение постов от друзей для отображения в новостях
        async LOAD_NEWS_FRIENDS_USERS({
            state,
            commit
        }) {
            try {
                await axios.get('http://localhost:8000/news_friends.js', {
                    params: {
                        _count: state.countNews,
                        _limit: state.limitNews,
                    }
                }).then((response) => {
                    if (response.data.length > 0) {
                        commit("setNewsPostsFriends", [...state.newsPostsFriends, ...response.data])
                        commit("setCountNews", 10)
                        console.log(state.newsPostsFriends)
                    }

                });
            } catch (err) {
                console.error(err);
            }
        },

        //лайкнуть пост
        async SAVE_LIKE_COUNT_POST({ commit }, postID) {
            try {
                await axios.post('http://localhost:8000/likes_post', postID)
                    .then((response) => {
                        commit("setLikesPost", response.data)
                    });
            } catch (err) {
                console.error(err);
            }
        },
    },

    namespaced: true
}