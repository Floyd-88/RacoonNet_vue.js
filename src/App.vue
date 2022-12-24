<template>
  <div>
    <div>
      <HeaderNet/>
    </div>
   <div>
     <NavigationNet/>
     <FooterNet/>
   </div>

  </div>

</template>

<script>
import HeaderNet from "@/components/HeaderNet";
import NavigationNet from "@/components/NavigationNet";
import FooterNet from "@/components/FooterNet";
export default {
  name: 'App',
  components: {
    FooterNet,
    NavigationNet,
    HeaderNet,

  }
}
</script>

<style>

</style>
