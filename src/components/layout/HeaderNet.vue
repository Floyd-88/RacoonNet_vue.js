<template>
  <header class="header">

    <div class="header_wrapper_logo_title">
      <div class="header_wrapper_logo_title_notice">
        <div class="header_wrapper_logo">
          <img class="header_logo" src="../../assets/logo/logo.png" alt="logo" @click="$router.push(`/id${userID}`)">
        </div>
        <div class="header_wrapper_title">
          <button class="btn_title" @click="$router.push(pathID)">RaccoonNet</button>
        </div>
        <div class="wrapper_notice" v-if="isLoggedIn">
          <img class="new_message_img" src="../../assets/icons/notice.png" alt="new_message"
            @click="setIsShowModalWindowNotice(true)">
          <div class="notice_true" v-if="countNotice.length > 0" @click="setIsShowModalWindowNotice(true)">
            <p>{{ (countNotice.length > 99) ? 99 : countNotice.length }} </p>
          </div>
        </div>

      </div>

      <div class="wrapper_menu_burger" @click="setIsShowMenu()">
        <div class="menu_burger"></div>
        <div class="menu_burger"></div>
        <div class="menu_burger"></div>
      </div>

    </div>

    <div class="header_wrapper_exit">
      <!-- <p class="welcom_text" v-if="isLoggedIn">Добро пожаловать, {{JSON.parse( nameUser ).name }}</p> -->
      <span class="header_exit" v-if="isLoggedIn"> <a @click="runLogout">Выход</a></span>
      <span class="header_exit" v-else> <a @click="$router.push('/')">Вход</a></span>
    </div>

  </header>

  <UImodal v-if="getIsShowModalWindowNotice">
    <NoticeUser />
  </UImodal>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import UImodal from "../UI/UImodal.vue";

export default {
  name: "HeaderNet",
  data() {
    return {
      userID: (localStorage.getItem("user")) ? JSON.parse(localStorage.getItem("user")).userID : "",
      // nameUser: (localStorage.getItem("token")) ? atob(localStorage.getItem("token").split(".")[1]) : "",

    };
  },
  methods: {
    ...mapMutations({
      setIsShowModalWindowNotice: "noticeStore/setIsShowModalWindowNotice",
      setIsShowMenu: "authorizationStore/setIsShowMenu"
    }),
    ...mapActions({
      logout: "authorizationStore/logout",
    }),
    runLogout() {
      this.logout()
        .then(() => {
          // window.location.href = "/";
          this.$router.push('/')
        });
    }
  },
  computed: {
    ...mapGetters({
      isLoggedIn: "authorizationStore/isLoggedIn",
      // getUser: "authorizationStore/getUser",
      getIsShowModalWindowNotice: "noticeStore/getIsShowModalWindowNotice",
      getNoticeArray: "noticeStore/getNoticeArray"
    }),

    countNotice() {
      return this.getNoticeArray.filter(notice => notice.show_notice !== 1);
    },

    pathID() {
      return (this.userID) ? '/id' + this.userID : '/';
    }
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

.header_wrapper_logo_title_notice {
    display: flex;
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
  text-shadow: 1px 1px 0 #ccc, 4px 4px 0 rgb(0 0 0 / 15%);
  display: flex;
  align-items: center;
  font-size: 45px;
  font-family: "Russo One", fantasy, sans-serif;
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
  font-family: Russo One, fantasy, sans-serif;
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

.header_exit:hover {
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
  margin-left: 25px;
  align-items: center;
  margin-top: 6px;
}

.new_message_img {
  width: 35px;
  margin-right: 10px;
  margin-left: 5px;
  cursor: pointer;
}

.notice_true {
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin-left: -8px;
  background-color: #FF6B6B;
  cursor: pointer;
}

.notice_true p {
  font-size: 13px;
  font-family: emoji;
  font-weight: 600;
}

.wrapper_menu_burger {
  display: none;
}

.menu_burger {
    display: none;
}

/* МЕДИА-ЗАПРОСЫ */

@media (max-width: 761px) {
  .header {
    justify-content: center;
  }

  .header_wrapper_logo_title {
    margin-left: 0px;
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    justify-content: space-around;
}

.header_wrapper_logo {
    display: none;
}

  .header_logo {
    width: 40px;
    margin-right: 5px;
  }

  .header_wrapper_exit {
    display: none;
  }

  .header_wrapper_title {
    margin-left: 0px;
  }

  .btn_title {
    font-size: 35px;
  }

  .wrapper_notice {
    margin-top: 3px;
    margin-left: 20px;
    position: relative;
  }

  .new_message_img {
    width: 25px;
    margin-right: 0px;
    margin-left: 0px;
  }

  .notice_true[data-v-2dc6f19b] {
    width: 18px;
    height: 18px;
    position: absolute;
    left: 25px;
    margin-left: 0px;
  }

  .wrapper_menu_burger {
    display: flex;
    width: 30px;
    height: 30px;
    flex-direction: column;
  }

  .menu_burger {
    display: flex;
    border-bottom: 5px solid black;
    width: 100%;
    padding-bottom: 5px;
    cursor: pointer;
  }
}
</style>