<template>
  <NavigationNetEnter/>
  <div class="wrapper_main">
    <div class="main">
      <div class="wrapper_not_found">
        <h2 class="not_found">{{ title }}</h2>
      </div>

    </div>
  </div>



</template>

<script>
export default {
  name: "NotFound",
  data() {
    return {
      title: 'Ошибка 404. Страница не найдена...'
    }
  }
}
</script>

<style scoped>
.wrapper_main {
  padding: 120px 20px 5px;
}

.main {
  margin-left: 180px;
}

/* .wrapper_not_found {
  width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    overflow: auto;
    white-space: nowrap;
    text-align: center;
    font-size: 0;
} */


    .not_found {
      margin: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-right: -50%;
    transform: translate(-50%, -50%);
    font-family: Russo One, fantasy, sans-serif;
    font-size: 35px;
    opacity: .7;
    } 

    /* МЕДИА-ЗАПРОСЫ */

@media (max-width: 761px) {

  .not_found {
    font-size: 25px;
    width: 100%;
    text-align: center;
    } 
}

</style>