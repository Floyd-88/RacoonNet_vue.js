<template>
  <NavigationNet v-if="isLoggedIn" />

  <div class="wrapper_main">
    <div class="main">

      <div class="wrapper_my_friends">

        <div class="my_friends" :class="{ myfriends_active: userTokenID != this.$route.query.id }">
          <template v-if="getIsFriendShow === 'allFriends'">
            <MyFriends @getUserInfo="getUserInfo" />
          </template>
          <template v-else-if="getIsFriendShow === 'friendsMe'">
            <InviteFriendsMe />
          </template>
          <template v-else-if="getIsFriendShow === 'friendsFromMe'">
            <InviteFriendsFromMe />
          </template>
          <div ref="observer" class="observer"></div>
          <template v-if="getIsUIloadMoreFriends">
            <UIloadMoreContent />
          </template>
        </div>

        <MyFriendsBlock class="wrapper_my_friends_params" v-if="userTokenID == this.$route.query.id">

          <!-- Переключение между уведомлениями -->
          <div class="my_friends_params_choice" @mouseleave="btnFone = getIsFriendShow">

            <button class="my_friends_params_choice_btn" @click="getAllFriends()"
              :class="{ activeBtn: btnFone === 'allFriends' }" @mouseenter="btnFone = 'allFriends'">
              Все мои друзья
            </button>

            <button class="my_friends_params_choice_btn" @click="setIsFriendShow('friendsMe')"
              :class="{ activeBtn: btnFone === 'friendsMe' }" @mouseenter="btnFone = 'friendsMe'">
              Входящие заявки
            </button>

            <button class="my_friends_params_choice_btn my_friends_params_choice_btn_end"
              @click="setIsFriendShow('friendsFromMe')" :class="{ activeBtn: btnFone === 'friendsFromMe' }"
              @mouseenter="btnFone = 'friendsFromMe'">
              Исходящие заявки
            </button>
          </div>

          <!-- Фильтр поиска новых друзей -->
          <SearchNewFriends />

        </MyFriendsBlock>

      </div>

      <!-- модальное окно для написания сообщения -->
      <template v-if="getModalWriteMessage">
        <UImodal>
          <WriteMessage :user="{
            name: user.name,
            surname: user.surname,
            ava: user.ava,
            userID: user.userID
          }" />
        </UImodal>
      </template>

      <UImodal class="modal_fone" v-if="getIsModalLoadPhoto">
        <FileUpload :addresseeID="String(user.userID)"/>
      </UImodal>

    </div>
  </div>
</template>

<script>
// import FileUpload from "@/components/FileUpload.vue";
import { mapActions, mapGetters, mapMutations } from "vuex";

export default {
    name: "FriendsPage",
    emits: ["getUserInfo"],
    data() {
        return {
            btnFone: "allFriends",
            userTokenID: JSON.parse(localStorage.getItem("user")).userID,
        };
    },
    //   beforeMount() {
    //     this.GET_USER_MY_FRIENDS(this.$route.query.id);
    // },
    mounted() {
        if (this.getCountFriends === 0) {
            this.GET_USER_MY_FRIENDS(this.$route.query.id);
        }
        //подгрузка новой партии новостей при скроле страницы
        const options = {
            rootMargin: "0px",
            threshold: 1
        };
        const callback = (entries) => {
            if (entries[0].isIntersecting) {
                if (this.getIsFriendShow === "allFriends" && this.getTitleFriend === "Друзья" && this.getCountFriends !== 0) {
                    this.GET_USER_MY_FRIENDS(this.$route.query.id);
                }
                else if (this.getIsFriendShow === "friendsFromMe" && this.getCountFriends !== 0) {
                    this.GET_USER_ADD_FRIENDS_FROM_ME();
                }
                else if (this.getIsFriendShow === "friendsMe" && this.getCountFriends !== 0) {
                    this.GET_USER_ADD_FRIENDS_ME();
                }
                if (this.getIsFriendShow === "allFriends" && this.getTitleFriend === "Поиск друзей" && this.getCountFriends !== 0) {
                    this.SEARCH_USERS_FRIENDS({
                        name: this.getSearchFriendName,
                        surname: this.getSearchFriendSurname,
                        country: this.getSearchFriendCountry,
                        city: this.getSearchFriendCity,
                        ageAfter: this.getSearchFriendAgeAfter,
                        ageBefore: this.getSearchFriendAgeBefore,
                        sex: this.getSearchFriendSex,
                    });
                }
            }
        };
        const observer = new IntersectionObserver(callback, options);
        observer.observe(this.$refs.observer);

        if(!this.getUser.userID) {
          this.loadUser({ id: JSON.parse(localStorage.getItem('user')).userID })
        }
    },
    beforeUnmount() {
        this.setIsFriendShow("allFriends");
        this.setUsersMyFriends([]);
        this.setUsersMyFriendsFilter([]);
        this.setCountFriendsNull();
        this.setSearchUsersFriends([]);
        // this.setUsersFriendsMe([]);
        // this.setUsersFriendsFromMe([]);
    },
    methods: {
        ...mapMutations({
            setIsFriendShow: "friendsStore/setIsFriendShow",
            setUsersMyFriends: "friendsStore/setUsersMyFriends",
            setCountFriendsNull: "friendsStore/setCountFriendsNull",
            setUsersMyFriendsFilter: "friendsStore/setUsersMyFriendsFilter",
            setSearchUsersFriends: "friendsStore/setSearchUsersFriends",
            setTitleFriend: "friendsStore/setTitleFriend",
            setSearchFriend: "friendsStore/setSearchFriend",
            // setUsersFriendsMe: "friendsStore/setUsersFriendsMe",
            // setUsersFriendsFromMe: "friendsStore/setUsersFriendsFromMe"
        }),
        ...mapActions({
            GET_USER_MY_FRIENDS: "friendsStore/GET_USER_MY_FRIENDS",
            SEARCH_USERS_FRIENDS: "friendsStore/SEARCH_USERS_FRIENDS",
            GET_USER_ADD_FRIENDS_FROM_ME: "friendsStore/GET_USER_ADD_FRIENDS_FROM_ME",
            GET_USER_ADD_FRIENDS_ME: "friendsStore/GET_USER_ADD_FRIENDS_ME",
            loadUser: "authorizationStore/loadUser",
        }),

        getUserInfo(user) {
            this.user = user;
            // console.log(user)
        },

        getAllFriends() {
            if (this.getIsFriendShow !== "allFriends" || this.getTitleFriend === "Поиск друзей") {
                this.setTitleFriend("Друзья");
                this.setSearchFriend();
                this.setUsersMyFriends([]);
                this.setUsersMyFriendsFilter([]);
                this.setCountFriendsNull();
                this.GET_USER_MY_FRIENDS(this.$route.query.id);
            }
            this.setIsFriendShow("allFriends");
        }
    },
    computed: {
        ...mapGetters({
            isLoggedIn: "authorizationStore/isLoggedIn",
            getIsFriendShow: "friendsStore/getIsFriendShow",
            getModalWriteMessage: "messageStore/getModalWriteMessage",
            getUser: "authorizationStore/getUser",
            getTitleFriend: "friendsStore/getTitleFriend",
            getSearchFriendName: "friendsStore/getSearchFriendName",
            getSearchFriendSurname: "friendsStore/getSearchFriendSurname",
            getSearchFriendCountry: "friendsStore/getSearchFriendCountry",
            getSearchFriendCity: "friendsStore/getSearchFriendCity",
            getSearchFriendAgeAfter: "friendsStore/getSearchFriendAgeAfter",
            getSearchFriendAgeBefore: "friendsStore/getSearchFriendAgeBefore",
            getSearchFriendSex: "friendsStore/getSearchFriendSex",
            getCountFriends: "friendsStore/getCountFriends",
            getIsUIloadMoreFriends: "friendsStore/getIsUIloadMoreFriends",
            getIsModalLoadPhoto: "loadPhotoStore/getIsModalLoadPhoto",
        }),
    },
    watch: {
        $route() {
            const id = this.$route.query.id;
            if (id) {
                this.GET_USER_MY_FRIENDS(id);
            }
        }
    },
    // components: { FileUpload }
}
</script>


<style scoped>
.wrapper_main {
  padding: 120px 20px 5px;
}

.main {
  margin-left: 180px;
}

.wrapper_my_friends {
  display: flex;
}

.my_friends {
  /* white-space: nowrap; */
  display: flex;
  flex-direction: column;
  flex: 0 0 70%;
  padding: 15px;
  border-radius: 5px;
  margin-right: 20px;
  box-shadow: 0px 2px 5px 0px rgb(0 0 0 / 40%);
}

.myfriends_active {
  flex: 0 0 100%;
}


.wrapper_my_friends_params {
  border-radius: 5px;
}

.wrapper_my_friends_params {
  border-radius: 5px;
  padding: 8px;
}

.my_friends_params_choice {}

.my_friends_params_choice_btn {
  width: 100%;
  padding-bottom: 5px;
  border: none;
  background: whitesmoke;
  border-top: 1px solid;
  padding-top: 5px;
  cursor: pointer;
}

.my_friends_params_choice_btn_end {
  border-bottom: 1px solid;
}

/* .my_friends_params_choice_btn:hover {
  filter: brightness(90%);
} */
.activeBtn {
  filter: brightness(90%);
}

.observer {
  /* border: 1px solid black */
}
</style>