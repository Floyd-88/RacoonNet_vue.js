<template>
  <HeaderNet/>
  <div class="wrapper">
    <NavigationNet
    v-if="route"
    />
    <div class="wrapper_main">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>

import axios from "axios";

export default {
  name: 'App',

  created: function () {
    axios.interceptors.response.use(undefined, function (err) {
      return new Promise(function (resolve) {
        if (err.status === 401 && err.config
            && !err.config.__isRetryRequest
        ) {
          this.$store.dispatch("logout")
          resolve()
        }
        throw err;
      });
    });
  },

  computed: {
    route() {
      return this.$store.getters.isLoggedIn;
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
  background: aliceblue;
}
.wrapper {
  margin: 0 10%;
}

.wrapper_main {
  padding: 120px 20px;
  background: aliceblue;
}

</style>
