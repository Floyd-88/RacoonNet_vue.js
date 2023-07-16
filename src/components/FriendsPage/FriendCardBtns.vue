<template>
    <div class="wrapper_my_friend_card_show_btns">
        <div class="wrapper_my_friend_card_btns" v-if="isCardBtn">
            <div class="my_friend_card_btn_write_message">
                <UIbtn class="btn_write_message" @click="writeMessageMyFriend(user)">Написать сообщение</UIbtn>
            </div>
            <div class="my_friend_card_btn_delete_friend">
                <UIbtn class="btn_delete_friend"
                    @click="DELETE_FRIEND({ id: user.id, query: this.$route.query.id, userID: user.userID })">Удалить из
                    друзей</UIbtn>
            </div>
        </div>

        <div class="wrapper_show_btns">
            <p class="show_btns" @click="showCardBtn()">...</p>
        </div>
    </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';

export default {
    name: "FriendCardBtns",

    props: {
        user: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },


    data() {
        return {
            isCardBtn: false,
        }
    },

    methods: {
        ...mapMutations({ setModalWriteMessage: "messageStore/setModalWriteMessage" }),
        ...mapActions({ DELETE_FRIEND: "friendsStore/DELETE_FRIEND" }),

        showCardBtn() {
            this.isCardBtn = !this.isCardBtn
        },

        writeMessageMyFriend(user) {
            this.setModalWriteMessage(true)
            this.$emit("getUserInfo", user)
        }
    }
}
</script>

<style scoped>
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

.btn_delete_friend {
    filter: opacity(0.7);
}

.wrapper_show_btns {
    margin-left: 10px;
}

.show_btns {
    font-size: 22px;
    padding-right: 5px;
    cursor: pointer;
}

/* МЕДИА-ЗАПРОСЫ */
@media (max-width: 761px) {
    .wrapper_my_friend_card_btns {
        flex-direction: column;
    }

    .my_friend_card_btn_write_message {
        padding-right: 0px;
        max-width: 90px;
    }

    .wrapper_my_friend_card_btns {
        align-items: flex-end;
    }

    .btn_write_message {
        font-size: 12px;
        padding: 2px;
        margin-bottom: 10px;
    }

    .my_friend_card_btn_delete_friend {
        max-width: 90px;
    }

    .btn_delete_friend {
        font-size: 12px;
        padding: 2px;
    }
}
</style>