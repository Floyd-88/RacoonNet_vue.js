<template>
  <div class="wrapper_nav">
    <div class="wrapper_nav_link">
       <button class="link" @click="$router.push('/mypage')"> Моя страница </button>
    </div>
    <div class="wrapper_nav_link">
      <button class="link" @click="$router.push('/message')">Сообщения</button>
    </div>
    <div class="wrapper_nav_link">
      <button class="link" @click="$router.push('/friends')"> Мои друзья</button>
    </div>
    <div class="wrapper_nav_link">
      <button class="link" @click="$router.push('/gallery')"> Галерея</button>
    </div>
    <div class="wrapper_nav_link">
      <button class="link" @click="$router.push('/news')"> Новости </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "NavigationNet",

}
</script>

<style scoped>
.wrapper_nav {
  background: floralwhite;
  padding: 30px;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 100px;
  height: 100%;
  min-width: 150px;
}
.wrapper_nav_link {

}
.link {
  margin: 10px 0;
  font-size: 18px;
  font-family: cursive;
  background: none;
  border: none;
  cursor: pointer;
}
</style>