<template>
  <div class="wrapper_myFriends">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "MyFriendsBlock"
}
</script>

<style scoped>
.wrapper_myFriends {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 0 0 30%;
  border-radius: 5px;
  background: #f8f8f9;
  box-shadow: 0px 2px 5px 0px rgb(0 0 0 / 40%);
  height: max-content;
  position: sticky;
  top: 120px;
}

/* МЕДИА-ЗАПРОСЫ */

@media (max-width: 761px) {

  .wrapper_myFriends {
    margin-bottom: 20px;
    position: static;
}
}
</style>