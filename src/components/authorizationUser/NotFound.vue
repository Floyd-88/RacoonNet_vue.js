<template>
  <NavigationNet v-if="isLoggedIn" />
  <NavigationNetEnter  v-if="!isLoggedIn" />
  <div class="wrapper_main">
    <div class="main">
      <div class="wrapper_not_found">
        <h2 class="not_found">{{ title }}</h2>
      </div>

    </div>
  </div>



</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: "NotFound",
  data() {
    return {
      title: 'Ошибка 404. Страница не найдена...'
    }
  },

  computed: {
    ...mapGetters({isLoggedIn: "authorizationStore/isLoggedIn"})
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

/* .wrapper_not_found {
  width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    overflow: auto;
    white-space: nowrap;
    text-align: center;
    font-size: 0;
} */


    .not_found {
    /* position: absolute; */
    text-align: center;
    margin-top: 80px;
    /* top: 50%;
    left: 50%; */
    /* margin-right: -50%; */
    /* transform: translate(-50%, -50%); */
    font-family: Russo One, fantasy, sans-serif;
    font-size: 30px;
    opacity: .7;

    } 

    /* МЕДИА-ЗАПРОСЫ */

@media (max-width: 761px) {

  .main {
  margin-left: 0;
}

  .not_found {
    font-size: 24px;
    } 
}

</style>