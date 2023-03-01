<template>
  <div class="wrapper_user">

    <div class="wrapper_info">

      <!-- блок с аватаркой -->
      <div class="wrapper_ava_user" @mouseenter="show_btn_photo" @mouseleave="active_btn = false">
        <div class="block_ava_user">
          <img class="ava_user" :src="pathAva" alt="ava" ref="ava">
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
          <p v-if="getUser.country" class="city_user">Страна: {{ getUser.country }}</p>
          <p v-if="getUser.city"  class="city_user">Город: {{ getUser.city }}</p>
          <p v-if="age" class="city_user">Возраст: {{ age }}</p>
          <p v-if="getUser.selectedGender"  class="city_user">Пол: {{ getUser.selectedGender }}</p>
        </div>
      </div>

    </div>

    <div class="wrapper_btn" >
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
      v-if="!getUser.is_editProfile && getToken"
      ref = addFriendBtn
      class="add_friend_btn"
      :class="{'add_friend_btn_togle': text_btn_friend === 'Заявка отправлена'}" 
      @click="addFriend()"
      >
      {{ text_btn_friend }}
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
      text_btn_friend: "Добавить в друзья"     
    };
  },

  methods: {
    ...mapMutations({
      setModulEditProfile: "editProfileStore/setModulEditProfile",
      setShowFullAvaPhoto: "showFullPhotoStore/setShowFullAvaPhoto",
      setModalWriteMessage: "messageStore/setModalWriteMessage"
    }),
    ...mapActions({
      showFullAvaPhoto: "showFullPhotoStore/showFullAvaPhoto",
      // age: "authorizationStore/age",

    }),

    show_btn_photo() {
      this.active_btn = true;
      if (this.pathAva.includes("/img/ava_1")) { //????????????????///
        this.text_btn = "Загрузить главное фото";
      } else {
        this.text_btn = "Редактировать фото";
      }
    },

    addFriend() {
      this.text_btn_friend === "Добавить в друзья" ? this.text_btn_friend = "Заявка отправлена" : this.text_btn_friend = "Добавить в друзья";
    }

    // editToken() {
    //   localStorage.setItem('token', "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSWx5YSIsImlkIjoyLCJpYXQiOjE2NzYzMjA0NjUsImV4cCI6MTY3NjQwNjg2NX0=.kWsqEdmYWjsShYxCy8TV2ivBk7J_wLCqNaAlilrs2VE");
    // }

  },

  computed: {
    ...mapGetters({
      getUser: "authorizationStore/getUser",
      getShowFullAvaPhoto: "showFullPhotoStore/getShowFullAvaPhoto",
      getToken: "authorizationStore/getToken"
    }),

    pathAva() {
      try {
        return require(`../../assets/photo/${this.getUser.ava}`);
      } catch {
        return require(`../../assets/ava/ava_1.jpg`);
      }
    },

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

.ava_user {
  width: 100%;
  height: auto;
}

.wrapper_btn_main_photo {
  width: 83%;
  margin: auto;
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, -20%);
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
  font-family: fantasy;
}

.wrapper_city_user {
  margin-top: 5px;
}

.city_user {
  font-size: 16px;
  font-family: math;
  /*margin-bottom: 5px;*/
}

.wrapper_btn {
  margin: 20px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
}

.redaction_profile_btn {
  width: 155px;
  font-size: 13px;
  margin-bottom: 15px;
}

.add_friend_btn {
  width: 155px;
  font-size: 13px;
  margin-bottom: 15px;
  background: #00adef;
  border: 1px solid #00adef;

}
.add_friend_btn_togle {
  /* filter: opacity(0.5); */
    background: content-box;
    transition: 0.3s;
    z-index: 1;
    border: 1px solid #00adef;
    box-shadow: 0px 1px 3px 0px rgb(0 0 0 / 40%);
}
.add_friend_btn_togle:hover {
    /* filter: opacity(0.5); */
    background: content-box;
    transition: 0.3s;
}
</style>