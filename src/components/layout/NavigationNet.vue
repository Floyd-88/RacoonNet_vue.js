<template>
  <div class="wrapper_nav">
    <div class="wrapper_nav_link">
       <button class="link" @click="goMyPage()" > Моя страница </button>
    </div>
    <div class="wrapper_nav_link">
      <button class="link" @click="goNews()"> Новости </button>
    </div>
    <div class="wrapper_nav_link">
      <button class="link" @click="goMessage()">Сообщения</button>
      <p :class="{'new_message': newMessage}"></p>
    </div>
    <div class="wrapper_nav_link">
      <button class="link"  @click="goMyFriend()"> Мои друзья</button>
      <p :class="{'new_message': getUsersFriendsMe.length > 0}"></p>
    </div>
    <div class="wrapper_nav_link">
      <button class="link" @click="$router.push('/gallery')"> Галерея</button>
    </div>
    <div class="wrapper_nav_link_help">
       <button class="link_help" @click="setIsModalFeedBack(true)" > Обратная связь </button>
  </div>
  </div>

  
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
export default {
  name: "NavigationNet",
  
  data() {
    return {
      userID: JSON.parse(localStorage.getItem('user')).userID,
    }
  },

  methods: {
    ...mapActions({
      loadUser: "authorizationStore/loadUser",
      GET_USER_MY_FRIENDS: "friendsStore/GET_USER_MY_FRIENDS",
      LOAD_DIALOGS: "messageStore/LOAD_DIALOGS",
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
    }),

    goMyPage() {
      this.$router.push(`/id${this.userID}`);
      this.setUsersMyFriends([]);
      this.setUsersMyFriendsFilter([]);
      this.setCountFriendsNull()
      this.GET_USER_MY_FRIENDS(this.userID);
    },

    goNews() {
      this.setUserEditProfile(false)
      this.$router.push('/news');
    },
    goMyFriend() {
      this.setUsersMyFriends([]);
      this.setUsersMyFriendsFilter([]);
      this.setCountFriendsNull()
      if(this.getCountFriends === 0) {
          this.GET_USER_MY_FRIENDS(this.userID). 
          then(() => {
            this.$router.push({name: 'friendspage', query: {id: this.userID} });
          })
        }
    },

    goMessage() {
      this.setCountDialogsNull();
      this.setArrayDialogs([]);
      this.setArrayMessages([]);
      this.LOAD_DIALOGS();
      this.$router.push('/message');
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
      getCountFriends: "friendsStore/getCountFriends"
  }),

    newMessage() {
      return this.getArrayDialogs.some(dialog => dialog.unread)
    }
  }

  // watch: {
  //   $route() {
  //     const id = this.$route.params.id;
      
  //     if (id) {
  //       this.loadUser({ id })
  //         .then(() => {
  //         })
  //         .catch(() => {
  //           // if (err) {
  //             // console.log(err.response.data)
  //             this.$router.push('notFound')
  //           // }
  //         })
  //     }
  //   }
  // }

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
}
/* .new_message {
  padding-left: 10px;
  font-size: 18px;
  color: #0197d6;
} */

  .new_message {
    color:#fff;
    background-color:#fff;
    background-image: linear-gradient(#bdd7fa, #5d66b1 50%, #010767 20%, #40def7);
    background-image: -moz-linear-gradient(#bdd7fa, #5d66b1 50%, #010767 20%, #40def7);
    background-image: -webkit-linear-gradient(#bdd7fa, #5d66b1 50%, #010767 20%, #40def7);
    background-image: -o-linear-gradient(#bdd7fa, #5d66b1 50%, #010767 20%, #40def7);
    border:0px;
    border-radius:10px;
    padding: 7px 7px;
    margin-left: 8px;
}
.link {
  margin: 7px 0;
  font-size: 18px;
  font-family: fantasy;
  border: none;
  cursor: pointer;
  background: none;
  color: black;
}
.link:after {
  display: none; /*превращаем его в блочный элемент*/
  content: ""; /*контента в данном блоке не будет поэтому в кавычках ничего не ставим*/
  height: 3px; /*задаём высоту линии*/
  width: 0%; /*задаём начальную ширину элемента (линии)*/
  background-color: #2f3030; /*цвет фона элемента*/
  transition: width 0.2s ease-in-out; /*данное свойство отвечает за плавное изменение ширины. Здесь можно задать время анимации в секундах (в данном случае задано 0.4 секунды)*/
}
.link:hover:after{
  width: 100%;
}
.link:hover{
  filter:contrast(30%)
}

.wrapper_nav_link_help {
  border-top: 1px solid black;
    padding-top: 10px;
    margin-top: 5px;
}
.link_help {
  background: none;
    border: none;
    font-family: fantasy;
    font-size: 13px;
    color: #636363;
    cursor: pointer;
}

.link_help:hover {
filter: brightness(80%);
}
</style>



