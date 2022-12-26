<template>

  <div class="post"
       v-for="post of posts"
       :key="post.id"
  >

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
             <textarea
                 class="edit_text_body"
                 :value="value"
                 @input="this.$emit('update:value', $event.target.value)"
             ></textarea>
          </div>

        </template>
      </div>

    </div>


    <div class="btns_post">
      <UIbtn
          @click="editPost(post.id)"
      >
        {{ post.nameBtnEdit }}
      </UIbtn>
      <UIbtn style="margin-left: 5px"
             @click="this.$emit('removePost', post.id)"
      >
        Удалить
      </UIbtn>
    </div>

  </div>


</template>

<script>

export default {
  name: "PostMyPage",
  emits: [
    "removePost",
    "editPost",
    "update:value",
  ],
  props: {
    value: [String, Number],
    posts: {
      type: Array,
      required: true,
    },
  },

  methods: {
    editPost(id) {
      this.$emit('editPost', id)
    },
  }
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

}

.text_post {

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