<template>
  <div class="close_modal"></div>
</template>

<script>
export default {
  name: "closeModal",
}
</script>

<style scoped>
.close_modal {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 30px;
  height: 30px;
  cursor: pointer;
  border: 1px solid black;
  background-image: url("../../assets/icons/close.svg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>