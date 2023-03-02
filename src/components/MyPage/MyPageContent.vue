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

    <MyFriendsBlock>Мои друзья </MyFriendsBlock>
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
        }),
        ...mapMutations({
            setPosts: "postsMyPageStore/setPosts",
            setCountPostsNull: "postsMyPageStore/setCountPostsNull"
        }),
    },
    computed: {
        ...mapGetters({
            getPosts: "postsMyPageStore/getPosts",
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
</style>