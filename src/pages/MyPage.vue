<template>
  <NavigationNet v-if="isLoggedIn" />
  <NavigationNetEnter v-else />

  <template v-if="getUser.delete === 0">

    <!-- показывать загрузчик -->
    <template v-if="getStatus === 'loading'">
      <div class="loading_show">
        <UIloadMoreContent />
      </div>
    </template>


    <div class="wrapper_main" v-if="getStatus === 'success'">
      <div class="main">

        <!-- модальное окно для редактирования профиля -->
        <template v-if="getModulEditProfile">
          <UImodal>
            <EditProfile />
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
  <template v-else-if="getUser.delete === 1">
    <div class="wrapper_delete_user">
      <p>Профиль пользователя был удален</p>
    </div>
  </template>
</template>
<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import EditProfile from "@/components/MyPage/EditProfile";
import MyPageContent from "@/components/MyPage/MyPageContent.vue";

export default {
  name: "MyPage",
  components: { EditProfile, MyPageContent },

  mounted() {
    this.loadAllPhotos(this.$route.params.id);
    this.setPosts([])
    this.setPhotosPostsArray([]);
    this.setCountPostsNull()
  },

  methods: {
    ...mapActions({
      loadAllPhotos: "loadPhotoStore/loadAllPhotos",
    }),

    ...mapMutations({
      setPosts: "postsMyPageStore/setPosts",
      setCountPostsNull: "postsMyPageStore/setCountPostsNull",
      setPhotosPostsArray: "postsMyPageStore/setPhotosPostsArray"
    })

  },

  computed: {
    ...mapGetters({
      isLoggedIn: "authorizationStore/isLoggedIn",
      getModulEditProfile: "editProfileStore/getModulEditProfile",
      getUser: "authorizationStore/getUser",
      getModalWriteMessage: "messageStore/getModalWriteMessage",
      getStatus: "authorizationStore/getStatus"
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
  font-family: Russo One, fantasy, sans-serif;

}

.title_warning_auth {
  text-align: center;
  font-weight: 400;
}

.wrapper_delete_user {
  padding: 120px 20px 5px;
  margin-left: 180px;
}

.wrapper_delete_user p {
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-right: -50%;
  transform: translate(-50%, -50%);
  font-family: Russo One, fantasy, sans-serif;
  font-size: 30px;
  opacity: .7;
}

.loading_show {
  margin-left: 180px;
  padding: 130px;
}

/* МЕДИА-ЗАПРОСЫ */
@media (max-width: 761px) {
  .wrapper_main {
    padding: 120px 0px 0px;
  }

  .main {
    margin-left: 0;
  }

  .wrapper_myPage {
    display: flex;
    flex-direction: column-reverse;
  }

  .wrapper_delete_user {
    padding: 120px 5px 5px;
    margin-left: 0px;
    text-align: center;
  }

  .wrapper_delete_user p {
    font-size: 17px;
  }

  .wrapper_delete_user p {
    font-size: 22px;
    width: 100%;
    text-align: center;
    padding: 5px;
  }

  .loading_show {
    margin-left: 0px;
    padding: 130px;
  }
}
</style>
