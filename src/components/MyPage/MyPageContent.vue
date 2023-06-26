<template>
    <div class="wrapper_contents">

        <PhotoMyPage />

        <div class="wrapper_posts">
            <AddPost />
            <PostMyPage />

            <div class="wrapper_not_posts" v-if="getPosts.length === 0 && isNotPosts === true">
                <p class="not_posts">Посты не найдены!!!</p>
            </div>

            <!--при прокрутки страницы до данного элемента - подгружать следующие посты -->
            <div ref="observer" class="observer"></div>
            <template v-if="isUIloadMoreContent">
                <UIloadMoreContent />
            </template>
        </div>
    </div>

    <MyFriendsBlock>
        <div class="wrapper_my_friends_title">
            <h4 class="titleMyFriendsBlock" @click="goMyFriends()">
                Список друзей
            </h4>
        </div>
        <div class="list_my_friends">
            <div class="my_friend" v-for="friend in getUsersMyFriends.slice(0, 8)" :key="friend.id">
                <div class="my_friend_ava" @click="$router.push({ name: 'mypage', params: { id: `${friend.userID}` } })">
                    <img :src="loadAva(friend.ava)" alt="ava">
                </div>
                <div class="my_friend_name" @click="$router.push({ name: 'mypage', params: { id: `${friend.userID}` } })">
                    <p>{{ friend.name }}</p>
                </div>
            </div>

            <div class="wrapper_not_friends" >
                <p class="not_friends" v-if="getIsNotFriends && getUsersMyFriends.length === 0">Ваш список друзей пуст!</p>
            </div>
        </div>
    </MyFriendsBlock>
</template>
  
<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import MyFriendsBlock from "./MyFriendsBlock.vue";
import UIloadMoreContent from "../UI/UIloadMoreContent.vue";
export default {
    name: "MyPageContent",

    data() {
        return {
            isUIloadMoreContent: false, //отображать индикотор загрузки новых постов
            isNotPosts: false, //надпись что посты отсутсвуют
            loadPost: true //разрешать загрузку постов
        }
    },

    methods: {
        ...mapActions({
            loadPostServer: "postsMyPageStore/loadPostServer",
            loadAllPhotos: "loadPhotoStore/loadAllPhotos",
            LOAD_COMMENTS_POST: "commentsPost/LOAD_COMMENTS_POST",
            LOAD_COMMENTS_COMMENT: "commentsPost/LOAD_COMMENTS_COMMENT"
        }),
        ...mapMutations({
            setPosts: "postsMyPageStore/setPosts",
            setCountPostsNull: "postsMyPageStore/setCountPostsNull",
            setCommentsArray: "commentsPost/setCommentsArray",
            setCommentsCommentArray: "commentsPost/setCommentsCommentArray",
            setPhotosPostsArray: "postsMyPageStore/setPhotosPostsArray",
            setUsersMyFriends: "friendsStore/setUsersMyFriends",
            setCountFriendsNull: "friendsStore/setCountFriendsNull",
            setUsersMyFriendsFilter: "friendsStore/setUsersMyFriendsFilter"
        }),

        loadAva(ava) {
            try {
                return require(`../../assets/photo/${ava}`)
            } catch {
                return require(`../../assets/ava/ava_1.jpg`);
            }
        },

        goMyFriends() {
            this.setCountFriendsNull();
            this.setUsersMyFriends([]);
            this.setUsersMyFriendsFilter([]);
            this.$router.push({ name: 'friendspage', query: { id: this.getUser.userID } })
        }
    },
    computed: {
        ...mapGetters({
            getPosts: "postsMyPageStore/getPosts",
            getUsersMyFriends: "friendsStore/getUsersMyFriends",
            getUser: "authorizationStore/getUser",
            getIsNotFriends: "friendsStore/getIsNotFriends",
        }),
    },
    watch: {
        $route() {
            if (this.$route.params.id) {
                this.loadAllPhotos(this.$route.params.id);
                window.location.href = `/id${this.$route.params.id}`;
                // window.scrollTo(0, 0);
                // this.setPosts([]);
                // this.setCountPostsNull();
                // this.loadPostServer(this.$route.params.id);
            }
        },
    },
    mounted() {
        const options = {
            rootMargin: "0px",
            threshold: 1
        };
        const callback = (entries) => {
            if (entries[0].isIntersecting) {
                this.isUIloadMoreContent = true; //показывать что идет загрузка

                if(this.loadPost) {
                    this.loadPost = false;
                    this.loadPostServer(this.$route.params.id)
                    .then((response) => {
                        this.isNotPosts = false;
                        if (response.data.length === 0) {
                            this.isNotPosts = true;
                        }
                        this.isUIloadMoreContent = false;
                        this.loadPost = true;

                        return response.data.map(post => post.id)
                    })
                    .then((data) => {
                        this.LOAD_COMMENTS_POST({ userID: this.$route.params.id, postID: data })
                            .then((response) => {
                                this.LOAD_COMMENTS_COMMENT({ userID: this.$route.params.id, postID: response.data.map(post => post.id) });
                            })
                            .catch((err) => {
                                if (err.code === "ERR_CANCELED") {
                                    console.log("Загрузка была отменена")
                                }
                            });
                    })
                    .catch((err) => {
                        if (err.code === "ERR_CANCELED") {
                            console.log("Загрузка была отменена")
                        }
                        this.loadPost = true;
                    });
                }
            } else {
                this.isUIloadMoreContent = false; //отключать загрузку
            }
        };
        const observer = new IntersectionObserver(callback, options);
        observer.observe(this.$refs.observer);
    },

    beforeUnmount() {
        this.setCommentsArray([]);
        this.setCommentsCommentArray([]);
        // this.setPhotosPostsArray([]);
    },

    components: { MyFriendsBlock, UIloadMoreContent }
}
</script>
  
<style scoped>
.wrapper_contents {
    white-space: nowrap;
    display: flex;
    flex-direction: column;
    flex: 0 0 70%;
    /*overflow: hidden;*/
}

.wrapper_posts {
    display: flex;
    flex-direction: column;
    white-space: normal;
    margin-right: 20px;
}

.not_posts {
    line-height: 26px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 30px;
    font-size: 20px;
    opacity: .8;
    font-family: Russo One, fantasy, sans-serif;
    color: dimgray;
}

.not_friends {
    padding-top: 1px;
    line-height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    opacity: .7;
    font-family: Russo One, fantasy, sans-serif;
    color: dimgray;
    text-align: center;
}

.observer {
    border: 1px solid;
    opacity: 0;
    margin: 5px;
}


/* --------------------------- */

.wrapper_my_friends_title {
    display: flex;
    justify-content: center;
    margin: 10px;
    font-size: 17px;
    font-family: Russo One, fantasy, sans-serif;
}

.wrapper_my_friends_title h4 {
    font-weight: 300;
}

.list_my_friends {
    display: flex;
    flex-wrap: wrap;
    padding: 0 0 10px;
    justify-content: center;
}

.my_friend {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 5px;
}

.my_friend_ava {}

.my_friend_ava img {
    width: 64px;
    border-radius: 100%;
    cursor: pointer;
}

.my_friend_name {
    max-width: 70px;
    font-size: 14px;
    font-family: Roboto Condensed, Arial, Helvetica, sans-serif;
    cursor: pointer;
    
}
.my_friend_name p {
    word-wrap: break-word;
    
}

.titleMyFriendsBlock {
    cursor: pointer;
}

.titleMyFriendsBlock:hover {
    color: rgb(0 0 0 / 50%);
}

/* МЕДИА-ЗАПРОСЫ */

@media (max-width: 761px) {

.wrapper_posts {
    margin-right: 0;
}
}
</style>