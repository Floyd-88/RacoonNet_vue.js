<template>
  <NavigationNet v-if="isLoggedIn" />

  <div class="wrapper_main">
    <div class="main">

      <!-- header -->
      <HeaderGallery />

      <!-- выбрать категории для фильтрации -->
      <CategoryFilter />

      <!-- фотографии -->
      <div class="wrapper_contents_myPhoto">
        <div class="wrapper_contents_allPhotos">
          <div class="wrapper_preview_allPhotos">
            <div id="preview_myPhoto" v-for="(photo, index) in getArrayFilterPhotos.slice(0, getLimitAllPhoto)"
              :key="index" :class="{ 'active_all_photos': photo.newDate }">

              <div class="wrapper_date_load_photos">
                <p class="date_load_photos">{{ dateLoadPhotos(photo, index) }}
                </p>
              </div>

              <div class="all_photos" @click="fullSizePhoto({ bool: true, elem: index, id: photo.id })">
                <UIPhoto :photo="photo" />
              </div>
            </div>

            <!--при прокрутки страницы до данного элемента - подгружать следующие фотографии -->
            <div ref="observer" class="observer"></div>

            <div class="wrapper_not_photos">
              <p class="not_photos" v-if="getIsNotPhoto">
                У вас нет загруженных фотографий!
              </p>

              <p class="not_photos" v-if="getIsNotCat">
                Фотографии в данной категории отсутствуют!
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>

  <!-- окно загрузки -->
  <UImodal class="modal_fone" v-if="getIsModalLoadPhoto">
    <FileUpload :addresseeID="String(this.getUser.userID)" />
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

  async mounted() {
    if (this.getCheckedCat.length === 0) {
      this.loadAllPhotos(JSON.parse(localStorage.getItem('user')).userID);
      this.loadUser({ id: JSON.parse(localStorage.getItem('user')).userID })
        .catch((err) => {
          if (err.code === "ERR_CANCELED") {
            console.log("Загрузка была отменена")
          }
        });
    }

    // обсервер срабатывает каждый раз когда докручиваем страницу донизу
    const options = {
      rootMargin: "0px",
      threshold: 0.1
    };
    const callback = (entries) => {
      if (entries[0].isIntersecting) {
        this.setLimitAllPhoto(8);
      }
    };
    const observer = new IntersectionObserver(callback, options);
    observer.observe(this.$refs.observer);
  },


  methods: {
    ...mapMutations({
      setLimitAllPhoto: "loadPhotoStore/setLimitAllPhoto",
    }),

    ...mapActions({
      loadUser: "authorizationStore/loadUser",
      loadAllPhotos: "loadPhotoStore/loadAllPhotos",
      fullSizePhoto: "showFullPhotoStore/fullSizePhoto",
      closeModalFullSize: "showFullPhotoStore/closeModalFullSize",

    }),

    dateLoadPhotos(photo, index) {
      if (photo.date.slice(0, 7) !== this.getArrayFilterPhotos[(index - 1 === -1) ? 0 : index - 1].date.slice(0, 7) || this.getArrayFilterPhotos[0].id === photo.id) {
        photo.newDate = true;

        return new Date(photo.date).toLocaleDateString('ru-RU', {
          month: 'long',
          year: 'numeric',
        })
      } else {
        return "";
      }
    },

  },

  computed: {
    ...mapGetters({
      isLoggedIn: "authorizationStore/isLoggedIn",
      getUser: "authorizationStore/getUser",
      getAllPhotosMyPage: "loadPhotoStore/getAllPhotosMyPage",
      getLimitAllPhoto: "loadPhotoStore/getLimitAllPhoto",
      getIsModalLoadPhoto: "loadPhotoStore/getIsModalLoadPhoto",
      getIsModalFullSize: "showFullPhotoStore/getIsModalFullSize",
      getArrayFilterPhotos: "galleryStore/getArrayFilterPhotos",
      getCheckedCat: "galleryStore/getCheckedCat",
      getIsNotPhoto: "loadPhotoStore/getIsNotPhoto",
      getIsNotCat: "galleryStore/getIsNotCat"
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
  width: 100%;
  display: flex;
}

.wrapper_preview_allPhotos {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
}

.all_photos {
  width: 250px;
  height: 250px;
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

.wrapper_date_load_photos {
  background: #0197d617;
  width: 100%;
}

.date_load_photos {
  font-size: 15px;
  font-family: Russo One, fantasy, sans-serif;
  padding-left: 10px;
}

.active_all_photos {
  display: contents;
}

.not_photos {
  padding: 20px;
  line-height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  opacity: .8;
  font-family: Russo One, fantasy, sans-serif;
  color: dimgray;
  text-align: center;
}

/* МЕДИА-ЗАПРОСЫ */
@media (max-width: 761px) {
  .wrapper_main {
    padding: 120px 0px 5px;
  }

  .main {
    margin-left: 0px;
  }
}
</style>
