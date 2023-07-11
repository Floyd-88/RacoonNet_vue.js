<template>
  <div class="wrapper_user">

    <div class="wrapper_info">

      <!-- блок с аватаркой -->
      <div class="wrapper_ava_user" @mouseenter="show_btn_photo" @mouseleave="active_btn = false">
        <div class="block_ava_user">
          <UIAva :ava="getUser.ava"/>
        </div>

        <div class="wrapper_btn_main_photo" v-if="getUser.is_editProfile">

          <transition v-if="text_btn === 'Загрузить главное фото'" name="mainPhoto">
            <button class="btn_main_photo" v-show="active_btn"
              @click="showFullAvaPhoto({ bool: true, load: 'load' })">{{ text_btn }}</button>
          </transition>

          <transition v-else name="mainPhoto">
            <button class="btn_main_photo" v-show="active_btn"
              @click="showFullAvaPhoto({ bool: true, load: 'edit' })">{{ text_btn }}</button>
          </transition>

        </div>
      </div>

      <!-- <div @click="editToken">Поменять токен</div> -->

      <!-- модальное окно для загрузки-редактирования аватарки  -->
      <div @click="setShowFullAvaPhoto(false)">
        <UImodal v-if="getShowFullAvaPhoto">
          <MainPhoto />
        </UImodal>
      </div>

      <!-- блок с информацией о пользователе -->
      <div class="wrapper_info_user">
        <div class="wrapper_name_user">
          <p v-if="getUser.name" class="name_user">{{ getUser.name + " " + getUser.surname }}</p>
        </div>
        <div class="wrapper_city_user">
          <p v-if="getUser.country" class="city_user">Страна: <span class="city_user_name">{{ getUser.country }}</span></p>
          <p v-if="getUser.city"  class="city_user">Город:  <span class="city_user_name">{{ getUser.city }}</span></p>
          <p v-if="age" class="city_user">Возраст: <span class="city_user_name">{{ age }}</span></p>
          <p v-if="getUser.selectedGender"  class="city_user">Пол: <span class="city_user_name">{{ getUser.selectedGender }}</span></p>
        </div>
      </div>

    </div>

    <div class="wrapper_btn" v-if="getIsBtnsBlock">
      <UIbtn 
      v-if="getUser.is_editProfile"
      class="redaction_profile_btn" 
      @click="setModulEditProfile(true)">
      Редактировать профиль
      </UIbtn>

      <UIbtn 
      v-if="!getUser.is_editProfile && getToken"
      class="redaction_profile_btn" 
      @click="setModalWriteMessage(true)">
      Написать сообщение
      </UIbtn>

      <UIbtn 
      v-if="!getUser.is_editProfile && getToken && getIsFriend"
      ref = addFriendBtn
      class="add_friend_btn"
      :class="{'add_friend_btn_togle': getTextBtnFfriend === 'Заявка отправлена'}" 
      @click="addFriend(getTextBtnFfriend)">
      {{ getTextBtnFfriend }}
      </UIbtn>
    </div>
      
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex"
import UIbtn from "../UI/UIbtn.vue";

export default {
  name: "UserInfo",
  components: { UIbtn },

  data() {
    return {
      active_btn: false,
      text_btn: "",   
    };
  },

  // created() {
  //   this.CHECK_REQUEST_FRIEND(this.$route.params.id);
  // },

  mounted() {
    console.log('golf')
  },

  methods: {
    ...mapMutations({
      setModulEditProfile: "editProfileStore/setModulEditProfile",
      setShowFullAvaPhoto: "showFullPhotoStore/setShowFullAvaPhoto",
      setModalWriteMessage: "messageStore/setModalWriteMessage",
      setIsFriendShow: "friendsStore/setIsFriendShow",
      setCountFriendsNull: "friendsStore/setCountFriendsNull",
    }),
    ...mapActions({
      showFullAvaPhoto: "showFullPhotoStore/showFullAvaPhoto",
      ADD_FRIEND: "friendsStore/ADD_FRIEND",
      CHECK_REQUEST_FRIEND: "friendsStore/CHECK_REQUEST_FRIEND"
      // age: "authorizationStore/age",

    }),

    show_btn_photo() {
      this.active_btn = true;
      if (`${'../../assets/' + this.getUser.ava}`.includes("/img/ava_1")) { //????????????????///
        this.text_btn = "Загрузить главное фото";
      } else {
        this.text_btn = "Редактировать фото";
      }
    },

    //приглашение в друзья
    addFriend(nameBTN) {
      if(nameBTN === "Рассмотреть заявку") {
      this.setCountFriendsNull();
        this.setIsFriendShow("friendsMe");
        this.$router.push({ name: 'friendspage', query: { id: JSON.parse(localStorage.getItem('user')).userID } });
      } else {
        this.ADD_FRIEND(this.$route.params.id);
      }
    }

    // editToken() {
    //   localStorage.setItem('token', "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSWx5YSIsImlkIjoyLCJpYXQiOjE2NzYzMjA0NjUsImV4cCI6MTY3NjQwNjg2NX0=.kWsqEdmYWjsShYxCy8TV2ivBk7J_wLCqNaAlilrs2VE");
    // }

  },

  computed: {
    ...mapGetters({
      getUser: "authorizationStore/getUser",
      getShowFullAvaPhoto: "showFullPhotoStore/getShowFullAvaPhoto",
      getToken: "authorizationStore/getToken",
      getTextBtnFfriend: "friendsStore/getTextBtnFfriend",
      getIsFriend: "friendsStore/getIsFriend",
      getStatus: "authorizationStore/getStatus",
      getIsBtnsBlock: "friendsStore/getIsBtnsBlock"
    }),

    // pathAva() {
    //   try {
    //     return require(`../../assets/photo/${this.getUser.ava}`);
    //   } catch {
    //     return require(`../../assets/ava/ava_1.jpg`);
    //   }
    // },

    //вычисляет возраст пользователя
    age() {
            const today = new Date();
            const birthday = this.getUser.year_user + "-" + this.getUser.month_user + "-" + this.getUser.day_user;
            const birthDate = new Date(birthday);
            const age = today.getFullYear() - birthDate.getFullYear();
            if (
                today.getMonth() < birthDate.getMonth() || (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())
            ) {
                return age - 1;
            }
            return age;
        },

  },

}
</script>

<style scoped>
.mainPhoto-enter-active {
  animation: bounce-in .3s;
}

.mainPhoto-leave-active {
  animation: bounce-in .3s reverse;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
  }

  /* 50% {
    transform: scale(1);
  } */
  100% {
    transform: scale(1);
  }
}

.wrapper_user {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  border-radius: 5px;
  background: #f8f8f9;
  box-shadow: 0px 2px 5px 0px rgb(0 0 0 / 40%);
}

/* .wrapper_ava_user {
} */
.wrapper_info {
  display: flex;
}

.wrapper_info_user {
  display: flex;
  flex-direction: column;
  margin: 20px;
}

.wrapper_ava_user {
  position: relative;
}

.block_ava_user {
  width: 200px;
  height: 200px;
  overflow: hidden;
  border-radius: 100%;
}

/* .ava_user {
  width: 100%;
  height: auto;
} */

.wrapper_btn_main_photo {
  width: 83%;
  margin: auto;
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-43%, -20%);
}

.btn_main_photo {
  padding: 5px;
  background: white;
  border: 1px solid cadetblue;
  border-radius: 9px;
  box-shadow: 0px 5px 10px 0px rgb(0 0 0 / 50%);
  cursor: pointer;
}

.btn_main_photo:hover {
  filter: brightness(90%);
  transition: 0.3s;
}

/* .wrapper_name_user {
} */
.name_user {
  font-size: 20px;
  font-family: Russo One, fantasy, sans-serif;
}

.wrapper_city_user {
  margin-top: 5px;
}

.city_user {
  font-size: 16px;
  font-family: Russo One, fantasy, sans-serif;
  /*margin-bottom: 5px;*/
}

.city_user_name {
  font-size: 16px;
  font-family: Roboto Condensed, Arial, Helvetica, sans-serif;
}

.wrapper_btn {
  margin: 20px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
}

.redaction_profile_btn {
  width: auto;
  font-size: 12px;
  margin-bottom: 15px;
}

.add_friend_btn {
  width: 155px;
  font-size: 12px;
  margin-bottom: 15px;
  background: #00adef;
  border: 2px solid #00adef;

}
.add_friend_btn_togle {
  /* filter: opacity(0.5); */
    background: content-box;
    /* transition: 0.3s; */
    z-index: 1;
    border: 2px solid #00adef;
    box-shadow: 0px 1px 3px 0px rgb(0 0 0 / 40%);
}
.add_friend_btn_togle:hover {
    /* filter: opacity(0.5); */
    background: content-box;
    /* transition: 0.3s; */
}

/* МЕДИА-ЗАПРОСЫ */

@media (max-width: 761px) {
.wrapper_user {
flex-direction: column;
}

.wrapper_info {
    flex-direction: column;
    align-items: center;
}

.block_ava_user {
    width: 100px;
    height: 100px;
    margin-top: 10px;
}

.wrapper_info_user{
  margin: 10px;
    width: 100%;
    padding: 0 20px;
}

.wrapper_name_user {
    display: flex;
    justify-content: center;
}

.wrapper_city_user{
    margin-top: 15px;
    display: flex;
    flex-direction: column;
}

.city_user{
    font-size: 17px;
    opacity: 0.9;
}

.city_user_name{
    font-size: 17px;
}

.redaction_profile_btn {
    font-size: 15px;
}

.name_user{
  text-align: center;
}

/* МЕДИА-ЗАПРОСЫ */

@media (max-width: 761px) {
  .wrapper_btn_main_photo {
  width: 146%;
}
.btn_main_photo {
  font-size: 12px;
}

.add_friend_btn {
  width: auto;
  font-size: 15px;

}

}
}
</style>