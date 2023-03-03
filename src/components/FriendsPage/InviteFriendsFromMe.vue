<template>
    <div class="wrapper_my_friends_header">
        <div class="my_friends_header">
            <h3>Я хочу дружить...</h3>
        </div>
    </div>

    <!-- карточка с другом -->
    <div class="wrapper_my_friends_list" v-for="elem in 2" :key="elem">
        <div class="my_friend_card">
            <CardFriend :elem="elem" />

            <!-- блок с кнопками -->
            <div class="wrapper_my_friend_card_show_btns">
                <div class="wrapper_my_friend_card_btns">
                    <div class="my_friend_card_btn_write_message">
                        <UIbtn class="btn_write_message">Отменить заявку</UIbtn>
                    </div>
                </div>
            </div>
            
        </div>
</div>
</template>
    
<script>
export default {
    name: "InviteFriendsFromMe",

}

</script>
    
<style scoped>
.wrapper_my_friends_header {
    border-bottom: 1px solid;
    margin-bottom: 20px;
}

.my_friends_header {}

.my_friends_header h3 {
    padding: 0 0 8px 0;
    font-size: 17px;
    font-family: fantasy;
    font-weight: 300;
}

.my_friend_card {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
    padding: 5px;
    border-radius: 5px;
    background: #f8f8f9;
    box-shadow: 0px 2px 5px 0px rgb(0 0 0 / 40%);
}

.wrapper_my_friend_card_show_btns {
    display: flex;
}

.wrapper_my_friend_card_btns {
    display: flex;
    padding-top: 5px;

}

.my_friend_card_btn_write_message {
    padding-right: 10px;
}

.btn_write_message {}
</style>