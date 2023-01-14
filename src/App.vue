<template>
  <HeaderNet/>
  <div class="wrapper">
    <NavigationNet/>
    <div class="wrapper_main">
      <router-view></router-view>
    </div>
  </div>

</template>

<script>

export default {
  name: 'App',

  // created: function () {
  //   this.$http.interceptors.response.use(undefined, function (err) {
  //     return new Promise(function (resolve) {
  //       if (err.status === 401 && err.config
  //           && !err.config.__isRetryRequest
  //       ) {
  //         this.$store.dispatch("logout")
  //         resolve()
  //       }
  //       throw err;
  //     });
  //   });
  // }
}
</script>

<style>
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
  margin-left: 180px;
  padding: 120px 20px;
  background: aliceblue;

}

</style>
