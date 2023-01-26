<template>
  <div class="post" v-for="post of getPost" :key="post.id">

    <div class="wrapper_post">

      <div class="wrapper_ava_posts">
        <img class="ava_posts" src=@/assets/ava/ava_1.jpg alt="ava">
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
              {{ post.postText }}
            </p>
          </div>
        </template>

        <!-- <template v-else>
          <div class="wrapper_edit_text_body">
            <textarea class="edit_text_body" v-model="beforeModelPostText"></textarea>
          </div>

        </template> -->
      </div>

    </div>

    <div class="btn_post">
      <UIbtn class="redaction_post_btn" @click="setModulePost({id: post.id, text: post.postText})" :disabled="post.postText.length < 1">
        Редактировать
      </UIbtn>

      <UIbtn class="delete_post_btn" @click="removePost(post.id)">
        Удалить
      </UIbtn>
    </div>

  </div>

  <template v-if="getModulePost">
      <UImodal>
        <div class="wrapper_save_editPost">
          <div class="save_editPost_title">


            <div class="wrapper_edit_text_body">
              <textarea class="edit_text_body" v-model="beforeModelPostText"></textarea>
            </div>


          </div>
          <div class="wrapper_save_editPost_btn">
            <UIbtn class="save_editPost_btn" type="submit" @click="editPost">
              OK
            </UIbtn>

            <UIbtn class="save_editPost_btn" @click="setCloseModulePost">
              Отменить
            </UIbtn>
          </div>
        </div>

      </UImodal>
    </template>


</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";

export default {
  name: "PostMyPage",
  emits: [
    "removePost",
    "editPost",
  ],

  data() {
    return {
      // getModulePost: false
    }
  },

  methods: {
    ...mapMutations({
      setBeforePostText: "postsMyPageStore/setBeforePostText",
      setModulePost: "postsMyPageStore/setModulePost",
      setCloseModulePost: "postsMyPageStore/setCloseModulePost"
      // showModalTrue: "modalStore/showModalTrue"
    }),
    ...mapActions({editPost: "postsMyPageStore/editPost"}),

    removePost(id) {
      this.$emit('removePost', id);
    },

    // editPost(id) {
    //   this.showModalTrue()
    //   this.getModulePost = true,

    //     this.$emit('editPost', id)
    // }
  },

  computed: {
    ...mapGetters({
      getPost: "postsMyPageStore/getPosts",
      getBeforePostText: "postsMyPageStore/getBeforePostText",
      getModulePost: "postsMyPageStore/getModulePost"
    }),

    beforeModelPostText: {
      get() {
        return this.getBeforePostText;
      },
      set(value) {
        this.setBeforePostText(value);
      }
    }

  }
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
  padding-right: 6px;
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

.redaction_post_btn {
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
  resize: none;
    height: 150px;
    width: 250px;
}

.wrapper_save_editPost {
  display: flex;
    flex-direction: column;
    align-items: center;
    margin: 15px;
}
.save_editPost_title {
  margin: 10px;
    font-size: 17px;
}
.wrapper_save_editPost_btn {
}
.save_editPost_btn {
      width: 70px;
    margin-left: 5px;
    margin-right: 5px;
}

</style>