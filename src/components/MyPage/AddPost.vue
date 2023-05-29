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
      <UIbtn class="btn_addPhoto"
          @click="addPostPhoto(postText)">
      </UIbtn>

      <UIbtn class="btn_addPost"
             @click="addPostPage()"
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
...mapMutations({
  setPostText: "postsMyPageStore/setPostText",
  setIsModalLoadPhoto: "loadPhotoStore/setIsModalLoadPhoto",
  setIsLoadPhotoPost: "loadPhotoStore/setIsLoadPhotoPost"
  }),
...mapActions({addPost: "postsMyPageStore/addPost"}),

   addPostPhoto() {
    this.setIsLoadPhotoPost(true);
    // this.addPost(postText)
    this.setIsModalLoadPhoto(true);
   },

   addPostPage() {
    if(this.getIsNotRepeatAddPost) {
      this.addPost(); 
    }
   }
  },

  computed: {
...mapGetters({
  getUser: "authorizationStore/getUser",
  getPostText: "postsMyPageStore/getPostText",
  getIsNotRepeatAddPost: "postsMyPageStore/getIsNotRepeatAddPost"
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

.btn_addPhoto {
 background-image: url("../../assets/icons/camera_4.svg");
    background-size: 58%;
    background-repeat: no-repeat;
    width: 60px;
    background-position: center;
    margin-right: 10px;
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