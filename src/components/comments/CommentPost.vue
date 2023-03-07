<template>
    <div class="wrapper_message_dialog_user">
        <div class="wrapper_block_message_user">
            <div class="wrapper_message_user">
                <div class="message_name_user">
                    <div class="dialog_ava_user">
                        <img src="../../assets/ava/ava_1.jpg" alt="ava">
                    </div>
                    <p class="message_name">Илья Сазонов</p>
                </div>
                <div class="message_time">
                    <p>2022-03-02</p>
                </div>
            </div>
            <div class="message_text" @click="showBtnsAnsw()">
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum, provident. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum, provident.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum, provident.
                </p>
                <div class="wrapper_answer_comment" v-if="isBtnsAnsw">
                    <UIbtn class="answer_comment" @click.stop="showWriteUnderComments()" >Ответить</UIbtn>
                    <UIbtn class="answer_comment answer_comment_del" @click.stop>Удалить</UIbtn>
                </div>

                <UnderComment/>
                <UnderComment/>
                <UnderComment/>

                <div class="wrapper_under_write_comments" v-if="isShowWriteUnderComment">
                    <WriteComments/>
                </div>
            </div>


        </div>
</div>
<!-- -- --></template>

<script>
import UIbtn from '../UI/UIbtn.vue';
import UnderComment from './UnderComment.vue';


export default {
    name: "CommentPost",
    data() {
        return {
            isBtnsAnsw: false,
            isShowWriteUnderComment: false,
        };
    },
    methods: {
        showBtnsAnsw() {
            this.isBtnsAnsw = !this.isBtnsAnsw;
        },

        showWriteUnderComments() {
            this.isShowWriteUnderComment = !this.isShowWriteUnderComment;
        }
    },
    components: { UIbtn, UnderComment }
}

</script>

<style scoped>
.wrapper_message_dialog_user {
    display: flex;
    margin: 10px 10px 20px 30px;
}

.dialog_ava_user img {
    width: 30px;
    border-radius: 100%;
    cursor: pointer;
}

.wrapper_block_message_user {
    width: 100%;
}

.wrapper_message_user {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.message_name_user {
    display: flex;
    align-items: center;
}

.message_name {
    padding-left: 5px;
    font-size: 14px;
    cursor: pointer;
    font-family: cursive;
    font-weight: 600;
}

.message_time {
    font-size: 15px;
}

.message_text {
    cursor: pointer;
    margin-left: 10px;
    font-size: 15px;
    border-bottom: 1px solid;
    padding-bottom: 10px;
}

.message_text p {
    word-break: break-word;
}

.wrapper_answer_comment {
    display: flex;
    justify-content: flex-end;
}

.answer_comment {
    padding: 3px 6px 3px 6px;
    background: whitesmoke;
    font-size: 12px;
    font-family: fantasy;
    border-radius: 0px;
}

.answer_comment_del {
    margin-left: 10px;
    opacity: 0.7;
}

.wrapper_under_write_comments {

}

/* .message_btn_delete {
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

.active_text_fone {
    background: aliceblue;
}

.not_read_message {
    background-color: #ddffe6b3;
} */
</style>