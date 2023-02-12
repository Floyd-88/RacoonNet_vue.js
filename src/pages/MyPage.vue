<template>

  <NavigationNet v-if="isLoggedIn" />

  <div class="wrapper_main">
    <div class="main">

      <template v-if="getModulEditProfile">
        <UImodal>
          <EditProfile />
        </UImodal>
      </template>

      <UserInfo />

      <div class="wrapper_myPage">
        <router-view></router-view>
      </div>

    </div>
  </div>



</template>
<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import EditProfile from "@/components/MyPage/EditProfile";
// import axios from "axios";


export default {
  name: "MyPage",
  components: { EditProfile },

  data() {
    return {
      // myPhotosMyPage: [],
    }
  },

  mounted() {

    // this.loadAllPhotos();

    // обсервер срабатывает каждый раз когда докручиваем страницу донизу
    // const options = {
    //   rootMargin: '0px',
    //   threshold: 1.0
    // };
    // const callback = (entries) => {
    //   if (entries[0].isIntersecting) {
    //     this.setLimitPosts();
    //     this.setCountPosts();
    //     this.loadPostServer();
    //   }
    // };
    // const observer = new IntersectionObserver(callback, options);
    // observer.observe(this.$refs.observer);


  },

  methods: {
    ...mapActions({
      // loadPostServer: "postsMyPageStore/loadPostServer",
      // loadAllPhotos: "loadPhotoStore/loadAllPhotos",
    }),
    ...mapMutations({
      // setCountPosts: "postsMyPageStore/setCountPosts",
      // setLimitPosts: "postsMyPageStore/setLimitPosts",
    }),

  },

  computed: {
    ...mapGetters({
      isLoggedIn: "authorizationStore/isLoggedIn",
      // getPosts: "postsMyPageStore/getPosts",
      getModulEditProfile: "editProfileStore/getModulEditProfile",
      // getUser: "authorizationStore/getUser"
    }),
  },

  watch: {
    // getUser() {
    //   this.loadAllPhotos();

    //   const options = {
    //   rootMargin: '0px',
    //   threshold: 1.0
    // };
    // const callback = (entries) => {
    //   if (entries[0].isIntersecting) {
    //     this.setLimitPosts();
    //     this.setCountPosts();
    //     this.loadPostServer();
    //   }
    // };
    // const observer = new IntersectionObserver(callback, options);
    // observer.observe(this.$refs.observer);
    // }

  }
}

</script>

<style scoped>
.wrapper_main {
  padding: 120px 20px 5px;
}

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