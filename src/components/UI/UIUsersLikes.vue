<template>
    <div class="wrapper_my_friends_title">
    </div>
    <div class="list_my_friends">
        <slot></slot>
    </div>
</template>
  
<script>
export default {
    name: "UIUsersLikes",
}
</script>
  
<style scoped>
.wrapper_my_friends_title {
    display: flex;
    justify-content: center;
    margin: 10px;
    font-size: 17px;
    font-family: fantasy;
}

.list_my_friends {
    display: flex;
    flex-wrap: wrap;
    max-width: 400px;
    max-height: 400px;
    padding: 0 0 10px;
    justify-content: center;
}

/* МЕДИА-ЗАПРОСЫ */
@media (max-width: 761px) {
    .list_my_friends[data-v-04e84efa] {
        max-width: 355px;
    }
}
</style>