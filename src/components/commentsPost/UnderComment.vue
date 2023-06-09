<template>
    <div class="wrapper_under_comment" v-for="comment in commentsComment.slice(0, countUnderComments)" :key="comment.id">
        <div class="wrapper_block_under_comment_user">
            <div class="wrapper_under_comment_user">
                <div class="under_comment_name_user">
                    <div class="under_comment_ava_user">
                        <img :src="pathAva(comment.ava)" alt="ava" @click="$router.push({ name: 'mypage', params: { id: comment.author_comment } })">
                    </div>
                    <p class="under_comment_name" @click="$router.push({ name: 'mypage', params: { id: comment.author_comment } })">{{comment.name + " " + comment.surname}}</p>
                </div>
                <div class="under_comment_time">
                    <p>{{ comment.date.slice(0, 10) }}</p>
                </div>
            </div>
            <div class="under_comment_text" >
                
                <div v-if="comment.comment_comment_text.length < 200">
                    <p @click.stop="showBtnsAnswUnder(comment)">
                    {{ messageText(comment.comment_comment_text) }}
                    </p>
                </div>                
                <div v-else>
                    <p class="text_post" v-if="!comment.isFullText" 
                        @click="showBtnsAnswUnder(comment)" >
                        {{ messageText(comment.comment_comment_text).slice(0, 200) }}
                    </p>
                    <p class="text_post" v-else 
                        @click="showBtnsAnswUnder(comment)" >
                        {{ messageText(comment.comment_comment_text) }}
                    </p>
                    <p class="more_text_post" v-if="!comment.isFullText" @click="moreTextCommentComments(comment)">
                        Показать еще
                    </p>
                </div>

                <div class="wrapper_answer_under_comment" v-if="comment.isBtnsAnswUnder">
                    <UIbtn class="answer_under_comment" @click="notShowBtnsAnswUnder(comment)">Ответить</UIbtn>
                    <UIbtn class="answer_under_comment answer_under_comment_del" 
                        v-if="getUser.is_editProfile || userID == comment.author_comment" 
                        @click.stop = "DELETE_COMMENTS_COMMENT({commentID: comment.id, authorID: comment.author_comment, pageID: +$route.params.id})">
                        Удалить
                    </UIbtn>
                </div>
            </div>
        </div>
    </div>

<div class="wrapper_show_add_comments" v-if="commentsComment.length > countUnderComments">
    <p class="show_add_comments" @click="showUnderComments(3)">Показать еще комментарии</p>
</div>
<!-- -- -->
</template>

<script>
import UIbtn from '../UI/UIbtn.vue';
import { mapActions, mapGetters } from 'vuex';

export default {
    name: "UnderComment",

    props: {
        comment: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    emits: ['showWriteUnderComments', 'notShowWriteUnderComments'],

    data() {
        return {
            isBtnsAnswUnder: false,
            userID: JSON.parse(localStorage.getItem('user')).userID,
            countUnderComments: 3,
            commentID: "",
        };
    },
    methods: {
        ...mapActions({DELETE_COMMENTS_COMMENT: "commentsPost/DELETE_COMMENTS_COMMENT"}),

        showBtnsAnswUnder(comment) {
            this.$emit("notShowWriteUnderComments")
            this.commentID = comment.id;
            this.commentsComment.map(comment => {
                if(comment.id == this.commentID) {
                    comment.isBtnsAnswUnder = !comment.isBtnsAnswUnder;
                } else{
                    comment.isBtnsAnswUnder = false;
                }
            })
        },

        notShowBtnsAnswUnder(comment) {
            comment.isBtnsAnswUnder = false;
            this.$emit('showWriteUnderComments', {id: comment.id, author_comment: comment.author_comment, comment_comment_text: comment.comment_comment_text, comment_comment_name: comment.name});
        },

        pathAva(ava) {
            try {
                return require(`../../assets/photo/${ava}`);
            } catch {
                return require(`../../assets/ava/ava_1.jpg`);
            }
        },

        messageText(value) {
            let doc = new DOMParser().parseFromString(value, "text/html");
            return doc.documentElement.textContent;
        },
        showUnderComments(n) {
            this.countUnderComments += n;
        },

        moreTextCommentComments(comment) {
            comment.isFullText = true;
        }
    },

    computed: {
        ...mapGetters({
            getUser: "authorizationStore/getUser",
            getCommentsCommentArray: "commentsPost/getCommentsCommentArray"
        }),

        commentsComment() {
          return this.getCommentsCommentArray.filter(comment => comment.comment_id === this.comment.id)
        }
    },

    // watch: {
    //     commentsComment() {
    //         this.showUnderComments(1)
    //     }
    // },

    components: { UIbtn }
}

</script>

<style scoped>
.wrapper_under_comment {
    display: flex;
    margin: 10px 10px 20px 20px;
}

.under_comment_ava_user img {
    width: 25px;
    border-radius: 100%;
    cursor: pointer;
}

.wrapper_block_under_comment_user {
    width: 100%;
}

.wrapper_under_comment_user {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.under_comment_name_user {
    display: flex;
    align-items: center;
}

.under_comment_name {
    padding-left: 5px;
    font-size: 13px;
    cursor: pointer;
    font-family: Russo One, fantasy, sans-serif;
}

.under_comment_time {
    font-size: 11px;
    font-family: Roboto Condensed, Arial, Helvetica, sans-serif;
}

.under_comment_text {
    margin-left: 10px;
}

.under_comment_text p {
    word-break: break-word;
    cursor: pointer;
    font-family: Roboto Condensed, Arial, Helvetica, sans-serif;
    font-size: 12px;
    line-height: 16px;

}

.wrapper_answer_under_comment {
    display: flex;
    justify-content: flex-end;
}

.answer_under_comment {
    padding: 3px 6px 3px 6px;
    background: whitesmoke;
    font-size: 10px;
    font-family: fantasy;
    border-radius: 0px;
}

.answer_under_comment_del {
    margin-left: 10px;
    font-size: 10px;
    opacity: 0.7;
}

.wrapper_show_add_comments {
    display: flex;
    justify-content: center;
    padding-bottom: 5px;
}

.show_add_comments {
    font-weight: 600;
    cursor: pointer;
    display: inline-block;
    font-size: 13px;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}

.show_add_comments:hover {
    opacity: 0.7;
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