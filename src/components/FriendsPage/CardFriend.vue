<template>
        <div class="my_friends_user_info">
            <div class="wrapper_my_friend_card_ava">
                <img class="my_friend_card_ava" src="../../assets/ava/ava_1.jpg" alt="ava">
            </div>
            <div class="wrapper_my_friend_card_identification">
                <div class="wrapper_my_friend_card_name">
                    <p class="my_friend_card_name">Илья Сазонов {{ elem }}</p>
                </div>
                <div class="wrapper_my_friend_card_country">
                    <p class="my_friend_card_country">Страна: Россия</p>
                </div>
                <div class="wrapper_my_friend_card_city">
                    <p class="my_friend_card_city">Город: Ставрополь</p>
                </div>
            </div>
        </div>    
</template>

<script>
export default {
    name: "CardFriend",

    props: {
        elem:  {
            type: Number,
            default: () => {
                return 0
            }
        }
    },


}
</script>

<style scoped>


.my_friends_user_info {
    display: flex;
}

.wrapper_my_friend_card_identification {
    margin-left: 10px;
    padding-top: 5px;
}

.wrapper_my_friend_card_ava {
    width: 80px;
    height: 80px;
    overflow: hidden;
    border-radius: 100%;
}

.my_friend_card_ava {
    width: 100%;
    height: auto;
}

.wrapper_my_friend_card_name {
    font-size: 16px;
    font-family: fantasy;
}

.my_friend_card_name {}

.wrapper_my_friend_card_country {
    margin-top: 1px;

}

.my_friend_card_country {}

.wrapper_my_friend_card_city {
    margin-top: 1px;

}

.my_friend_card_city {}


</style>