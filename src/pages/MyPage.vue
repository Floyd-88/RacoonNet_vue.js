<template>
  <div class="main">
    <div class="wrapper_myPage">
      <UserInfo/>
      <div class="wrapper_contents_main">

        <div class="wrapper_contents">
          <div class="wrapper_contents_myPhoto">
            <h2>Мои фото</h2>
            <div class="wrapper_preview_myPhoto">
              <div class="preview_myPhoto">
                <img class="myPhoto" src="@/assets/photo/man.jpg" alt="photo">
              </div>
              <div class="preview_myPhoto">
                <img class="myPhoto" src="@/assets/photo/man.jpg" alt="photo">
              </div>
              <div class="preview_myPhoto">
                <img class="myPhoto" src="@/assets/photo/man.jpg" alt="photo">
              </div>
              <div class="preview_myPhoto">
                <img class="myPhoto" src="@/assets/photo/man.jpg" alt="photo">
              </div>
              <div class="preview_myPhoto">
                <img class="myPhoto" src="@/assets/photo/man.jpg" alt="photo">
              </div>
              <div class="preview_myPhoto">
                <img class="myPhoto" src="@/assets/photo/man.jpg" alt="photo">
              </div>
            </div>
          </div>

          <div class="wrapper_posts">
            <AddPost
                @addPost="addPost"
            />
            <PostMyPage
                @editPost="editPost"
                @removePost="removePost"
            />

            <div class="wrapper_not_posts"
                 v-if="getPosts.length === 0"
            >
              <p class="not_posts">Посты не найдены!!!</p>
            </div>
            <div ref="observer" class="observer"></div>

          </div>
        </div>

        <div class="wrapper_myFriends">
          Мои друзья
        </div>

      </div>

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
  background: aliceblue;
}

.wrapper_myPage {

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
  overflow: hidden;
}

.wrapper_contents_myPhoto {
  border: 1px solid black;
  margin-right: 20px;
  margin-bottom: 20px;
}

.wrapper_preview_myPhoto {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 25px;

}

.preview_myPhoto {
  flex: 0 0 33.33333%;
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}

.myPhoto {
  width: 150px;
}

.wrapper_myFriends {
  display: flex;
  border: 1px solid;
  justify-content: center;
  background: floralwhite;
  flex: 0 0 30%;
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