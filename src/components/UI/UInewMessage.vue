<template>
    <div class="wrapper_new_message" ref="newMessage" v-if="newMessage">
        <div class="wrapper_close_new_message">
            <CloseModal class="close_new_message" @click="closeNewMessage" />
        </div>
        <div class="wrapper_content_new_message" 
        @click = "nextNewMessage()">
            <img class="new_message_img" src="../../assets/icons/new_message.png" alt="new_message">
            <p class="new_message_title">У Вас новое сообщение!</p>
        </div>

</div>
</template>
  
<script>
import CloseModal from './CloseModal.vue';
import { mapGetters } from 'vuex';


export default {
    name: "UInewMessage",
    components: { CloseModal },

    methods: {
        closeNewMessage() {
            this.$refs.newMessage.style.display = "none"
        },

        nextNewMessage() {
            this.$router.push("/message")
            this.$refs.newMessage.style.display = "none"

        }
    },

    computed: {
        ...mapGetters({ getArrayDialogs: "messageStore/getArrayDialogs" }),

        newMessage() {
            return this.getArrayDialogs.some(dialog => dialog.unread)
        }
    }
}
</script>
  
<style scoped>
.wrapper_new_message {
    display: flex;
    align-items: center;
    position: fixed;
    margin: 10px;
    padding: 5px;
    bottom: 0;
    right: 0;
    border: 1px solid;
    background: paleturquoise;
    border-radius: 6px;
    cursor: pointer;
}

.wrapper_new_message:hover {
    filter: brightness(90%);
}

.wrapper_content_new_message {
    display: flex;
    align-items: center;
}

.new_message_img {
    width: 30px;
    margin-right: 10px;
    margin-left: 5px;
}

.new_message_title {
    margin-right: 5px;
    font-size: 15px;
    font-family: fantasy;
}

.close_new_message {
    /* display: none; */
    top: -15px;
    margin: -5px;
    width: 15px;
    height: 15px;
    border-radius: 50px;
}
</style>