<template>
  <button class="btn">
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: "UIbtn"
}
</script>

<style scoped>
.btn {
  border-radius: 5px;
  background: gainsboro;
  border: 0px solid black;
  padding: 5px;
  font-family: fantasy;
  cursor: pointer;
  color: black;
  box-shadow: 0px 1px 0px 0px rgb(0 0 0 / 40%);
}
.btn:hover {
  filter: brightness(80%);
  transition: 0.3s;
  z-index: 1;
}
</style>