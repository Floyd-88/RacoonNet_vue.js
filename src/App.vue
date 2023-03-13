<template>
  <HeaderNet />
  <div class="wrapper">
    <router-view></router-view>
    <UInewMessage />
</div>
</template>

<script>
import { mapActions, mapMutations, mapGetters } from "vuex";
import SocketioService from "./services/socketio.service"

// import axios from "axios";

export default {
  name: 'App',

  created() {

    // this.CHECK_CONFIRM_FRIEND();
    this.LOAD_DIALOGS();
    this.GET_USER_ADD_FRIENDS_ME();
    this.GET_USER_MY_FRIENDS();
    // this.CHECK_REQUEST_FRIEND(this.$route.params.id);
   


    //вызываем метод для отправки сообщения всем участникам комнаты
    SocketioService.setupSocketConnection();
    console.log("connected");

    SocketioService.subscribeToMessages((err, data) => {
      // if (err) return console.log(err)
      this.setArrayMessages([...this.getArrayMessages, data]);

      this.UPDATE_DIALOGS_SOCKETS(data);

      if (this.$route.path === `/message/id${this.$route.params.id}`) {
        this.setIsNewMessageNotify(false);
      } else {
        this.setIsNewMessageNotify(true);

      }
      // console.log(this.getArrayDialogs);
      // console.log(data.conv_id)

      //  this.getArrayDialogs.map((dialog) => {
      //   if(dialog.convId == data.conv_id) {
      //    this.setArrayDialogs(data);
      //     // dialog.message = data.message
      //   }
      // })

    });

    //       axios.interceptors.response.use(undefined, function (err) {
    //         // this.logout()
    //         return new Promise(function (resolve) {
    //       if (err.status === 403 && err.config 
    //           && !err.config.__isRetryRequest 
    //       ) {
    //         // this.logout()
    //         resolve()
    //       }
    //       throw err; 
    //     }); 
    //   });  
  },

  // mounted() {
  //   this.CHECK_REQUEST_FRIEND(this.$route.params.id);
  // },

  beforeUnmount() {
    SocketioService.disconnect();
    console.log("disconnected")
  },


  methods: {
    ...mapMutations({
      setArrayMessages: "messageStore/setArrayMessages",
      setArrayDialogs: "messageStore/setArrayDialogs",
      setIsNewMessageNotify: "messageStore/setIsNewMessageNotify"
    }),
    ...mapActions({
      logout: "authorizationStore/logout",
      loadUser: "authorizationStore/loadUser",
      LOAD_DIALOGS: "messageStore/LOAD_DIALOGS",
      UPDATE_DIALOGS_SOCKETS: "messageStore/UPDATE_DIALOGS_SOCKETS",
      GET_USER_ADD_FRIENDS_ME: "friendsStore/GET_USER_ADD_FRIENDS_ME",
      GET_USER_MY_FRIENDS: "friendsStore/GET_USER_MY_FRIENDS",
      CHECK_REQUEST_FRIEND: "friendsStore/CHECK_REQUEST_FRIEND"

      // loadAllPhotos: "loadPhotoStore/loadAllPhotos",
      // loadPostServer: "postsMyPageStore/loadPostServer",


    }),
  },

  computed: {
    ...mapGetters({
      getArrayMessages: "messageStore/getArrayMessages",
      getArrayDialogs: "messageStore/getArrayDialogs",
    })
  },


  watch: {
    $route() {
      const id = this.$route.params.id;
      if (id) {
        this.loadUser({ id })
          .then(() => {
            this.CHECK_REQUEST_FRIEND(id);

            // this.LOAD_DIALOGS();
            // this.CHECK_CONFIRM_FRIEND();
            // console.log(this.getArrayDialogs.reduce((accum, item) => accum + item.unread, 0))
            // this.loadAllPhotos();
            // this.loadPostServer(this.$route.params.id);
          })
          .catch(() => {
            this.$router.push('notFound')
          })
      }
    }
  }
}

</script>

<style>
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
</style>
