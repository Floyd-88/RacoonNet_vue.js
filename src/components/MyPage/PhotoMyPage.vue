<template>
  <div class="wrapper_contents_myPhoto">
    <div class="wrapper_preview_myPhoto">
      <div class="preview_myPhoto" id="preview_myPhoto">
        <!-- <img class="myPhoto" :src="require('../../../Server/uploads' + this.photo)" alt="photo"> -->
      </div>
    </div>

    <UIbtn class="show_more_photo_btn"> Показать больше </UIbtn>
    <UIbtn class="show_more_photo_btn"
      @click="showModalPhoto(true)"
      > Загрузить фото
    </UIbtn>

    <UImodal class="modal_fone" v-if="isModalPhoto">
      <FileUpload 
      @showModalPhoto="showModalPhoto"
      />
    </UImodal>

  </div>
</template>

<script>

export default {
  name: "PhotoMyPage",

  data() {
    return {
      isModalPhoto: false,
      photo: "",
    }

  },

  methods: {
    showModalPhoto: function(bool) {
      this.isModalPhoto = bool;
    },
    photoAdd(page) {
      this.photo = page
      // let div = document.querySelector("#preview_myPhoto");
      // let img = document.createElement("img")
      // img.src = require('../../../Server/uploads' + page);
      // img.alt="photo"
     
      // div.append(img);
      // img.classList.add("myPhoto")
    }
  }

}
</script>

<style>
.modal_fone {
  background-color: aliceblue;
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
  width: 70%;
  margin: 10px;
}

.preview_myPhoto {
  display: flex;
  margin: 5px;
}

.myPhoto {
  width: 150px;
}
</style>