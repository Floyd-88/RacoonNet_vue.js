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
            <div class="message_text">
                <div v-if="comment.comment_post_text.length < 200">
                    <p class="text_post" @click="showBtnsAnsw(comment)" >
                        {{ messageText(comment.comment_post_text) }}
                    </p>
                </div>                
                <div v-else>
                    <p class="text_post" v-if="!comment.isFullText" 
                        @click="showBtnsAnsw(comment)" >
                        {{ messageText(comment.comment_post_text).slice(0, 200) }}
                    </p>
                    <p class="text_post" v-else 
                        @click="showBtnsAnsw(comment)" >
                        {{ messageText(comment.comment_post_text) }}
                    </p>
                    <p class="more_text_post" v-if="!comment.isFullText" @click="moreTextComment(comment)">
                        Показать еще
                    </p>
                </div>

                <div class="wrapper_answer_comment" v-if="comment.isBtnsAnsw">
                    <UIbtn class="answer_comment"
                        @click.stop="showWriteUnderComments(comment, 'underComment' + comment.id)">
                        Ответить
                    </UIbtn>

                    <UIbtn class="answer_comment answer_comment_del"
                        v-if="getUser.is_editProfile || userID == comment.author_comment_id"
                        @click.stop="DELETE_COMMENTS_POST({ commentID: comment.id, authorID: comment.author_comment_id, pageID: +$route.params.id })">
                        Удалить
                    </UIbtn>
                </div>

                <UnderComment :comment="comment" @notShowWriteUnderComments="notShowWriteUnderComments(comment)"
                    @showWriteUnderComments="showWriteUnderComments(comment, 'underComment' + comment.id, $event)" />

                <div :ref="'underComment' + comment.id">
                    <div class="wrapper_under_write_comments" v-show="comment.isShowWriteUnderComment">
                        <WriteComments :comment="comment" :name="name" :isShowWriteUnderComment="comment.isShowWriteUnderComment"
                            @notShowWriteUnderComments="notShowWriteUnderComments(comment)" />
                    </div>
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
            userID: JSON.parse(localStorage.getItem('user')).userID,
            // isShowWriteUnderComment: false,
            name: "" //имя пользователя которму мы отвечаем
        };
    },
    methods: {
        ...mapActions({ DELETE_COMMENTS_POST: "commentsPost/DELETE_COMMENTS_POST" }),

        showBtnsAnsw(comment) {
            comment.isBtnsAnsw = !comment.isBtnsAnsw;
            comment.isShowWriteUnderComment = false;
        },

        showWriteUnderComments(comment, ref, comment_comments) {
            if (comment_comments) {
                comment.comment_commentID = comment_comments.id;
                comment.author_comment_comment = comment_comments.author_comment;
                comment.comment_comment_text = comment_comments.comment_comment_text;
                this.name = comment_comments.comment_comment_name + ", ";
            } else {
                comment.comment_commentID = "";
                comment.author_comment_comment = "";
                comment.comment_comment_text = "";
                this.name = comment.name + ", ";
            }

            comment.isShowWriteUnderComment = !comment.isShowWriteUnderComment;
            if (comment.isShowWriteUnderComment) {

                let topWriteUnderComment = window.scrollY + this.$refs[ref][0].getBoundingClientRect().y - document.documentElement.clientHeight + 60;
                window.scrollTo(0, topWriteUnderComment)
                comment.isBtnsAnsw = false;
            }
        },

        notShowWriteUnderComments(comment) {
            comment.isShowWriteUnderComment = false;
        },

        pathAva(ava) {
            try {
                return require(`../../assets/photo/${ava}`);
            } catch {
                return require(`../../assets/ava/ava_1.jpg`);
            }
        },

        //в случае закодированных специсимволов в тексте- переводим их обратно в читаемый вид
        messageText(value) {
            let doc = new DOMParser().parseFromString(value, "text/html");
            return doc.documentElement.textContent;
        },

        moreTextComment(comment) {
            comment.isFullText = true;
    }
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
    margin: 10px 10px 20px 50px;
}

.dialog_ava_user img {
    width: 50px;
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
    font-family: Russo One, fantasy, sans-serif;
}

.message_time {
    font-size: 12px;
    font-family: Roboto Condensed, Arial, Helvetica, sans-serif;
}

.message_text {
    margin-left: 20px;
    font-size: 15px;
    border-bottom: 1px solid;
    padding-bottom: 10px;
}

.message_text p {
    word-break: break-word;
    cursor: pointer;
}




.wrapper_text_post {
  padding-right: 6px;
}

.text_post {
  word-break: break-word;
  font-family: Roboto Condensed, Arial, Helvetica, sans-serif;
  font-size: 13px;
  line-height: 18px;
}

.more_text_post {
  font-weight: 600;
  cursor: pointer;
  display: inline-block;
  font-size: 14px;
  font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}

.more_text_post:hover {
  opacity: 0.7;
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

.wrapper_under_write_comments {}

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