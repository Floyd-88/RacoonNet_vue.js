<template>
  <div class="wrapper_text_new_post">
    <textarea class="text_new_post" placeholder="Введите текст поста"></textarea>
  </div>

  <div class="wrapper_btn_addPost">
<!--    <button class="btn_addPost">Опубликовать</button>-->
    <UIbtn class="btn_addPost">Опубликовать</UIbtn>
  </div>


    <PostMyPage/>


</template>

<script>

export default {
  name: "PostsMyPage",
}
</script>

<style scoped>
.wrapper_text_new_post {
  width: 100%;
}

.text_new_post {
  width: 100%;
  min-height: 100px;
  resize: none;
}

.wrapper_btn_addPost {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.btn_addPost {
}


</style>