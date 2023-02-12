<template>
  <HeaderNet/>
  <div class="wrapper">
    
    <!-- <NavigationNet v-if="isLoggedIn"/> -->

    <!-- <div class="wrapper_main"> -->
      <router-view></router-view>
    <!-- </div> -->
  </div>

</template>

<script>

// import axios from "axios";
import {mapGetters, mapActions} from "vuex";

export default {
  name: 'App',

  // created: function () {
  //       axios.interceptors.response.use(undefined, function (err) {
  //         console.log(222)
  //         // this.logout()
  //         return new Promise(function (resolve) {
  //       if (err.status === 403 && err.config 
  //           && !err.config.__isRetryRequest 
  //       ) {
  //         this.logout()
  //         resolve()
  //       }
  //       throw err; 
  //     }); 
  //   });  
  // }, 

  methods: {
    ...mapActions({
      logout: "authorizationStore/logout",
      loadPostServer: "postsMyPageStore/loadPostServer",
      loadUser: "authorizationStore/loadUser"
    }),
  },

  computed: {
    ...mapGetters({
      // isLoggedIn: "authorizationStore/isLoggedIn",
      // getUser: "authorizationStore/getUser"
    }),
  },

  watch: {
    $route() {
      const id = this.$route.params.id;
      // localStorage.setItem('id', JSON.stringify(id));
     
     if(id) {
      // console.log(this.$route.params.id)
        this.loadUser({id})
        .then(() => {
        // console.log(resp.data.userID)
        })
        .catch((err) => {
            if (err.err) {
              this.$router.push('notFound')
            }
          })
     }

    }
  }
}

</script>

<style>
*, *::before, *::after {
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
