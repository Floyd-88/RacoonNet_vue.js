<template>
  <NavigationNet v-if="isLoggedIn" />

  <div class="wrapper_main">
    <div class="main">

      <div class="MyFriends">
        <div class="wrapper_my_friends">
          <template v-if="isFriendShow === 'allFriends'">
            <MyFriends />
          </template>
          <template v-else-if="isFriendShow === 'friendsMe'">
            <InviteFriendsMe />
          </template>
          <template v-else-if="isFriendShow === 'friendsFromMe'">
            <InviteFriendsFromMe />
          </template>
        </div>


        <MyFriendsBlock class="wrapper_my_friends_params">

          <!-- Переключение между уведомлениями -->
          <div class="my_friends_params_choice">
            <button class="my_friends_params_choice_btn" @click="friendShow('allFriends')">Все мои друзья</button>
            <button class="my_friends_params_choice_btn" @click="friendShow('friendsMe')">Со мной хотят дружить</button>
            <button class="my_friends_params_choice_btn my_friends_params_choice_btn_end" @click="friendShow('friendsFromMe')">Я хочу дружить</button>
          </div>

          <!-- Фильтр поиска новых друзей -->
          <SearchNewFriends />

        </MyFriendsBlock>

      </div>
    </div>
</div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "FriendsPage",
  data() {
    return {
      isFriendShow: "allFriends"
    };
  },

  methods: {
    friendShow(value) {
      this.isFriendShow = value
    }
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

.wrapper_my_friends {
  white-space: nowrap;
  display: flex;
  flex-direction: column;
  flex: 0 0 70%;
  padding: 15px;
  border-radius: 5px;
  margin-right: 20px;
  box-shadow: 0px 2px 5px 0px rgb(0 0 0 / 40%);
}

.MyFriends {
  display: flex;
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

.my_friends_params_choice_btn:hover {
  filter: brightness(90%);
}
</style>