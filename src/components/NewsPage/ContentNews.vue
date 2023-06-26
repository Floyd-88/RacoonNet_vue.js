<template>
  <div class="post" v-for="post in newsPostsFriendsArray.filter(post => post.delete_post !== 1)" :key="post.id" @mouseover="showBtnPost(post)"
    @mouseleave="notShowBtnPost(post)">

    <div class="wrapper_post">
      <div class="wrapper_post_user">

        <div class="wrapper_post_name">
          <div class="wrapper_ava_posts">
            <img class="ava_posts" alt="ava" ref="img" :src="loadAva(post.ava)"
              @click="$router.push({ name: 'mypage', params: { id: `${post.authorPost}` } })">
          </div>
          <div class="block_post_name">
            <p class="post_name" @click="$router.push({ name: 'mypage', params: { id: `${post.authorPost}` } })">
              {{ post.name + " " + post.surname }}
            </p>
            <div class="wrapper_data_post">
              <p class="data_post">{{ post.date }}</p>
            </div>
          </div>
        </div>

        <div class="wrapper_params_post">
          <p class="post_show_btn" @click="btnPost(post)">
            <!-- ... -->
          </p>
        </div>

      </div>

       <!-- текст поста -->
       <div class="wrapper_text_post" v-if="post.postText.length < 800">
          <p class="text_post">
            {{ postText(post.postText)}}
          </p>
        </div>
        <div class="wrapper_text_post" v-else>
          <p class="text_post" v-if="!post.isFullText">
            {{ postText(post.postText).slice(0, 800)}}
          </p>
          <p class="text_post" v-else>
            {{ postText(post.postText)}}
          </p>
          <p class="more_text_post" 
            v-if="!post.isFullText" 
            @click="moreTextPost(post)">
            Показать еще
          </p>
        </div>

      <div class="wrapper_block_photo_post">
        <div class="wrapper_block_photo_post_first">
          <template 
            v-for="(photo, index) in getPhotosPostsArray.filter(i => i.id === post.id).slice(0, 1)" 
            :key="index">
          <div class="wrapper_photo_post size_photo_1" 
            v-if="post.id === photo.id">
              <img class="photo_post" 
                :src="myPhotos(photo)"
                :alt="'photo' + photo.id"
                @click="FULL_SIZE_PHOTO_POST({ 'bool': true, 'elem': index, id: photo.id, postID: post.id })">             
          </div>
        </template>
        </div>
        
        <div class="wrapper_block_photo_post_another" v-if="getPhotosPostsArray.filter(i => i.id === post.id).slice(1).length
           > 0">
          <template v-for="(photo, index) in getPhotosPostsArray.filter(i => i.id === post.id).slice(1)" 
            :key="index">
            <div class="wrapper_photo_post photo_another" 
            v-if="post.id === photo.id">
              <img class="photo_post" 
                :src="myPhotos(photo)"
                :alt="'photo' + photo.id"
                @click="FULL_SIZE_PHOTO_POST({ 'bool': true, 'elem': index+1, id: photo.id, postID: post.id })">             
            </div>
          </template>
        </div>
        
      </div>
    </div>

    <!-- комментарии к посту -->
    <CommentsPost :post="post" />
    <!-- ------------------ -->
  </div>

  <div @click="closeModalFullSize(false)">
    <UImodal v-if="getIsModalFullSize">
      <SliderPhoto />
    </UImodal>
  </div>

  <div class="wrapper_not_news" v-if="getNewsPostsFriends.length < 1 && isNotNews === true">
    <p class="not_news">
      Список Вашей новостной ленты пуст. Попробуйте обзавестись новыми знакомыми что бы получать свежие новости.
    </p>
  </div>
</template>
  
<script>
import { mapGetters, mapMutations, mapActions } from "vuex";

export default {
  name: "ContentNews",

  props: {
    isNotNews:{
      type: Boolean,
      default: false
    }
  },

  data() {
    return {}
  },

  methods: {
    ...mapMutations({
      // setModulePost: "postsMyPageStore/setModulePost",
    }),
    ...mapActions({
      LOAD_NEWS_FRIENDS_USERS: "postsMyPageStore/LOAD_NEWS_FRIENDS_USERS",
      FULL_SIZE_PHOTO_POST: "showFullPhotoStore/FULL_SIZE_PHOTO_POST",
      closeModalFullSize: "showFullPhotoStore/closeModalFullSize"
    }),

    loadAva(ava) {
      try {
        return require(`../../assets/photo/${ava}`)
      } catch {
        return require(`../../assets/ava/ava_1.jpg`);
      }

    },

    myPhotos(photo) {
      try {
        return require(`../../assets/photo/${photo.photo_name}`)
      } catch (err) {
        // console.log(err)
        return require(`../../assets/ava/ava_1.jpg`);
      }
    },

    postText(value) {
      let doc = new DOMParser().parseFromString(value, "text/html");
      return doc.documentElement.textContent;
    },

    showBtnPost(post) {
      post.isShowBtn = true;
    },
    notShowBtnPost(post) {
      post.isShowBtn = false;
    },
    btnPost(post) {
      post.isPostDel = !post.isPostDel;
    },

    moreTextPost(post) {
      post.isFullText = true;
    }

  },

  computed: {
    ...mapGetters({
      // getUser: "authorizationStore/getUser",
      getNewsPostsFriends: "postsMyPageStore/getNewsPostsFriends",
      getPhotosPostsArray: "postsMyPageStore/getPhotosPostsArray",
      getIsModalFullSize: "showFullPhotoStore/getIsModalFullSize",
    }),

    newsPostsFriendsArray() {
      let notDoubleNews = this.getNewsPostsFriends.filter((v,i,a)=>a.findIndex(v2=>(v2.id===v.id))===i);
      return notDoubleNews;
    }
  }
}
</script>
  
<style scoped>
.post {
  margin-bottom: 20px;
  border-radius: 5px;
  background: #f8f8f9;
  box-shadow: 0px 2px 5px 0px rgb(0 0 0 / 40%);
}

.wrapper_post {
  display: flex;
  margin-bottom: 10px;
  width: 100%;
  justify-content: flex-start;
  flex-direction: column;
}

.wrapper_ava_posts {
  margin: 5px;
  cursor: pointer
}

.ava_posts {
  width: 90px;
  border-radius: 100%;
}

.wrapper_post_user {
  display: flex;
  width: 100%;
  justify-content: space-between;
  flex-direction: row;
}

.wrapper_post_name {
  display: flex;
  align-items: center;
}

.post_show_btn {
  margin-right: 10px;
  font-size: 20px;
  line-height: 17px;
  cursor: pointer;
}

.block_post_name {
  display: flex;
  flex-direction: column;
  margin-top: 8px;
}

.post_name {
  font-size: 16px;
  font-weight: 300;
  cursor: pointer;
  font-family: Russo One, fantasy, sans-serif;
}

.wrapper_params_post {
  display: flex;
}

.wrapper_data_post {
  margin-bottom: 10px;
}

.data_post {
  padding-top: 2px;
  font-size: 12px;
  font-family: Roboto Condensed, Arial, Helvetica, sans-serif;
}

.wrapper_text_post {
  margin: 0px 10px 10px 45px;
}

.text_post {
  font-family: Roboto Condensed, Arial, Helvetica, sans-serif;
  font-size: 14px;
  line-height: 20px;
  word-break: break-word;
}

.more_text_post {
  font-weight: 600;
  cursor: pointer;
  display: inline-block;
  font-size: 14px;
  font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}

.btn_post {
  display: flex;
  display: flex;
  justify-content: flex-end;
  /* margin: 5px; */
}

.redaction_post_btn {
  width: 100px;
  font-size: 13px;
  margin-right: 5px;
  margin-bottom: 5px;
}

.delete_post_btn {
  width: 70px;
  font-size: 13px;
  margin-bottom: 5px;
  margin-right: 5px;

}

.wrapper_not_news {
  font-size: 16px;
    line-height: 26px;
    position: absolute;
    top: 50%;
    margin-top: -100px;
    text-align: center;
    opacity: .7;
    font-family: Russo One, fantasy, sans-serif;
    color: dimgray;
    left: 30%;
    margin-left: -50px;
    padding: 0 60px;
}

.wrapper_block_photo_post {
  display: flex;
    justify-content: center;
    flex-direction: row;
    max-height: 450px;
    width: 75%;
    padding: 0 8%;
}

.wrapper_block_photo_post_first {
  display: flex;
  width: 75%;
  /* flex: 1.5; */
  /* background-color: rgb(0 0 0 / 10%); */
    align-items: center;
    justify-content: center;
}

.wrapper_block_photo_post_another {
  display: flex;
    flex-direction: column;
    width: 25%;
  /* flex: 1; */
    /* background-color: rgb(0 0 0 / 10%); */
    margin-left: 10px;
}

.wrapper_photo_post {
  height: -webkit-fill-available;
    /* margin: 10px; */
    padding-bottom: 10px;
    /* border-radius: 8px; */
    overflow: hidden;
}

.photo_post {
  width: 100%;
  height: 100%;
  -o-object-fit: cover;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
}
.size_photo_1 {
  width: 100%;
  height: 100%;
  /* max-height: 450px; */
}

/* МЕДИА-ЗАПРОСЫ */

@media (max-width: 761px) {

  .wrapper_block_photo_post {
    width: 100%;
    padding: 2% 2% 0 2%;
}

.wrapper_block_photo_post_another {
    width: 22%;
}

.wrapper_not_news {
    position: static;
    top: 50%;
    margin-top: 0;
    left: 30%;
    margin-left: 0;
    padding: 0;
}
}
</style>