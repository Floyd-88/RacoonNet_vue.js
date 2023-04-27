<template>

        <div class="wrapper_my_friends_title">
            <!-- <h4 class="titleMyFriendsBlock" @click="$router.push({name: 'friendspage', query: {id: getUser.userID} })">
                Список друзей
            </h4> -->
        </div>
        <div class="list_my_friends">
            <div class="my_friend" v-for="user in getUsersLikesPost" :key="user.author_likes_post">
                <div class="my_friend_ava" @click="$router.push({name: 'mypage', params: {id: `${user.author_likes_post}`}})">
                    <img :src="loadAva(user.ava)" alt="ava">
                </div>
                <div class="my_friend_name" @click="$router.push({name: 'mypage', params: {id: `${user.author_likes_post}`}})">
                    <p>{{ user.name }}</p>
                </div>
                <div class="my_friend_name" @click="$router.push({name: 'mypage', params: {id: `${user.author_likes_post}`}})">
                    <p>{{ user.surname }}</p>
                </div>
            </div>
        </div>

</template>
  
<script>
import { mapGetters } from 'vuex';


export default {
    name: "UIUsersLikes",

    methods: {
        loadAva(ava) {
            try {
                return require(`../../assets/photo/${ava}`)
            } catch {
                return require(`../../assets/ava/ava_1.jpg`);
            }
        }
    },

    computed: {
        ...mapGetters({
            getUsersLikesPost: "commentsPost/getUsersLikesPost",
        })
    }
}
</script>
  
<style scoped>
.wrapper_my_friends_title {
    display: flex;
    justify-content: center;
    margin: 10px;
    font-size: 17px;
    font-family: fantasy;
}
.list_my_friends {
    display: flex;
    flex-wrap: wrap;
    max-width: 400px;
    max-height: 400px;
    padding: 0 0 10px;
    justify-content: center;
}
.my_friend {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 5px;
}
.my_friend_ava {
    
}
.my_friend_ava img {
    width: 64px;
    border-radius: 100%;
    cursor: pointer;
}
.my_friend_name {
    cursor: pointer;
}
</style>