<template>
    <div class="wrapper_my_friends_title">
    </div>
    <div class="list_my_friends">
        <slot></slot>
    </div>
</template>
  
<script>
// import { mapGetters } from 'vuex';


export default {
    name: "UIUsersLikes",

    // methods: {
    //     loadAva(ava) {
    //         try {
    //             return require(`../../assets/photo/${ava}`)
    //         } catch {
    //             return require(`../../assets/ava/ava_1.jpg`);
    //         }
    //     }
    // },

    // computed: {
    //     ...mapGetters({
    //         getUsersLikesPost: "commentsPost/getUsersLikesPost",
    //     })
    // }
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

/* .my_friend {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 5px;
}

.my_friend_ava {}

.my_friend_ava img {
    width: 64px;
    border-radius: 100%;
    cursor: pointer;
}

.my_friend_name {
    cursor: pointer;
} */
</style>