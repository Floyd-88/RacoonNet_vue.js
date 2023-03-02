<template>
  <NavigationNet v-if="isLoggedIn" />

  <div class="wrapper_main">
    <div class="main">

      <div class="MyFriends">
        <MyFriends/>
      </div>
      <!-- <NotificationFriends/> -->

    </div>
  </div>



</template>

<script>
import { mapGetters } from "vuex";

export default {
    name: "FriendsPage",
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
.MyFriends {
  display: flex;
}
</style>