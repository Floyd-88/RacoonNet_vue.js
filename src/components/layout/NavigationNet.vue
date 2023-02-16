<template>
  <div class="wrapper_nav">
    <div class="wrapper_nav_link">
       <button class="link" @click="$router.push(`/id${userID}`)" > Моя страница </button>
    </div>
    <div class="wrapper_nav_link">
      <button class="link" @click="$router.push('/news')"> Новости </button>
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
 
  </div>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  name: "NavigationNet",
  
  data() {
    return {
      userID: JSON.parse(localStorage.getItem('user')).userID,
    }
  },

  methods: {
    ...mapActions({
      loadUser: "authorizationStore/loadUser"
    }),
  },

  // watch: {
  //   $route() {
  //     const id = this.$route.params.id;
      
  //     if (id) {
  //       this.loadUser({ id })
  //         .then(() => {
  //         })
  //         .catch(() => {
  //           // if (err) {
  //             // console.log(err.response.data)
  //             this.$router.push('notFound')
  //           // }
  //         })
  //     }
  //   }
  // }

}
</script>

<style scoped>
.wrapper_nav {
  /*background: floralwhite;*/
  padding: 30px;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 100px;
  height: 100%;
  min-width: 150px;
}
/* .wrapper_nav_link {

} */
.link {
  margin: 7px 0;
  font-size: 18px;
  font-family: fantasy;
  border: none;
  cursor: pointer;
  background: none;
  color: black;
}
.link:after {
  display: none; /*превращаем его в блочный элемент*/
  content: ""; /*контента в данном блоке не будет поэтому в кавычках ничего не ставим*/
  height: 3px; /*задаём высоту линии*/
  width: 0%; /*задаём начальную ширину элемента (линии)*/
  background-color: #2f3030; /*цвет фона элемента*/
  transition: width 0.2s ease-in-out; /*данное свойство отвечает за плавное изменение ширины. Здесь можно задать время анимации в секундах (в данном случае задано 0.4 секунды)*/
}
.link:hover:after{
  width: 100%;
}
.link:hover{
  filter:contrast(30%)
}
</style>