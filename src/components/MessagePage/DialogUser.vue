<template >
    <div class="wrapper_dialog_user">

        <!-- headre -->
        <div class="wrapper_header_user">
            <div class="header_btn_back">
                <button @click="$router.go(-1)">Назад</button>
            </div>
            <div class="wrapper_header_user_name">
                <div class="header_ava_user" @click="$router.push({ name: 'mypage', params: { id: getUser.userID } })">
                    <template v-if="getUser.ava != undefined || getUser.ava != null">
                        <img :src="pathAva" alt="ava">
                    </template>
                </div>
                <div class="header_name_user" @click="$router.push({ name: 'mypage', params: { id: getUser.userID } })">
                    <p>{{ (getUser.name || "") + " " + (getUser.surname || "") }}</p>
                </div>
            </div>
            <div></div>
        </div>
        <!-- -- -->

        <div class="wrapper_main_messages" ref="scrollToMe">
            <!-- message -->
            <div class="wrapper_message_dialog_user" v-for="(message, index) in getArrayMessages" :key="message.id">
                <div class="dialog_ava_user" @click="$router.push({ name: 'mypage', params: { id: message.sender } })">
                    <template v-if="message.sender == $route.params.id">
                        <img :src="pathAva" alt="ava">
                    </template>
                    <template v-else>
                        <img :src="require(`../../assets/photo/${message.ava}`)" alt="ava">
                    </template>

                </div>
                <div class="wrapper_block_message_user">
                    <div class="wrapper_message_user">
                        <div class="message_name_user"
                            @click="$router.push({ name: 'mypage', params: { id: message.sender } })">
                            <p>{{ message.name + " " + message.surname }}</p>
                        </div>
                        <div class="message_time">
                            <p>{{ message.date }}</p>
                        </div>
                        <div class="message_btn_delete" v-if="message.isMesssageDel">
                            <UIbtn @click="DELETE_MESSAGES(message.id)">Удалить</UIbtn>
                        </div>
                    </div>
                    <div class="message_text" :class="{ 'active_text_fone': message.isMesssageDel }"
                        @click="showBtnDelete(message, index)">
                        <p>
                            {{ messageText(message.message)}}
                        </p>
                    </div>
                </div>
            </div>
            <!-- -- -->
        </div>

        <div class="wrapper_block_write_message">

            <!-- block textarea -->
            <div class="wrapper_form_message_name">
                <div class="wrapper_form_message_input">
                    <div class="input-errors" v-for="(error, index) of v$.messageUser.$errors" :key="index">
                        <div class="error-msg" v-if="error.$message === 'Value is required'">
                            <!-- Вы не можете отправить пустое сообщение -->
                        </div>
                    </div>

                    <textarea class="new_message" id="name" placeholder="Введите сообщение" v-model="changeMessage"
                        :class="{ invalid: (v$.messageUser.$error) }">
                                </textarea>
                </div>
            </div>
            <!-- -- -->

            <!-- button -->
            <div class="wrapper_form_message_btn">
                <button class="form_message_btn" type="submit" @click="submitMessage()" :disabled="v$.$invalid">
                    Написать
                </button>
            </div>
            <!-- -- -->

        </div>

</div>
</template>

<script>
// import SocketioService from "../../services/socketio.service";
import { useVuelidate } from "@vuelidate/core";
import { required, minLength } from "@vuelidate/validators";
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";
import UIbtn from "../UI/UIbtn.vue";
export default {
    name: "DialogUser",
    setup() {
        return { v$: useVuelidate() };
    },
    data() {
        return {
            isBtnMessageDelete: false,
            messages: [],
            id: "",
        };
    },
    validations: {
        messageUser: {
            required,
            min: minLength(1),
        },
    },
    mounted() {
        // this.scrollToElement();
        this.id = this.$route.params.id;
        this.LOAD_MESSAGES_USER(this.id);
        // this.scrollToElement();
        // console.log(this.getArrayMessages)
        // SocketioService.subscribeToMessages((err, data) => {
        //     if (err) return console.log(err)
        //     this.setArrayMessages([...this.getArrayMessages, data])
        // });
    },
    updated() {
        if (this.$refs.scrollToMe) {
            this.$nextTick(function () {
                this.scrollToElement();
            })
        }
    },

    unmounted() {
    this.LOAD_DIALOGS({isExitMessage: true, convID: this.getArrayMessages[0].conv_id})
    },

    methods: {
        ...mapActions({
            WRITE_MESSAGE_USER: "messageStore/WRITE_MESSAGE_USER",
            LOAD_MESSAGES_USER: "messageStore/LOAD_MESSAGES_USER",
            DELETE_MESSAGES: "messageStore/DELETE_MESSAGES",
            LOAD_DIALOGS: "messageStore/LOAD_DIALOGS",
            UPDATE_FLAGS_UNREAD_MESSAGE: "messageStore/UPDATE_FLAGS_UNREAD_MESSAGE"
        }),
        
        ...mapMutations({
            setModalWriteMessage: "messageStore/setModalWriteMessage",
            setMessageUser: "messageStore/setMessageUser",
            setArrayMessagesUnread: "messageStore/setArrayMessagesUnread"
        }),
        //отправляем сообщение
        async submitMessage() {
            // при отпарвке сообщения убирать фон с непрачитанных
            this.setArrayMessagesUnread()
            //сохраянем сообщение в БД
            this.WRITE_MESSAGE_USER(this.$route.params.id);
        },
        showBtnDelete(message) {
            message.isMesssageDel = !message.isMesssageDel
        },
        //автоматическая прокрутка сообщений вниз
        scrollToElement() {
            try {
                const el = this.$refs.scrollToMe;
                if (el) {
                    el.scrollTop = el.scrollHeight;
                }
            } catch (err) {
                console.log(err)
            }
        },
        //в случае закодированных специсимволов в тектсе- переводим их обратно в читаемый вид
        messageText(value) {
            let doc = new DOMParser().parseFromString(value, "text/html");
            return doc.documentElement.textContent;
        },
    },
    computed: {
        ...mapGetters({
            getMessageUser: "messageStore/getMessageUser",
            getArrayMessages: "messageStore/getArrayMessages",
            getUser: "authorizationStore/getUser",
        }),
        ...mapState({
            messageUser: (state) => state.messageStore.messageUser,
        }),
        //двухстороннее связывание + валидация
        changeMessage: {
            get() {
                return this.getMessageUser;
            },
            set(value) {
                this.setMessageUser(value);
                this.v$.messageUser.$touch();
            }
        },
        //подгрузка автатарки
        pathAva() {
            try {
                return require(`../../assets/photo/${this.getUser.ava}`);
            } catch {
                return require(`../../assets/ava/ava_1.jpg`);
            }
        },
    },
    components: { UIbtn }
}
</script>


<style scoped>
.wrapper_dialog_user {
    display: flex;
    border-radius: 7px;
    background: #ffffff;
    box-shadow: 0px 2px 5px 0px rgb(0 0 0 / 40%);
    flex-direction: column;
    height: 80vh;
}
.wrapper_header_user {
    display: flex;
    border-bottom: 1px solid black;
    padding: 5px;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
}
/* .header_btn_back {} */
.header_btn_back button {
    padding: 6px;
    font-size: 14px;
    font-family: fantasy;
    border-radius: 5px;
    background: #0197d6;
    cursor: pointer;
    color: whitesmoke;
    border: none;
}
.wrapper_header_user_name {
    display: flex;
    align-items: center;
}
.header_ava_user {
    margin-right: 10px;
    cursor: pointer;
}
.header_ava_user img {
    width: 50px;
    border-radius: 100%;
}
.header_name_user {
    font-family: fantasy;
    font-size: 20px;
    cursor: pointer;
}
.wrapper_main_messages {
    flex-grow: 1;
    overflow: auto;
}
.wrapper_message_dialog_user {
    display: flex;
    margin: 0px 15px 25px 10px;
}
/* .dialog_ava_user {} */
.dialog_ava_user img {
    width: 40px;
    border-radius: 100%;
    cursor: pointer;
}
.wrapper_block_message_user {
    margin-left: 10px;
    width: 100%;
}
.wrapper_message_user {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
}
.message_name_user {
    margin-right: 10px;
    font-size: 17px;
    font-family: fantasy;
    cursor: pointer;
}
.message_time {
    font-size: 15px;
}
.message_text {
    cursor: pointer;
}
.message_text p {
    word-break: break-word;
}
.message_btn_delete {
    margin-left: 10px;
}
.message_btn_delete button {
    height: 20px;
    display: flex;
    align-items: center;
}
.wrapper_block_write_message {
    display: flex;
    align-items: center;
    margin: 10px;
    flex-shrink: 0;
}
.wrapper_form_message_name {
    display: flex;
    justify-content: space-around;
    width: 100%;
}
.wrapper_form_message_input {
    width: 100%;
    margin-bottom: 0px;
}
.new_message {
    width: 100%;
    min-height: 50px;
    resize: none;
    border-radius: 5px;
    padding: 5px;
}
.wrapper_form_message_btn {
    display: flex;
    justify-content: flex-end;
    height: 35px;
    margin: 5px 0px 10px 5px;
}
.form_message_btn {
    width: 130px;
    height: 100%;
    border: 1px solid;
    border-radius: 5px;
    background: cornflowerblue;
    cursor: pointer;
    font-size: 23px;
    color: white;
    font-family: emoji;
}
.error-msg {
    color: red;
    font-size: 14px;
}
.invalid {
    /* border: 1px solid red; */
}
.active_text_fone {
    background: aliceblue;
}
.not_read_message {
    background-color: #ddffe6b3;
}
</style>