<template>
    <HeaderNet />
    <div class="wrapper">
        <router-view></router-view>
        <UInewMessage />

        <UImodal v-if="getisModalFeedBack">
            <FeedBack />
        </UImodal>
    </div>
</template>

<script>
import { mapActions, mapMutations, mapGetters } from "vuex";
import SocketioService from "./services/socketio.service"
import axios from "axios";
import store from "@/store/index";

export default {
    name: "App",
    created() {

        axios.interceptors.request.use(async function (config) {
            const token = localStorage.getItem("token");
            if (token) {
                config.headers.Authorization = token;
            }

            //отмена запросов на сервер
            let source = axios.CancelToken.source();
            config.cancelToken = source.token;
            store.commit("cancelLoadAxios/setCancelTokens", source);
            return config;
        }, function (error) {
            return Promise.reject(error);
        });

        axios.interceptors.response.use(config => {
            const token = localStorage.getItem("token");
            if (token) {
                config.headers.Authorization = token;
            }
            return config;
        }, error => {
            if (error.response) {
                if (error.response.data === "Неверный токен") {
                    this.UPDATE_TOKEN()
                        .then(res => {
                            if (res.data.token) {
                                error.config.headers.Authorization = res.data.token;
                            }
                        })
                        .catch((err) => {
                            if (err.code !== "ERR_CANCELED") {
                                this.$router.push('/')
                                return
                            }
                        });
                    if (localStorage.getItem("token")) {
                        return axios.request(error.config);
                    }
                }
            }
            if (error.code === "ERR_CANCELED") {
                console.log("Загрузка была отменена");
            }
            return Promise.reject(error);
        });

        if (localStorage.getItem("token")) {
            this.LOAD_DIALOGS()
                .then(() => () => { })
                .catch((err) => {
                    if (err.code === "ERR_CANCELED") {
                        this.LOAD_DIALOGS();
                    }
                });
            this.GET_USER_ADD_FRIENDS_ME()
                .catch((err) => {
                    if (err.code === "ERR_CANCELED") {
                        console.log("Загрузка была отменена");
                    }
                });
            this.GET_NEW_NOTICE()
                .catch((err) => {
                    if (err.code === "ERR_CANCELED") {
                        this.GET_NEW_NOTICE();
                    }
                    if (err) {
                        console.log(err);
                    }
                });
        }

        //вызываем метод для отправки сообщения всем участникам комнаты
        SocketioService.setupSocketConnection();

        //получаем сообщение
        SocketioService.subscribeToMessages((err, data) => {

            if (+this.$route.params.id === +data.sender) {
                this.setArrayMessages([...this.getArrayMessages, data]);
            }

            this.UPDATE_DIALOGS_SOCKETS(data);

            if (this.$route.path === `/message/id${data.sender}`) {
                this.setIsNewMessageNotify(false);

            }
            else {
                this.setIsNewMessageNotify(true);
            }
            if (err) {
                console.log(err);
            }
        });

        // получаем фотографии из сообщения
        SocketioService.subscribeToMessagesPhotos((err, data) => {
            if (+this.$route.params.id === +data.arrayPhotos[0].userID) {
                this.setPhotosMessagesArray([...data.arrayPhotos, ...this.getPhotosMessagesArray]);
            }
            if (err) {
                console.log(err);
            }
        });

        //получаем уведомления
        SocketioService.subscribeToNotice((err, data) => {
            if (data.length > 0) {
                if (data[0].text_notice !== "Пользователь удален из ваших друзей") {
                    this.setNoticeArray([...data]);
                }
                this.changeTextBTN(data[0]);
            }
            if (err) {
                console.log(err);
            }
        });
    },
  
    beforeUnmount() {
        SocketioService.disconnect();
    },
    methods: {
        ...mapMutations({
            setArrayMessages: "messageStore/setArrayMessages",
            setArrayDialogs: "messageStore/setArrayDialogs",
            setIsNewMessageNotify: "messageStore/setIsNewMessageNotify",
            setCountFriendsNull: "friendsStore/setCountFriendsNull",
            setUsersMyFriends: "friendsStore/setUsersMyFriends",
            setNoticeArray: "noticeStore/setNoticeArray",
            changeTextBTN: "friendsStore/changeTextBTN",
            setCountPosts: "postsMyPageStore/setCountPosts",
            setCountPostDel: "postsMyPageStore/setCountPostDel",
            setMyPhotosMyPage: "loadPhotoStore/setMyPhotosMyPage",
            setPosts: "postsMyPageStore/setPosts",
            setCountPostsNull: "postsMyPageStore/setCountPostsNull",
            setPhotosPostsArray: "postsMyPageStore/setPhotosPostsArray",
            setCommentsArray: "commentsPost/setCommentsArray",
            setCommentsCommentArray: "commentsPost/setCommentsCommentArray",
            setPhotosMessagesArray: "messageStore/setPhotosMessagesArray"

        }),
        ...mapActions({
            logout: "authorizationStore/logout",
            loadUser: "authorizationStore/loadUser",
            LOAD_DIALOGS: "messageStore/LOAD_DIALOGS",
            UPDATE_DIALOGS_SOCKETS: "messageStore/UPDATE_DIALOGS_SOCKETS",
            GET_USER_ADD_FRIENDS_ME: "friendsStore/GET_USER_ADD_FRIENDS_ME",
            GET_USER_MY_FRIENDS: "friendsStore/GET_USER_MY_FRIENDS",
            CHECK_REQUEST_FRIEND: "friendsStore/CHECK_REQUEST_FRIEND",
            UPDATE_TOKEN: "authorizationStore/UPDATE_TOKEN",
            GET_NEW_NOTICE: "noticeStore/GET_NEW_NOTICE",
        }),
    },
    computed: {
        ...mapGetters({
            getArrayMessages: "messageStore/getArrayMessages",
            getArrayDialogs: "messageStore/getArrayDialogs",
            getisModalFeedBack: "feedBackStore/getisModalFeedBack",
            getCountFriends: "friendsStore/getCountFriends",
            getNoticeArray: "noticeStore/getNoticeArray",
            getSearchUsersFriends: "friendsStore/getSearchUsersFriends",
            getCountPosts: "postsMyPageStore/getCountPosts",
            getStatus: "authorizationStore/getStatus",
            getPhotosMessagesArray: "messageStore/getPhotosMessagesArray"
        })
    },
    watch: {
        $route() {
            const id = this.$route.params.id;
            if (id) {
                this.setMyPhotosMyPage([]);
                this.setPosts([]);
                this.setCountPostsNull();
                this.setPhotosPostsArray([]);
                this.setCommentsArray([]);
                this.setCommentsCommentArray([]);

                this.loadUser({ id })
                    .then(() => {
                        this.setCountFriendsNull();
                        this.setUsersMyFriends([]);
                    })
                    .then(() => {
                        this.CHECK_REQUEST_FRIEND(id);
                        if (this.getCountFriends === 0) {
                            this.GET_USER_MY_FRIENDS(id);
                        }
                    })
                    .catch((err) => {
                        if (err.response?.data === "Такого пользователя не существует") {
                            this.$router.push("notFound");
                        }
                    });
            }
        }
    },

}

</script>

<style lang="scss">
*,
*::before,
*::after {
    box-sizing: border-box;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    background: #f8f8f9;
}

.wrapper {
    margin: 0 10%;
    position: static;
}

.wrapper_main {
    padding: 120px 20px 5px;
}

.loading_show {
    padding: 130px;
}

/* МЕДИА-ЗАПРОСЫ */
@media (max-width: 761px) {
    .wrapper {
        margin: 0 5%;
    }
}
</style>
