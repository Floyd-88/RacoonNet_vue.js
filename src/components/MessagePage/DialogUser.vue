<template>

    <div class="wrapper_dialog_user">

        <!-- headre -->
        <div class="wrapper_header_user">
            <div class="header_btn_back">
                <button>Назад</button>
            </div>
            <div class="wrapper_header_user_name">
                <div class="header_ava_user">
                    <img src="../../assets/ava/ava_1.jpg" alt="ava">
                </div>
                <div class="header_name_user">
                    <p>Pink Floyd</p>
                </div>
            </div>
            <div></div>
        </div>
        <!-- -- -->

        <div class="wrapper_main_messages">
            <!-- message -->
            <div class="wrapper_message_dialog_user">
                <div class="dialog_ava_user">
                    <img src="../../assets/ava/ava_1.jpg" alt="ava">
                </div>
                <div class="wrapper_block_message_user">
                    <div class="wrapper_message_user">
                        <div class="message_name_user">
                            <p>Pink</p>
                        </div>
                        <div class="message_time">
                            <p>12.12.2023 10:45</p>
                        </div>
                    </div>
                    <div class="message_text">
                        <p>Lorem ipsum dolor sit amet consectetur adipisicingorem ipsum dolor sit amet consectetur
                            adipisicing elit. Fugiat, quia!orem ipsum dolor sit amet consectetur adipisicing elit.
                            Fugiat, quia! elit. Fugiat, quia!</p>
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
                <button class="form_message_btn" 
                        type="submit"
                         @click="WRITE_MESSAGE_USER()" 
                         :disabled="v$.$invalid">
                    Написать
                </button>
            </div>
            <!-- -- -->

        </div>

    </div>

</template>

<script>
import { useVuelidate } from "@vuelidate/core";
import { required, minLength } from "@vuelidate/validators";
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";

export default {
    name: "DialogUser",


    setup() {
        return { v$: useVuelidate() }
    },

    data() {
        return {}
    },

    validations: {
        messageUser: {
            required,
            min: minLength(1),
        },
    },

    methods: {
        ...mapActions({
            WRITE_MESSAGE_USER: "messageStore/WRITE_MESSAGE_USER"
        }),
        ...mapMutations({
            setModalWriteMessage: "messageStore/setModalWriteMessage",
            setMessageUser: "messageStore/setMessageUser",
        }),
    },

    computed: {
        ...mapGetters({
            getMessageUser: "messageStore/getMessageUser",

        }),
        ...mapState({
            messageUser: (state) => state.messageStore.messageUser,

        }),

        //двухстороннее связывание + валидация
        changeMessage: {
            get() {
                return this.getMessageUser
            },
            set(value) {
                this.setMessageUser(value)
                this.v$.messageUser.$touch()
            }
        },

        pathAva() {
            try {
                return require(`../../assets/photo/${this.user.ava}`);
            } catch {
                return require(`../../assets/ava/ava_1.jpg`);
            }

        },
    }
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

.header_btn_back {}

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
}

.header_ava_user img {
    width: 50px;
    border-radius: 100%;
}

.header_name_user {
    font-family: fantasy;
    font-size: 20px;
}
.wrapper_main_messages {
    flex-grow: 1;
    overflow: auto;
}
.wrapper_message_dialog_user {
    display: flex;
    margin: 0px 15px 25px 10px;
}

.dialog_ava_user {}

.dialog_ava_user img {
    width: 40px;
    border-radius: 100%;
}

.wrapper_block_message_user {
    margin-left: 10px;
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
}

.message_time {
    font-size: 15px;
}

.message_text {
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
    border: 1px solid red;
}
</style>