<template>
    <!-- Мои друзья -->
    <template v-if="getTitleFriend === 'Друзья'">
        <div class="wrapper_my_friends_header">
            <div class="my_friends_header">
                <h3>{{ getTitleFriend }}</h3>
            </div>

            <!-- поск друга по имени -->
            <FilterName />
            <!-- -- -->

        </div>

        <!-- карточка с другом -->
        <template v-if="getUsersMyFriends.length > 0">
            <div class="wrapper_my_friends_list" v-for="user in getUsersMyFriendsFilter" :key="user.id">
                <div class="my_friend_card">
                    <CardFriend :user="user" />

                    <!-- блок с кнопками -->
                    <FriendCardBtns v-if="userTokenID == this.$route.query.id" :user="user" @getUserInfo="getUserInfo" />
                </div>
            </div>
        </template>
        <template v-else>
            <div class="wrapper_text_not_friends" v-if="getIsNotFriends">
                <p>Ваш список друзей пуст, попробуйте завести новые знакомства здесь</p>
            </div>
        </template>
    </template>
    <!-- ----- -->

    <!-- Поиск друзей -->
    <template v-if="getTitleFriend === 'Поиск друзей'">
        <div class="wrapper_my_friends_header">
            <div class="my_friends_header">
                <h3>{{ getTitleFriend }}</h3>
            </div>
        </div>

        <!-- карточка с другом -->
        <template v-if="getSearchUsersFriends.length > 0">
            <div class="wrapper_my_friends_list" v-for="user in getSearchUsersFriends" :key="user.id">
                <div class="my_friend_card">
                    <CardFriend :user="user" />

                    <!-- блок с кнопками -->

                    <!-- друзья -->
                    <template v-if="user.type_user === 'друзья'">
                        <div class="wrapper_my_friend_card_show_btns">
                            <div class="wrapper_my_friend_card_btns">
                                <div class="my_friend_card_btn_write_message">
                                    <UIbtn class="btn_write_message" @click="writeMessageMyFriend(user)">Написать сообщение
                                    </UIbtn>
                                </div>
                                <div class="my_friend_card_btn_delete_friend">
                                    <UIbtn class="btn_write_add_friend"
                                        :class="{ 'btn_delete_friend': user.textBTN === 'Удалить из друзей' || user.textBTN === 'Отменить заявку' }"
                                        @click="removeFriend(user)">
                                        {{ user.textBTN = user.textBTN || "Удалить из друзей" }}
                                    </UIbtn>
                                </div>
                            </div>
                        </div>
                    </template>

                    <!-- я отправил заявку -->
                    <template v-if="user.type_user === 'я отправил заявку'">
                        <div class="wrapper_my_friend_card_show_btns">
                            <div class="wrapper_my_friend_card_btns">
                                <div class="my_friend_card_btn_write_message">
                                    <UIbtn class="btn_write_message" @click="writeMessageMyFriend(user)">Написать сообщение
                                    </UIbtn>
                                </div>
                                <div class="my_friend_card_btn_delete_friend">
                                    <UIbtn class="btn_write_add_friend"
                                        :class="{ 'btn_delete_friend': user.textBTN === 'Отменить заявку' }"
                                        @click="removeFriend(user)">
                                        {{ user.textBTN = user.textBTN || "Отменить заявку" }}
                                    </UIbtn>
                                </div>
                            </div>
                        </div>
                    </template>

                    <!-- мне отправили заявку в друзья -->
                    <template v-if="user.type_user === 'мне отправили заявку'">
                        <div class="wrapper_my_friend_card_show_btns">
                            <div class="wrapper_my_friend_card_btns">

                                <div class="my_friend_card_btn_write_message">
                                    <UIbtn class="btn_write_message" @click="writeMessageMyFriend(user)">Написать сообщение
                                    </UIbtn>
                                </div>

                                <template v-if="user.acceptBTN === 'removeFriend'">
                                    <div class="my_friend_card_btn_delete_friend">
                                        <UIbtn class="btn_write_add_friend"
                                            :class="{ 'btn_delete_friend': user.textBTN === 'Удалить из друзей' || user.textBTN === 'Отменить заявку' }"
                                            @click="removeFriend(user)">
                                            {{ user.textBTN = user.textBTN || "Удалить из друзей" }}
                                        </UIbtn>
                                    </div>
                                </template>

                                <template v-else-if="user.acceptBTN === 'addFriend'">
                                    <div class="my_friend_card_btn_delete_friend">
                                        <UIbtn class="btn_write_add_friend"
                                            :class="{ 'btn_delete_friend': user.textBTN === 'Отменить заявку' }"
                                            @click="addFriend(user)">
                                            {{ user.textBTN = user.textBTN || "Добавить в друзья" }}
                                        </UIbtn>
                                    </div>
                                </template>

                                <template v-else>
                                    <div class="my_friend_card_btn_write_show_block">
                                        <div class="my_friend_card_btn_write_message">
                                            <UIbtn class="btn_write_add_friend add_friend" @click="acceptFriend(user)">
                                                Принять
                                            </UIbtn>
                                        </div>

                                        <div class="my_friend_card_btn_delete_friend">
                                            <UIbtn class="btn_delete_friend" @click="refusalFriend(user)">
                                                Отказаться
                                            </UIbtn>
                                        </div>
                                    </div>
                                </template>


                            </div>
                        </div>
                    </template>

                    <!-- остальные -->
                    <template v-if="user.type_user == null">
                        <div class="wrapper_my_friend_card_show_btns">
                            <div class="wrapper_my_friend_card_btns">
                                <div class="my_friend_card_btn_write_message">
                                    <UIbtn class="btn_write_message" @click="writeMessageMyFriend(user)">Написать сообщение
                                    </UIbtn>
                                </div>
                                <div class="my_friend_card_btn_delete_friend">
                                    <UIbtn class="btn_write_add_friend"
                                        :class="{ 'btn_delete_friend': user.textBTN === 'Отменить заявку' }"
                                        @click="addFriend(user)">
                                        {{ user.textBTN = user.textBTN || "Добавить в друзья" }}
                                    </UIbtn>
                                </div>
                            </div>
                        </div>
                    </template>

                </div>
            </div>
        </template>
        <template v-else>
            <div class="wrapper_text_not_friends" v-if="getIsNotFriends">
                <p>Никого не найдено, попробуйте изменить критерии поиска</p>
            </div>
        </template>
    </template>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';

export default {
    name: "MyFriends",
    emits: ["getUserInfo"],
    data() {
        return {
            userTokenID: JSON.parse(localStorage.getItem("user"))?.userID,
        };
    },
    beforeUnmount() {
        this.setTitleFriend("Друзья");
        this.setSearchFriend();
        this.setCountFriendsNull();
        this.setSearchUsersFriends([]);
    },
    methods: {
        ...mapMutations({
            setTitleFriend: "friendsStore/setTitleFriend",
            setModalWriteMessage: "messageStore/setModalWriteMessage",
            setSearchFriend: "friendsStore/setSearchFriend",
            setSearchUsersFriends: "friendsStore/setSearchUsersFriends",
            setCountFriendsNull: "friendsStore/setCountFriendsNull",
        }),
        ...mapActions({
            ADD_FRIEND: "friendsStore/ADD_FRIEND",
            DELETE_FRIEND: "friendsStore/DELETE_FRIEND",
            AGREE_ADD_FRIEND_USER: "friendsStore/AGREE_ADD_FRIEND_USER"
        }),
        getUserInfo(user) {
            this.$emit("getUserInfo", user);
        },
        writeMessageMyFriend(user) {
            this.setModalWriteMessage(true);
            this.getUserInfo(user);
        },
        //приглашение в друзья от меня
        addFriend(user) {
            if (user.textBTN === "Добавить в друзья") {
                this.ADD_FRIEND(user.userID);
                user.textBTN = "Отменить заявку";
            }
            else {
                user.textBTN = "Добавить в друзья";
                this.ADD_FRIEND(user.userID);
            }
        },
        removeFriend(user) {
            if (user.textBTN === "Удалить из друзей") {
                this.DELETE_FRIEND({ id: user.id, query: this.$route.query.id, userID: user.userID });
                user.textBTN = "Добавить в друзья";
            }
            else if (user.textBTN === "Добавить в друзья") {
                user.textBTN = "Отменить заявку";
                this.ADD_FRIEND(user.userID);
            }
            else if (user.textBTN === "Отменить заявку") {
                user.textBTN = "Добавить в друзья";
                this.ADD_FRIEND(user.userID);
            }
        },
        async acceptFriend(user) {
            await this.AGREE_ADD_FRIEND_USER({ id: user.id, userID: user.userID });
            user.type_user = "друзья";
            user.textBTN = "Удалить из друзей"
        },
        refusalFriend(user) {
            this.DELETE_FRIEND({ id: user.id, query: this.$route.query.id, userID: user.userID })
                .then(() => {
                    user.type_user = null;
                    user.id = null;
                });
        }
    },
    computed: {
        ...mapGetters({
            getUsersMyFriends: "friendsStore/getUsersMyFriends",
            getUsersMyFriendsFilter: "friendsStore/getUsersMyFriendsFilter",
            getTitleFriend: "friendsStore/getTitleFriend",
            getSearchUsersFriends: "friendsStore/getSearchUsersFriends",
            getUser: "authorizationStore/getUser",
            getIsNotFriends: "friendsStore/getIsNotFriends",
        }),
    },
}

</script>

<style scoped>

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

.wrapper_text_not_friends {
    font-size: 15px;
    font-family: Russo One, fantasy, sans-serif;
    text-align: center;
    margin-top: 20px;
    opacity: .6;
}

.wrapper_my_friend_card_show_btns {
    display: flex;
    padding-right: 10px;
}

.wrapper_my_friend_card_btns {
    display: flex;
    padding-top: 5px;
    flex-direction: column;
    justify-content: space-evenly;

}

.my_friend_card_btn_write_show_block {
    display: flex;
}

.my_friend_card_btn_write_message {
    display: flex;
    justify-content: flex-end;
}

.my_friend_card_btn_delete_friend {
    padding-left: 10px;
}

.btn_write_message {
    min-width: 140px;
    background: #0197d6bd;
}

.btn_write_add_friend {
    min-width: 155px;
}

.add_friend {
    min-width: 100px;
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
    .wrapper_my_friend_card_show_btns {
        flex-direction: column-reverse;
        align-items: flex-end;
        justify-content: flex-end;
        padding-right: 0;
    }

    .btn_write_message {
        min-width: 95px;
        width: 95px;
        margin-bottom: 10px;
    }

    .btn_delete_friend {
        min-width: 95px;
        width: 95px;
        margin-bottom: 7px;
    }

    .my_friend_card_btn_write_show_block {
        flex-direction: column;
    }

    .btn_write_add_friend {
        min-width: 95px;
        margin-bottom: 7px;
    }

    .btn_write_add_friend {
        width: 95px;
    }

    .wrapper_my_friend_card_name {
        max-width: 110px;
        word-break: break-word;
    }
}
</style>