<template>
    <div class="wrapper_my_friends">
        <div class="wrapper_my_friends_header">
            <div class="my_friends_header">
                <h3>Список ваших друзей</h3>
            </div>

            <!-- поск друга по имени -->
            <div class="my_friends_filter">
                <input type="text" placeholder="Поиск среди ваших друзей">
            </div>
            <!-- -- -->

        </div>

        <!-- карточка с другом -->
        <div class="wrapper_my_friends_list" v-for="elem in 10" :key="elem">
            <div class="my_friend_card">
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
                <div class="wrapper_my_friend_card_show_btns">
                    <div class="wrapper_my_friend_card_btns" v-if="isCardBtn">
                        <div class="my_friend_card_btn_write_message">
                            <UIbtn class="btn_write_message">Написать сообщение</UIbtn>
                        </div>
                        <div class="my_friend_card_btn_delete_friend">
                            <UIbtn class="btn_delete_friend">Удалить из друзей</UIbtn>
                        </div>
                    </div>

                    <div class="wrapper_show_btns">
                        <p class="show_btns" @click="showCardBtn()">...</p>
                    </div>
                </div>


            </div>
        </div>
        <!-- -- -->
</div>

    
    <MyFriendsBlock class="wrapper_my_friends_params"> 

        <!-- Переключение между уведомлениями -->
        <div class="my_friends_params_choice">
            <button class="my_friends_params_choice_btn">Все мои друзья</button>
            <button class="my_friends_params_choice_btn">Со мной хотят дружить</button>
            <button class="my_friends_params_choice_btn my_friends_params_choice_btn_end">Я хочу дружить</button>
        </div>
        <!-- -- -->

        <!-- Фильтр поиска новых друзей -->
        <div class="wrapper_search_new_friends">
            <h4 class="wrapper_search_new_friends_title">
                Поиск новых друзей
            </h4>
            <div class="wrapper_search_new_friends_filter">
                <div class="search_new_friends_filter">
                    Фильтр поиска
                </div>
            </div>
            <div class="wrapper_search_new_friends_btn">
                <UIbtn class="search_new_friends_btn">Найти друзей</UIbtn>
            </div>
        </div>
        <!-- -- -->

    </MyFriendsBlock>

</template>

<script>
import UIbtn from '../UI/UIbtn.vue';

export default {
    name: "MyFriends",
    components: { UIbtn },

    data() {
        return {
            isCardBtn: false,
        }
    },

    methods: {
        showCardBtn() {
            this.isCardBtn = !this.isCardBtn
        }
    }
}

</script>

<style scoped>
.wrapper_my_friends {
    white-space: nowrap;
    display: flex;
    flex-direction: column;
    flex: 0 0 70%;
    padding: 15px;
    border-radius: 5px;
    margin-right: 20px;
    box-shadow: 0px 2px 5px 0px rgb(0 0 0 / 40%);
}

.wrapper_my_friends_header {}

.my_friends_header {}

.my_friends_header h3 {
    padding: 0 0 8px 0;
    font-size: 17px;
    font-family: fantasy;
    font-weight: 300;
}

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

.my_friend_card_btn_delete_friend {}

.btn_write_message {}

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

.wrapper_my_friends_params {
border-radius: 5px;
}


/* ------------------------- */
.wrapper_my_friends_params {
    border-radius: 5px;
    padding: 8px;
}
.my_friends_params_choice {
}
.my_friends_params_choice_btn {
    width: 100%;
    padding-bottom: 5px;
    border: none;
    background: whitesmoke;
    border-top: 1px solid;
    padding-top: 5px;
    cursor: pointer;
}
.my_friends_params_choice_btn_end {
    border-bottom: 1px solid;
}

.my_friends_params_choice_btn:hover {
    filter: brightness(90%);
}
 .wrapper_search_new_friends {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 15px;
}
.wrapper_search_new_friends_title {
    padding-bottom: 5px;
    font-family: fantasy;
    font-weight: 300;
    font-size: 14px;
}
.wrapper_search_new_friends_filter {
    margin-bottom: 10px;
}
.search_new_friends_filter {
}
.wrapper_search_new_friends_btn {
    width: 100%;
}
.search_new_friends_btn {
    width: 100%;
    font-size: 15px;
    background: #0197d6;
    opacity: 0.9;
}
</style>