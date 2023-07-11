<template>
    <div class="wrapper_under_comment" v-for="comment in commentsComment.slice(0, countUnderComments)" :key="comment.id">
        <div class="wrapper_block_under_comment_user">
            <div class="wrapper_under_comment_user">
                <div class="under_comment_name_user">
                    <div class="under_comment_ava_user"
                        @click="$router.push({ name: 'mypage', params: { id: comment.author_comment } })">
                        <!-- <img :src="pathAva(comment.ava)" alt="ava" > -->
                        <UIAva :ava="comment.ava"/>
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
                        <span :style="{fontWeight: 600}" 
                              v-if="comment.nameAddressee === comment.comment_comment_text.slice(0, comment.nameAddressee.length)">
                            {{ comment.nameAddressee }}
                        </span>
                    {{ messageText(comment) }}
                    </p>
                </div>                
                <div v-else>
                    <p class="text_post" v-if="!comment.isFullText" 
                        @click="showBtnsAnswUnder(comment)" >
                        <span :style="{fontWeight: 600}" 
                              v-if="comment.nameAddressee === comment.comment_comment_text.slice(0, comment.nameAddressee.length)">
                            {{ comment.nameAddressee }}
                        </span>
                        {{ messageText(comment).slice(0, 200) }}
                    </p>
                    <p class="text_post" v-else 
                        @click="showBtnsAnswUnder(comment)" >
                        <span :style="{fontWeight: 600}" 
                              v-if="comment.nameAddressee === comment.comment_comment_text.slice(0, comment.nameAddressee.length)">
                            {{ comment.nameAddressee }}
                        </span>
                        {{ messageText(comment) }}
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

        // pathAva(ava) {
        //     try {
        //         return require(`../../assets/photo/${ava}`);
        //     } catch {
        //         return require(`../../assets/ava/ava_1.jpg`);
        //     }
        // },

        messageText(comment) {
            let doc = new DOMParser().parseFromString(comment.comment_comment_text, "text/html");
            if(comment.comment_comment_text.slice(0, comment.nameAddressee.length) === comment.nameAddressee) {
                return doc.documentElement.textContent.slice(comment.nameAddressee.length);
            }else {
                return doc.documentElement.textContent;
            }
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
    font-family: Russo One, fantasy, sans-serif;
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

/* МЕДИА-ЗАПРОСЫ */

@media (max-width: 761px) {

.under_comment_text p {
font-size: 12px;
line-height: 16px;
}
.wrapper_under_comment {
    margin: 10px 10px 10px 10px;
}

.under_comment_name {
    font-size: 12px;
    max-width: 170px;
}
}
</style>