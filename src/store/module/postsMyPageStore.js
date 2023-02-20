import axios from "axios";

export const postsMyPageStore = {

    state: () => ({
        postText: "", //текст который отображается на странице
        id: "", //id конкретного поста
        beforePostText: "", //копия текста отображаемого на странице с которым мы работаем при редактировании
        modulePost: false, //отображение модального окна
        posts: [], //массив постов подгружаемый из базы данных
        countPosts: 0, //номер массива страницы
        limitPosts: 3, //количество постов на одной странице
        totalCount: 0, //всего страниц
    }),

    getters: {
        getPostText: state => state.postText,
        getBeforePostText: state => state.beforePostText,
        getModulePost: (state) => state.modulePost,
        getPosts: state => state.posts,
        getUser: (state, getters, rootState, rootGetters) => { //получаем ID авторизованного юзера
            return rootGetters["authorizationStore/getUser"]
        },
    },

    mutations: {
        //при открытии модального окна сохраняем в state его id и текст поста
        setModulePost(state, { task, id, text }) {
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
    },

    actions: {
        //загрузка постов с базы данных
        async loadPostServer({ state, commit }, id) {
            try {
                await axios.get('http://localhost:8000/dataBase.js', {
                    params: {
                        _count: state.countPosts,
                        _limit: state.limitPosts,
                        userID: id
                    }
                }).then((response) => {
                    console.log(response.data)
                    if (response.data.length > 0) {
                        commit("setPosts", [...state.posts, ...response.data]);
                        commit("setCountPosts", 3)
                    }

                });
            } catch (err) {
                console.error(err);
            }
        },

        // добавление нового поста на мою страницу
        async addPost({ dispatch, getters, commit }, postText) {
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
        async editPost({ state, dispatch, commit }) {
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
        async removePost({ getters, commit, state }) {
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
    },

    namespaced: true
}