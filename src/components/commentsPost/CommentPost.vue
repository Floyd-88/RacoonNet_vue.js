<template>
    <div class="wrapper_message_dialog_user" v-for="comment in comments" :key="comment.post_id">
        <div class="wrapper_block_message_user">
            <div class="wrapper_message_user">
                <div class="message_name_user">
                    <div class="dialog_ava_user" 
                    @click="$router.push({ name: 'mypage', params: { id: comment.author_comment_id } })">
                        <img :src="pathAva(comment.ava)" alt="ava">
                    </div>
                    <p class="message_name"
                        @click="$router.push({ name: 'mypage', params: { id: comment.author_comment_id } })">
                    {{ comment.name + " " + comment.surname }}
                    </p>
                </div>
                <div class="message_time">
                    <p>{{ comment.date.slice(0, 10) }}</p>
                </div>
            </div>
            <div class="message_text" @click="showBtnsAnsw(comment)">
                <p>
                    {{ messageText(comment.comment_post_text) }}
                </p>
                <div class="wrapper_answer_comment" v-if="comment.isBtnsAnsw">
                    <UIbtn class="answer_comment" @click.stop="showWriteUnderComments(comment)" >Ответить</UIbtn>

                    <UIbtn class="answer_comment answer_comment_del" v-if="getUser.is_editProfile || getUser.enterUser == comment.author_comment_id" @click.stop="DELETE_COMMENTS_POST({commentID: comment.id, authorID: comment.author_comment_id, pageID: +$route.params.id})">Удалить</UIbtn>
                </div>

                <UnderComment :comment="comment"/>

                <div class="wrapper_under_write_comments" v-if="comment.isShowWriteUnderComment">
                    <WriteComments :comment="comment"/>
                </div>
            </div>
        </div>
</div>
<!-- -- -->
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import UIbtn from '../UI/UIbtn.vue';

export default {
    name: "CommentPost",

    props: {
        comments: {
            type: Array,
            default: () => {
                return []
            }
        }
    },

    data() {
        return {
            isBtnsAnsw: false,
            // isShowWriteUnderComment: false,
        };
    },
    methods: {
        ...mapActions({DELETE_COMMENTS_POST: "commentsPost/DELETE_COMMENTS_POST"}),
        
        showBtnsAnsw(comment) {
            comment.isBtnsAnsw = !comment.isBtnsAnsw;
        },

        showWriteUnderComments(comment) {
            comment.isShowWriteUnderComment = !comment.isShowWriteUnderComment;
        },

        pathAva(ava) {
            try {
                console.log('ava')
                return require(`../../assets/photo/${ava}`);
            } catch {
                return require(`../../assets/ava/ava_1.jpg`);
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
            getUser: "authorizationStore/getUser",
            getCommentsCommentArray: "commentsPost/getCommentsCommentArray"
            // getCommentsArray: "commentsPost/getCommentsArray",
            // getCommentPost: "commentsPost/getCommentPost"
        }),

        // commentsComment() {
        //   return this.getCommentsCommentArray.filter(comment => comment.comment_id === this.comment.id)
        // }
    },


    components: { UIbtn }
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