<template>
  <NavigationNet v-if="isLoggedIn" />

  <div class="wrapper_main">
    <div class="main">
      <ContentNews :isNotNews="isNotNews"/>
    <!-- </div> -->
    <div ref="observer" class="observer"></div>
    <template v-if="isUIloadMoreContent">
      <UIloadMoreContent/>
    </template>
  </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";

export default {
  name: "NewsPage",

  data() {
    return {
      isUIloadMoreContent: false, //отображать индикотор загрузки новых постов
      isNotNews: false //надпись что посты отсутсвуют
    }
  },

  mounted() {
    //подгрузка новой партии новостей при скроле страницы
    const options = {
      rootMargin: "0px",
      threshold: 1
    };
    const callback = (entries) => {
      if (entries[0].isIntersecting) {
        this.isUIloadMoreContent = true; //показывать что идет загрузка

        this.LOAD_NEWS_FRIENDS_USERS()
        .then((response) => {
        this.isNotNews = false;

        this.isUIloadMoreContent = false;
          if(response.data.length === 0) {
              this.isNotNews = true;
            }
        })
      } else {
        this.isUIloadMoreContent = false; //отключать загрузку
      }
    };
    const observer = new IntersectionObserver(callback, options);
    observer.observe(this.$refs.observer);
  },

  beforeUnmount() {
    //при уходе со страницы обнулять список новостей
    this.setCountNewsNull();
    this.setNewsPostsFriends([]);
    this.setPhotosPostsArray([]);
    this.setCommentsArray([]);
    this.setCommentsCommentArray([]);
  },

  methods: {
    ...mapMutations({
      setCountNewsNull: "postsMyPageStore/setCountNewsNull",
      setNewsPostsFriends: "postsMyPageStore/setNewsPostsFriends",
      setPhotosPostsArray: "postsMyPageStore/setPhotosPostsArray",
      setCommentsArray: "commentsPost/setCommentsArray",
      setCommentsCommentArray: "commentsPost/setCommentsCommentArray"
    }),
    ...mapActions({ 
      LOAD_NEWS_FRIENDS_USERS: "postsMyPageStore/LOAD_NEWS_FRIENDS_USERS",
    })
  },

  computed: {
    ...mapGetters({
      isLoggedIn: "authorizationStore/isLoggedIn",
    }),
  },


}
</script>
<style scoped>
.wrapper_main {
  padding: 120px 20px 5px;
}

.main {
  margin-left: 180px;
}

.observer {
    /* border: 1px solid; */
}
</style>

