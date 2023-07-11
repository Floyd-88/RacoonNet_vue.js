<template>
  <transition name="slideDown">

    <div class="wrapper_nav" v-show="getIsShowMenu || isSmallScreen">
    <div class="wrapper_nav_link" @click="goMyPage()">
      <button class="link" :disabled="!blockBtnNavigation"> Моя страница </button>
    </div>
    <div class="wrapper_nav_link" @click="goNews()">
      <button class="link" :disabled="!blockBtnNavigation"> Новости </button>
    </div>
    <div class="wrapper_nav_link" @click="goMessage()" >
      <button class="link" :disabled="!blockBtnNavigation">Сообщения</button>
      <p :class="{ 'new_message': newMessage }"></p>
    </div>
    <div class="wrapper_nav_link" @click="goMyFriend()">
      <button class="link" :disabled="!blockBtnNavigation"> Мои друзья</button>
      <p :class="{ 'new_message': getUsersFriendsMe.length > 0 }"></p>
    </div>
    <div class="wrapper_nav_link" @click="goMyGallery()">
      <button class="link" :disabled="!blockBtnNavigation">Галерея</button>
    </div>
    <div class="wrapper_nav_link exit" @click="runLogout">
      <button class="link" :disabled="!blockBtnNavigation">Выход</button>
    </div>
    <div class="wrapper_nav_link_help" @click="openFeedBack()">
      <button class="link_help"> Обратная связь </button>
    </div>
  </div>

  </transition>

</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
export default {
  name: "NavigationNet",

  data() {
    return {
      userID: JSON.parse(localStorage.getItem('user')).userID,
      blockBtnNavigation: true,
      // blockBtnMessage: true,
      // isSmallScreen: false,
      
    }
  },

  created() {
    window.addEventListener('resize', this.checkSize);
    this.checkSize();
  },
  unmounted() {
    this.setIsShowMenuClose();
    window.removeEventListener('resize', this.checkSize);
  },

  methods: {
    ...mapActions({
      loadUser: "authorizationStore/loadUser",
      GET_USER_MY_FRIENDS: "friendsStore/GET_USER_MY_FRIENDS",
      LOAD_DIALOGS: "messageStore/LOAD_DIALOGS",
      UPDATE_FLAGS_UNREAD_MESSAGE: "messageStore/UPDATE_FLAGS_UNREAD_MESSAGE",
      GET_PHOTO_NOT_FILTER: "galleryStore/GET_PHOTO_NOT_FILTER",
      logout: "authorizationStore/logout",
    }),

    ...mapMutations({
      setUserEditProfile: "authorizationStore/setUserEditProfile",
      setIsModalFeedBack: "feedBackStore/setIsModalFeedBack",
      setUsersMyFriends: "friendsStore/setUsersMyFriends",
      setCountFriendsNull: "friendsStore/setCountFriendsNull",
      setUsersMyFriendsFilter: "friendsStore/setUsersMyFriendsFilter",
      setIsFriendShow: "friendsStore/setIsFriendShow",
      setCountDialogsNull: "messageStore/setCountDialogsNull",
      setArrayDialogs: "messageStore/setArrayDialogs",
      setArrayMessages: "messageStore/setArrayMessages",
      setTitleFriend: "friendsStore/setTitleFriend",
      setIsShowMenuClose: "authorizationStore/setIsShowMenuClose",
      setPhotosPostsArray: "postsMyPageStore/setPhotosPostsArray"
    }),

    async goMyPage() {
      this.blockBtnNavigation = false;

      await this.$router.push(`/id${this.userID}`);
      // this.setUsersMyFriends([]);
      // this.setUsersMyFriendsFilter([]);
      // this.setCountFriendsNull()
      // await this.GET_USER_MY_FRIENDS(this.userID);

      this.blockBtnNavigation = true;
    },

    async goNews() {
      this.blockBtnNavigation = false;

      this.setUserEditProfile(false);
      this.setPhotosPostsArray([]);
      await this.$router.push('/news');

      this.blockBtnNavigation = true;
    },

    async goMyGallery() {
      this.blockBtnNavigation = false;

      await this.$router.push('/gallery');
      await this.GET_PHOTO_NOT_FILTER();

      this.blockBtnNavigation = true;

    },

    openFeedBack() {
     this.setIsModalFeedBack(true);
     this.setIsShowMenuClose();
    },

    async goMyFriend() {
      this.blockBtnNavigation = false;

      this.setUsersMyFriends([]);
      this.setUsersMyFriendsFilter([]);
      this.setCountFriendsNull();
      this.setIsFriendShow('allFriends');
      this.setTitleFriend('Друзья');

      if (this.getCountFriends === 0) {
        await this.GET_USER_MY_FRIENDS(this.userID);
        await this.$router.push({ name: 'friendspage', query: { id: this.userID } });
        } 
        this.blockBtnNavigation = true;
    },

    async goMessage() {
      this.blockBtnNavigation = false;

      this.setCountDialogsNull();
      this.setArrayDialogs([]);
      this.setArrayMessages([]);
      await this.LOAD_DIALOGS()
        .then(() => {
        })
        .catch((err) => {
          if (err.code === "ERR_CANCELED") {
            this.setCountDialogsNull();
            this.setArrayDialogs([]);
            this.setArrayMessages([]);
            this.LOAD_DIALOGS()
              .catch((err) => {
                if (err.code === "ERR_CANCELED") {
                  console.log("Загрузка была отменена")
                }
              });
          }
        });
      await this.$router.push('/message');
      this.blockBtnNavigation = true;
    },

    //проверяем размер экрана
    checkSize(){
      this.isSmallScreen = innerWidth > 761;
      this.setIsShowMenuClose();
    },

    async runLogout() {
    this.blockBtnNavigation = false;
    await this.logout()
        .then(() => {
          window.location.href = "/";
          // this.$router.push('/')
        });
    this.blockBtnNavigation = true;
    }

  },

  computed: {
    ...mapGetters({
      // getCountNewMessage: "messageStore/getCountNewMessage",
      getArrayDialogs: "messageStore/getArrayDialogs",
      getUsersFriendsMe: "friendsStore/getUsersFriendsMe",
      getUser: "authorizationStore/getUser",
      getIsFriendShow: "friendsStore/getIsFriendShow",
      getTitleFriend: "friendsStore/getTitleFriend",
      getCountFriends: "friendsStore/getCountFriends",
      getArrayMessages: "messageStore/getArrayMessages",
      getIsShowMenu: "authorizationStore/getIsShowMenu"
    }),

    newMessage() {
      return this.getArrayDialogs.some(dialog => dialog.unread)
    }
  }

}
</script>

<style scoped>
.wrapper_nav {
  /*background: floralwhite;*/
  padding: 30px;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 100px;
  height: 100%;
  min-width: 150px;
}

.wrapper_nav_link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: max-content;
}

/* .new_message {
  padding-left: 10px;
  font-size: 18px;
  color: #0197d6;
} */

.new_message {
  color: #fff;
  background-color: #fff;
  background-image: linear-gradient(#bdd7fa, #5d66b1 50%, #010767 20%, #40def7);
  background-image: -moz-linear-gradient(#bdd7fa, #5d66b1 50%, #010767 20%, #40def7);
  background-image: -webkit-linear-gradient(#bdd7fa, #5d66b1 50%, #010767 20%, #40def7);
  background-image: -o-linear-gradient(#bdd7fa, #5d66b1 50%, #010767 20%, #40def7);
  border: 0px;
  border-radius: 10px;
  padding: 7px 7px;
  margin-left: 8px;
}

.link {
  margin: 7px 0;
  font-size: 18px;
  font-family: Russo One, fantasy, sans-serif;
  border: none;
  cursor: pointer;
  background: none;
  color: black;
}

.link:after {
  display: none;
  /*превращаем его в блочный элемент*/
  content: "";
  /*контента в данном блоке не будет поэтому в кавычках ничего не ставим*/
  height: 3px;
  /*задаём высоту линии*/
  width: 0%;
  /*задаём начальную ширину элемента (линии)*/
  background-color: #2f3030;
  /*цвет фона элемента*/
  transition: width 0.2s ease-in-out;
  /*данное свойство отвечает за плавное изменение ширины. Здесь можно задать время анимации в секундах (в данном случае задано 0.4 секунды)*/
}

.link:hover:after {
  width: 100%;
}

.link:hover {
  filter: contrast(30%)
}

.wrapper_nav_link_help {
  border-top: 1px solid black;
  padding-top: 10px;
  margin-top: 5px;
  width: max-content;
}

.link_help {
  background: none;
  border: none;
  font-family: Russo One, fantasy, sans-serif;
  font-size: 13px;
  color: #636363;
  cursor: pointer;
}

.link_help:hover {
  filter: brightness(80%);
}

.exit {
  display: none;
}
/* МЕДИА-ЗАПРОСЫ */

@media (max-width: 761px) {

  .wrapper_nav {
    width: 90%;
    padding: 100px 0px 0px 0px;
    top: 0;
    left: 0;
    right: 0;
    margin: 0 auto;
    height: auto;
    min-width: auto;
    border-radius: 5px;
    background: #f2f2f2;
    box-shadow: 0px 2px 5px 0px rgb(0 0 0 / 40%);
    position: fixed;
    z-index: 1;
}

.wrapper_nav_link {
    display: flex;
    justify-content: center;
    align-items: center;
    /* background-color: cornflowerblue; */
    width: 100%;
    box-shadow: 0px 2px 3px 0px rgb(0 0 0 / 30%);
}

.wrapper_nav_link:hover {
  background-color: #e2e0e0;
}

.link:hover {
  filter:none;
}

.wrapper_nav_link_help {
    border-top: none;
    padding: 10px;
    margin-top: 0;
    /* background-color: cornflowerblue; */
    width: 100%;
    display: flex;
    justify-content: center;
}
.link_help {
    font-size: 14px;
    color: black;
    opacity: .5;
}
.exit {
  display:flex;
}

.slideDown-enter-active, .slideDown-leave-active {
  transition: all 0.3s ease;
  /* overflow: hidden; */
}
.slideDown-enter-from, .slideDown-leave-to  {
  transform: translateY(-100%);
  transition: all 0.3s ease-in 0s
}
}
</style>



