<template>
  <div v-for="dialog in getArrayDialogs" :key="dialog.convId" class="wrapper_all_messages_users">
    <UserMessage :dialog="dialog" />
</div>
</template>
    
<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "AllUsersMessages",

  //не обнавляем диалоги в случае перехода со страницы с перепиской
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (from.name !== 'dialoguser') {
        vm.LOAD_DIALOGS()
      }
    })
  },


  methods: {
    ...mapActions({
      LOAD_DIALOGS: "messageStore/LOAD_DIALOGS",
    })
  },
  computed: {
    ...mapGetters({ getArrayDialogs: "messageStore/getArrayDialogs" })
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
</style>