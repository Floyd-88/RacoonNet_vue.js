<template>
    <div class="wrapper_my_friends_header">
        <div class="my_friends_header">
            <h3>Входящие заявки</h3>
        </div>
    </div>

    <!-- карточка с другом -->
    <template v-if="getUsersFriendsMe.length > 0">
        <div class="wrapper_my_friends_list" v-for="user in getUsersFriendsMe" :key="user.userID">
        <div class="my_friend_card">
            <CardFriend :user="user" />

            <!-- блок с кнопками -->
            <div class="wrapper_my_friend_card_show_btns">
                <div class="wrapper_my_friend_card_btns">
                    <div class="my_friend_card_btn_write_message">
                        <UIbtn class="btn_write_message" @click="AGREE_ADD_FRIEND_USER(user.id)">Принять приглашение</UIbtn>
                    </div>
                <div class="my_friend_card_btn_delete_friend">
                    <UIbtn class="btn_delete_friend" @click="DELETE_FRIEND(user.id)">Отказаться от дружбы</UIbtn>
                </div>
                </div>
            </div>

        </div>
    </div>
    </template>
    <template v-else>
        <div class="wrapper_text_not_friends">
            <p>Список входящих заявок пуст</p>
        </div>
    </template>
   
</template>
    
<script>
import { mapActions, mapGetters } from 'vuex';

export default {
    name: "InviteFriendsMe",

    mounted() {
        this.GET_USER_ADD_FRIENDS_ME();
    },

    methods: {
        ...mapActions({ 
            GET_USER_ADD_FRIENDS_ME: "friendsStore/GET_USER_ADD_FRIENDS_ME",
            AGREE_ADD_FRIEND_USER: "friendsStore/AGREE_ADD_FRIEND_USER",
            DELETE_FRIEND: "friendsStore/DELETE_FRIEND"

        })
    },

    computed: {
        ...mapGetters({ getUsersFriendsMe: "friendsStore/getUsersFriendsMe" })
    }
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

.btn_delete_friend {
    filter: opacity(0.7);
}

.wrapper_text_not_friends {
    font-size: 15px;
    font-family: fantasy;
    text-align: center;
    margin-top: 20px;
    opacity: .6;
}
</style>