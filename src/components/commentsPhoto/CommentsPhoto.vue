<template>
    <div class="wrapper_block_comments">
        <div class="wrapper_block_comments_flex_column">
            <div class="wrapper_block_comments_title">
            <div class="wrapper_block_comments_title_name_ava">
                <div class="wrapper_block_comments_ava">
                    <img class="ava_posts" :src="loadAva" alt="ava">
                </div>
                <div class="wrapper_block_comments_name">
                    <p class="block_comments_name">{{ currentImg.name + " " + currentImg.surname }}</p>
                </div>
            </div>

            <div class="wrapper_block_comments_date">
                <p class="block_comments_date">{{ currentImg.date.slice(0, 10) }}</p>
            </div>

            
        </div>
        <div class="wrapper_block_comments_item" @mouseleave="closeUserLikes(currentImg)">
                <div class="wrapper_block_comments_item_like">
                    <p class="count_likes" v-if="currentImg.likes !== 0">{{ currentImg.likes }}</p>

                    <img class="likes" src="../../assets/icons/like.svg" alt="like" v-if="currentImg.like_photo == 0"
                        @click="countLikes(currentImg)" @mouseover="getUserLike(currentImg)">

                    <!-- подкрашивать сердце если пост лайкнут -->
                    <img class="likes" src="../../assets/icons/like_full.png" alt="like" v-if="currentImg.like_photo == 1"
                        @click="countLikes(currentImg)" @mouseover="getUserLike(currentImg)">
                </div>

                <!-- при наведении всплывающее окно с теми кто лайкнул -->
                <div class="wrapper_likes_users" v-show="currentImg.activeLikesUsers">
                    <div class="likes_users" v-for="user in getUsersLikesPhoto.slice(0, 4)" :key="user.author_likes_photo">
                        <div class="my_friend_ava" @mouseover.stop="user.isNameUserLike = true"
                            @mouseleave.stop="user.isNameUserLike = false"
                            @click="$router.push({ name: 'mypage', params: { id: `${user.author_likes_photo}` } })">
                            <img :src="loadAvaUserLikePhoto(user.ava)" alt="ava">
                        </div>
                        <div class="wrapper_like_user_name" v-if="user.isNameUserLike">
                            <p class="like_user_name" @mouseleave="closeUserLikes(currentImg)">{{user.name + " " + user.surname}}</p>
                        </div>
                    </div>

                    <div class="wrapper_more_users_likes" v-if="getUsersLikesPhoto.length > 4">
                        <p class="more_users_likes" @click="setShowModalBlockUsersLikesPhoto(true)">еще</p>
                    </div>
                </div>
            </div>
        </div>
        

        <!-- комментарии -->
        <div class="wrapper_block_comments_comment" ref="scrollToMe">
            <CommentPhoto />
        </div>

        <div class="wrapper_under_write_comments">
            <WriteCommentPhoto :currentImg="currentImg" @scrollToMe="scrollToElement()" />
        </div>
    </div>

    <!-- модальное окно c пользователями лайкнувшими фото  -->
    <div @click.stop="closeModalWindowLikesUserPhoto()">
        <div class="modal_show_users_likes_fone" v-if="getShowModalBlockUsersLikesPhoto">
            <div class="modal_show_users_likes_window">
                <UIUsersLikes>
                    <div class="my_friend" v-for="user in getUsersLikesPhoto" :key="user.author_likes_photo">
                        <div class="my_friend_ava_full"
                            @click="$router.push({ name: 'mypage', params: { id: `${user.author_likes_photo}` } })">
                            <img :src="loadAvaUserLikePhoto(user.ava)" alt="ava">
                        </div>
                        <div class="my_friend_name"
                            @click="$router.push({ name: 'mypage', params: { id: `${user.author_likes_photo}` } })">
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
import { mapActions, mapGetters, mapMutations } from 'vuex';

export default {
    name: "CommentsPhoto",

    props: {
        currentImg: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },

    methods: {
        ...mapMutations({
            setShowModalBlockUsersLikesPhoto: "commentsPhoto/setShowModalBlockUsersLikesPhoto",
            setUsersLikesPhoto: "commentsPhoto/setUsersLikesPhoto"
        }),
        ...mapActions({
            SAVE_LIKE_COUNT_PHOTO: "loadPhotoStore/SAVE_LIKE_COUNT_PHOTO",
            GET_USER_LIKES_PHOTO: "commentsPhoto/GET_USER_LIKES_PHOTO",
        }),

        //пролистывать вниз при написании поста
        scrollToElement() {
            try {
                const el = this.$refs.scrollToMe;
                if (el) {
                    el.scrollTop = el.scrollHeight;
                }
            } catch (err) {
                console.log(err)
            }
        },

        //сохраняем лайк фотографии
        async countLikes(currentImg) {
            await this.SAVE_LIKE_COUNT_PHOTO({ photoID: (currentImg.photoID) ? currentImg.photoID : currentImg.id });
            let objectLikes = await this.getLikesPhoto;
            currentImg.likes = objectLikes.likes.likes;

            //если я лайкнул фото из поста, также лайкается фото из массива фотографий
            if (currentImg.photoID) {
                this.getAllPhotosMyPage.map(photo => {
                    if (photo.id === currentImg.photoID) {
                        photo.likes = objectLikes.likes.likes;

                        if (photo.like_photo == 0) {
                            photo.like_photo = 1;
                        } else {
                            photo.like_photo = 0;
                        }
                    }
                });
            } else {
                this.getPhotosPostsArray.map(photo => {
                    if (photo.photoID === currentImg.id) {
                        photo.likes = objectLikes.likes.likes;

                        if (photo.like_photo == 0) {
                            photo.like_photo = 1;
                        } else {
                            photo.like_photo = 0;
                        }
                    }
                });
            }

            if (currentImg.like_photo == 0) {
                currentImg.like_photo = 1;
            } else {
                currentImg.like_photo = 0
            }

        },

        getUserLike(currentImg) {
            if (currentImg.likes > 0) {
                currentImg.activeLikesUsers = true;
                this.GET_USER_LIKES_PHOTO(currentImg);
            }
        },

        closeUserLikes(currentImg) {
            currentImg.activeLikesUsers = false;
            if (!this.getShowModalBlockUsersLikesPhoto) {
                this.setUsersLikesPhoto([]);
            }
        },

        loadAvaUserLikePhoto(ava) {
            try {
                return require(`../../assets/photo/${ava}`)
            } catch {
                return require(`../../assets/ava/ava_1.jpg`);
            }
        },

        closeModalWindowLikesUserPhoto() {
            this.setShowModalBlockUsersLikesPhoto(false)
            this.setUsersLikesPhoto([]);
        },
    },

    computed: {
        ...mapGetters({
            getCommentsPhotoArray: "commentsPhoto/getCommentsPhotoArray",
            getLikesPhoto: "loadPhotoStore/getLikesPhoto",
            getPhotosPostsArray: "postsMyPageStore/getPhotosPostsArray",
            getAllPhotosMyPage: "loadPhotoStore/getAllPhotosMyPage",
            getUsersLikesPhoto: "commentsPhoto/getUsersLikesPhoto",
            getShowModalBlockUsersLikesPhoto: "commentsPhoto/getShowModalBlockUsersLikesPhoto"
        }),

        loadAva() {
            try {
                return require(`../../assets/photo/${this.currentImg.ava}`)
            } catch {
                return require(`../../assets/ava/ava_1.jpg`);
            }
        },
    },

    watch: {
        getCommentsPhotoArray() {
            this.scrollToElement();
        }
    }

}
</script>

<style scoped>
.wrapper_block_comments {
    width: 30%;
    background: whitesmoke;
    padding: 10px;
    display: flex;
    flex-direction: column;
}

.wrapper_block_comments_title {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.wrapper_block_comments_title_name_ava {
    display: flex;
    align-items: center;
}

.wrapper_block_comments_ava {}

.ava_posts {
    width: 50px;
    border-radius: 100%;
}

.wrapper_block_comments_name {
    margin-left: 5px;
}

.block_comments_name {
    font-family: Russo One, fantasy, sans-serif;
    font-size: 17px;
    max-width: 150px;
    word-break: break-word;
    white-space: normal;
}

.wrapper_block_comments_date {}

.block_comments_date {
    font-family: Roboto Condensed, Arial, Helvetica, sans-serif;
    font-size: 14px;
}

.wrapper_block_comments_item {
    display: flex;
    width: max-content;
}

.wrapper_block_comments_item_like {
    display: flex;
    align-items: center;
    margin-top: 5px;
    margin-bottom: 17px;
}

.count_likes {
    font-size: 20px;
    font-family: fantasy;
}

.likes {
    width: 30px;
    margin-left: 2px;
    cursor: pointer;
}

.wrapper_block_comments_dislike {}

.wrapper_block_comments_comment {
    display: flex;
    flex-direction: column;
    margin-top: 10px;
    white-space: normal;
    flex-grow: 1;
    overflow: auto;
}

.block_comments_comment {}

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
    background: rgba(0, 0, 0, 0.5);
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
    margin-top: 5px;
    width: -moz-max-content;
    width: max-content;
    font-size: 11px;
    font-family: Russo One, fantasy, sans-serif;
    background: gainsboro;
    padding: 0;
    white-space: normal;
    max-width: 106px;
    text-align: center;
    transform: translateX(-34%);
    z-index: 1;
}

.like_user_name {
    
}

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
    font-family: Russo One, fantasy, sans-serif;
    font-size: 13px;
}

/* МЕДИА-ЗАПРОСЫ */

@media (max-width: 761px) {

    .wrapper_block_comments_flex_column {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .wrapper_block_comments {
        width: auto;
        max-height: 36vh;
    }

    .ava_posts {
        width: 40px;
    }

    .wrapper_block_comments_item {
        flex-direction: row-reverse;
        align-items: center;
    }

    .wrapper_block_comments_item_like {
        margin-top: 0px;
        margin-bottom: 0px;
        margin-left: 5px;
    }

    .wrapper_block_comments_date {
        display: none;
    }

    .block_comments_name[data-v-99ffbf26] {
    max-width: 205px;
    white-space: normal;
}

}</style>