<template>
  <form @submit.prevent>
    <div class="wrapper_text_new_post">

      <textarea
          class="text_new_post"
          placeholder="Введите текст поста"
          v-model="body"
      ></textarea>

    </div>

    <div class="wrapper_btn_addPost">
      <UIbtn class="btn_addPost"
             @click="addPost"
             :disabled="body.length < 1"
      >
        Добавить
      </UIbtn>
    </div>
  </form>
</template>

<script>
export default {
  name: "AddPost",
  emits: ["addPost"],
  data() {
    return {
      body: "",
    }
  },

  methods: {
    addPost() {
      this.$emit('addPost', this.body);
      this.body = "";
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
  background: cornflowerblue;
}
.btn_addPost:hover {
  filter: brightness(80%);
  transition: 0.3s;
}
</style>