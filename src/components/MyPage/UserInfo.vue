<template>
  <div class="wrapper_user">

    <div class="wrapper_info">

      <div class="wrapper_ava_user">
        <img class="ava_user" src="@/assets/ava/ava_1.jpg" alt="ava">
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
      >Редактировать профиль</UIbtn>
    </div>

  </div>
</template>

<script>
import {mapGetters, mapMutations} from "vuex"
export default {
  name: "UserInfo",

  data() {
    return { }
  },

  methods: {
    ...mapMutations({showModalTrue: "modalStore/showModalTrue",
    setModulEditProfile: "editProfileStore/setModulEditProfile"
  }),

  },

  computed: {
    ...mapGetters({
      getUser: "authorizationStore/getUser",
      age: "authorizationStore/age"
    }),
  }
}
</script>

<style scoped>
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