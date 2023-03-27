<template>
    <div class="wrapper_contents">

        <PhotoMyPage />

        <div class="wrapper_posts">
            <AddPost />
            <PostMyPage />

            <div class="wrapper_not_posts" v-if="getPosts.length === 0">
                <p class="not_posts">Посты не найдены!!!</p>
            </div>

            <!--при прокрутки страницы до данного элемента - подгружать следующие посты -->
            <div ref="observer" class="observer"></div>
        </div>
        <!-- <p>Загрузить еще</p> -->

    </div>

    <MyFriendsBlock>
        <div class="wrapper_my_friends_title">
            <h4 class="titleMyFriendsBlock" @click="$router.push({name: 'friendspage', query: {id: getUser.userID} })">
                Список друзей
            </h4>
        </div>
        <div class="list_my_friends">
            <div class="my_friend" v-for="friend in getUsersMyFriends.slice(0, 8)" :key="friend.id">
                <div class="my_friend_ava" @click="$router.push({name: 'mypage', params: {id: `${friend.userID}`}})">
                    <img :src="loadAva(friend.ava)" alt="ava">
                </div>
                <div class="my_friend_name" @click="$router.push({name: 'mypage', params: {id: `${friend.userID}`}})">
                    <p>{{ friend.name }}</p>
                </div>
            </div>
        </div>
    </MyFriendsBlock>
</template>
  
<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import MyFriendsBlock from "./MyFriendsBlock.vue";
export default {
    name: "MyPageContent",
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
            setPhotosPostsArray: "postsMyPageStore/setPhotosPostsArray"
        }),

        loadAva(ava) {
            try {
                return require(`../../assets/photo/${ava}`)
            } catch {
                return require(`../../assets/ava/ava_1.jpg`);
            }
        }
    },
    computed: {
        ...mapGetters({
            getPosts: "postsMyPageStore/getPosts",
            getUsersMyFriends: "friendsStore/getUsersMyFriends",
            getUser: "authorizationStore/getUser",
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
                this.loadPostServer(this.$route.params.id);
            }
        };
        const observer = new IntersectionObserver(callback, options);
        observer.observe(this.$refs.observer);

        this.LOAD_COMMENTS_POST(this.$route.params.id);
        this.LOAD_COMMENTS_COMMENT(this.$route.params.id);
    },

    beforeUnmount() {
        this.setCommentsArray([]);
        this.setCommentsCommentArray([]);
        this.setPhotosPostsArray([]);
    },


    components: { MyFriendsBlock }
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
    margin: 10px 0;
    font-size: 18px;
    font-family: cursive;
    font-weight: 600;
}

.observer {
    border: 1px solid;
}


/* --------------------------- */

.wrapper_my_friends_title {
    display: flex;
    justify-content: center;
    margin: 10px;
    font-size: 17px;
    font-family: fantasy;
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
.my_friend_ava {
    
}
.my_friend_ava img {
    width: 64px;
    border-radius: 100%;
    cursor: pointer;
}
.my_friend_name {
    cursor: pointer;
}

.titleMyFriendsBlock {
    cursor: pointer;
}
.titleMyFriendsBlock:hover {
    color: rgb(0 0 0 / 50%);
}
</style>