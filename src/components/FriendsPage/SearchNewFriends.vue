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

                    <div class="input-errors" v-for="(error, index) of v$.name.$errors" :key="index">
                        <div class="error-msg" v-if="error.$message === 'Invalid Name'">
                            Необходимо указать корректное имя
                        </div>
                    </div>

                    <input class="search_form_title_input" id="name" type="text" placeholder="Имя" v-model.trim="searchName"
                        :class="{ invalid: (v$.name.$error) }">
                </div>

                <div class="search_form search_surname">
                    <label class="search_form_title" for="">Фамилия</label>
                    <div class="input-errors" v-for="(error, index) of v$.surname.$errors" :key="index">
                        <div class="error-msg" v-if="error.$message === 'Invalid Name'">
                            Необходимо указать корректную фамилию
                        </div>
                    </div>
                    <input class="search_form_title_input" type="text" id="surname" placeholder="Фамилия"
                        :class="{ invalid: (v$.surname.$error) }" v-model.trim="searchSurname">
                </div>
                <div class="search_form search_country">
                    <label class="search_form_title" for="">Страна</label>

                    <div class="input-errors" v-for="(error, index) of v$.country.$errors" :key="index">
                        <div class="error-msg" v-if="error.$message === 'Invalid Name'">
                            Необходимо указать корректную страну
                        </div>
                    </div>

                    <input class="search_form_title_input" id="country" type="text" placeholder="Страна"
                        :class="{ invalid: (v$.country.$error) }" v-model.trim="searchCountry">
                </div>

                <div class="search_form search_city">
                    <label class="search_form_title" for="">Город</label>
                    <div class="input-errors" v-for="(error, index) of v$.city.$errors" :key="index">
                        <div class="error-msg" v-if="error.$message === 'Invalid Name'">
                            Необходимо указать корректный населенный пункт
                        </div>
                    </div>
                    <input class="search_form_title_input" id="city" type="text" placeholder="Населенный пункт"
                        :class="{ invalid: (v$.city.$error) }" v-model.trim="searchCity">
                </div>
                <div class="wrapper_search_age">
                    <label class="search_form_title" for="">Возраст</label>
                    <div class="wrapper_search_age_block">
                        <div class="search_form search_age">
                            <select class="search_form_title_select" name="" id="" v-model.trim="searchAgeAfter">
                                <option class="search_form_title_option" value="" selected>От</option>
                                <option class="search_form_title_option" :value="n" v-for="n in 100" :key="n">{{ n }}
                                </option>

                            </select>
                        </div>
                        <div class="search_form search_age search_age_before">
                            <select class="search_form_title_select" name="" id="" v-model.trim="searchAgeBefore">
                                <option class="search_form_title_option" value="" selected>До</option>
                                <option class="search_form_title_option" v-for="n in 100 - ((searchAgeAfter) ? (searchAgeAfter - 1) : 0)"
                                    :value="(searchAgeAfter) ? n + searchAgeAfter - 1 : n"
                                    :key="(searchAgeAfter) ? n + searchAgeAfter - 1 : n">
                                    {{ (searchAgeAfter) ? n + searchAgeAfter - 1 : n }}
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
            <UIbtn class="search_new_friends_btn" 
            @click="search_users()"
            :disabled="v$.$invalid || !isblockBtnSearchUsers">Найти новых друзей</UIbtn>
        </div>
    </div>
</template>

<script>
import { useVuelidate } from "@vuelidate/core";
import { maxLength } from "@vuelidate/validators";
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';

//функция для валидации имяни и фамилии
export function validName(name) {
    let validNamePattern = new RegExp("^$|^[a-zA-Zа-яА-Я]+(?:[-'\\s][a-zA-Zа-яА-Я]+)*$");
    return validNamePattern.test(name);
}

export default {
    name: "SearchNewFriends",

    setup() {
        return { v$: useVuelidate() }
    },

    data() {
        return {
            isSearchUsersFilter: false,
            isblockBtnSearchUsers: true,
        }
    },

    validations() {
        return {
            name: {
                max: maxLength(30),
                name_validation: {
                    $validator: validName,
                    $message: 'Invalid Name'
                }
            },
            surname: {
                max: maxLength(30),
                name_validation: {
                    $validator: validName,
                    $message: 'Invalid Name'
                }
            },
            country: {
                max: maxLength(30), 
                name_validation: {
                    $validator: validName,
                    $message: 'Invalid Name'
                }
            },
            city: {
                max: maxLength(30), 
                name_validation: {
                    $validator: validName,
                    $message: 'Invalid Name'
                }
            },
        }
    },

    methods: {
        ...mapMutations({
            //двухстроннее связывание v-model
            setSearchFriendName: "friendsStore/setSearchFriendName",
            setSearchFriendSurname: "friendsStore/setSearchFriendSurname",
            setSearchFriendCountry: "friendsStore/setSearchFriendCountry",
            setSearchFriendCity: "friendsStore/setSearchFriendCity",
            setSearchFriendAgeAfter: "friendsStore/setSearchFriendAgeAfter",
            setSearchFriendAgeBefore: "friendsStore/setSearchFriendAgeBefore",
            setSearchFriendSex: "friendsStore/setSearchFriendSex",
            setCountFriendsNull: "friendsStore/setCountFriendsNull",
            setSearchUsersFriends: "friendsStore/setSearchUsersFriends"
        }),
        ...mapActions({ SEARCH_USERS_FRIENDS: "friendsStore/SEARCH_USERS_FRIENDS" }),

        async search_users() {
            this.isblockBtnSearchUsers = false;
            this.setCountFriendsNull();
            this.setSearchUsersFriends([]);

            await this.SEARCH_USERS_FRIENDS({
                name: this.getSearchFriendName,
                surname: this.getSearchFriendSurname,
                country: this.getSearchFriendCountry,
                city: this.getSearchFriendCity,
                ageAfter: this.getSearchFriendAgeAfter,
                ageBefore: this.getSearchFriendAgeBefore,
                sex: this.getSearchFriendSex,
            });
            this.isblockBtnSearchUsers = true;
        }
    },

    computed: {
        ...mapState({
            name: (state) => state.friendsStore.searchFriend.name,
            surname: (state) => state.friendsStore.searchFriend.surname,
            country: (state) => state.friendsStore.searchFriend.country,
            city: (state) => state.friendsStore.searchFriend.city
        }),

        ...mapGetters({
            getSearchFriendName: "friendsStore/getSearchFriendName",
            getSearchFriendSurname: "friendsStore/getSearchFriendSurname",
            getSearchFriendCountry: "friendsStore/getSearchFriendCountry",
            getSearchFriendCity: "friendsStore/getSearchFriendCity",
            getSearchFriendAgeAfter: "friendsStore/getSearchFriendAgeAfter",
            getSearchFriendAgeBefore: "friendsStore/getSearchFriendAgeBefore",
            getSearchFriendSex: "friendsStore/getSearchFriendSex"
        }),

        //двухстороннее связывние со store
        searchName: {
            get() {
                return this.getSearchFriendName;
            },
            set(value) {
                this.setSearchFriendName(value);
                this.v$.name.$touch();
            }
        },
        searchSurname: {
            get() {
                return this.getSearchFriendSurname
            },
            set(value) {
                this.setSearchFriendSurname(value)
                this.v$.surname.$touch()
            }
        },
        searchCountry: {
            get() {
                return this.getSearchFriendCountry
            },
            set(value) {
                this.setSearchFriendCountry(value)
                this.v$.country.$touch()
            }
        },
        searchCity: {
            get() {
                return this.getSearchFriendCity
            },
            set(value) {
                this.setSearchFriendCity(value)
                this.v$.city.$touch()
            }
        },
        searchAgeAfter: {
            get() {
                return this.getSearchFriendAgeAfter
            },
            set(value) {
                this.setSearchFriendAgeAfter(value)
                // this.v$.city.$touch()
            }
        },
        searchAgeBefore: {
            get() {
                return this.getSearchFriendAgeBefore
            },
            set(value) {
                this.setSearchFriendAgeBefore(value)
                // this.v$.city.$touch()
            }
        },
        searchSex: {
            get() {
                return this.getSearchFriendSex
            },
            set(value) {
                this.setSearchFriendSex(value)
                // this.v$.city.$touch()
            }
        },
    }

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
    font-family: Russo One, fantasy, sans-serif;
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

.error-msg {
    color: red;
    font-size: 14px;
}

.invalid {
    border: 1px solid red;
}
</style>