<template>
  <NavigationNet v-if="isLoggedIn" />

  <div class="wrapper_main">
    <div class="main">

      <div class="wrapper_my_friends">

        <div class="my_friends">
          <template v-if="getIsFriendShow === 'allFriends'">
            <MyFriends @getUserInfo="getUserInfo"/>
          </template>
          <template v-else-if="getIsFriendShow === 'friendsMe'">
            <InviteFriendsMe />
          </template>
          <template v-else-if="getIsFriendShow === 'friendsFromMe'">
            <InviteFriendsFromMe />
          </template>
        </div>


        <MyFriendsBlock class="wrapper_my_friends_params">

          <!-- Переключение между уведомлениями -->
          <div class="my_friends_params_choice"  
               @mouseleave="btnFone = getIsFriendShow">
               
            <button class="my_friends_params_choice_btn" 
                    @click="setIsFriendShow('allFriends')" 
                    :class="{ activeBtn:  btnFone === 'allFriends' }"
                    @mouseenter="btnFone = 'allFriends'" 
              
                    >
            Все мои друзья
            </button>

            <button class="my_friends_params_choice_btn" 
                    @click="setIsFriendShow('friendsMe')" 
                    :class="{ activeBtn:  btnFone === 'friendsMe' }"
                    @mouseenter="btnFone = 'friendsMe'" 
        
                    >
            Входящие заявки
            </button>

            <button class="my_friends_params_choice_btn my_friends_params_choice_btn_end" 
                    @click="setIsFriendShow('friendsFromMe')" 
                    :class="{ activeBtn:  btnFone === 'friendsFromMe' }"
                    @mouseenter="btnFone = 'friendsFromMe'" 
       
                    >
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


    </div>
</div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";

export default {
  name: "FriendsPage",
  emits: ["getUserInfo"],

  data() {
    return {
      btnFone: "allFriends",
    };
  },

  beforeUnmount() {
    this.setIsFriendShow("allFriends")
  },

  methods: {

    ...mapMutations({setIsFriendShow: "friendsStore/setIsFriendShow"}),

    getUserInfo(user) {
      this.user = user;
      // console.log(user)
    }
  },

  computed: {
    ...mapGetters({
      isLoggedIn: "authorizationStore/isLoggedIn",
      getIsFriendShow: "friendsStore/getIsFriendShow",
      getModalWriteMessage: "messageStore/getModalWriteMessage"
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

.wrapper_my_friends {
  display: flex;
}

.my_friends  {
  /* white-space: nowrap; */
  display: flex;
  flex-direction: column;
  flex: 0 0 70%;
  padding: 15px;
  border-radius: 5px;
  margin-right: 20px;
  box-shadow: 0px 2px 5px 0px rgb(0 0 0 / 40%);
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
</style>