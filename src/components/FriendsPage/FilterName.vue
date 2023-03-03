<template>
    <div class="my_friends_filter">
        <input type="text" placeholder="Поиск среди ваших друзей">
</div>
</template>

<script>
export default {
    name: "FilterName",

}
</script>

<style scoped>
.my_friends_filter {
    margin-bottom: 10px;
}

.my_friends_filter input {
    width: 100%;
    height: 30px;
}

.my_friends_filter input:focus {
    border: 1px solid #0197d6;
    box-shadow: 0 0 3px #0197d6;
    outline-offset: 0px;
    outline: none;
}
</style>