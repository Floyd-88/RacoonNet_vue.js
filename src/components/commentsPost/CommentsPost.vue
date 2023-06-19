<template>
    <div class="wrapper_comments_post">
        <div class="wrapper_likes" @mouseleave="closeUserLikes(post)">
            <p class="count_likes" v-if="post.likes !== 0">{{ post.likes }}</p>

            <img class="likes" src="../../assets/icons/like.svg" alt="like" v-if="post.like_post == 0"
                @click="countLikes(post)" @mouseover="getUserLike(post)">

            <!-- подкрашивать сердце если пост лайкнут -->
            <img class="likes" src="../../assets/icons/like_full.png" alt="like" v-if="post.like_post == 1"
                @click="countLikes(post)" @mouseover="getUserLike(post)">

            <!-- при наведении всплывающее окно с теми кто лайкнул -->
            <div class="wrapper_likes_users" v-show="post.activeLikesUsers">
                <div class="likes_users" v-for="user in getUsersLikesPost.slice(0, 4)" :key="user.author_likes_post">
                    <div class="my_friend_ava" @mouseover.stop="user.isNameUserLike = true"
                        @mouseleave.stop="user.isNameUserLike = false"
                        @click="$router.push({ name: 'mypage', params: { id: `${user.author_likes_post}` } })">
                        <img :src="loadAva(user.ava)" alt="ava">
                    </div>
                    <div class="wrapper_like_user_name" v-if="user.isNameUserLike">
                        <p class="like_user_name" @mouseleave="closeUserLikes(post)">{{ user.name + " " + user.surname }}</p>
                    </div>
                </div>

                <div class="wrapper_more_users_likes" v-if="getUsersLikesPost.length > 4">
                    <p class="more_users_likes" @click="setShowModalBlockUsersLikesPost(true)">еще</p>
                </div>
            </div>
        </div>
        <div class="wrapper_comments_show_btn" @click="showWriteComment(post, 'comment' + post.id)">
            <img class="comments_show_btn" src="../../assets/icons/comment.svg" alt="comments">
        </div>
    </div>

    <div class="wrapper_write_comments" :class="{ 'active_border_top': comments.length > 0 }">
        <template v-if="comments.length > 0">
            <CommentPost :comments="comments.slice(0, countComments)" />
            <div class="wrapper_show_add_comments" v-if="comments.length > countComments">
                <p class="show_add_comments" @click="showComments(3)">Показать еще комментарии</p>
            </div>
        </template>

        <div :ref="'comment' + post.id">
            <div v-show="post.isShowWriteComment">
                <WriteComments :post="post" @showComments="showComments" />
            </div>
        </div>
    </div>

    <!-- модальное окно c пользователями лайкнувшими пост  -->
    <div @click.stop="closeModalWindowLikesUser()">
        <div class="modal_show_users_likes_fone" v-if="getShowModalBlockUsersLikesPost">
            <div class="modal_show_users_likes_window">
                <UIUsersLikes>
                    <div class="my_friend" v-for="user in getUsersLikesPost" :key="user.author_likes_post">
                        <div class="my_friend_ava_full"
                            @click="$router.push({ name: 'mypage', params: { id: `${user.author_likes_post}` } })">
                            <img :src="loadAva(user.ava)" alt="ava">
                        </div>
                        <div class="my_friend_name"
                            @click="$router.push({ name: 'mypage', params: { id: `${user.author_likes_post}` } })">
                            <p>{{ user.name }}</p>
                            <p>{{ user.surname }}</p>
                        </div>
                    </div>
                </UIUsersLikes>
            </div>
        </div>
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
        return {
            countComments: 3,
            isNameUserLike: false,
            // activeLikesUsers: false
        };
    },

    methods: {
        ...mapMutations({
            setIsShowWriteComment: "commentsPost/setIsShowWriteComment",
            setUsersLikesPost: "commentsPost/setUsersLikesPost",
            setShowModalBlockUsersLikesPost: "commentsPost/setShowModalBlockUsersLikesPost"
        }),
        ...mapActions({
            LOAD_COMMENTS_POST: "commentsPost/LOAD_COMMENTS_POST",
            SAVE_LIKE_COUNT_POST: "postsMyPageStore/SAVE_LIKE_COUNT_POST",
            LOAD_AUTHOR_LIKES: "postsMyPageStore/LOAD_AUTHOR_LIKES",
            GET_USER_LIKES_POST: "commentsPost/GET_USER_LIKES_POST"
        }),

        async showWriteComment(post, ref) {
            post.isShowWriteComment = !post.isShowWriteComment;

            if (post.isShowWriteComment) {
                let top = window.scrollY + this.$refs[ref].getBoundingClientRect().y - document.documentElement.clientHeight + 85;
                window.scrollTo({ top, behavior: 'smooth' })
            }

        },

        comment(value) {
            console.log(value)
        },

        async countLikes(post) {
            await this.SAVE_LIKE_COUNT_POST({ postID: post.id });
            let objectLikes = await this.getLikesPost;
            post.likes = objectLikes.likes.likes

            if (post.like_post == 0) {
                post.like_post = 1;
            } else {
                post.like_post = 0
            }
        },

        showComments(n) {
            this.countComments += n;
        },

        getUserLike(post) {
            if (post.likes > 0) {
                post.activeLikesUsers = true;
                this.GET_USER_LIKES_POST(post);
            }
        },

        closeUserLikes(post) {
            post.activeLikesUsers = false;
            if (!this.getShowModalBlockUsersLikesPost) {
                this.setUsersLikesPost([]);
            }
        },

        loadAva(ava) {
            try {
                return require(`../../assets/photo/${ava}`)
            } catch {
                return require(`../../assets/ava/ava_1.jpg`);
            }
        },

        closeModalWindowLikesUser() {
            this.setShowModalBlockUsersLikesPost(false)
            this.setUsersLikesPost([]);
        },

        // closeNameUserLikePost(user) {
        //     user.isNameUserLike = false;
        //     // post.activeLikesUsers = false;
        //     // this.setUsersLikesPost([]);
        // }
    },

    computed: {
        ...mapGetters({
            getCommentsArray: "commentsPost/getCommentsArray",
            getLikesPost: "postsMyPageStore/getLikesPost",
            getUsersLikesPost: "commentsPost/getUsersLikesPost",
            getShowModalBlockUsersLikesPost: "commentsPost/getShowModalBlockUsersLikesPost"
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
    padding: 0px 8px 13px 8px;
}

.active_border_top {
    border-top: 1px solid;
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
    font-size: 14px;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}

.show_add_comments:hover {
    opacity: 0.7;
}

.wrapper_likes_users {
    display: flex;
    max-width: 170px;
    height: 32px;
    background: white;
    border-radius: 5px;
    box-shadow: 1px 1px 3px 0px rgb(0 0 0 / 40%);
}

.likes_users {
    position: relative;
}

.my_friend_ava {
    height: 100%;
    padding: 2px;

}

.my_friend_ava img {
    height: 100%;
    border-radius: 100%;
    cursor: pointer;
}

.wrapper_more_users_likes {
    display: flex;
    align-items: center;
    padding-left: 10px;
    padding-right: 5px;
}

.more_users_likes {
    cursor: pointer;
}

.more_users_likes:hover {
    font-weight: 600;
}

.modal_show_users_likes_fone {
    display: flex;
    position: fixed;
    background: rgba(0, 0, 0, 0.04);
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    align-items: center;
    justify-content: center;
    z-index: 3;
    /* opacity: 0.1; */
}

.modal_show_users_likes_window {
    position: relative;
    width: max-content;
    height: max-content;
    /* padding-bottom: 10px; */
    border-radius: 5px;
    background: whitesmoke;
    box-shadow: 3px 6px 5px 1px rgb(0 0 0 / 5%);
    overflow: auto;
}

.wrapper_like_user_name {
    position: absolute;
    width: max-content;
    font-size: 11px;
    font-family: Russo One, fantasy, sans-serif;
    background: gainsboro;
    padding: 0px 2px 0px 2px;
    left: -50%;
    bottom: -20px;
}

.like_user_name {}

.my_friend {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 5px;
}

.my_friend_ava_full {}

.my_friend_ava_full img {
    width: 64px;
    border-radius: 100%;
    cursor: pointer;
}

.my_friend_name {
    cursor: pointer;
    text-align: center;
}
</style>