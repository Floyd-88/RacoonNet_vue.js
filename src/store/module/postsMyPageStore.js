import axios from "axios";


export const postsMyPageStore = {

    state: () => ({
        posts: [],      //массив постов подгружаемый из базы данных
        countPosts: 0,  //номер массива страницы
        limitPosts: 0,  //количество постов на одной странице
        totalCount: 0,  //всего страниц
    }),

    getters: {
        getPosts: state => state.posts,
        getUser: (state, getters, rootState, rootGetters) => {
            return rootGetters["authorizationStore/getUser"]
        }
    },

    mutations: {
        setPosts(state, posts) {
            state.posts = posts;
        },
        setAddPosts(state, newPost) {
            state.posts.unshift(newPost);
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
        async loadPostServer({state, commit, getters}) {
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
        async addPost({commit, dispatch, getters}, body) {
            const newPost = {
                userID: getters.getUser.userID,
                ava: '/img/ava_1.776f687c.jpg',
                name: getters.getUser.name,
                surname: getters.getUser.surname,
                body: body.trim(),
                flag: '1',
                nameBtnEdit: "Редактировать",
            }
            newPost.date = await dispatch("newDate"),

                await axios.post('http://localhost:8000/dataBase.js', newPost)
                    .then(function (response) {
                        newPost.id = response.data.insertId;
                        commit("setAddPosts", newPost);
                    })
                    .catch(function (error) {
                        console.log("Ошибка при добавлении поста: " + error);
                    });

        },

        // изменение поста
        async editPost({state, dispatch}, id) {
            const date = await dispatch("newDate");
            const [post] = state.posts.filter(post => post.id === id);
            post.flag = !post.flag;
            if (post.flag) {
                post.nameBtnEdit = "Редактировать"
                post.date = "Изменено: " + date;
            } else {
                post.nameBtnEdit = "Сохранить";
            }
                await axios.put('http://localhost:8000/dataBase.js', {
                    body: post.body,
                    date: date,
                    id: post.id,
                })
                    .then(function (response) {
                        console.log(response)
                    })
                    .catch(function (error) {
                        console.log("Ошибка при редактировании поста: " + error)
                    })
        },

        //удаление поста
        async removePost({commit}, id) {
            commit("setRemovePost", id);
            await axios.delete('http://localhost:8000/dataBase.js?id=' + id)
                .then(function (response) {
                    console.log(response)
                })
                .catch(function (error) {
                    console.log(error)
                })
        },

        //функция устанавливает отредактированный формат даты и времени
        newDate() {
            const date = new Date();
            return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        },
    },

    namespaced: true
}