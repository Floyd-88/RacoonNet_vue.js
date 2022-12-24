<template>
  <div class="wrapper_nav">
    <div class="wrapper_nav_link">
      <p class="link">Моя страница</p>
    </div>
    <div class="wrapper_nav_link">
      <p class="link">Сообщения</p>
    </div>
    <div class="wrapper_nav_link">
      <p class="link">Мои друзья</p>
    </div>
    <div class="wrapper_nav_link">
      <p class="link">Галерея</p>
    </div>
    <div class="wrapper_nav_link">
      <p class="link">Новости</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "NavigationNet"
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
  margin: 10px 0px;
  font-size: 18px;
  font-family: cursive;
}
</style>