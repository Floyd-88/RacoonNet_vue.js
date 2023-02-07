<template>
  <div class="wrapper_user">

    <div class="wrapper_info">

      <div class="wrapper_ava_user" @mouseenter="show_btn_photo " @mouseleave="active_btn = false">
        <div class="block_ava_user">
          <img class="ava_user" 
          :src="pathAva" alt="ava" ref="ava">
        </div>
        <div class="wrapper_btn_main_photo">

          <transition v-if="text_btn==='Загрузить главное фото'" name="mainPhoto">
            <button class="btn_main_photo" v-show="active_btn" @click="modalLoadPhoto('ava')">{{text_btn}}</button>
          </transition>

          <transition v-else name="mainPhoto">
            <button class="btn_main_photo" v-show="active_btn" @click="setShowFullAvaPhoto(true)">{{text_btn}}</button>
          </transition>

        </div>
      </div>
      
      <!-- загрузчик аватарки -->
    <UImodal class="modal_fone" v-if="getIsModalLoadPhoto">
      <FileUpload/>
    </UImodal>

    <div @click="setShowFullAvaPhoto(false)">
      <UImodal v-if="getShowFullAvaPhoto">
        <MainPhoto/>
      </UImodal>
    </div>
  
      
      
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

export default {
    name: "UserInfo",
    components: { UIbtn},

    data() {
        return {
          active_btn: false,
          text_btn: "", 
          // showFullMainPhoto: false         
        };
    },

    // created() {
    //     document.onkeydown = (e) => {
    //       if(e.keyCode === 27) {
    //         console.log(6657)
    //       }
    //   }
    // },

    methods: {
        ...mapMutations({ 
          showModalTrue: "modalStore/showModalTrue", 
          setModulEditProfile: "editProfileStore/setModulEditProfile",
          setIsModalLoadPhoto: "loadPhotoStore/setIsModalLoadPhoto",
          setShowFullAvaPhoto: "showFullPhotoStore/setShowFullAvaPhoto"
        }),
        ...mapActions({
          modalLoadPhoto: "loadPhotoStore/modalLoadPhoto",
          fullSizePhoto: "showFullPhotoStore/fullSizePhoto"
        }),

        show_btn_photo() {
          this.active_btn = true;
          if(this.pathAva.includes("/img/ava_1")) {
            this.text_btn = "Загрузить главное фото";
          } else {
            this.text_btn = "Редактировать фото";
          }
        },

        // editMainPhoto(bool) {
        //   this.showFullMainPhoto = bool
        // }

    },
    computed: {
        ...mapGetters({
            getUser: "authorizationStore/getUser",
            age: "authorizationStore/age",
            getIsModalLoadPhoto: "loadPhotoStore/getIsModalLoadPhoto",
            getShowFullAvaPhoto: "showFullPhotoStore/getShowFullAvaPhoto"
        }),

        pathAva() {
          try{
            return require(`../../assets/photo/${this.getUser.ava}`);
          } catch {
            return require(`../../assets/ava/ava_1.jpg`);
          }

        }, 

        // text_btn() {
        //   if(this.$refs.src == "http://localhost:8080/img/ava_1.jpg") {
        //     return 1111
        //   } else {
        //     return this.$refs.src
        //   }
        // }
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