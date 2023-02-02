<template>
  <div class="wrapper_contents_myPhoto">
    <div class="wrapper_preview_myPhoto">
      <div class="preview_myPhoto" 
           id="preview_myPhoto" 
           v-for="(photo, index) in getMyPhotosMyPage" 
           :key="index">
          <img class="myPhoto" :src="require(`../../assets/photo/${photo.photo_name}`)" :alt="photo.photo_name" @click="fullSizePhoto({'bool': true, 'elem': index})">     
      </div>
    </div>

    <UIbtn class="show_more_photo_btn" 
           id="load_photo_btn" 
           v-if="getMyPhotosMyPage.length >= 8"
           @click="loadAllPhotos()">
      Показать больше
    </UIbtn>

    <UIbtn class="show_more_photo_btn" 
           @click="setIsModalLoadPhoto(true)"> 
           Загрузить фото
    </UIbtn>

    <UImodal class="modal_fone" v-if="getIsModalLoadPhoto">
      <FileUpload/>
    </UImodal>

    <div @click="setIsModalAllPhotos(false)">
      <UImodal class="modal_fone"   
             v-if="getIsModalAllPhotos">
      <AllPhotos/>
    </UImodal>
    </div>

    <div @click="setIsModalFullSize(false)">
      <UImodal v-if="getIsModalFullSize">
        <SliderPhoto/>
      </UImodal>
    </div>
  

  </div>
</template>

<script>
import {mapGetters, mapMutations, mapActions} from "vuex";


export default {


  name: "PhotoMyPage",

  data() {
    return {
    }
  },

  methods: {
    ...mapMutations({
      setIsModalLoadPhoto: "loadPhotoStore/setIsModalLoadPhoto",
      setIsModalAllPhotos: "loadPhotoStore/setIsModalAllPhotos",

      setIsModalFullSize: "showFullPhotoStore/setIsModalFullSize"
    }),

    ...mapActions({
      loadAllPhotos: "loadPhotoStore/loadAllPhotos",

      fullSizePhoto: "showFullPhotoStore/fullSizePhoto"
    }),

  },

  computed: {
  ...mapGetters({
      getMyPhotosMyPage: "loadPhotoStore/getMyPhotosMyPage",

      getIsModalLoadPhoto: "loadPhotoStore/getIsModalLoadPhoto",
      getIsModalAllPhotos: "loadPhotoStore/getIsModalAllPhotos",

      getIsModalFullSize: "showFullPhotoStore/getIsModalFullSize",


    }),
  }

}
</script>

<style>

.modal_fone {
  background-color: aliceblue;
}

.closeModalAllPhoto {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    right: 0;
    cursor: auto;
    /* opacity: 0; */
}

.wrapper_contents_myPhoto {
  margin-right: 20px;
  margin-bottom: 20px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f8f8f9;
  box-shadow: 0px 2px 5px 0px rgb(0 0 0 / 40%);
}

.wrapper_preview_myPhoto {
  display: flex;
  flex-wrap: wrap;
  padding: 5px;
  justify-content: center;
}

.show_more_photo_btn {
  width: 150px;
  margin: 10px;
}

#load_photo_btn {
  background: #3fc3f6;
}

.preview_myPhoto {
  width: 150px;
  height: 150px;
  margin: 5px;
  border-radius: 8px;
  overflow: hidden;
}

.myPhoto {
  width: 100%;
    min-height: -webkit-fill-available;
    cursor: pointer;
}

.full_size_photo_modal {
  width: 600px;
    display: flex;
    justify-content: center;
    padding: 10px;
    background: black;
}
</style>