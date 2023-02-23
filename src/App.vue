<template>
  <HeaderNet />
  <div class="wrapper">
    <router-view></router-view>
  </div>
</template>

<script>
import { mapActions, mapMutations } from "vuex";
// import axios from "axios";

export default {
  name: 'App',

  // created: function () {
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
  // }, 

  methods: {
    ...mapMutations({
    }),
    ...mapActions({
      logout: "authorizationStore/logout",
      loadUser: "authorizationStore/loadUser",
      LOAD_DIALOGS: "messageStore/LOAD_DIALOGS",
      // loadAllPhotos: "loadPhotoStore/loadAllPhotos",
      // loadPostServer: "postsMyPageStore/loadPostServer",


    }),
  },


  watch: {
    $route() {
      const id = this.$route.params.id;
      if (id) {
        this.loadUser({ id })
          .then(() => {
            this.LOAD_DIALOGS();
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
}

.wrapper_main {
  padding: 120px 20px 5px;
}
</style>
