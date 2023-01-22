<template>
  <div class="wrapper_contents_myPhoto">
    <div class="wrapper_preview_myPhoto">
      <div class="preview_myPhoto">
        <img class="myPhoto" src="@/assets/photo/man.jpg" alt="photo">
      </div>
      <div class="preview_myPhoto">
        <img class="myPhoto" src="@/assets/photo/man.jpg" alt="photo">
      </div>
      <div class="preview_myPhoto">
        <img class="myPhoto" src="@/assets/photo/man.jpg" alt="photo">
      </div>
      <div class="preview_myPhoto">
        <img class="myPhoto" src="@/assets/photo/man.jpg" alt="photo">
      </div>
      <div class="preview_myPhoto">
        <img class="myPhoto" src="@/assets/photo/man.jpg" alt="photo">
      </div>
      <div class="preview_myPhoto">
        <img class="myPhoto" src="@/assets/photo/man.jpg" alt="photo">
      </div>
    </div>

    <UIbtn class="show_more_photo_btn"> Показать больше </UIbtn>
  </div>
</template>

<script>
export default {
  name: "PhotoMyPage"
}
</script>

<style scoped>
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