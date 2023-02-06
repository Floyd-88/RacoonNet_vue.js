<template>
  <div class="wrapper_user">

    <div class="wrapper_info">

      <div class="wrapper_ava_user" @mouseenter="active_btn = true" @mouseleave="active_btn = false">
        <div>
          <img class="ava_user" :src=" require('../../assets/photo/' + getUser.ava)" alt="ava">
        </div>
        <div class="wrapper_btn_main_photo">

          <transition name="mainPhoto">
            <button class="btn_main_photo" v-show="active_btn" @click="modalLoadPhoto('ava')">Загрузить главное фото</button>
          </transition>

        </div>
      </div>

      <!-- загрузчик аватарки -->
    <UImodal class="modal_fone" v-if="getIsModalLoadPhoto">
      <FileUpload/>
    </UImodal>
  
      
      
      <div class="wrapper_info_user">
        <div class="wrapper_name_user">
          <p class="name_user">{{getUser.name + " " + getUser.surname}}</p>
        </div>
        <div class="wrapper_city_user">
          <p class="city_user">Страна: {{getUser.country}}</p>
          <p class="city_user">Город: {{getUser.city}}</p>
          <p @click="func" class="city_user">Возраст: {{age}}</p>
        </div>
      </div>

    </div>

    <div class="wrapper_btn">
      <UIbtn class="redaction_profile_btn"
      @click="setModulEditProfile(true)"
      >Редактировать профиль
    </UIbtn>
    </div>

  </div>
</template>

<script>
import {mapGetters, mapMutations, mapActions} from "vuex"
import UIbtn from "../UI/UIbtn.vue";
// import AvaUpload from "../AvaUpload.vue";
export default {
    name: "UserInfo",
    data() {
        return {
          active_btn: false,
        };
    },
    methods: {
        ...mapMutations({ 
          showModalTrue: "modalStore/showModalTrue", 
          setModulEditProfile: "editProfileStore/setModulEditProfile",
          setIsModalLoadPhoto: "loadPhotoStore/setIsModalLoadPhoto"
        }),

        show_btn_photo() {
          this.active_btn = !this.active_btn
        },

        ...mapActions({modalLoadPhoto: "loadPhotoStore/modalLoadPhoto"})
    },
    computed: {
        ...mapGetters({
            getUser: "authorizationStore/getUser",
            age: "authorizationStore/age",
            getIsModalLoadPhoto: "loadPhotoStore/getIsModalLoadPhoto"
        }),
    },
    components: { UIbtn}
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
.ava_user {
  width: 200px;
  border-radius: 100%;
}
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

.wrapper_btn_main_photo{
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
}
.redaction_profile_btn {
  width: 155px;
  font-size: 13px;
}
</style>