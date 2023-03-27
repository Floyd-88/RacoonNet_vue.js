<template>
    <div class="wrapper_under_comment" v-for="comment in commentsComment" :key="comment.id">
        <div class="wrapper_block_under_comment_user">
            <div class="wrapper_under_comment_user">
                <div class="under_comment_name_user">
                    <div class="under_comment_ava_user">
                        <img :src="pathAva(comment.ava)" alt="ava">
                    </div>
                    <p class="under_comment_name">{{comment.name + " " + comment.surname}}</p>
                </div>
                <div class="under_comment_time">
                    <p>{{ comment.date.slice(0, 10) }}</p>
                </div>
            </div>
            <div class="under_comment_text" >
                <p @click.stop="showBtnsAnswUnder(comment)">
                    {{ messageText(comment.comment_comment_text) }}
                </p>
                <div class="wrapper_answer_under_comment" v-if="comment.isBtnsAnswUnder">
                    <!-- <UIbtn class="answer_under_comment">Ответить</UIbtn> -->
                    <UIbtn class="answer_under_comment answer_under_comment_del" 
                        v-if="getUser.is_editProfile || userID == comment.author_comment" 
                        @click.stop = "DELETE_COMMENTS_COMMENT({commentID: comment.id, authorID: comment.author_comment, pageID: +$route.params.id})">
                        Удалить
                    </UIbtn>
                </div>
            </div>


        </div>
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

    data() {
        return {
            isBtnsAnswUnder: false,
            userID: JSON.parse(localStorage.getItem('user')).userID,
        };
    },
    methods: {

        ...mapActions({DELETE_COMMENTS_COMMENT: "commentsPost/DELETE_COMMENTS_COMMENT"}),

        showBtnsAnswUnder(comment) {
            comment.isBtnsAnswUnder = !comment.isBtnsAnswUnder;
        },

        pathAva(ava) {
            try {
                console.log('ava')
                return require(`../../assets/photo/${ava}`);
            } catch {
                return require(`../../assets/ava/ava_1.jpg`);
            }
        },

        messageText(value) {
            let doc = new DOMParser().parseFromString(value, "text/html");
            return doc.documentElement.textContent;
        },
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

    components: { UIbtn }
}

</script>

<style scoped>
.wrapper_under_comment {
    display: flex;
    margin: 10px 10px 20px 30px;
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
    font-family: cursive;
    font-weight: 600;
}

.under_comment_time {
    font-size: 13px;
}

.under_comment_text {
    margin-left: 10px;
    font-size: 14px;
}

.under_comment_text p {
    word-break: break-word;
    cursor: pointer;
}

.wrapper_answer_under_comment {
    display: flex;
    justify-content: flex-end;
}

.answer_under_comment {
    padding: 3px 6px 3px 6px;
    background: whitesmoke;
    font-size: 12px;
    font-family: fantasy;
    border-radius: 0px;
}

.answer_under_comment_del {
    margin-left: 10px;
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