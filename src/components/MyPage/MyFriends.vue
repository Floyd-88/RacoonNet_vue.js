<template>
  <div class="wrapper_myFriends">
    Мои друзья
  </div>
</template>

<script>
export default {
  name: "MyFriends"
}
</script>

<style scoped>
.wrapper_myFriends {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 0 0 30%;
  background: #f8f8f9;
  box-shadow: 0px 2px 5px 0px rgb(0 0 0 / 40%);
  height: max-content;
  position: sticky;
  top: 120px;
}
</style>