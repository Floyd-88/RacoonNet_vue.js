<template>
  <NavigationNet v-if="isLoggedIn" />

  <div class="wrapper_main">
    <div class="main">

      <!-- header -->
      <HeaderGallery/>

      <!-- выбрать категории для фильтрации -->
     <CategoryFilter/>

      <!-- фотографии -->
      <div class="wrapper_contents_myPhoto">
        <div class="wrapper_contents_allPhotos">
          <div class="wrapper_preview_allPhotos">
            <div class="all_photos" id="preview_myPhoto"
              v-for="(photo, index) in getArrayFilterPhotos.slice(0, getLimitAllPhoto)" :key="index">
              <div>
                <p>{{ `дата ${photo.date}` }}</p>
              </div>
              <img class="photo" :src="require(`../assets/photo/${photo.photo_name}`)" :alt="photo.photo_name"
                @click="fullSizePhoto({ bool: true, elem: index, id: photo.id })">

            </div>

            <!--при прокрутки страницы до данного элемента - подгружать следующие фотографии -->
            <div ref="observer" class="observer"></div>
          </div>
        </div>
      </div>
      
    </div>
  </div>

  <!-- окно загрузки -->
  <UImodal class="modal_fone" v-if="getIsModalLoadPhoto">
    <FileUpload />
  </UImodal>

  <!-- слайдер -->
  <div @click="closeModalFullSize(false)">
    <UImodal v-if="getIsModalFullSize">
      <SliderPhoto />
    </UImodal>
  </div>

</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
export default {
  name: "GalleryPage",
  data() {
    return {
      // checkedCat: [],
      // isShowCat: false,
    };
  },


  async mounted() {
    this.loadAllPhotos(JSON.parse(localStorage.getItem('user')).userID);
    this.loadUser({id: JSON.parse(localStorage.getItem('user')).userID})


    // this.setFilterPhoto(this.getAllPhotosMyPage);
    // console.log(this.getFilterPhoto)

    // обсервер срабатывает каждый раз когда докручиваем страницу донизу
    const options = {
      rootMargin: "0px",
      threshold: 0.1
    };
    const callback = (entries) => {
      if (entries[0].isIntersecting) {
        this.setLimitAllPhoto(8);
        // this.loadAllPhotos(JSON.parse(localStorage.getItem('user')).userID);
      }
    };
    const observer = new IntersectionObserver(callback, options);
    observer.observe(this.$refs.observer);
  },


  methods: {
    ...mapMutations({
      setIsModalLoadPhoto: "loadPhotoStore/setIsModalLoadPhoto",
      setCountPhoto: "loadPhotoStore/setCountPhoto",
      setLimitAllPhoto: "loadPhotoStore/setLimitAllPhoto",
      setArrayFilterPhotos: "galleryStore/setArrayFilterPhotos"

    }),

    ...mapActions({
      loadUser: "authorizationStore/loadUser",
      loadAllPhotos: "loadPhotoStore/loadAllPhotos",
      fullSizePhoto: "showFullPhotoStore/fullSizePhoto",
      // modalLoadPhoto: "loadPhotoStore/modalLoadPhoto",
      closeModalFullSize: "showFullPhotoStore/closeModalFullSize",
    }),

  },

  computed: {
    ...mapGetters({
      isLoggedIn: "authorizationStore/isLoggedIn",

      getUser: "authorizationStore/getUser",

      getAllPhotosMyPage: "loadPhotoStore/getAllPhotosMyPage",
      getLimitAllPhoto: "loadPhotoStore/getLimitAllPhoto",
      // getMyPhotosMyPage: "loadPhotoStore/getMyPhotosMyPage",
      getIsModalLoadPhoto: "loadPhotoStore/getIsModalLoadPhoto",
      // getIsModalAllPhotos: "loadPhotoStore/getIsModalAllPhotos",
      getIsModalFullSize: "showFullPhotoStore/getIsModalFullSize",

      getArrayFilterPhotos: "galleryStore/getArrayFilterPhotos"
    }),
  },
}
</script>


<style scoped>
.wrapper_main {
  padding: 120px 20px 5px;
}

.main {
  margin-left: 180px;
}

/* ------------------------ */

.wrapper_header_checkboxes {
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
}

.header_checkboxes {
  padding: 0 10px 5px 2px;
  display: flex;
  align-items: center;
}

.header_checkboxes label {
  padding-left: 3px;
}

.wrapper_checkboxes_filter {
  margin-bottom: 15px;
}

.wrapper_checkboxes_filter_btn {
  margin-bottom: 15px;
}

.checkboxes_filter_btn {
  background: #0197d6c2;
}


/* --------------------------- */
.title_pthoto_name {
  margin-top: 10px;
  margin-left: 40px;
  font-family: fantasy;
  font-size: 20px;
}

.wrapper_contents_allPhotos {
  /* width: 740px; */
  display: flex;
  /* padding: 20px; */
}

.wrapper_preview_allPhotos {
  display: flex;
  flex-wrap: wrap;
  /* max-height: 600px; */
  justify-content: center;
}

.all_photos {
  width: 150px;
  height: 150px;
  margin: 10px;
  border-radius: 8px;
  overflow: hidden;
}

.photo {
  width: inherit;
  height: inherit;
  object-fit: cover;
  cursor: pointer;
}

.observer {
  display: block;
  width: 100%;
  border: 1px solid;
  height: 1px;
  background: black;
  opacity: 0;
}

.closeModalAllPhoto {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  right: 0;
  cursor: auto;
}
</style>
