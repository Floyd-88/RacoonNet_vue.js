<template>

  <div class="post"
       v-for="post of getPost"
       :key="post.id">
 
    <div class="wrapper_post">

      <div class="wrapper_ava_posts">
        <img class="ava_posts" :src=post.ava alt="ava">
      </div>

      <div class="wrapper_post_user">
        <div class="wrapper_post_name">
          <p class="post_name">{{ post.name + " " + post.surname }}</p>
        </div>

        <div class="wrapper_data_post">
          <p class="data_post">{{ post.date }}</p>
        </div>

        <template v-if="post.flag">
          <div class="wrapper_text_post">
            <p class="text_post">
              {{ post.body }}
            </p>
          </div>
        </template>

        <template v-else>
          <div class="wrapper_edit_text_body">
            <textarea class="edit_text_body"
                      v-model="post.body"
            ></textarea>
          </div>

        </template>
      </div>

    </div>

    <div class="btn_post">
      <UIbtn class="redaction_post_btn"
          @click="this.$emit('editPost', post.id)"
             :disabled="post.body.length < 1"
      >
        {{ post.nameBtnEdit }}
      </UIbtn>

      <UIbtn class="delete_post_btn"
          @click="this.$emit('removePost', post.id)">
        Удалить
      </UIbtn>
    </div>

  </div>


</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "PostMyPage",
  emits: [
    "removePost",
    "editPost",
  ],

  computed: {...mapGetters({getPost: "postsMyPageStore/getPosts"})}
}
</script>

<style scoped>
.post {
  margin-bottom: 20px;
  border-radius: 5px;
  background: #f8f8f9;
  box-shadow: 0px 2px 5px 0px rgb(0 0 0 / 40%);
}

.wrapper_post {
  display: flex;
  margin-bottom: 10px;
  width: 100%;
  justify-content: flex-start;
}

.wrapper_ava_posts {
  margin: 5px;
}

.ava_posts {
  width: 90px;
  border-radius: 100%;
}

.wrapper_post_user {
  display: flex;
  flex-direction: column;
  width: 100%;
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
  padding-right: 5px;
}

.text_post {
  word-break: break-word;
}

.btn_post {
  display: flex;
  display: flex;
  justify-content: flex-end;
  margin: 5px;
}

.redaction_post_btn{
  width: 100px;
  font-size: 13px;
  margin-right: 5px;
}

.delete_post_btn {
  width: 70px;
  font-size: 13px;
}

.wrapper_edit_text_body {
  width: 100%;
  padding-right: 5px;
}

.edit_text_body {
  width: 100%;
  resize: none;
  height: 70px;
}


</style>