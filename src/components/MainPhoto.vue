<template>
    <div class="wrapper_block_full_size">
        <div class="wrapper_block_full_size_img">

          <template v-if="getEditAva==='load'">
            <div class="wrapper_full_size_img">
                <AvatarEditor/>
              </div>
          </template>
          <template v-else>
            <div class="wrapper_full_size_img">
                    <img class="full_size_img" :src="pathAva"
                    :alt="this.getUser.ava"/>
            </div>
                        
            <div class="wrapper_block_info_photo">
                <div class="wrapper_block_info_remove_photo">
                    <button class="remove_photo" @click="showFullAvaPhoto({bool: true, load: 'load'})">Поменять главное фото</button>
                    <button class="remove_photo" @click="setModulePhotoRemove(true)">Удалить</button>
                </div>
            </div>
          </template>
            
        </div>      

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
          @click="removeAvaPhoto()">
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
    name: "MainPhoto",
    data() {
        return {};
    },

    methods: {
        ...mapMutations({
            setIndexPhoto: "showFullPhotoStore/setIndexPhoto",
            setModulePhotoRemove: "loadPhotoStore/setModulePhotoRemove",
            setPhotoId: "loadPhotoStore/setPhotoId"
        }),
        ...mapActions({
            removeAvaPhoto: "loadPhotoStore/removeAvaPhoto",
            showFullAvaPhoto: "showFullPhotoStore/showFullAvaPhoto"
        })
    },
    computed: {
        ...mapGetters({
            getAllPhotosMyPage: "loadPhotoStore/getAllPhotosMyPage",
            getModulePhotoRemove: "loadPhotoStore/getModulePhotoRemove",
            getUser: "authorizationStore/getUser",
            getEditAva: "showFullPhotoStore/getEditAva"
        }),

        pathAva() {
          try{
            return require(`../assets/photo/${this.getUser.ava}`);
          } catch {
            return require(`../assets/ava/ava_1.jpg`);
          }
    },
}
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
    width: 700px;
    height: 90vh;
    flex-direction: row;
    overflow: hidden;

}


.wrapper_block_full_size_img {
    width: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: black;
    justify-content: center;
}

.wrapper_full_size_img {
    width: 100%;
    height: 100%;
    background: whitesmoke;
    display: flex;
    align-items: center;
    justify-content: center;
}

.full_size_img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.wrapper_block_info_photo {
    display: flex;
    background: black;
    width: 100%;
    justify-content: center;
    padding: 6px 30px;
    position: absolute;
    bottom: 0;
    color: white;
}

.wrapper_block_info_remove_photo {
width: 100%;
display: flex;
justify-content: space-between;
}

.remove_photo {
    border: none;
    background: repeat;
    color: white;
    font-family: fantasy;
    font-size: 15px;
    padding-right: 30px;
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

