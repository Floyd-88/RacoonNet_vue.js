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
          <p class="city_user">Населенный пункт: {{getUser.city}}</p>
          <p class="city_user">Возраст:{{age}}</p>
        </div>
      </div>

    </div>

    <div class="wrapper_btn">
      <UIbtn>Редактировать профиль</UIbtn>
    </div>

  </div>
</template>

<script>
import {mapGetters} from "vuex"
export default {
  name: "UserInfo",

  computed: {
    ...mapGetters({getUser: "authorizationStore/getUser"}),

    age() {
        const today = new Date();
        const birthDate = new Date(this.getUser.birthday);
        const age = today.getFullYear() - birthDate.getFullYear();
        if (
            today.getMonth() < birthDate.getMonth() || (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())
        ) {
          return age - 1;
        }
    return age;
    },
  }
}
</script>

<style scoped>
.wrapper_user {
  display: flex;
  justify-content: space-between;
  border: 1px solid;
  margin-bottom: 15px;
}
.wrapper_ava_user {
}
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
.wrapper_name_user {
}
.name_user {
  font-size: 20px;
  font-family: cursive;
}
.wrapper_city_user {
  margin-top: 5px;
}
.city_user {
  font-size: 16px;
  font-family: cursive;
  /*margin-bottom: 5px;*/
}
.wrapper_btn {
  margin: 20px;
}
</style>