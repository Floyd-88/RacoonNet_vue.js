<template>
    <div class="write_comments">
        <!-- блок с комментариями к комменатириям -->
        <div class="write_comments_text" v-if="comment.isShowWriteUnderComment">
            <div class="input-errors" v-for="(error, index) of v$.underCommentText.$errors" :key="index">
                <div class="error-msg" v-if="error.$message === 'Value is required'">
                    Пустой комментарий
                </div>
                <div class="error-msg" v-else-if="error.$message === 'The maximum length allowed is 2500'">
                    Вы превысили допустимое количество символов
                </div>
            </div>
            <textarea placeholder="Оставить комментарий..." @click.stop v-model.trim="v$.underCommentText.$model"
                @blur="v$.underCommentText.$reset()" :class="{ invalid: (v$.underCommentText.$error) }"></textarea>
        </div>

        <!-- блок с комментариями к постам -->
        <div class="write_comments_text" v-else>
            <div class="input-errors" v-for="(error, index) of v$.commentText.$errors" :key="index">
                <div class="error-msg" v-if="error.$message === 'Value is required'">
                    Вы не написали комментарий
                </div>
                <div class="error-msg" v-else-if="error.$message === 'The maximum length allowed is 5000'">
                    Вы превысили допустимое количество символов
                </div>
            </div>
            <textarea placeholder="Оставить комментарий..." @click.stop v-model.trim="v$.commentText.$model"
                @blur="v$.commentText.$reset()" :class="{ invalid: (v$.commentText.$error) }"></textarea>
        </div>

        <div class="write_comments_btn" @click.stop>
            <UIbtn v-if="comment.isShowWriteUnderComment" @click="clickWriteUnderCommentPost()"
                :disabled="v$.underCommentText.$invalid">
                Отправить
            </UIbtn>

            <UIbtn v-else @click="clickWriteCommentPost()" :disabled="v$.commentText.$invalid">
                Отправить
            </UIbtn>

        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';
import UIbtn from '../UI/UIbtn.vue';
import { useVuelidate } from "@vuelidate/core";
import { required, minLength, maxLength } from "@vuelidate/validators";

export default {
    name: "WriteComments",
    components: { UIbtn },

    emits: ['notShowWriteUnderComments', 'showComments'],

    props: {
        post: {
            type: Object,
            default: () => {
                return {}
            }
        },

        comment: {
            type: Object,
            default: () => {
                return {}
            }
        },

        name: {
            type: String,
            default: "",
        },

        isShowWriteUnderComment: {
            type: Boolean,
            default: false,
        }
    },

    setup() {
        return { v$: useVuelidate() }
    },

    validations: {
        commentText: {
            required,
            min: minLength(1),
            max: maxLength(5000),
        },
        underCommentText: {
            required,
            min: minLength(1),
            max: maxLength(2500),
        },
    },

    data() {
        return {
            commentText: "",
            underCommentText: this.name,
        }
    },

    methods: {
        ...mapMutations({
            setCommentPost: "commentsPost/setCommentPost",
            setUnderCommentPost: "commentsPost/setUnderCommentPost",
            setCommentsArray: "commentsPost/setCommentsArray"
        }),
        ...mapActions({
            SAVE_COMMENTS_POST: "commentsPost/SAVE_COMMENTS_POST",
            SAVE_UNDER_COMMENTS_POST: "commentsPost/SAVE_UNDER_COMMENTS_POST"
        }),

        clickWriteCommentPost() {
            this.SAVE_COMMENTS_POST({ postID: this.post.id, textMessage: this.commentText, userPage: this.$route.params.id || this.post.authorPost});
            this.$emit("showComments", 1);
            this.commentText = "";
            this.v$.commentText.$reset();
            this.$emit("notShowWriteUnderComments")
        },

        clickWriteUnderCommentPost() {
            this.SAVE_UNDER_COMMENTS_POST({
                postID: this.comment.post_id,
                commentID: this.comment.id,
                textMessage: this.underCommentText,
                userPage: this.$route.params.id || this.comment.author_comment_id,
                comment_commentID: this.comment.comment_commentID,
                author_comment_comment: this.comment.author_comment_comment,
                comment_comment_text: this.comment.comment_comment_text,
                nameAddressee: this.name
            });
            this.$emit("notShowWriteUnderComments")
            this.underCommentText = "";
            this.v$.underCommentText.$reset()
        },

        // setCommentText(value) {
        //         this.commentText = value;
        //         this.v$.commentText.$touch();
        //     }
    },

    computed: {
        ...mapGetters({
            // getCommentPost: "commentsPost/getCommentPost",
            // getUnderCommentPost: "commentsPost/getUnderCommentPost"
        }),
        ...mapState({
            // commentPost: (state) => state.commentsPost.commentPost,
            // underCommentPost: (state) => state.commentsPost.underCommentPost
        }),
        // underCommentText: {
        //     get() {
        //         return this.getUnderCommentPost;
        //     },
        //     set(value) {
        //         this.setUnderCommentPost(value);
        //         this.v$.underCommentPost.$touch();
        //     }
        // }
    },

    watch: {
        name() {
            this.underCommentText = this.name;
        },

        isShowWriteUnderComment() {
            this.underCommentText = this.name;
        }
    }
}

</script>

<style scoped>
.write_comments {
    display: flex;
    width: 100%;
    align-items: center;
    margin-top: 10px;
}

.write_comments_text {
    width: 100%;
    line-height: 0px;
}

.write_comments_text textarea {
    width: 100%;
    height: 70px;
    border-radius: 5px;
    /* border: 1px solid; */
    padding: 3px;
    resize: none;
}

.write_comments_text textarea:focus {
    border: 1px solid #0197d6;
    box-shadow: 0 0 3px #0197d6;
    outline-offset: 0px;
    outline: none;

}

.write_comments_btn {
    padding-left: 10px;
}

.input-errors {
    margin-bottom: 10px;
}

.error-msg {
    color: red;
    font-size: 14px;
}

.invalid {
    border: 1px solid red;
}
</style>

