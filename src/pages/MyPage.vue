<template>
  <div class="wrapper_myPage">

    <UserInfo/>

    <div class="wrapper_contents_main">

      <div class="wrapper_contents">
        <div class="wrapper_preview_myPhoto">
          <div class="preview_myPhoto">
            <img class="myPhoto" src="@/assets/photo/man.jpg" alt="foto_1">
          </div>
          <div class="preview_myPhoto">
            <img class="myPhoto" src="@/assets/photo/man.jpg" alt="foto_1">
          </div>
          <div class="preview_myPhoto">
            <img class="myPhoto" src="@/assets/photo/man.jpg" alt="foto_1">
          </div>
          <div class="preview_myPhoto">
            <img class="myPhoto" src="@/assets/photo/man.jpg" alt="foto_1">
          </div>
          <div class="preview_myPhoto">
            <img class="myPhoto" src="@/assets/photo/man.jpg" alt="foto_1">
          </div>
          <div class="preview_myPhoto">
            <img class="myPhoto" src="@/assets/photo/man.jpg" alt="foto_1">
          </div>
        </div>

        <div class="wrapper_posts">
          <PostsMyPage/>
        </div>
      </div>

      <div class="wrapper_myFriends">
        Мои друзья
      </div>

    </div>


    <div>
    </div>

  </div>
</template>
<script>
export default {
  name: "MyPage",
}
</script>

<style scoped>
.wrapper_myPage {

}



.wrapper_contents_main {
  display: flex;
  flex-wrap: wrap;
}

.wrapper_contents {
  white-space: nowrap;
  display: flex;
  flex-direction: column;
  flex: 0 0 70%;
}

.wrapper_preview_myPhoto {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 25px;
  border: 1px solid;
}

.preview_myPhoto {
  flex: 0 0 33.33333%;
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}

.myPhoto {
  width: 150px;
}

.wrapper_myFriends {
  display: flex;
  border: 1px solid;
  justify-content: center;
  background: floralwhite;
  flex: 0 0 30%;
}

.wrapper_posts {
  display: flex;
  flex-direction: column;
  white-space: normal;
  margin-right: 20px;
}
</style>