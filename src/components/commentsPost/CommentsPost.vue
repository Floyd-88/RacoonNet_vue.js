<template>
    <div class="wrapper_comments_post">
        <div class="wrapper_likes">
            <p class="count_likes" v-if="post.likes !==0">{{ post.likes }}</p>

            <img class="likes"  
                src="../../assets/icons/like.svg"  
                alt="like" 
                v-if="post.like_post == 0"
                @click="countLikes(post)">

            <!-- подкрашивать сердце если пост лайкнут -->
            <img class="likes"  
                src="../../assets/icons/like_full.png"  
                alt="like" 
                v-if="post.like_post == 1"
                @click="countLikes(post)">

        </div>
        <div class="wrapper_comments_show_btn" @click="showWriteComment(post)">
            <img class="comments_show_btn" src="../../assets/icons/comment.svg" alt="comments">
        </div>
    </div>

    <div class="wrapper_write_comments" v-if="post.isShowWriteComment">
               
        <CommentPost :comments="comments"/>
        <WriteComments :post="post"/>
    </div>
</template>

<script>
import { mapActions, mapMutations, mapGetters } from 'vuex';

export default {
    name: "CommentsPost",

    props: {
        post: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },

    data() {
        return { };
    },

    methods: {
        ...mapMutations({setIsShowWriteComment: "commentsPost/setIsShowWriteComment"}),
        ...mapActions({
            LOAD_COMMENTS_POST: "commentsPost/LOAD_COMMENTS_POST",
            SAVE_LIKE_COUNT_POST: "postsMyPageStore/SAVE_LIKE_COUNT_POST",
            LOAD_AUTHOR_LIKES: "postsMyPageStore/LOAD_AUTHOR_LIKES"
        }),

        showWriteComment(post) {
            post.isShowWriteComment = !post.isShowWriteComment;
        },

        comment(value) {
            console.log(value)
        },

       async countLikes(post) {
            await this.SAVE_LIKE_COUNT_POST({postID: post.id});
            let objectLikes = await this.getLikesPost;
            post.likes = objectLikes.likes.likes

            if(post.like_post == 0) {
                post.like_post = 1;
            } else {
                post.like_post = 0
            }

        }
    },

    computed: {
        ...mapGetters({
            getCommentsArray: "commentsPost/getCommentsArray",
            getLikesPost: "postsMyPageStore/getLikesPost"
        }),

        comments() {
          return this.getCommentsArray.filter(comment => comment.post_id === this.post.id)
        },
    },
}

</script>

<style scoped>
.wrapper_comments_post {
    display: flex;
    justify-content: space-between;
    padding: 0 10px 7px 6px;
    align-items: center;
}

.wrapper_likes {
    display: flex;
    align-items: center;
}

.count_likes {
    font-size: 20px;
    font-family: fantasy;
}

.likes {
    width: 30px;
    margin-left: 5px;
    cursor: pointer;
}

.wrapper_comments_show_btn {}

.comments_show_btn {
    width: 30px;
    cursor: pointer;
}

.wrapper_write_comments {
    border-top: 1px solid;
    padding: 0px 8px 13px 8px;
}
</style>