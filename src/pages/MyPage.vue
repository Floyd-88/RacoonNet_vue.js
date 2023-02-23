<template>

  <NavigationNet v-if="isLoggedIn" />

  <div class="wrapper_main">
    <div class="main">

      <!-- модальное окно для редактирования профиля -->
      <template v-if="getModulEditProfile">
        <UImodal>
          <EditProfile />
        </UImodal>
      </template>

      <!-- модальное окно для написания сообщения -->
      <template v-if="getModalWriteMessage">
        <UImodal>
          <WriteMessage :user="{
            name: getUser.name,
            surname: getUser.surname,
            ava: getUser.ava,
            userID: getUser.userID
          }" />
        </UImodal>
      </template>

      <UserInfo />

      <div v-if="getUser.enterUser" class="wrapper_myPage">
        <MyPageContent />
      </div>
      <div v-if="!getUser.enterUser" class="wrapper_title_warning_auth">
        <h2 class="title_warning_auth">Для просмотра контента страницы Вам необходимо авторизоваться</h2>
      </div>

    </div>
  </div>



</template>
<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import EditProfile from "@/components/MyPage/EditProfile";
import MyPageContent from "@/components/MyPage/MyPageContent.vue";

export default {
  name: "MyPage",
  components: { EditProfile, MyPageContent },

  methods: {
    ...mapActions({
      loadAllPhotos: "loadPhotoStore/loadAllPhotos",
      // LOAD_DIALOGS: "messageStore/LOAD_DIALOGS",
      // loadPostServer: "postsMyPageStore/loadPostServer",
    }),

    ...mapMutations({
    setPosts: "postsMyPageStore/setPosts",
    setCountPostsNull: "postsMyPageStore/setCountPostsNull"
  })

  },

  computed: {
    ...mapGetters({
      isLoggedIn: "authorizationStore/isLoggedIn",
      getModulEditProfile: "editProfileStore/getModulEditProfile",
      getUser: "authorizationStore/getUser",
      getModalWriteMessage: "messageStore/getModalWriteMessage"
    }),
  },

  mounted() {
    this.loadAllPhotos(this.$route.params.id);

    this.setPosts([])
    this.setCountPostsNull()
    // this.loadPostServer(this.$route.params.id);
    // this.LOAD_DIALOGS();
  },

  // watch: {
  //   $route() {
  //     // this.$route.params.id
  //     this.loadAllPhotos();
  //   }
  // }

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

.wrapper_title_warning_auth {
  display: block;
  margin-top: 40px;
  font-size: 14px;
  border-bottom: 1px solid black;
  padding-bottom: 10px;
  font-family: fantasy;
}

.title_warning_auth {
  text-align: center;
}
</style>
