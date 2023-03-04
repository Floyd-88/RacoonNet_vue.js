<template>
        <div class="wrapper_my_friends_header">
            <div class="my_friends_header">
                <h3>Мои друзья</h3>
            </div>

            <!-- поск друга по имени -->
            <FilterName />
            <!-- -- -->

        </div>

        <!-- карточка с другом -->
        <template v-if="getUsersMyFriends.length > 0">
            <div class="wrapper_my_friends_list" v-for="user in getUsersMyFriends" :key="user.id">
            <div class="my_friend_card">
                <CardFriend :user="user"/>
                
                <!-- блок с кнопками -->
                <FriendCardBtns 
                :user="user"
                @getUserInfo="getUserInfo"
                />
            </div>
        </div>
        </template>
        <template v-else>
        <div class="wrapper_text_not_friends">
            <p>Ваш список друзей пуст, попробуйте завести новые знакомства здесь</p>
        </div>
        </template>



</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: "MyFriends",
    emits: ["getUserInfo"],

    methods: {
        getUserInfo(user) {
            this.$emit("getUserInfo", user);
        }
    },

    computed: {
        ...mapGetters({ getUsersMyFriends: "friendsStore/getUsersMyFriends" }),
    }
    
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

.wrapper_text_not_friends {
    font-size: 15px;
    font-family: fantasy;
    text-align: center;
    margin-top: 20px;
    opacity: .6;
}
</style>