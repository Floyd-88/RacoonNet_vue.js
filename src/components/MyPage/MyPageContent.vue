<template>
    <div class="wrapper_contents">

        <PhotoMyPage/>

        <div class="wrapper_posts">
            <AddPost />
            <PostMyPage />

            <div class="wrapper_not_posts" v-if="getPosts.length === 0">
                <p class="not_posts">Посты не найдены!!!</p>
            </div>

            <!--при прокрутки страницы до данного элемента - подгружать следующие посты -->
            <div ref="observer" class="observer"></div>
        </div>
    </div>

    <MyFriends />
</template>
  
<script>
import {mapGetters, mapActions, mapMutations} from "vuex";
export default {
    name: "MyPageContent",

    methods: {
        ...mapActions({
            loadPostServer: "postsMyPageStore/loadPostServer",
            loadAllPhotos: "loadPhotoStore/loadAllPhotos",
        }),
        ...mapMutations({
            setCountPosts: "postsMyPageStore/setCountPosts",
            setLimitPosts: "postsMyPageStore/setLimitPosts",
        }),

    },

    computed: {
        ...mapGetters({
            getPosts: "postsMyPageStore/getPosts",
            //   getModulEditProfile: "editProfileStore/getModulEditProfile",
            getUser: "authorizationStore/getUser"
        }),
    },

    watch: {
        getUser() {
            console.log(this.getUser)
            this.loadAllPhotos();

            const options = {
                rootMargin: '0px',
                threshold: 1.0
            };
            const callback = (entries) => {
                if (entries[0].isIntersecting) {
                    this.setLimitPosts();
                    this.setCountPosts();
                    this.loadPostServer();
                }
            };
            const observer = new IntersectionObserver(callback, options);
            observer.observe(this.$refs.observer);
        }
    }
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
</style>