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
  name: 'App',

  created() {
    axios.interceptors.request.use(
      async function (config) {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = token;
        }

        //отмена запросов на сервер
        let source = axios.CancelToken.source();
        config.cancelToken = source.token;
        store.commit('cancelLoadAxios/setCancelTokens', source);

        return config;
      },
      function (error) {
        return Promise.reject(error);
      }
    );

    axios.interceptors.response.use(config => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = token;
      }
      return config
    }, error => {
      if(error.response) {
        if (error.response.data === "Неверный токен") {
        this.UPDATE_TOKEN()
          .then(res => {
            if (res.data.token) {
              error.config.headers.Authorization = res.data.token;
            }
          })
          .catch(() => {
            return window.location.href = '/'
          })
        return axios.request(error.config)
        }
      }
      
      if (error.code === "ERR_CANCELED") {
        console.log("Загрузка была отменена")
      }
      
      return Promise.reject(error);
    });


    // this.CHECK_CONFIRM_FRIEND();
    if(localStorage.getItem('token')) {
      
      this.LOAD_DIALOGS()
        .then(() => () => {})
        .catch((err) => {
              if (err.code === "ERR_CANCELED") {
              this.LOAD_DIALOGS()
            }
        });

      this.GET_USER_ADD_FRIENDS_ME()
        .catch((err) => {
          if (err.code === "ERR_CANCELED") {
              console.log("Загрузка была отменена")
            }
        });
        
      this.GET_NEW_NOTICE()
      .catch((err) => {
          if (err.code === "ERR_CANCELED") {
              this.GET_NEW_NOTICE()
            }
            if(err) {
              console.log(err)
            }
        });
    }



    // this.CHECK_REQUEST_FRIEND(this.$route.params.id);

    //вызываем метод для отправки сообщения всем участникам комнаты
    SocketioService.setupSocketConnection();
    console.log("connected");

    //получаем сообщение
    SocketioService.subscribeToMessages((err, data) => {
      // if (err) return console.log(err)
      this.setArrayMessages([...this.getArrayMessages, data]);

      this.UPDATE_DIALOGS_SOCKETS(data);

      if (this.$route.path === `/message/id${this.$route.params.id}`) {
        this.setIsNewMessageNotify(false);
      } else {
        this.setIsNewMessageNotify(true);
      }
      if(err) {
        console.log(err)
      }
    });

    //изменяем количество подгружаемых постов при скроллинге
    SocketioService.subscribeUsersID((err, status_post) => {
      if(status_post === 'add post') {
        this.setCountPosts(1);
      } else if(status_post === 'delete post') {
        this.setCountPostDel();
      }
      if(err) {
        console.log(err)
      }
    });

    //получаем уведомления
    SocketioService.subscribeToNotice((err, data) => {
        if(data.length > 0) {
          if(data[0].text_notice !== "Пользователь удален из ваших друзей") {
            this.setNoticeArray([...data]);

          //   if(data[0].text_notice === "написал что то на Вашей стене" && this.getCountPosts !== 0) {
          //   console.log(data[0])
          //   this.setCountPosts(1);
          // } 
          } 
        this.changeTextBTN(data[0])
      }
      if(err) {
        console.log(err)
      }
    });
  },

  mounted() {
    // this.LOAD_DIALOGS();

  },

  beforeUnmount() {
    SocketioService.disconnect();
    console.log("disconnected");
  },


  methods: {
    ...mapMutations({
      setArrayMessages: "messageStore/setArrayMessages",
      setArrayDialogs: "messageStore/setArrayDialogs",
      setIsNewMessageNotify: "messageStore/setIsNewMessageNotify",
      setCountFriendsNull: "friendsStore/setCountFriendsNull",
      setUsersMyFriends: "friendsStore/setUsersMyFriends",
      setNoticeArray: "noticeStore/setNoticeArray",
      // setCancelTokens: "cancelLoadAxios/setCancelTokens",
      changeTextBTN: "friendsStore/changeTextBTN",
      setCountPosts: "postsMyPageStore/setCountPosts",
      setCountPostDel: "postsMyPageStore/setCountPostDel"

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
      // CANCEL_PENDING_REQUESTS: "cancelLoadAxios/CANCEL_PENDING_REQUESTS"


      // loadAllPhotos: "loadPhotoStore/loadAllPhotos",
      // loadPostServer: "postsMyPageStore/loadPostServer",


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
      getCountPosts: "postsMyPageStore/getCountPosts"
    })
  },


  watch: {
    
    $route() {
      const id = this.$route.params.id;

      if (id) {
        this.loadUser({ id })
        .then(() => {
          this.setCountFriendsNull();
          this.setUsersMyFriends([]);
        })
          .then(() => {
            this.CHECK_REQUEST_FRIEND(id);
            if(this.getCountFriends === 0) {
              this.GET_USER_MY_FRIENDS(id);
            }
            // this.LOAD_DIALOGS();
            // this.CHECK_CONFIRM_FRIEND();
            // console.log(this.getArrayDialogs.reduce((accum, item) => accum + item.unread, 0));
            // this.loadAllPhotos();
            // this.loadPostServer(this.$route.params.id);
          })
          .catch((err) => {
            if(err.response.data === "Такого пользователя не существует") {
              this.$router.push('notFound')
            }
          })
      }
    }
  }
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

/* МЕДИА-ЗАПРОСЫ */

@media (max-width: 761px) {

  .wrapper {
  margin: 0 5%;
}
}
</style>
