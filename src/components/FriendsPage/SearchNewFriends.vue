<template>
    <div class="wrapper_search_new_friends">
        <h4 class="wrapper_search_new_friends_title">
            Поиск новых друзей
        </h4>
        <div class="wrapper_search_new_friends_filter">
            <div class="search_new_friends_filter" @click="isSearchUsersFilter = !isSearchUsersFilter">
                Фильтр поиска
            </div>

            <!-- блок поиска -->
            <div class="wrapper_search_new_friends_filter_form" v-if="isSearchUsersFilter">
                <div class="search_form search_name">
                    <label class="search_form_title" for="">Имя</label>
                    <input class="search_form_title_input" type="text" v-model="searchName">
                </div>
                <div class="search_form search_surname">
                    <label class="search_form_title" for="">Фамилия</label>
                    <input class="search_form_title_input" type="text" v-model="searchSurname">
                </div>
                <div class="search_form search_country">
                    <label class="search_form_title" for="">Страна</label>
                    <input class="search_form_title_input" type="text" v-model="searchCountry">
                </div>
                <div class="search_form search_city">
                    <label class="search_form_title" for="">Город</label>
                    <input class="search_form_title_input" type="text" v-model="searchCity">
                </div>
                <div class="wrapper_search_age">
                    <label class="search_form_title" for="">Возраст</label>
                    <div class="wrapper_search_age_block">
                        <div class="search_form search_age">
                            <select class="search_form_title_select" name="" id="" v-model="searchAgeAfter">
                                <option class="search_form_title_option" value="" selected>От</option>
                                <option class="search_form_title_option" :value="n" v-for="n in 100" :key="n">{{ n }}
                                </option>

                            </select>
                        </div>
                        <div class="search_form search_age search_age_before">
                            <select class="search_form_title_select" name="" id="" v-model="searchAgeBefore">
                                <option class="search_form_title_option" value="" selected>До</option>
                                <option class="search_form_title_option" 
                                v-for="n in 100"
                                :value="(searchAgeAfter) ? n + searchAgeAfter-1 : n"  
                                :key="(searchAgeAfter) ? n + searchAgeAfter-1 : n">
                                {{ (searchAgeAfter) ? n + searchAgeAfter-1 : n }}
                                </option>
                            </select>
                        </div>
                    </div>

                </div>
                <div class="search_form">
                    <label class="search_form_title" for="">Пол</label>
                    <select class="search_form_title_select search_sex" name="" id="" v-model="searchSex">
                        <option class="option_form_register_gender" value="" disabled>Выбрать</option>
                        <option class="search_form_title_option" value="man">Мужской</option>
                        <option class="search_form_title_option" value="woman">Женский</option>
                    </select>
                </div>
            </div>
            <!-- ------------- -->
        </div>
        <div class="wrapper_search_new_friends_btn">
            <UIbtn class="search_new_friends_btn" @click="search_users()">Найти друзей</UIbtn>
        </div>
    </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';

export default {
    name: "SearchNewFriends",

    data() {
        return {
            isSearchUsersFilter: false,
            searchName: "",
            searchSurname: "",
            searchCountry: "",
            searchCity: "",
            searchAgeAfter: "",
            searchAgeBefore: "",
            searchSex: ""
        }
    },

    methods: {
        ...mapMutations({setIsFriendShow: "friendsStore/setIsFriendShow"}),
        ...mapActions({ SEARCH_USERS_FRIENDS: "friendsStore/SEARCH_USERS_FRIENDS" }),

        search_users() {
            this.SEARCH_USERS_FRIENDS({
                name: this.searchName,
                surname: this.searchSurname,
                country: this.searchCountry,
                city: this.searchCity,
                ageAfter: this.searchAgeAfter,
                ageBefore: this.searchAgeBefore,
                sex: this.searchSex,
            });
            this.setIsFriendShow("allFriends")
        }
    },

    // computed: {
    //     ageBefore() {
    //         if(this.searchAgeAfter > 1) {
    //             return this.searchAgeBefore >= this.searchAgeAfter;
    //         } 
    //     }
    // }

}
</script>

<style scoped>
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
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-bottom: 10px;
}

.search_new_friends_filter {
    display: flex;
    justify-content: center;
    padding-top: 5px;
    padding-bottom: 10px;
    font-size: 17px;
    text-decoration: underline;
    cursor: pointer;
    color: #0197d6;
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

.wrapper_search_new_friends_filter_form {}

.search_form {
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
}

.search_country {}

.search_form_title {
    font-size: 15px;
}

.search_form_title_input {
    height: 25px;
}

.search_city {}

.wrapper_search_age {
    display: flex;
    flex-direction: column;
}

.wrapper_search_age_block {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
}

.search_age {}

.search_age_before {
    padding-left: 10px;
}

.search_form_title_select {
    width: 70px;
    height: 25px;
}

.search_form_title_option {}

.search_sex {
    width: 80px;
}
</style>