<template>
  <div>
    <header class="header">
      <div class="header_wrapper_logo">
        <img class="header_logo" src="../assets/logo/logo.png">
      </div>
      <div class="header_wrapper_title">
        <h1 class="header_title"> RacoonNet</h1>
      </div>
    </header>
    <nav>

    </nav>
    <main>

    </main>
    <footer>

    </footer>
  </div>
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
}
.header_wrapper_logo {
  display: flex;
  align-items: center;
  margin: 0 20px;
}
.header_logo {
width: 100px;
}
.header_wrapper_title {
  display: flex;
  align-items: center;
  font-size: 25px;
  font-family: fantasy;
  margin-left: 5px;
}
.header_title {
  text-shadow: 4px 3px 0px #ccc, 9px 8px 0px rgb(0 0 0 / 15%);
}
</style>