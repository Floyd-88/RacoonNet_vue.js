<template>
  <form v-if="getUser.enterUser" @submit.prevent>
    <div class="wrapper_text_new_post">

      <textarea
          class="text_new_post"
          placeholder="Введите текст поста"
          v-model="postText">
        </textarea>
    </div>

    <div class="wrapper_btn_addPost">
      <UIbtn class="btn_addPost"
             @click="addPost(postText)"
             :disabled="postText.length < 1">
        Добавить
      </UIbtn>
    </div>
  </form>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
export default {
  name: "AddPost",
  data() {
    return {
    }
  },

  methods: {
...mapMutations({setPostText: "postsMyPageStore/setPostText"}),
...mapActions({addPost: "postsMyPageStore/addPost"})
  },

  computed: {
...mapGetters({
  getUser: "authorizationStore/getUser",
  getPostText: "postsMyPageStore/getPostText"
}),

postText: {
      get() {
        return this.getPostText;
      },
      set(value) {
        this.setPostText(value);
      }
    },
  }

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
  width: 150px;
  height: 40px;
  font-size: 19px;
  font-family: fantasy;
  background: #00adef;
}
.btn_addPost:hover {
  filter: brightness(80%);
  transition: 0.3s;
}
</style>