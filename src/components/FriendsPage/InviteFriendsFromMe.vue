<template>
    <div class="wrapper_my_friends_header">
        <div class="my_friends_header">
            <h3>Исходящие заявки</h3>
        </div>
    </div>

    <!-- карточка с другом -->
    <template v-if="getUsersFriendsFromMe.length > 0">
        <div class="wrapper_my_friends_list" v-for="user in getUsersFriendsFromMe" :key="user.id">
            <div class="my_friend_card">
                <CardFriend :user="user" />

                <!-- блок с кнопками -->
                <div class="wrapper_my_friend_card_show_btns">
                    <div class="wrapper_my_friend_card_btns">
                        <div class="my_friend_card_btn_write_message">
                            <UIbtn class="btn_write_message" @click="DELETE_FRIEND({id: user.id, query: this.$route.query.id, userID: user.userID})">Отменить заявку</UIbtn>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </template>
    <template v-else>
        <div class="wrapper_text_not_friends" v-if="getIsNotFriends">
            <p>Список исходящих заявок пуст</p>
        </div>
    </template>
</template>

    
<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';

export default {
    name: "InviteFriendsFromMe",

    mounted() {
        if(this.getCountFriends === 0) {
        this.GET_USER_ADD_FRIENDS_FROM_ME();
        }
    },

    beforeUnmount() {
        this.setUsersFriendsFromMe([]);
        this.setSearchFriend();
        this.setCountFriendsNull();
        this.setSearchUsersFriends([]);
    },

    methods: {
        ...mapMutations({
            setSearchFriend: "friendsStore/setSearchFriend",
            setSearchUsersFriends: "friendsStore/setSearchUsersFriends",
            setCountFriendsNull: "friendsStore/setCountFriendsNull",
            setUsersFriendsFromMe: "friendsStore/setUsersFriendsFromMe"
        }),

        ...mapActions({
            GET_USER_ADD_FRIENDS_FROM_ME: "friendsStore/GET_USER_ADD_FRIENDS_FROM_ME",
            DELETE_FRIEND: "friendsStore/DELETE_FRIEND"
        })
    },

    computed: {
        ...mapGetters({ 
            getUsersFriendsFromMe: "friendsStore/getUsersFriendsFromMe",
            getIsNotFriends: "friendsStore/getIsNotFriends",
            getCountFriends: "friendsStore/getCountFriends"
        })
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
    font-size: 18px;
    font-family: Russo One, fantasy, sans-serif;
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

.wrapper_text_not_friends {
    font-size: 15px;
    font-family: Russo One, fantasy, sans-serif;
    text-align: center;
    margin-top: 20px;
    opacity: .6;
}
</style>