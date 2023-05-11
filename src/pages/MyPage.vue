<template>

  <NavigationNet v-if="isLoggedIn" />

  <template v-if="getUser.delete === 0">
    <div class="wrapper_main">
    <div class="main">
      <!-- модальное окно для редактирования профиля -->
      <template v-if="getModulEditProfile">
        <UImodal>
          <EditProfile/>
        </UImodal>
      </template>

      <!-- модальное окно для написания сообщения -->
      <template v-if="getModalWriteMessage && $route.params.id">
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
  <template v-else-if = "getUser.delete === 1">
    <div class="wrapper_delete_user">
      <p>Профиль пользователя был удален</p>
    </div>
  </template>
 
</template>
<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import EditProfile from "@/components/MyPage/EditProfile";
import MyPageContent from "@/components/MyPage/MyPageContent.vue";

// import SocketioService from "../services/socketio.service";


export default {
  name: "MyPage",
  components: { EditProfile, MyPageContent },

  created() {
        //вызываем метод для отправки сообщения всем участникам комнаты
        // SocketioService.setupSocketConnection();
        // console.log("connected")

        // SocketioService.subscribeToMessages((err, data) => {
        //     if (err) return console.log(err)
        //     this.setArrayMessages([...this.getArrayMessages, data])
        //     // console.log(this.getArrayMessages)
        // });
  }, 

  methods: {
    ...mapActions({
      loadAllPhotos: "loadPhotoStore/loadAllPhotos",
      // LOAD_DIALOGS: "messageStore/LOAD_DIALOGS",
      // loadPostServer: "postsMyPageStore/loadPostServer",
    }),

    ...mapMutations({
    setPosts: "postsMyPageStore/setPosts",
    setCountPostsNull: "postsMyPageStore/setCountPostsNull",
    setPhotosPostsArray: "postsMyPageStore/setPhotosPostsArray"
    // setArrayMessages: "messageStore/setArrayMessages"
  })

  },

  computed: {
    ...mapGetters({
      isLoggedIn: "authorizationStore/isLoggedIn",
      getModulEditProfile: "editProfileStore/getModulEditProfile",
      getUser: "authorizationStore/getUser",
      getModalWriteMessage: "messageStore/getModalWriteMessage",
      // getArrayMessages: "messageStore/getArrayMessages"
    }),
  },

  mounted() {
    this.loadAllPhotos(this.$route.params.id);
    this.setPosts([])
    this.setPhotosPostsArray([]);
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

.wrapper_delete_user{
  padding: 120px 20px 5px;
  margin-left: 180px;
}

.wrapper_delete_user p {
  font-size: 16px;
    line-height: 26px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 30px;
    font-size: 20px;
    opacity: .8;
    font-family: fantasy;
    color: dimgray;
}
</style>
