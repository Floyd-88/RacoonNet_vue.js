<template>
  <form v-if="getUser.enterUser" @submit.prevent>
    <div class="wrapper_text_new_post">

      <div class="input-errors" v-for="(error, index) of v$.postText.$errors" :key="index">
          <div class="error-msg" v-if="error.$message === 'Value is required'">
            Вы не написали комментарий
          </div>
          <div class="error-msg" v-else-if="error.$message === 'The maximum length allowed is 40000'">
            Вы превысили допустимое количество символов
          </div>
        </div>

      <textarea
          class="text_new_post"
          placeholder="Введите текст поста"
          @click.stop
          v-model.trim="addPostText"
          @blur="v$.postText.$reset()"
          :class="{ invalid: (v$.postText.$error) }">
        </textarea>
    </div>

    <div class="wrapper_btn_addPost">
      <UIbtn class="btn_addPhoto"
          @click="addPostPhoto(postText)">
      </UIbtn>

      <UIbtn class="btn_addPost"
             @click="addPostPage()"
             :disabled="v$.$invalid">
        Добавить
      </UIbtn>
    </div>
  </form>
</template>

<script>
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex';
import { useVuelidate } from "@vuelidate/core";
import { required, minLength, maxLength } from "@vuelidate/validators";

export default {
  name: "AddPost",

  setup() {
        return { v$: useVuelidate() }
    },

    validations: {
      postText: {
            required,
            min: minLength(1),
            max: maxLength(40000),
        },
    },

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
...mapState({postText: (state) => state.postsMyPageStore.postText,}),

...mapGetters({
  getUser: "authorizationStore/getUser",
  getPostText: "postsMyPageStore/getPostText",
  getIsNotRepeatAddPost: "postsMyPageStore/getIsNotRepeatAddPost"
}),

addPostText: {
      get() {
        return this.getPostText;
      },
      set(value) {
        this.setPostText(value);
        this.v$.postText.$touch();
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
  font-family: Russo One, fantasy, sans-serif;
  background: #00adef;
}
.btn_addPost:hover {
  filter: brightness(80%);
  transition: 0.3s;
}

.input-errors {
    margin-bottom: 10px;
}

.error-msg {
    color: red;
    font-size: 14px;
}

.invalid {
    border: 1px solid red;
}
</style>