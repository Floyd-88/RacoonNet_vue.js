<template>
  <NavigationNet v-if="isLoggedIn" />

  <div class="wrapper_main">
    <div class="main">
      <ContentNews />
    </div>
    <div ref="observer" class="observer"></div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";

export default {
  name: "NewsPage",

  mounted() {
    //подгрузка новой партии новостей при скроле страницы
    const options = {
      rootMargin: "0px",
      threshold: 1
    };
    const callback = (entries) => {
      if (entries[0].isIntersecting) {
        this.LOAD_NEWS_FRIENDS_USERS();
      }
    };
    const observer = new IntersectionObserver(callback, options);
    observer.observe(this.$refs.observer);
  },

  beforeUnmount() {
    //при уходе со страницы обнулять список новостей
    this.setCountNewsNull()
    this.setNewsPostsFriends([])
  },

  methods: {
    ...mapMutations({
      setCountNewsNull: "postsMyPageStore/setCountNewsNull",
      setNewsPostsFriends: "postsMyPageStore/setNewsPostsFriends"
    }),
    ...mapActions({ LOAD_NEWS_FRIENDS_USERS: "postsMyPageStore/LOAD_NEWS_FRIENDS_USERS" })
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
</style>

