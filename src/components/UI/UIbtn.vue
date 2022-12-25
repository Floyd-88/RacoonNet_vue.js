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
  background: aquamarine;
  border: 1px solid black;
  padding: 5px;
  font-family: cursive;
  cursor: pointer;
}
</style>