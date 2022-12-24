<template>
  <div class="wrapper">
    <HeaderNet/>
    <NavigationNet/>
    <div class="wrapper_main">
      <MainPage/>
    </div>
  </div>

</template>

<script>
import HeaderNet from "@/components/HeaderNet";
import NavigationNet from "@/components/NavigationNet";
// import FooterNet from "@/components/FooterNet";
import MainPage from "@/pages/MainPage";

export default {
  name: 'App',
  components: {
    MainPage,
    // FooterNet,
    NavigationNet,
    HeaderNet,

  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  background: aliceblue;
}
.wrapper {
}

.wrapper_main {
  margin-left: 180px;
  padding: 120px 20px;
  background: aliceblue;

}

</style>
