<template>
        <div class="my_friends_user_info">

            <div class="wrapper_my_friend_card_ava"
                @click="$router.push({name: 'mypage', params: {id: `${user.userID}`}})">
                <!-- <img class="my_friend_card_ava" :src="loadAva" alt="ava"> -->
                <UIAva :ava="user.ava"/>
            </div>

            <div class="wrapper_my_friend_card_identification">
                <div class="wrapper_my_friend_card_name"
                @click="$router.push({name: 'mypage', params: {id: `${user.userID}`}})">
                    <p class="my_friend_card_name">{{ user.name + " " + user.surname }}</p>
                </div>
                <div class="wrapper_my_friend_card_country">
                    <p class="my_friend_card_country">Страна: <span>{{ user.country }}</span></p>
                </div>
                <div class="wrapper_my_friend_card_city">
                    <p class="my_friend_card_city">Город: <span>{{ user.city }}</span></p>
                </div>
            </div>
        </div>    
</template>

<script>
export default {
    name: "CardFriend",

    props: {
        user:  {
            type: Object,
            default: () => {
                return {}
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
    cursor: pointer;
}

.my_friend_card_ava {
    width: 100%;
    height: auto;
}

.wrapper_my_friend_card_name {
    padding-bottom: 5px;
    font-size: 16px;
    font-family: Russo One, fantasy, sans-serif;
   
}

.my_friend_card_name {
    display: inline;
    cursor: pointer;
    
}

.wrapper_my_friend_card_country {
    margin-top: 1px;

}

.my_friend_card_country {
    font-family: Russo One, fantasy, sans-serif;
    font-size: 13px;
    font-weight: 400;
}

.my_friend_card_country span {
    font-family: Roboto Condensed, Arial, Helvetica, sans-serif;
    font-size: 13px;
    font-weight: 400;
}

.wrapper_my_friend_card_city {
    margin-top: 1px;
    
}

.my_friend_card_city {
    font-family: Russo One, fantasy, sans-serif;
    font-size: 13px;
    font-weight: 400;
}
.my_friend_card_city span {
    font-family: Roboto Condensed, Arial, Helvetica, sans-serif;
    font-size: 13px;
    font-weight: 400;
}

/* МЕДИА-ЗАПРОСЫ */

@media (max-width: 761px) {
    .wrapper_my_friend_card_name {
    max-width: 114px;
    word-break: break-word;
}
.wrapper_my_friend_card_ava {
    width: 70px;
    height: 70px;
}

.wrapper_my_friend_card_city {
    max-width: 114px;
    word-wrap: break-word;
}

.wrapper_my_friend_card_country {
    max-width: 114px;
    word-wrap: break-word;
}
}
</style>