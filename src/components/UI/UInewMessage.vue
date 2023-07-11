<template>
    <div class="wrapper_new_message" ref="newMessage" v-if="getIsNewMessageNotify && newMessage">
        <div class="wrapper_close_new_message">
            <CloseModal class="close_new_message" @click="closeNewMessage" />
        </div>
        <div class="wrapper_content_new_message" @click="nextNewMessage()">
            <img class="new_message_img" src="../../assets/icons/new_message.png" alt="new_message">
            <p class="new_message_title">У Вас новое сообщение!</p>
        </div>

    </div>
</template>
  
<script>
import CloseModal from './CloseModal.vue';
import { mapActions, mapGetters, mapMutations } from 'vuex';


export default {
    name: "UInewMessage",
    components: { CloseModal },


    //     beforeRouteEnter(to, from, next) {
    //     next(vm => {
    //       if (from.name == 'messagepage') {
    //         console.log(111)
    //         vm.$refs.newMessage.style.display = "none"
    //       }
    //     })
    //   },

    methods: {
        ...mapMutations({
            setIsNewMessageNotify: "messageStore/setIsNewMessageNotify",
            setCountDialogsNull: "messageStore/setCountDialogsNull",
            setArrayDialogs: "messageStore/setArrayDialogs",
            setArrayMessages: "messageStore/setArrayMessages",
        }),

        ...mapActions({
            LOAD_DIALOGS: "messageStore/LOAD_DIALOGS",

        }),

        closeNewMessage() {
            this.$refs.newMessage.style.display = "none";
            this.setIsNewMessageNotify(false);
        },

        async nextNewMessage() {
            this.$refs.newMessage.style.display = "none";

            this.setIsNewMessageNotify(false);

            this.setCountDialogsNull();
            this.setArrayDialogs([]);
            this.setArrayMessages([]);
            await this.LOAD_DIALOGS()
                .then(() => {
                })
                .catch((err) => {
                    if (err.code === "ERR_CANCELED") {
                        this.setCountDialogsNull();
                        this.setArrayDialogs([]);
                        this.setArrayMessages([]);
                        this.LOAD_DIALOGS()
                            .catch((err) => {
                                if (err.code === "ERR_CANCELED") {
                                    console.log("Загрузка была отменена")
                                }
                            });
                    }
                });
            await this.$router.push('/message');
        }
    },

    computed: {
        ...mapGetters({
            getArrayDialogs: "messageStore/getArrayDialogs",
            getIsNewMessageNotify: "messageStore/getIsNewMessageNotify"
        }),

        newMessage() {
            console.log(this.getArrayDialogs)
            return this.getArrayDialogs.some(dialog => dialog.unread)
        }
    },

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
    left: 0;
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