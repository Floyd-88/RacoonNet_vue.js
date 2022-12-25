<template>

  <div class="post">
    <div class="wrapper_post">

      <div class="wrapper_ava_posts">
        <img class="ava_posts" src="@/assets/ava/ava_1.jpg" alt="">
      </div>

      <div class="wrapper_post_user">
        <div class="wrapper_post_name">
          <p class="post_name">Name</p>
        </div>

        <div class="wrapper_data_post">
          <p class="data_post">01.01.2022</p>
        </div>

        <div class="wrapper_text_post">
          <p class="text_post">Lorem ipsum dolor sit amet, consectetur adipisicing elit. A accusamus animi at aut
            blanditiis culpa cumque delectus deserunt ea error fuga, incidunt magnam maxime minima minus modi,
            necessitatibus nemo officia officiis, omnis porro quisquam reiciendis sapiente suscipit unde.</p>
        </div>
      </div>

    </div>

    <div class="btns_post">
      <UIbtn>Редактировать</UIbtn>
      <UIbtn style="margin-left: 5px">Удалить</UIbtn>
    </div>

  </div>
</template>

<script>
import UIbtn from "@/components/UI/UIbtn";

export default {
  name: "PostMyPage",
  components: {UIbtn}
}
</script>

<style scoped>
.post {
  border: 1px solid;
  margin-bottom: 20px;
}
.wrapper_post {
  display: flex;
  margin-bottom: 10px;
}

.wrapper_ava_posts {
  margin: 5px;
}

.ava_posts {
  width: 90px;
  border-radius: 100%;
}

.wrapper_post_user {

}

.wrapper_post_name {
  margin-bottom: 5px;
}

.post_name {
  font-size: 18px;
  font-family: cursive;
  font-weight: 600;
}

.wrapper_data_post {
  margin-bottom: 10px;
}

.data_post {
  font-size: 13px;
  font-family: cursive;
}

.wrapper_text_post {

}

.text_post {

}
.btns_post {
  display: flex;
  display: flex;
  justify-content: flex-end;
  margin: 5px;
}
</style>