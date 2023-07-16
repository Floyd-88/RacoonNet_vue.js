<template>
  <NavigationNet v-if="isLoggedIn" />
  <div class="wrapper_main">
    <div class="main">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "MessagePage",

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

/* МЕДИА-ЗАПРОСЫ */
@media (max-width: 761px) {

  .wrapper_main {
    padding: 120px 0px 5px;
  }

  .main {
    margin-left: 0px;
  }
}
</style>