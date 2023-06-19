<template>
  <template v-if="getArrayDialogs.length > 0">
    <div v-for="dialog in getArrayDialogs" :key="dialog.convId" class="wrapper_all_messages_users">
      <UserMessage :dialog="dialog" />
    </div>

  </template>
  <template v-else>
    <div class="wrapper_not_messages">
      <p class="not_messages" v-if="getIsNotDialogs">
        Ваш список диалогов пуст. Пора приступать к общению!
      </p>
    </div>
  </template>
  <div ref="observer" class="observer"></div>

  <template v-if="getIsUIloadMoreDialogs">
    <div class="wrapper_messages_load_more_message">
      <UIloadMoreContent />
    </div>
  </template>
</template>
    
<script>
import { mapGetters, mapActions } from "vuex";
// import store from "@/store/index";

export default {
  name: "AllUsersMessages",

  data() {
    return {}
  },

  mounted() {
    //подгрузка новой партии диалогов при скроле страницы
    const options = {
      rootMargin: "0px",
      threshold: 1
    };
    const callback = (entries) => {
      if (entries[0].isIntersecting) {

        if (this.getArrayDialogs.length !== 0) {
          this.LOAD_DIALOGS()
            .then(() => {})
        } 
      }
    };
    const observer = new IntersectionObserver(callback, options);
    observer.observe(this.$refs.observer);
  },

  //не обнавляем диалоги в случае перехода со страницы с перепиской
  // beforeRouteEnter(to, from, next) {
  //   next(vm => {
  //     if (from.name !== 'dialoguser') {
  //       vm.LOAD_DIALOGS()
  //     }
  //   })
  // },


  methods: {
    ...mapActions({
      LOAD_DIALOGS: "messageStore/LOAD_DIALOGS",
    })
  },
  computed: {
    ...mapGetters({ 
      getArrayDialogs: "messageStore/getArrayDialogs",
      getIsUIloadMoreDialogs: "messageStore/getIsUIloadMoreDialogs",
      getIsNotDialogs: "messageStore/getIsNotDialogs"
    })
  }
}
</script>
    
    
<style scoped>
.wrapper_all_messages_users {
  display: flex;
  justify-content: space-between;
  border-radius: 5px;
  background: #f8f8f9;
  box-shadow: 0px 2px 5px 0px rgb(0 0 0 / 40%);
}

.wrapper_all_messages_users:hover {
  filter: brightness(97%);
}

.wrapper_not_messages {
  display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    opacity: .8;
    font-family: Russo One, fantasy, sans-serif;
    color: dimgray;
    position: absolute;
    top: 50%;
    margin-top: -100px;
    left: 45%;
    margin-left: -100px;
}
.wrapper_messages_load_more_message {
  margin-top: 10px;
}

.observer {
  /* border: 1px solid; */
}
</style>