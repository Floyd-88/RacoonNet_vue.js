<template>
    <header class="header">
      <div class="header_wrapper_logo">
        <img class="header_logo" src="../assets/logo/logo.png">
      </div>
      <div class="header_wrapper_title">
        <button class="btn_title" @click="$router.push('/')">RacoonNet</button>
      </div>
    </header>
</template>

<script>
export default {
  name: "HeaderNet"
}
</script>

<style scoped>
.header{
  display: flex;
  height: 100px;
  background: cornflowerblue;
  border: 1px solid black;
  justify-content: flex-start;
  position: fixed;
  width: 100%;
}
.header_wrapper_logo {
  display: flex;
  align-items: center;
  margin: 0 20px 0 5%;
}
.header_logo {
width: 100px;
}
.header_wrapper_title {
  display: flex;
  align-items: center;
  margin-left: 5px;
}
.btn_title {
  border: none;
  background: none;
  text-shadow: 4px 3px 0px #ccc, 9px 8px 0px rgb(0 0 0 / 15%);
  display: flex;
  align-items: center;
  font-size: 40px;
  font-family: fantasy;
  cursor: pointer;
}
</style>