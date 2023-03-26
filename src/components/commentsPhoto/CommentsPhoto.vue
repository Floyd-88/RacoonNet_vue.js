<template>
    <div class="wrapper_block_comments">
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

        <div class="wrapper_block_comments_item">
            <div class="wrapper_block_comments_item_like">
                <p class="count_likes" v-if="currentImg.likes !== 0">{{ currentImg.likes }}</p>

                <img class="likes" src="../../assets/icons/like.svg" alt="like" v-if="currentImg.like_photo == 0"
                    @click="countLikes(currentImg)">

                <!-- подкрашивать сердце если пост лайкнут -->
                <img class="likes" src="../../assets/icons/like_full.png" alt="like" v-if="currentImg.like_photo == 1"
                    @click="countLikes(currentImg)">

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
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

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
        ...mapActions({SAVE_LIKE_COUNT_PHOTO: "loadPhotoStore/SAVE_LIKE_COUNT_PHOTO"}),

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
            await this.SAVE_LIKE_COUNT_PHOTO({photoID: (currentImg.photoID) ? currentImg.photoID : currentImg.id});
            let objectLikes = await this.getLikesPhoto;
            currentImg.likes = objectLikes.likes.likes;

            //если я лайкнул фото из поста, также лайкается фото из массива фотографий
            if(currentImg.photoID) {
                this.getAllPhotosMyPage.map( photo => {
                if(photo.id === currentImg.photoID) {
                photo.likes = objectLikes.likes.likes;

                if(photo.like_photo == 0) {
                    photo.like_photo = 1;
            } else {
                photo.like_photo = 0;
            }
            }});
            } else {
                this.getPhotosPostsArray.map( photo => {
                if(photo.photoID === currentImg.id ) {
                photo.likes = objectLikes.likes.likes;

                if(photo.like_photo == 0) {
                    photo.like_photo = 1;
            } else {
                photo.like_photo = 0;
            }
            }}); 
            }
            
            if(currentImg.like_photo == 0) {
                currentImg.like_photo = 1;
            } else {
                currentImg.like_photo = 0
            }

        }
    },

    computed: {
        ...mapGetters({ 
            getCommentsPhotoArray: "commentsPhoto/getCommentsPhotoArray",
            getLikesPhoto: "loadPhotoStore/getLikesPhoto",
            getPhotosPostsArray: "postsMyPageStore/getPhotosPostsArray",
            getAllPhotosMyPage: "loadPhotoStore/getAllPhotosMyPage",
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
    font-family: fantasy;
    font-size: 18px;
}

.wrapper_block_comments_date {}

.block_comments_date {}

.wrapper_block_comments_item {}

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
</style>