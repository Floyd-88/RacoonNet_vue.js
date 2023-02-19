<template>

<div v-for="userMessage in 2" :key="userMessage" class="wrapper_all_messages_users">
    <UserMessage/>
</div>
  
  
  </template>
  
  <script>
import { mapGetters, mapActions } from "vuex";

  
  export default {
    name: "AllUsersMessages",

    mounted() {
        this.LOAD_DIALOGS()
    },

    methods: {
        ...mapActions({
            LOAD_DIALOGS: "messageStore/LOAD_DIALOGS",
           
        })
    },

    computed: {
        ...mapGetters({getArrayMessages: "messageStore/getArrayMessages"})
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