import axios from "axios";
import SocketioService from "../../services/socketio.service";

export const postsMyPageStore = {

    state: () => ({
        postText: "", //текст который отображается на странице
        id: "", //id конкретного поста
        beforePostText: "", //копия текста отображаемого на странице с которым мы работаем при редактировании
        modulePost: false, //отображение модального окна
        posts: [], //массив постов подгружаемый из базы данных
        countPosts: 0, //с какого поста начинать вести счет
        limitPosts: 20, //лимит постов на одной странице
        totalCount: 0, //всего страниц
        newsPostsFriends: [], //новостная лента от друзей
        countNews: 0, //с какой новости начинать вести счет
        limitNews: 10, // лимит новостей на странице
        likesPost: "",
        // isLoadPhotoPost: "" //загрузка фотографий в пост
        photosPostsArray: [], //фотографии к постам
        isNotRepeatAddPost: true //предотвращение потворной отправки поста

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
        getLikesPost: state => state.likesPost,
        // getIsLoadPhotoPost: (state) => state.isLoadPhotoPost
        getPhotosPostsArray: (state) => state.photosPostsArray,

        getIsNotRepeatAddPost: (state) => state.isNotRepeatAddPost,
        getCountPosts: (state) => state.countPosts
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
        setCountPostDel(state) {
            state.countPosts -= 1;
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
        },

        // setIsLoadPhotoPost(state, bool) {
        //     state.isLoadPhotoPost = bool
        // }

        setPhotosPostsArray(state, value) {
            state.photosPostsArray = value
        },

        //удаление картинки из массива
        removePhotosPostsArray(state, id) {
            if (id) {
                state.photosPostsArray = state.photosPostsArray.filter(photo => photo.photoID !== id);
            }
        },

        setIsNotRepeatAddPost(state, bool) {
            state.isNotRepeatAddPost = bool;
        }

    },

    actions: {
        //загрузка постов с базы данных
        async loadPostServer({
            state,
            commit,
            dispatch,
            getters
        }, id) {
            return new Promise((resolve, reject) => {
                axios.get('http://localhost:8000/dataBase.js', {
                        params: {
                            _count: state.countPosts,
                            _limit: state.limitPosts,
                            userID: id
                        }
                    }).then((response) => {
                        if (response.data.length > 0) {
                            commit("setPosts", [...state.posts, ...response.data]);
                            commit("setCountPosts", 20);

                            response.data.forEach(post => {
                                if (post.photos === "1") {
                                    dispatch("LOAD_POST_PHOTOS", { postID: post.id, userID: getters.getUser.userID });
                                }
                            });
                        }

                        resolve(response)
                    })
                    .catch((err) => {
                        reject(err)
                    })
            })
        },

        // добавление нового поста на мою страницу
        async addPost({
            dispatch,
            getters,
            commit,
            state
        }, isPhoto) {

            commit("setIsNotRepeatAddPost", false);

            const newPost = {
                id: getters.getUser.userID,
                postText: state.postText.trim(),
            }
            newPost.date = await dispatch("newDate");

            newPost.photo = isPhoto;

            await axios.post('http://localhost:8000/dataBase.js', newPost)
                .then(async function(response) {


                    // newPost.id = response.data.user.postID;
                    // newPost.name = response.data.user.name;
                    // newPost.surname = response.data.user.surname;
                    // newPost.ava = response.data.user.ava


                    await commit("setAddPosts", response.data);
                    await commit("setCountPosts", 1);
                    await commit("setIsNotRepeatAddPost", true);

                    //отправляем уведомление адресату без перезагрузки страницы
                    SocketioService.sendNotice(newPost.id, cb => {
                        console.log(cb);
                    });

                    //отправляем уведомление всем кто находится в комнате(MyPage)
                    // SocketioService.sendInfoNewPost("add post", cb => {
                    //     console.log(cb);
                    // });

                })
                .catch(function(error) {
                    commit("setIsNotRepeatAddPost", true);
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
            const [post] = state.posts.filter(post => post.id == state.id);
            commit("setRemovePost", state.id);
            commit("setCloseModulePost");
            let paramsBody = {
                postID: state.id,
                authorPost: post.authorPost,
                pageID: getters.getUser.userID,
                photos: post.photos
            }
            await axios.delete('http://localhost:8000/dataBase_delete', {
                    data: paramsBody
                })
                .then(function(response) {
                    console.log(response);
                    commit("setCountPostDel");

                    //отправляем уведомление всем кто находится в комнате(MyPage)
                    // SocketioService.sendInfoNewPost("delete post", cb => {
                    //     console.log(cb);
                    // });
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
            commit,
            dispatch
        }) {
            return new Promise((resolve, reject) => {
                axios.get('http://localhost:8000/news_friends.js', {
                        params: {
                            _count: state.countNews,
                            _limit: state.limitNews,
                        }
                    }).then((response) => {
                        if (response.data.length > 0) {
                            commit("setNewsPostsFriends", [...state.newsPostsFriends, ...response.data])
                            commit("setCountNews", 10)

                            // response.data.forEach(post => {
                            //     dispatch("commentsPost/LOAD_COMMENTS_POST", post.authorPost, { root: true });
                            //     dispatch("commentsPost/LOAD_COMMENTS_COMMENT", post.authorPost, { root: true });
                            // })

                            response.data.forEach(post => {
                                if (post.photos === "1") {
                                    dispatch("LOAD_POST_PHOTOS", { postID: post.id, userID: post.authorPost });
                                }
                                dispatch("commentsPost/LOAD_COMMENTS_ONE_POST", post.id, { root: true });
                            });
                        }
                        resolve(response);
                    })
                    .catch((err) => {
                        reject(err)
                    })
            })

        },

        //лайкнуть пост
        async SAVE_LIKE_COUNT_POST({
            commit,
            dispatch
        }, postID) {
            try {
                postID.date = await dispatch("newDate");
                await axios.post('http://localhost:8000/likes_post', postID)
                    .then((response) => {
                        commit("setLikesPost", response.data);

                        //отправляем уведомление адресату без перезагрузки страницы
                        if (response.data.flag) {
                            SocketioService.sendNotice(response.data.likes.authorPost, cb => {
                                console.log(cb);
                            });
                        }

                    });
            } catch (err) {
                console.error(err);
            }
        },

        //загрузка фотографий к постам
        async LOAD_POST_PHOTOS({ state, commit }, params) {
            try {
                await axios.get('http://localhost:8000/post_photos.js', {
                    params
                }).then((response) => {
                    if (response.data.length > 0) {
                        commit("setPhotosPostsArray", [...state.photosPostsArray, ...response.data]);
                    }
                });
            } catch (err) {
                if (err.code === "ERR_CANCELED") {
                    console.log("Загрузка была отменена")
                } else {
                    console.log(err)
                }
            }
        }
    },



    namespaced: true
}