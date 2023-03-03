<template>
        <div class="wrapper_search_new_friends">
            <h4 class="wrapper_search_new_friends_title">
                Поиск новых друзей
            </h4>
            <div class="wrapper_search_new_friends_filter">
                <div class="search_new_friends_filter">
                    Фильтр поиска
                </div>
            </div>
            <div class="wrapper_search_new_friends_btn">
                <UIbtn class="search_new_friends_btn">Найти друзей</UIbtn>
            </div>
        </div>
</template>

<script>
export default {
    name: "SearchNewFriends",

}
</script>

<style scoped>
.wrapper_search_new_friends {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 15px;
}
.wrapper_search_new_friends_title {
    padding-bottom: 5px;
    font-family: fantasy;
    font-weight: 300;
    font-size: 14px;
}
.wrapper_search_new_friends_filter {
    margin-bottom: 10px;
}
.search_new_friends_filter {
}
.wrapper_search_new_friends_btn {
    width: 100%;
}
.search_new_friends_btn {
    width: 100%;
    font-size: 15px;
    background: #0197d6;
    opacity: 0.9;
}
</style>