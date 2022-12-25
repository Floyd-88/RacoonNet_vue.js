<template>
  <div class="wrapper_user">

    <div class="wrapper_info">

      <div class="wrapper_ava_user">
        <img class="ava_user" src="@/assets/ava/ava_1.jpg" alt="ava">
      </div>

      <div class="wrapper_info_user">
        <div class="wrapper_name_user">
          <p class="name_user">Илья Сазонов</p>
        </div>
        <div class="wrapper_city_user">
          <p class="city_user">г. Ставрополь</p>
        </div>
      </div>

    </div>

    <div class="wrapper_btn">
<!--      <button class="btn">Редактировать профиль</button>-->
      <UIbtn>Редактировать профиль</UIbtn>
    </div>

  </div>
</template>

<script>
import UIbtn from "@/components/UI/UIbtn";
export default {
  name: "UserInfo",
  components: {UIbtn}
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
}
.city_user {
  font-size: 16px;
  font-family: cursive;
  margin-bottom: 20px;
}
.wrapper_btn {
  margin: 20px;
}
</style>