<template>
  <div class="main">
    <UserInfo/>
    <div class="wrapper_myPage">
      <div class="wrapper_contents">
        <PhotoMyPage/>
        <div class="wrapper_posts">

          <AddPost @addPost="addPost"/>
          <PostMyPage
              @editPost="editPost"
              @removePost="removePost"/>


          <div class="wrapper_not_posts"
               v-if="getPosts.length === 0">
            <p class="not_posts">Посты не найдены!!!</p>
          </div>

          <!--при прокрутки страницы до данного элемента - подгружать следующие посты -->
          <div ref="observer" class="observer"></div>
        </div>
      </div>

      <MyFriends/>

    </div>
  </div>
</template>
<script>
import {mapGetters, mapActions, mapMutations} from "vuex";

export default {
  name: "MyPage",

  mounted() {
    // обсервер срабатывает каждый раз когда докручиваем страницу донизу
    const options = {
      rootMargin: '0px',
      threshold: 1.0
    };
    const callback = (entries) => {
      if (entries[0].isIntersecting) {
        this.setLimitPosts();
        this.setCountPosts();
        this.loadPostServer();
      }
    };
    const observer = new IntersectionObserver(callback, options);
    observer.observe(this.$refs.observer);
  },


  methods: {
    ...mapActions({
      addPost: "postsMyPageStore/addPost",
      loadPostServer: "postsMyPageStore/loadPostServer",
      removePost: "postsMyPageStore/removePost",
      editPost: "postsMyPageStore/editPost"
    }),
    ...mapMutations({
      setCountPosts: "postsMyPageStore/setCountPosts",
      setLimitPosts: "postsMyPageStore/setLimitPosts",
    }),
  },

  computed: {
    ...mapGetters({
      getPosts: "postsMyPageStore/getPosts",
    }),
  }

}
</script>
<style scoped>
.main {
  margin-left: 180px;
}

.wrapper_myPage {
  display: flex;
}

.wrapper_contents_main {
  display: flex;
  flex-wrap: wrap;
}

.wrapper_contents {
  white-space: nowrap;
  display: flex;
  flex-direction: column;
  flex: 0 0 70%;
  /*overflow: hidden;*/
}

.wrapper_posts {
  display: flex;
  flex-direction: column;
  white-space: normal;
  margin-right: 20px;
}

.observer {
  display: block;
  width: 100%;
  border: 1px solid;
  height: 1px;
  background: black;
}

.not_posts {
  margin: 10px 0;
  font-size: 18px;
  font-family: cursive;
  font-weight: 600;
}
</style>