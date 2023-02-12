<template>

  <div class="wrapper_main">
    <div class="main">
      <div class="hello">
        <h1>{{ title }}</h1>
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
</style>