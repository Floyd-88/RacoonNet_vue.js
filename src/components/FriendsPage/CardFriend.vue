<template>
        <div class="my_friends_user_info">

            <div class="wrapper_my_friend_card_ava"
                @click="$router.push({name: 'mypage', params: {id: `${user.userID}`}})">
                <img class="my_friend_card_ava" :src="loadAva(user.ava)" alt="ava">
            </div>

            <div class="wrapper_my_friend_card_identification">
                <div class="wrapper_my_friend_card_name"
                @click="$router.push({name: 'mypage', params: {id: `${user.userID}`}})">
                    <p class="my_friend_card_name">{{ user.name + " " + user.surname }}</p>
                </div>
                <div class="wrapper_my_friend_card_country">
                    <p class="my_friend_card_country">Страна: {{ user.country }}</p>
                </div>
                <div class="wrapper_my_friend_card_city">
                    <p class="my_friend_card_city">Город: {{ user.city }}</p>
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

    methods: {
        loadAva(ava) {
            try {
                return require(`../../assets/photo/${ava}`)
            } catch {
                return require(`../../assets/ava/ava_1.jpg`);
            }
        }
    }

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
    font-size: 16px;
    font-family: fantasy;
   
}

.my_friend_card_name {
    display: inline;
    cursor: pointer;
}

.wrapper_my_friend_card_country {
    margin-top: 1px;

}

.my_friend_card_country {}

.wrapper_my_friend_card_city {
    margin-top: 1px;

}

.my_friend_card_city {}


</style>