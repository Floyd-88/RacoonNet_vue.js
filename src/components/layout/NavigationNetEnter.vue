<template>
  <transition name="slideDown">
    <div class="wrapper_nav" v-show="getIsShowMenu || isSmallScreen">
      <div class="wrapper_nav_link exit" @click="$router.push('/')">
        <button class="link">Вход</button>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
export default {
  name: "NavigationNetEnter",

  data() {
    return {
      isSmallScreen: false,
    }
  },

  created() {
    window.addEventListener('resize', this.checkSize);
    this.checkSize();
  },
  unmounted() {
    this.setIsShowMenuClose();
    window.removeEventListener('resize', this.checkSize);
  },

  methods: {

    ...mapMutations({
      setIsShowMenuClose: "authorizationStore/setIsShowMenuClose"
    }),

    //проверяем размер экрана
    checkSize() {
      this.isSmallScreen = innerWidth > 761;
      this.setIsShowMenuClose();
    },

  },

  computed: {
    ...mapGetters({
      getIsShowMenu: "authorizationStore/getIsShowMenu"
    }),
  }

}
</script>

<style scoped>
.wrapper_nav {
  padding: 30px;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 100px;
  height: 100%;
  min-width: 150px;
}

.wrapper_nav_link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: max-content;
}


.link {
  margin: 7px 0;
  font-size: 18px;
  font-family: Russo One, fantasy, sans-serif;
  border: none;
  cursor: pointer;
  background: none;
  color: black;
}

.link:after {
  display: none;
  /*превращаем его в блочный элемент*/
  content: "";
  /*контента в данном блоке не будет поэтому в кавычках ничего не ставим*/
  height: 3px;
  /*задаём высоту линии*/
  width: 0%;
  /*задаём начальную ширину элемента (линии)*/
  background-color: #2f3030;
  /*цвет фона элемента*/
  transition: width 0.2s ease-in-out;
  /*данное свойство отвечает за плавное изменение ширины. Здесь можно задать время анимации в секундах (в данном случае задано 0.4 секунды)*/
}

.link:hover:after {
  width: 100%;
}

.link:hover {
  filter: contrast(30%)
}

.exit {
  display: none;
}

/* МЕДИА-ЗАПРОСЫ */

@media (max-width: 761px) {

  .wrapper_nav {
    width: 100%;
    padding: 100px 0px 0px 0px;
    top: 0;
    left: 0;
    right: 0;
    margin: 0 auto;
    height: auto;
    min-width: auto;
    border-radius: 5px;
    background: #f2f2f2;
    box-shadow: 0px 2px 5px 0px rgb(0 0 0 / 40%);
    position: fixed;
    z-index: 1;
  }

  .wrapper_nav_link {
    display: flex;
    justify-content: center;
    align-items: center;
    /* background-color: cornflowerblue; */
    width: 100%;
    box-shadow: 0px 2px 3px 0px rgb(0 0 0 / 30%);
  }

  .wrapper_nav_link:hover {
    background-color: #e2e0e0;
  }

  .link:hover {
    filter: none;
  }

  .exit {
    display: flex;
  }

  .slideDown-enter-active,
  .slideDown-leave-active {
    transition: all 0.3s ease;
    /* overflow: hidden; */
  }

  .slideDown-enter-from,
  .slideDown-leave-to {
    transform: translateY(-100%);
    transition: all 0.3s ease-in 0s
  }
}
</style>



