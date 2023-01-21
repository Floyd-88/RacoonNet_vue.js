<template>
  <div class="main">
    <UserInfo/>
    <div class="wrapper_myPage">
        <div class="wrapper_contents">

          <div class="wrapper_contents_myPhoto">
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

            <UIbtn class="show_more_photo_btn"> Показать больше </UIbtn>
          </div>

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

        <div class="wrapper_myFriends">
          Мои друзья
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium aperiam ex, illo iure iusto nesciunt obcaecati. Alias aut dolorum error fuga ipsum laboriosam porro quas sed temporibus. Alias beatae consectetur cumque deleniti dolore doloremque ea eligendi eos et ex facere fugit hic iure molestias neque nostrum odit optio praesentium quam quia quibusdam rem rerum sequi sint soluta sunt tenetur, veniam veritatis, vitae voluptate. Aliquam blanditiis eius, est et inventore libero nisi voluptas voluptate? Alias asperiores assumenda consectetur cum debitis dignissimos dolorem doloremque, esse eum, excepturi explicabo fuga fugit iure laborum, magni minus neque nisi non optio pariatur quasi quo quos recusandae sint sit tempora ut. Adipisci deleniti dolores eaque facere illo in iste maiores rem, vero! Assumenda consequuntur dolores hic ipsam modi nam ?</p>
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

.wrapper_contents_myPhoto {
  margin-right: 20px;
  margin-bottom: 20px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f8f8f9;
  box-shadow: 0px 2px 5px 0px rgb(0 0 0 / 40%);
}

.wrapper_preview_myPhoto {
  display: flex;
  flex-wrap: wrap;
  padding: 5px;
  justify-content: center;
}

.show_more_photo_btn {
  width: 70%;
  margin: 10px;

}

.preview_myPhoto {
  display: flex;
  margin: 5px;
}

.myPhoto {
  width: 150px;
}

.wrapper_myFriends {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 0 0 30%;
  background: #f8f8f9;
  box-shadow: 0px 2px 5px 0px rgb(0 0 0 / 40%);
  height: max-content;
  position: sticky;
  top: 120px;
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