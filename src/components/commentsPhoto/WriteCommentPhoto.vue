<template>
    <div class="write_comments">

        <!-- блок с комментариями к постам -->
        <div class="write_comments_text">
            <div class="input-errors" v-for="(error, index) of v$.commentPhoto.$errors" :key="index">
                <div class="error-msg" v-if="error.$message === 'Value is required'">
                    Вы не написали комментарий
                </div>
                <div class="error-msg-limit" v-else-if="error.$message === 'The maximum length allowed is 400'">
                    Вы превысили допустимое количество символов
                </div>
            </div>
            <textarea 
            placeholder="Оставить комментарий..." 
            @focus="setIsFocusComment(true)"  
            v-model.trim="v$.commentPhoto.$model"
            @blur="notFocusCommentPhoto()"
            :class="{ invalid: (v$.commentPhoto.$error) }"></textarea>
        </div>

        
        
        <div class="write_comments_btn" @click.stop>
            <UIbtn
            :disabled="v$.commentPhoto.$invalid"
            @click="clickWriteCommentPhoto()">
            Отправить</UIbtn>

        </div>
</div>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';
import UIbtn from '../UI/UIbtn.vue';
import { useVuelidate } from "@vuelidate/core";
import { required, minLength, maxLength } from "@vuelidate/validators";

export default {
    name: "WriteCommentPhoto",
    components: { UIbtn },

    props: {
    
        currentImg: {
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
        commentPhoto: {
            required,
            min: minLength(1),
            max: maxLength(400),
        },
    },

    data() {
        return {
            commentPhoto: "",
        }
    },

    methods: {
        ...mapMutations({
            setCommentPost: "commentsPost/setCommentPost",
            setUnderCommentPost: "commentsPost/setUnderCommentPost",
            setCommentsArray: "commentsPost/setCommentsArray",
            setIsFocusComment: "commentsPhoto/setIsFocusComment"
        }),
        ...mapActions({ 
            SAVE_COMMENTS_PHOTO: "commentsPhoto/SAVE_COMMENTS_PHOTO",
        }),

        notFocusCommentPhoto() {
            this.v$.commentPhoto.$reset();
            this.setIsFocusComment(false);
        },

        async clickWriteCommentPhoto() {
           await this.SAVE_COMMENTS_PHOTO({ photoID: this.currentImg?.photoID || this.currentImg.id, textMessage: this.commentPhoto, userPage: this.$route.params.id || this.getUser.userID || this.currentImg.userID});
           this.$emit("scrollToMe");
            this.commentPhoto = "";
            this.v$.commentPhoto.$reset();
        },


        // commentPhoto(value) {
        //         this.commentPhoto = value;
        //         this.v$.commentPhoto.$touch();
        //     }
    },

    computed: {
        ...mapGetters({
            getUser: "authorizationStore/getUser",
            // getCommentPost: "commentsPost/getCommentPost",
            // getUnderCommentPost: "commentsPost/getUnderCommentPost"
        }),
        ...mapState({
            // commentPost: (state) => state.commentsPost.commentPost,
            // underCommentPost: (state) => state.commentsPost.underCommentPost
        }),
    }
}

</script>

<style scoped>
.write_comments {
    display: flex;
    width: 100%;
    align-items: center;
    margin-top: 30px;
    position: relative;
}

.write_comments_text {
    width: 100%;
    line-height: 0px;
}

.write_comments_text textarea {
    width: 100%;
    height: 45px;
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
    position: absolute;
    top: -10px;
}

.error-msg {
    color: red;
    font-size: 14px;
}

.error-msg-limit {
    color: red;
    font-size: 13px; 
}

.invalid {
    border: 1px solid red;
}
</style>

