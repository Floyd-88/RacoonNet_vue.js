<template>
    <div class="my_friends_filter">
        <input type="text" placeholder="Поиск среди друзей" v-model="filterFriends">
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
    name: "FilterName",

    data() {
        return {
            nameFriendUser: "",
        }
    },

    methods: {
        ...mapMutations({ setNameFriendUser: "friendsStore/setNameFriendUser" })
    },

    computed: {
        ...mapGetters({
            getNameFriendUser: "friendsStore/getNameFriendUser"
        }),

        //двухстороннее связывние со store
        filterFriends: {
            get() {
                return this.getNameFriendUser;
            },
            set(value) {
                this.setNameFriendUser(value);
            }
        },
    }


}
</script>

<style scoped>
.my_friends_filter {
    margin-bottom: 10px;
}

.my_friends_filter input {
    width: 100%;
    height: 30px;
}

.my_friends_filter input:focus {
    border: 1px solid #0197d6;
    box-shadow: 0 0 3px #0197d6;
    outline-offset: 0px;
    outline: none;
}
</style>