<template>
        <div class="wrapper_my_friends_header">
            <div class="my_friends_header">
                <h3>Список ваших друзей</h3>
            </div>

            <!-- поск друга по имени -->
            <FilterName />
            <!-- -- -->

        </div>

        <!-- карточка с другом -->
        <div class="wrapper_my_friends_list" v-for="elem in 4" :key="elem">
            <div class="my_friend_card">
                <CardFriend :elem="elem" />
                
                <!-- блок с кнопками -->
                <FriendCardBtns/>
            </div>
        </div>
</template>

<script>
export default {
    name: "MyFriends",
}

</script>

<style scoped>


.wrapper_my_friends_header {}

.my_friends_header {}

.my_friends_header h3 {
    padding: 0 0 8px 0;
    font-size: 17px;
    font-family: fantasy;
    font-weight: 300;
}

.wrapper_my_friends_list {}

.my_friend_card {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
    padding: 5px;
    border-radius: 5px;
    background: #f8f8f9;
    box-shadow: 0px 2px 5px 0px rgb(0 0 0 / 40%);
}
</style>