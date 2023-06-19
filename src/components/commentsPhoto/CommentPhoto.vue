<template>
    <div class="wrapper_message_dialog_user" v-for="comment in getCommentsPhotoArray" :key="comment.id">
        <div class="wrapper_block_message_user">
            <div class="wrapper_message_user">
                <div class="message_name_user">
                    <div class="dialog_ava_user"
                        @click="$router.push({ name: 'mypage', params: { id: comment.author_comment_id } })">
                        <img :src="pathAva(comment.ava)" alt="ava">
                    </div>
                    <p class="message_name"
                        @click="$router.push({ name: 'mypage', params: { id: comment.author_comment_id } })">{{ comment.name
                            + " " + comment.surname }}</p>
                </div>
                <div class="message_time">
                    <p>{{ comment.date.slice(0, 10) }}</p>
                </div>
            </div>
            <div class="message_text">
                <!-- <p @click="showBtnDelete(comment)"> -->

                <div v-if="comment.comment_photo_text.length < 100">
                    <p class="text_post" @click="showBtnDelete(comment)">
                        {{ messageText(comment.comment_photo_text) }}
                    </p>
                </div>
                <div v-else>
                    <p class="text_post" v-if="!comment.isFullText" @click="showBtnDelete(comment)">
                        {{ messageText(comment.comment_photo_text).slice(0, 100) }}
                    </p>
                    <p class="text_post" v-else @click="showBtnDelete(comment)">
                        {{ messageText(comment.comment_photo_text) }}
                    </p>
                    <p class="more_text_post" v-if="!comment.isFullText" @click="moreTextComment(comment)">
                        Показать еще
                    </p>
                    <!-- </p> -->
                </div>
                <div class="wrapper_answer_comment" v-if="comment.isBtnDelete">
                    <!-- <UIbtn class="answer_comment" >Ответить</UIbtn> -->
                    <UIbtn class="answer_comment answer_comment_del"
                        v-if="getUser.is_editProfile || userID == comment.author_comment_id"
                        @click="DELETE_COMMENTS_PHOTO({ commentID: comment.id, authorID: comment.author_comment_id, pageID: +$route.params.id || getUser.userID })">
                        Удалить
                    </UIbtn>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import UIbtn from '../UI/UIbtn.vue';

export default {
    name: "CommentPhoto",

    // props: {
    //     comments: {
    //         type: Array,
    //         default: () => {
    //             return []
    //         }
    //     }
    // },

    data() {
        return {
            isBtnDelete: false,
            userID: JSON.parse(localStorage.getItem('user')).userID,
        };
    },

    methods: {
        ...mapActions({ DELETE_COMMENTS_PHOTO: "commentsPhoto/DELETE_COMMENTS_PHOTO" }),

        showBtnDelete(comment) {
            comment.isBtnDelete = !comment.isBtnDelete;
        },

        pathAva(ava) {
            try {
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

        moreTextComment(comment) {
            comment.isFullText = true;
        }
    },

    computed: {
        ...mapGetters({
            getUser: "authorizationStore/getUser",
            getCommentsPhotoArray: "commentsPhoto/getCommentsPhotoArray"
        }),
    },


    components: { UIbtn }
}

</script>

<style scoped>
.wrapper_message_dialog_user {
    display: flex;
    margin-bottom: 22px;
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
    font-family: Russo One, fantasy, sans-serif;
}

.message_time {
    font-size: 13px;
    margin-right: 3px;
    font-family: Roboto Condensed, Arial, Helvetica, sans-serif;
}

.message_text {
    margin-left: 10px;
    font-family: Roboto Condensed, Arial, Helvetica, sans-serif;
    font-size: 13px;
    border-bottom: 1px solid;
    padding-bottom: 10px;
}

.message_text p {
    word-break: break-word;
    cursor: pointer;
}

.wrapper_answer_comment {
    display: flex;
    justify-content: flex-end;
    /* margin-top: 9px; */
}

.answer_comment {
    padding: 3px 6px 3px 6px;
    background: whitesmoke;
    font-size: 12px;
    font-family: Russo One, fantasy, sans-serif;
    border-radius: 0px;
}

.answer_comment_del {
    margin-left: 10px;
    opacity: 0.7;
    margin-right: 3px;
}

.wrapper_under_write_comments {}

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

/* МЕДИА-ЗАПРОСЫ */

@media (max-width: 761px) {

.wrapper_message_user {
    margin-left: 10px;
}

.wrapper_message_dialog_user[data-v-83aca5d8] {
    margin-bottom: 10px;
}
}
</style>