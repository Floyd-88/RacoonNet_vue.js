<template>
  <div class="post" 
    v-for="post in getNewsPostsFriends" 
    :key="post.id" 
    @mouseover="showBtnPost(post)"
    @mouseleave="notShowBtnPost(post)">

    <div class="wrapper_post">
      <div class="wrapper_post_user">

        <div class="wrapper_post_name">
          <div class="wrapper_ava_posts">
            <img class="ava_posts" alt="ava" ref="img" :src="loadAva(post.ava)"
              @click="$router.push({ name: 'mypage', params: { id: `${post.authorPost}` } })">
          </div>
          <div class="block_post_name">
            <p class="post_name" @click="$router.push({ name: 'mypage', params: { id: `${post.authorPost}` } })">
              {{ post.name + " " + post.surname }}
            </p>
            <div class="wrapper_data_post">
              <p class="data_post">{{ post.date }}</p>
            </div>
          </div>
        </div>

        <div class="wrapper_params_post">
          <p class="post_show_btn" @click="btnPost(post)">
            ...
          </p>
        </div>

      </div>

      <div class="wrapper_text_post">
        <p class="text_post">{{ postText(post.postText) }}</p>
      </div>
    </div>

    <!-- <div class="btn_post" v-show="post.isPostDel">
            <UIbtn class="redaction_post_btn" 
                v-if="getUser.enterUser == post.authorPost"
                @click="setModulePost({ task: 'edit', id: post.id, text: post.postText })">
              Редактировать
            </UIbtn>
                        
            <UIbtn class="delete_post_btn" v-if="getUser.is_editProfile || getUser.enterUser == post.authorPost"
                @click="setModulePost({ task: 'remove', id: post.id })">
              Удалить
            </UIbtn>
          </div> -->
  </div>

  <div class="wrapper_not_news" v-if="getNewsPostsFriends.length < 1">
    <p class="not_news">
      Список Вашей новостной ленты пуст. Попробуйте обзавестись новыми знакомыми что бы получать свежие новости.
    </p>
  </div>
  </template>
  
<script>
import { mapGetters, mapMutations, mapActions } from "vuex";

export default {
  name: "ContentNews",

  data() {
    return { }
  },

  methods: {
    ...mapMutations({
      // setModulePost: "postsMyPageStore/setModulePost",
    }),
    ...mapActions({
      LOAD_NEWS_FRIENDS_USERS: "postsMyPageStore/LOAD_NEWS_FRIENDS_USERS"
    }),

    loadAva(ava) {
      try {
        return require(`../../assets/photo/${ava}`)
      } catch {
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
    }

  },

  computed: {
    ...mapGetters({
      // getUser: "authorizationStore/getUser",
      getNewsPostsFriends: "postsMyPageStore/getNewsPostsFriends"
    }),
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
  flex-direction: column;
}

.wrapper_ava_posts {
  margin: 5px;
  cursor: pointer
}

.ava_posts {
  width: 35px;
  border-radius: 100%;
}

.wrapper_post_user {
  display: flex;
  width: 100%;
  justify-content: space-between;
  flex-direction: row;
}

.wrapper_post_name {
  display: flex;
  align-items: center;
}

.post_show_btn {
  margin-right: 10px;
  font-size: 20px;
  line-height: 17px;
  cursor: pointer;
}

.block_post_name {
  display: flex;
  flex-direction: column;
  margin-top: 8px;
}

.post_name {
  font-size: 14px;
  font-weight: 300;
  cursor: pointer;
  font-family: fantasy;
}

.wrapper_params_post {
  display: flex;
}

.wrapper_data_post {
  margin-bottom: 10px;
}

.data_post {
  padding-top: 2px;
  font-size: 13px;
  font-family: none;
}

.wrapper_text_post {
  margin: 0px 10px 10px 45px;
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

.wrapper_not_news {
  font-size: 16px;
  line-height: 26px;
  position: absolute;
  top: 50%;
  margin-top: -50px;
  text-align: center;
  padding: 0 30px;
  opacity: .7;
  font-family: fantasy;
  color: dimgray;
}
</style>