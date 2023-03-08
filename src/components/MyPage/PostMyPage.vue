<template>
  <div class="post" v-for="post of getPost" :key="post.id" @mouseover="showBtnPost(post)"
    @mouseleave="notShowBtnPost(post)">

    <div class="wrapper_post">

      <div class="wrapper_ava_posts">
        <img class="ava_posts" alt="ava" ref="img" :src="loadAva(post.ava)"
          @click="$router.push({ name: 'mypage', params: { id: `${post.authorPost}` } })">
      </div>

      <div class="wrapper_post_user">
        <div class="wrapper_post_name">
          <p class="post_name" @click="$router.push({ name: 'mypage', params: { id: `${post.authorPost}` } })">
            {{ post.name + " " + post.surname }}
          </p>
          <p class="post_show_btn" v-show="post.isShowBtn" @click="btnPost(post)">
            ...
          </p>
        </div>

        <div class="wrapper_data_post">
          <p class="data_post">{{ post.date }}</p>
        </div>

        <div class="wrapper_text_post">
          <p class="text_post">{{ postText(post.postText) }}</p>
        </div>

      </div>
    </div>

    <!-- комментарии к посту -->
    
    <CommentsPost :post="post" />
    
    <!-- -------------------- -->

    <div class="btn_post" v-show="post.isPostDel">
      <UIbtn class="redaction_post_btn" v-if="getUser.enterUser == post.authorPost"
        @click="setModulePost({ task: 'edit', id: post.id, text: post.postText })">
        Редактировать
      </UIbtn>

      <UIbtn class="delete_post_btn" v-if="getUser.is_editProfile || getUser.enterUser == post.authorPost"
        @click="setModulePost({ task: 'remove', id: post.id })">
        Удалить
      </UIbtn>
    </div>

  </div>

  <template v-if="getModulePost === 'edit'">
    <UImodal>
      <div class="wrapper_save_editPost">
        <div class="save_editPost_title">
          <div class="wrapper_edit_text_body">
            <textarea class="edit_text_body" v-model="beforeModelPostText"></textarea>
          </div>
        </div>

        <div class="wrapper_save_editPost_btn">
          <UIbtn class="save_editPost_btn" type="submit" :disabled="getBeforePostText.length < 1" @click="editPost">
            Сохранить
          </UIbtn>

          <UIbtn class="save_editPost_btn" @click="setCloseModulePost">
            Отменить
          </UIbtn>

        </div>
      </div>
    </UImodal>

  </template>

  <template v-if="getModulePost === 'remove'">
    <UImodal>
      <div class="wrapper_save_editPost">
        <div class="wrapper_title_text">
          <p>Вы уверены что хотите удалить этот пост?</p>
        </div>

        <div class="wrapper_save_editPost_btn">
          <UIbtn class="save_editPost_btn" type="submit" @click="removePost">
            Удалить
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
  data() {
    return {
      // isLoaded: false,
      // noImageSrc: "require(`../../assets/ava/ava_1.jpg`)",
    };
  },
  methods: {
    ...mapMutations({
      setBeforePostText: "postsMyPageStore/setBeforePostText",
      setModulePost: "postsMyPageStore/setModulePost",
      setCloseModulePost: "postsMyPageStore/setCloseModulePost"
    }),
    ...mapActions({
      editPost: "postsMyPageStore/editPost",
      removePost: "postsMyPageStore/removePost"
    }),
    // onImgLoad() {
    //   console.log(this.$refs)
    //   // return this.isLoaded = false
    // },
    // loadAva() {
    //   require(`../../assets/photo/${post.ava}`)
    // }
    loadAva(ava) {
      try {
        return require(`../../assets/photo/${ava}`);
      }
      catch {
        return require(`../../assets/ava/ava_1.jpg`);
      }
    },
    postText(value) {
      let doc = new DOMParser().parseFromString(value, "text/html");
      return doc.documentElement.textContent;
    },
    showBtnPost(post) {
      post.isShowBtn = true;
    },
    notShowBtnPost(post) {
      post.isShowBtn = false;
    },
    btnPost(post) {
      post.isPostDel = !post.isPostDel;
    },
  },
  computed: {
    ...mapGetters({
      getPost: "postsMyPageStore/getPosts",
      getBeforePostText: "postsMyPageStore/getBeforePostText",
      getModulePost: "postsMyPageStore/getModulePost",
      getUser: "authorizationStore/getUser",
      // getCommentsArray: "commentsPost/getCommentsArray",
      getCommentsArray: "commentsPost/getCommentsArray"
    }),
    beforeModelPostText: {
      get() {
        let doc = new DOMParser().parseFromString(this.getBeforePostText, "text/html");
        return doc.documentElement.textContent;
        // return this.getBeforePostText;
      },
      set(value) {
        this.setBeforePostText(value);
      }
    },
  },
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
  cursor: pointer
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
  display: flex;
  justify-content: space-between;
}

.post_show_btn {
  margin-right: 10px;
  font-size: 20px;
  line-height: 17px;
  cursor: pointer;
}

.post_name {
  font-size: 18px;
  font-family: cursive;
  font-weight: 600;
  cursor: pointer;
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
  /* margin: 5px; */
}

.redaction_post_btn {
  width: 100px;
  font-size: 13px;
  margin-right: 5px;
  margin-bottom: 5px;
}

.delete_post_btn {
  width: 70px;
  font-size: 13px;
  margin-bottom: 5px;
  margin-right: 5px;

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

/* .wrapper_save_editPost_btn {} */

.save_editPost_btn {
  width: 70px;
  margin-left: 5px;
  margin-right: 5px;
}

.wrapper_title_text {
  margin: 0px 10px 10px;
  font-size: 17px;
}

.wrapper_write_comments {
    border-top: 1px solid;
    padding: 0px 8px 13px 8px;
}
</style>