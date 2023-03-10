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
                    <p>20.02.2023</p>
                </div>
            </div>
            <div class="message_text">
                <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate, quaerat?
                </p>
                <div class="wrapper_answer_comment" >
                    <!-- <UIbtn class="answer_comment" >Ответить</UIbtn> -->
                    <UIbtn class="answer_comment answer_comment_del">Удалить</UIbtn>
                </div>
            </div>
        </div>
</div>
<!-- <div class="wrapper_under_write_comments">
    <WriteCommentPhoto/>
</div> -->
<!-- -- -->
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import UIbtn from '../UI/UIbtn.vue';

export default {
    name: "CommentPhoto",

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
            // isBtnsAnsw: false,
            // isShowWriteUnderComment: false,
        };
    },
    methods: {
        ...mapActions({DELETE_COMMENTS_POST: "commentsPost/DELETE_COMMENTS_POST"}),
        
        showBtnsAnsw(comment) {
            comment.isBtnsAnsw = !comment.isBtnsAnsw;
        },

        // showWriteUnderComments(comment) {
        //     comment.isShowWriteUnderComment = !comment.isShowWriteUnderComment;
        // },

        // pathAva(ava) {
        //     try {
        //         console.log('ava')
        //         return require(`../../assets/photo/${ava}`);
        //     } catch {
        //         return require(`../../assets/ava/ava_1.jpg`);
        //     }
        // },

        //в случае закодированных специсимволов в тектсе- переводим их обратно в читаемый вид
        // messageText(value) {
        //     let doc = new DOMParser().parseFromString(value, "text/html");
        //     return doc.documentElement.textContent;
        // },
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
    margin-bottom: 15px;
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
    margin-right: 3px;
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
    margin-top: 9px;
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
    margin-right: 3px;
}

.wrapper_under_write_comments {

}
</style>