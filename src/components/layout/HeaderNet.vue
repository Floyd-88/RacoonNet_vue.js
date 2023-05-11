<template>
    <header class="header">

      <div class="header_wrapper_logo_title">
        <div class="header_wrapper_logo">
          <img 
            class="header_logo"   
            src="../../assets/logo/logo.png" 
            alt="logo"
            @click="$router.push(`/id${userID}`)" 
            >
        </div>

        <div class="header_wrapper_title">
          <button class="btn_title"  @click="$router.push(`/id${userID}`)" >RacсoonNet</button>
        </div>
        <div class="wrapper_notice" v-if="isLoggedIn">
          <img class="new_message_img" src="../../assets/icons/notice.png" alt="new_message" @click="setIsShowModalWindowNotice(true)">
        </div>
      </div>

      <div class="header_wrapper_exit">
          <!-- <p class="welcom_text" v-if="isLoggedIn">Добро пожаловать, {{JSON.parse( nameUser ).name }}</p> -->
          <span class="header_exit" v-if="isLoggedIn"> <a @click="runLogout">Выход</a></span>
          <span class="header_exit" v-else> <a @click="$router.push('/')">Вход</a></span>
      </div>

    </header>

    <UImodal v-if="getIsShowModalWindowNotice">
     <NoticeUser/>
    </UImodal>
</template>

<script>
import {mapGetters, mapActions, mapMutations} from "vuex";
import UImodal from "../UI/UImodal.vue";

export default {
    name: "HeaderNet",
    data() {
        return {
            userID: (localStorage.getItem("user")) ? JSON.parse(localStorage.getItem("user")).userID : "",
            nameUser: (localStorage.getItem("token")) ? atob(localStorage.getItem("token").split(".")[1]) : "",
            
        };
    },
    methods: {
      ...mapMutations({
        setIsShowModalWindowNotice: "noticeStore/setIsShowModalWindowNotice"
      }),
        ...mapActions({ logout: "authorizationStore/logout" }),
        runLogout() {
            this.logout()
                .then(() => {
                window.location.href = "/";
                // this.$router.push('/')
            });
        }
    },
    computed: {
        ...mapGetters({
            isLoggedIn: "authorizationStore/isLoggedIn",
            getUser: "authorizationStore/getUser",
            getIsShowModalWindowNotice: "noticeStore/getIsShowModalWindowNotice"
        })
    },
    components: { UImodal }
}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  height: 100px;
  background: #0197d6;
  border: 1px solid black;
  position: fixed;
  width: 100%;
  z-index: 2;
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
cursor: pointer;
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
.header_exit:after {
  display: block;
  content: "";
  height: 3px;
  width: 0%;
  background-color: black;
  transition: width 0.2s ease-in-out;
}
.header_exit:hover:after {
  width: 100%;
}
.header_exit:hover{
  color: black;
}

.welcom_text {
  padding-right: 20px;
    font-size: 18px;
    font-family: auto;
    font-weight: 600;
    color: honeydew;
    padding-bottom: 3px;
}
.wrapper_notice {
  display: flex;
    margin-left: 35px;
    align-items: center;
    margin-top: 6px;
}
.new_message_img {
    width: 30px;
    margin-right: 10px;
    margin-left: 5px;
    cursor: pointer;
}
</style>