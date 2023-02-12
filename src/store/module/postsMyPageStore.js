import axios from "axios";

export const postsMyPageStore = {

    state: () => ({
        postText: "", //текст который отображается на странице
        id: "", //id конкретного поста
        beforePostText: "", //копия текста отображаемого на странице с которым мы работаем при редактировании
        modulePost: false, //отображение модального окна
        posts: [], //массив постов подгружаемый из базы данных
        countPosts: 0, //номер массива страницы
        limitPosts: 0, //количество постов на одной странице
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
        setCountPosts(state) {
            state.countPosts = state.posts.length;
        },
        setRemovePost(state, id) {
            state.posts = state.posts.filter(post => post.id !== id);
        },
    },

    actions: {
        //загрузка постов с базы данных
        async loadPostServer({ state, commit, getters }) {
            try {
                await axios.get('http://localhost:8000/dataBase.js', {
                    params: {
                        _count: state.countPosts,
                        _limit: state.limitPosts,
                        userID: getters.getUser.userID
                    }
                }).then((response) => {
                    commit("setPosts", [...state.posts, ...response.data]);
                });
            } catch (err) {
                console.error(err);
            }
        },

        // добавление нового поста на мою страницу
        async addPost({ commit, dispatch, getters }, postText) {
            const newPost = {
                id: getters.getUser.userID,
                postText: postText.trim(),
            }
            newPost.date = await dispatch("newDate"),

                await axios.post('http://localhost:8000/dataBase.js', newPost)
                .then(function(response) {
                    // const user = JSON.parse(localStorage.getItem('user'));

                    console.log(response.data.user)
                    newPost.id = response.data.user.postID;
                    newPost.name = response.data.user.name;
                    newPost.surname = response.data.user.surname;
                    newPost.ava = response.data.user.ava

                    console.log(getters.getPosts)
                    commit("setAddPosts", newPost);
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
                    id: post.id,
                })
                .then(function(response) {
                    console.log(response)
                })
                .catch(function(error) {
                    console.log("Ошибка при редактировании поста: " + error)
                })
        },

        //удаление поста
        async removePost({ commit, state }) {
            commit("setRemovePost", state.id);
            commit("setCloseModulePost");
            await axios.delete('http://localhost:8000/dataBase.js?id=' + state.id)
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