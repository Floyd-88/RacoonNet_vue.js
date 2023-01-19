<template>
  <form @submit.prevent>
  <div class="wrapper_text_new_post">

      <textarea
          class="text_new_post"
          placeholder="Введите текст поста"
          required
          v-model="body"
      ></textarea>

  </div>

  <div class="wrapper_btn_addPost">
    <UIbtn
        class="btn_addPost"
        @click="addPost"
    >
      Опубликовать
    </UIbtn>
  </div>
  </form>
</template>

<script>
export default {
  name: "AddPost",
  emits: [
    "addPost",
  ],
  data() {
    return {
      body: "",
    }
  },

  methods: {
    addPost() {
      if(this.body) {
        this.$emit('addPost', this.body);
        this.body = "";
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
}
</style>