<template>
    <div class="wrapper_block_full_size">
        <!-- <transition-group name='fade' tag='div'> -->
        <div class="wrapper_block_full_size_img">
            <div class="wrapper_full_size_img">
                <img class="full_size_img" v-if="currentImg.photo_name" :src="require(`../assets/photo/${currentImg.photo_name}`)"
                    alt="currentImg" />

            </div>
            <!-- </transition-group> -->
            <!-- <button class="prev" v-on:click.left="setPrevIndexPhoto" >&#10094;</button> -->
            <a class="prev" @click="setPrevIndexPhoto" href='#'>&#10094;</a>
            <a class="next"  @click="setNextIndexPhoto" href='#'>&#10095;</a>

            <div class="wrapper_block_info_photo">
                <div class="wrapper_block_info_name_count_photo">
                    <div class="wrapper_block_info_name">
                        <p>Фотографии: 1 из 28</p>
                    </div>
                </div>
                <div class="wrapper_block_info_remove_photo">
                    <button class="remove_photo" @click="setModulePhotoRemove(true)">Удалить</button>
                </div>
            </div>
        </div>

        <!-- блок комментариев -->
        <CommentsPhoto/>
        

    </div>

    <template v-if="getModulePhotoRemove">
    <UImodal>
      <div class="wrapper_save_editPost">
        <div class="wrapper_title_text">
          <p>Вы уверены что хотите удалить эту фотографию?</p>
        </div>

        <div class="wrapper_save_editPost_btn">
          <UIbtn class="save_editPost_btn" 
          type="submit" 
          @click="removePhoto(currentImg.photo_name)">
            Удалить
          </UIbtn>

          <UIbtn class="save_editPost_btn" @click="setModulePhotoRemove(false)">
            Отменить
          </UIbtn>

        </div>
      </div>
    </UImodal>
  </template>


</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
export default {
    name: "SliderPhoto",
    data() {
        return {};
    },

    created() {
        //перелистывание фото стрелками клавиатуры
        document.onkeydown = (e) => {
    switch (e.keyCode) {
        case 37:
            this.setPrevIndexPhoto()
            break;
        case 39:
            this.setNextIndexPhoto()
            break;
        case 27:
            this.closeModalFullSize(false)
            break;
    }
};
    },

    methods: {
        ...mapMutations({
            setIndexPhoto: "showFullPhotoStore/setIndexPhoto",
            setNextIndexPhoto: "showFullPhotoStore/setNextIndexPhoto",
            setPrevIndexPhoto: "showFullPhotoStore/setPrevIndexPhoto",
            setModulePhotoRemove: "loadPhotoStore/setModulePhotoRemove",
            setPhotoId: "loadPhotoStore/setPhotoId"
        }),
        ...mapActions({
            removePhoto: "loadPhotoStore/removePhoto",
            closeModalFullSize: "showFullPhotoStore/closeModalFullSize"
        })
    },
    computed: {
        ...mapGetters({
            getAllPhotosMyPage: "loadPhotoStore/getAllPhotosMyPage",
            getIndexPhoto: "showFullPhotoStore/getIndexPhoto",
            getModulePhotoRemove: "loadPhotoStore/getModulePhotoRemove",
            getIdPhoto: "loadPhotoStore/getIdPhoto"
        }),
        currentImg: function () {
            if (this.getAllPhotosMyPage.length > 0) {
                if (this.getIndexPhoto === -1) {
                    this.setIndexPhoto(this.getAllPhotosMyPage.length - 1);
                }
                let photo = this.getAllPhotosMyPage[Math.abs(this.getIndexPhoto) % this.getAllPhotosMyPage.length];
                this.setPhotoId(photo.id);
                return photo;
            }
            return [];
        }
    },
}
</script>

<style scoped>
/* .fade-enter-active, .fade-leave-active {
  transition: all 1s;
} 
.fade-enter, .fade-leave-to {
  opacity: 0; 
  transform: translateX(30px);
} */

.wrapper_block_full_size {
    display: flex;
    width: 1000px;
    height: 90vh;
    flex-direction: row;
    overflow: hidden;

}


.wrapper_block_full_size_img {
    width: 70%;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: black;
    justify-content: center;
}

.wrapper_full_size_img {
    width: 100%;
    height: -webkit-fill-available;
}

.full_size_img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.prev,
.next {
    cursor: pointer;
    position: absolute;
    top: 45%;
    width: auto;
    padding: 16px;
    color: white;
    background-color: rgba(0, 0, 0, 0.9);
    font-weight: bold;
    font-size: 18px;
    transition: 0.7s ease;
    border-radius: 0 4px 4px 0;
    text-decoration: none;
    user-select: none;
    opacity: 0;
}

.next {
    right: 0;
}

.prev {
    left: 0;
}

.next:hover,
.prev:hover {
    opacity: 1;
}

.wrapper_full_size_img:hover~.prev {
    opacity: 1;
}

.wrapper_full_size_img:hover~.next {
    opacity: 1;
}

.wrapper_block_info_photo {
    display: flex;
    background: black;
    width: 100%;
    justify-content: space-between;
    padding: 6px 30px;
    position: absolute;
    bottom: 0;
    color: white;
}
.wrapper_block_info_name_count_photo {
    display: flex;
}
.wrapper_block_info_name {
font-family: fantasy;
}
.wrapper_block_info_count {
}
.wrapper_block_info_remove_photo {
}
.remove_photo {
    border: none;
    background: repeat;
    color: white;
    font-family: fantasy;
    font-size: 15px;
}
.remove_photo:hover {
    filter: brightness(80%);
    cursor: pointer;
}

.wrapper_save_editPost {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 15px;
  margin-bottom: 10px;
}

.wrapper_title_text {
    margin-bottom: 15px;
}

.save_editPost_title {
  margin: 10px;
  font-size: 17px;
}

/* .wrapper_save_editPost_btn {} */

.save_editPost_btn {
  width: 70px;
  margin-left: 5px;
  margin-right: 5px;
}

</style>