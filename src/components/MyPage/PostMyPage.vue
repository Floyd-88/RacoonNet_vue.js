<template>
  <div class="post" v-for="post of postArray" :key="post.id" @mouseover="showBtnPost(post)"
    @mouseleave="notShowBtnPost(post)">

    <div class="wrapper_post">

      <!-- блок с аватаркой -->
      <div class="wrapper_ava_posts" @click="$router.push({ name: 'mypage', params: { id: `${post.authorPost}` } })">
        <UIAva :ava="post.ava" />
      </div>

      <div class="wrapper_post_user">
        <div class="wrapper_post_name">
          <div class="wrapper_post_name_column">
            <p class="post_name" @click="$router.push({ name: 'mypage', params: { id: `${post.authorPost}` } })">
              {{ post.name + " " + post.surname }}
            </p>

            <div class="wrapper_data_post">
              <p class="data_post">{{ post.date }}</p>
            </div>
          </div>


          <div class="wrapper_post_redaction_btn">
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
            <div>
              <p class="post_show_btn" v-show="post.isShowBtn" @click="btnPost(post)">...</p>
            </div>
          </div>

        </div>

        <!-- текст поста -->
        <div class="wrapper_text_post" v-if="post.postText.length < 800">
          <p class="text_post">
            {{ postText(post.postText) }}
          </p>
        </div>
        <div class="wrapper_text_post" v-else>
          <p class="text_post" v-if="!post.isFullText">
            {{ postText(post.postText).slice(0, 800) }}
          </p>
          <p class="text_post" v-else>
            {{ postText(post.postText) }}
          </p>
          <p class="more_text_post" v-if="!post.isFullText" @click="moreTextPost(post)">
            Показать еще
          </p>
        </div>

      </div>
    </div>

    <!-- фотографии к посту -->
    <div class="wrapper_block_photo_post">
      <div class="wrapper_block_photo_post_first">
        <template v-for="(photo, index) in photosArray.filter(i => i.id === post.id).slice(0, 1)" :key="index">
          <div class="wrapper_photo_post size_photo_1" v-if="post.id === photo.id"
            @click="FULL_SIZE_PHOTO_POST({ 'bool': true, 'elem': index, id: photo.id, postID: post.id })">
            <UIPhoto :photo="photo" />
          </div>
        </template>
      </div>

      <div class="wrapper_block_photo_post_another" v-if="photosArray.filter(i => i.id === post.id).slice(1).length
        > 0">
        <template v-for="(photo, index) in photosArray.filter(i => i.id === post.id).slice(1)" :key="index">
          <div class="wrapper_photo_post photo_another" v-if="post.id === photo.id"
            @click="FULL_SIZE_PHOTO_POST({ 'bool': true, 'elem': index + 1, id: photo.id, postID: post.id })">
            <UIPhoto :photo="photo" />
          </div>
        </template>
      </div>
    </div>

    <!-- комментарии к посту -->
    <CommentsPost :post="post" />
    <!-- ------------------ -->

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

  methods: {
    ...mapMutations({
      setBeforePostText: "postsMyPageStore/setBeforePostText",
      setModulePost: "postsMyPageStore/setModulePost",
      setCloseModulePost: "postsMyPageStore/setCloseModulePost"
    }),
    ...mapActions({
      editPost: "postsMyPageStore/editPost",
      removePost: "postsMyPageStore/removePost",
   
      FULL_SIZE_PHOTO_POST: "showFullPhotoStore/FULL_SIZE_PHOTO_POST"
    }),
    
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
    moreTextPost(post) {
      post.isFullText = true;
    }
  },
  computed: {
    ...mapGetters({
      getPost: "postsMyPageStore/getPosts",
      getBeforePostText: "postsMyPageStore/getBeforePostText",
      getModulePost: "postsMyPageStore/getModulePost",
      getUser: "authorizationStore/getUser",
    
      getPhotosPostsArray: "postsMyPageStore/getPhotosPostsArray"
    }),
    beforeModelPostText: {
      get() {
        let doc = new DOMParser().parseFromString(this.getBeforePostText, "text/html");
        return doc.documentElement.textContent;
      },
      set(value) {
        this.setBeforePostText(value);
      }
    },
    postArray() {
      let notDoublePost = this.getPost.filter((v, i, a) => a.findIndex(v2 => (v2.id === v.id)) === i);
      return notDoublePost;
    },

    photosArray() {
      let notDoublePhoto = this.getPhotosPostsArray.filter((v, i, a) => a.findIndex(v2 => (v2.photo_name === v.photo_name)) === i);
      return notDoublePhoto;
    }
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
  /* margin-bottom: 10px; */
  width: 100%;
  justify-content: flex-start;
}

.wrapper_post_redaction_btn {
  display: flex;
}

.wrapper_ava_posts {
  margin: 5px;
  cursor: pointer;
  width: 90px;

}


.wrapper_post_user {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top: 25px;
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
  font-size: 16px;
  font-family: Russo One, fantasy, sans-serif;
  cursor: pointer;
}

.wrapper_data_post {
  margin-bottom: 10px;
}

.data_post {
  font-size: 12px;
  font-family: Roboto Condensed, Arial, Helvetica, sans-serif;
}

.wrapper_text_post {
  padding-right: 6px;
}

.text_post {
  word-break: break-word;
  font-family: Roboto Condensed, Arial, Helvetica, sans-serif;
  font-size: 14px;
  line-height: 20px;
}

.more_text_post {
  font-weight: 600;
  cursor: pointer;
  display: inline-block;
  font-size: 14px;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}

.more_text_post:hover {
  opacity: 0.7;
}

.btn_post {
  display: flex;
  display: flex;
  justify-content: flex-end;
}

.redaction_post_btn {
  width: auto;
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

.save_editPost_btn {
  width: 85px;
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

.wrapper_block_photo_post {
  display: flex;
  justify-content: center;
  flex-direction: row;
  max-height: 450px;
  width: 100%;
  padding: 2% 2% 0 2%;
}

.wrapper_block_photo_post_first {
  display: flex;
  width: 75%;
  align-items: center;
  justify-content: center;
}

.wrapper_block_photo_post_another {
  display: flex;
  flex-direction: column;
  width: 22%;
  margin-left: 10px;
}

.wrapper_photo_post {
  height: -webkit-fill-available;
  padding-bottom: 10px;
  overflow: hidden;
}

.photo_post {
  width: 100%;
  height: 100%;
  -o-object-fit: cover;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
}

.size_photo_1 {
  width: 100%;
  height: 100%;
}

/* МЕДИА-ЗАПРОСЫ */

@media (max-width: 761px) {
  .text_post {
    font-size: 13px;
    line-height: 17px;
  }

  .wrapper_ava_posts {
    width: 50px;

  }

  .wrapper_post_user {
    padding-top: 20px;
  }

  .size_photo_1 {
    max-height: 424px;
  }

  .btn_post {
    flex-direction: column;
  }

  .delete_post_btn {
    width: auto;
  }

  .redaction_post_btn {
    font-size: 11px;
    margin-bottom: 10px;
  }
}
</style>