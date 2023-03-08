<template>
    <div class="write_comments">
        
        <div class="write_comments_text">
            <div class="input-errors" v-for="(error, index) of v$.commentPost.$errors" :key="index">
            <div class="error-msg" v-if="error.$message === 'Value is required'">
                Вы не написали комментарий
            </div>
        </div>
            <textarea 
            placeholder="Оставить комментарий..." 
            @click.stop v-model="commentText"  
            :class="{invalid: (v$.commentPost.$error)}"></textarea>
        </div>

        <div class="write_comments_btn" @click.stop>
            <UIbtn @click="clickWriteCommentPost()" :disabled="v$.$invalid">Отправить</UIbtn>
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

    props: {
        post: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },

    setup() {
        return { v$: useVuelidate() }
    },

    validations: {
        commentPost: {
            required,
            min: minLength(1),
            max: maxLength(200),
        },
    },

    data() {
        return {  
            // commentText: "",
        }
    },

    methods: {
        ...mapMutations({ 
            setCommentPost: "commentsPost/setCommentPost",
            setCommentsArray: "commentsPost/setCommentsArray"
        }),
        ...mapActions({SAVE_COMMENTS_POST: "commentsPost/SAVE_COMMENTS_POST"}),

        clickWriteCommentPost() {
            this.SAVE_COMMENTS_POST({postID: this.post.id, text: this.getCommentPost, userPage: this.$route.params.id});
            this.commentText = "";
            this.v$.commentPost.$reset()
        }
    },

    computed: {
        ...mapGetters({ getCommentPost: "commentsPost/getCommentPost" }),
        ...mapState({ commentPost: (state) => state.commentsPost.commentPost }),

        commentText: {
            get() {
                return this.getCommentPost;
            },
            set(value) {
                this.setCommentPost(value);
                this.v$.commentPost.$touch();
            }
        },
    }
}

</script>

<style scoped>
.write_comments {
    display: flex;
    width: 100%;
    align-items: center;
    margin-top: 30px;
}

.write_comments_text {
    width: 100%;
    line-height: 0px;
}

.write_comments_text textarea {
    width: 100%;
    height: 33px;
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

