<template>

  <div class="post"
       v-for="post of getPost"
       :key="post.id">
    <form @submit.prevent>
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
                      required
                      v-model="post.body"
            ></textarea>
          </div>

        </template>
      </div>

    </div>

    <div class="btns_post">
      <UIbtn @click="this.$emit('editPost', post.id)"
             :disabled="post.body.length < 1"
      >
        {{ post.nameBtnEdit }}
      </UIbtn>

      <UIbtn style="margin-left: 5px"
             @click="this.$emit('removePost', post.id)">
        Удалить
      </UIbtn>
    </div>
    </form>
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
  border: 1px solid;
  margin-bottom: 20px;
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

.btns_post {
  display: flex;
  display: flex;
  justify-content: flex-end;
  margin: 5px;
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