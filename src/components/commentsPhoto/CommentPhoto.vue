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
                    @click="$router.push({ name: 'mypage', params: { id: comment.author_comment_id } })"
                    >{{ comment.name + " " + comment.surname }}</p>
                </div>
                <div class="message_time">
                    <p>{{ comment.date.slice(0, 10) }}</p>
                </div>
            </div>
            <div class="message_text" >
                <p @click="showBtnDelete(comment)">
                   {{ messageText(comment.comment_photo_text) }}
                </p>
                <div class="wrapper_answer_comment" v-if="comment.isBtnDelete">
                    <!-- <UIbtn class="answer_comment" >Ответить</UIbtn> -->
                    <UIbtn class="answer_comment answer_comment_del"  
                        v-if="getUser.is_editProfile || userID == comment.author_comment_id" 
                        @click="DELETE_COMMENTS_PHOTO({commentID: comment.id, authorID: comment.author_comment_id, pageID: +$route.params.id || getUser.userID})">
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
        ...mapActions({DELETE_COMMENTS_PHOTO: "commentsPhoto/DELETE_COMMENTS_PHOTO"}),

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
    font-family: cursive;
    font-weight: 600;
}

.message_time {
    font-size: 15px;
    margin-right: 3px;
}

.message_text {
    margin-left: 10px;
    font-size: 15px;
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