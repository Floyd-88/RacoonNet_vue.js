<template>
    <header class="header">

      <div class="header_wrapper_logo_title">
        <div class="header_wrapper_logo">
          <img class="header_logo" src="../../assets/logo/logo.png" alt="logo">
        </div>

        <div class="header_wrapper_title">
          <button class="btn_title" @click="$router.push('mypage')">RacсoonNet</button>
        </div>
      </div>

      <div class="header_wrapper_exit">
          <span class="header_exit" v-if="isLoggedIn"> <a @click="logout">Выход</a></span>
      </div>


    </header>
</template>

<script>
export default {
  name: "HeaderNet",

  methods: {
    logout: function () {
      this.$store.dispatch('logout')
          .then(() => {
            this.$router.push('/')
          })
    }
  },

  computed : {
    isLoggedIn : function(){
      return this.$store.getters.isLoggedIn
    }
  },

}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  height: 100px;
  background: cornflowerblue;
  border: 1px solid black;
  position: fixed;
  width: 100%;
}
.header_wrapper_logo_title {
  display: flex;
  margin-left: 5%;
}
.header_wrapper_logo {
  display: flex;
  align-items: center;
}
.header_logo {
width: 100px;
}
.header_wrapper_title {
  display: flex;
  align-items: center;
  margin-left: 20px;
}
.btn_title {
  border: none;
  background: none;
  text-shadow: 4px 3px 0 #ccc, 9px 8px 0 rgb(0 0 0 / 15%);
  display: flex;
  align-items: center;
  font-size: 40px;
  font-family: fantasy;
  cursor: pointer;
}
.header_wrapper_exit {
  display: flex;
  align-items: center;
  margin-right: 35px;
}
.header_exit {
  cursor: pointer;
  font-size: 18px;
  font-family: fantasy;
}
</style>