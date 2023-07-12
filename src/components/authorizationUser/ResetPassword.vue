<template>
    <div class="wrapper_main">

        <div class="wrapper_mainPage">
            <div class="wrapper_form">

                <!-- старый пароль -->
                <form class="form_password" v-if="getModalSave" @submit.prevent="update_password()">

                    <div class="wrapper_error_login" v-if="getErrorPassword">
                        <p class="error_password">{{ getErrorPassword }}</p>
                    </div>

                    <!-- новый пароль -->
                    <div class="wrapper_form_register_input">
                        <div class="input-errors" v-for="(error, index) of v$.new_password.$errors" :key="index">
                            <div class="error-msg"
                                v-if="error.$message === 'This field should be at least 8 characters long'">
                                Пароль должен состоять минимум из 8 символов
                            </div>
                        </div>

                        <div class="wrapper_form_change_password">
                            <div class="wrapper_form_change_password_label">
                                <label class="change_password_label" for="old_password">Новый пароль:</label>
                            </div>
                            <div class="wrapper_form_change_password_input">
                                <input class="form_register_input" id="new_password" type="password"
                                    placeholder="Укажите новый пароль" @change="setCheckNewPassword"
                                    v-model="check_new_password" :class="{ invalid: (v$.new_password.$error) }">
                            </div>
                        </div>
                    </div>

                    <!-- повторный новый пароль -->
                    <div class="wrapper_form_register_input">
                        <div class="input-errors">
                            <div class="error-msg" v-if="getDouble_new_password">Пароли не свопадают</div>
                        </div>

                        <div class="wrapper_form_change_password">
                            <div class="wrapper_form_change_password_label">
                                <label class="change_password_label" for="old_password">Повторите пароль:</label>
                            </div>

                            <div class="wrapper_form_change_password_input">
                                <input class="form_register_input" id="new_password_confirmation" type="password"
                                    placeholder="Повторите новый пароль" @input="setCheckNewPassword"
                                    v-model="check_new_password_confirmation">
                            </div>
                        </div>
                    </div>

                    <div class="wrapper_save_password_btn">
                        <UIbtn class="save_password_btn" type="submit" :disabled="v$.$invalid">
                            Обновить пароль
                        </UIbtn>
                    </div>


                </form>
                <div v-else class="wrapper_save_password">
                    <div>
                        <p class="save_password">Ваш был пароль изменен!</p>
                    </div>
                    <div>
                        <UIbtn class="btn_save_password" @click.prevent="setCloseChangePassword">OK</UIbtn>
                    </div>
                </div>


            </div>
        </div>

    </div>
</template>
  
<script>
import { useVuelidate } from "@vuelidate/core";
import { required, minLength, maxLength } from "@vuelidate/validators";
import { mapMutations, mapGetters, mapState, mapActions } from "vuex";
import UIbtn from "../UI/UIbtn.vue";

export default {
    name: "ResetPassword",
    components: { UIbtn },

    setup() {
        return { v$: useVuelidate() };
    },
    data() {
        return {
            token: this.$route.query.token
        };
    },
    validations: {
        new_password: { required, min: minLength(8), max: maxLength(30) },
        new_password_confirmation: { required },
    },
    methods: {
        ...mapMutations({
            setCloseChangePassword: "updatePasswordStore/setCloseChangePassword",
            setNew_password: "updatePasswordStore/setNew_password",
            setNew_password_confirmation: "updatePasswordStore/setNew_password_confirmation",
            setCheckNewPassword: "updatePasswordStore/setCheckNewPassword",
            setErrorPassword: "updatePasswordStore/setErrorPassword",

            setModalSave: "updatePasswordStore/setModalSave"
        }),
        ...mapActions({ UPDATE_PASSWORD_RESTORE: "updatePasswordStore/UPDATE_PASSWORD_RESTORE" }),

        //изменение старого пароля
        update_password() {
            if (!this.getDouble_new_password) { //если пароли совпадают
                let pass = {
                    token: this.token,
                    new_password: this.getNew_password
                };

                this.UPDATE_PASSWORD_RESTORE(pass)
                    .then(() => {
                        this.$router.push('/')
                    })
                    .catch((err) => {
                        if (err.err) {
                            this.setErrorPassword(JSON.stringify(err.err).slice(1, -1));
                        }
                        this.setNew_password("");
                        this.setNew_password_confirmation("");
                        console.log("Изменение пароля завершилось с ошибкой: " + JSON.stringify(err));
                    });
            }
        },
    },
    computed: {
        ...mapGetters({
            getDouble_new_password: "updatePasswordStore/getDouble_new_password",
            getNew_password: "updatePasswordStore/getNew_password",
            getNew_password_confirmation: "updatePasswordStore/getNew_password_confirmation",
            getErrorPassword: "updatePasswordStore/getErrorPassword",

            getModalSave: "updatePasswordStore/getModalSave"
        }),
        ...mapState({
            new_password: (state) => state.updatePasswordStore.new_password,
            new_password_confirmation: (state) => state.updatePasswordStore.new_password_confirmation,
        }),
        check_new_password: {
            get() {
                return this.getNew_password;
            },
            set(value) {
                this.setNew_password(value);
                this.v$.new_password.$touch();
            }
        },
        check_new_password_confirmation: {
            get() {
                return this.getNew_password_confirmation;
            },
            set(value) {
                this.setNew_password_confirmation(value);
                this.v$.new_password_confirmation.$touch();
            }
        },
    },
}
</script>
  
  
<style scoped>
.wrapper_main {
    padding: 120px 20px 5px;
}

.wrapper_mainPage {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    margin-top: 10%;
}

.wrapper_title {
    display: flex;
    flex-direction: column;
    padding: 10px;
}

.welcome_title {
    display: flex;
    flex-direction: column;
    padding: 10px;
    max-width: 500px;
    font-weight: 400;
    font-size: 26px;
    font-family: emoji;
}

.name_net_title {
    margin-bottom: 10px;
    font-size: 55px;
    padding-top: 10px;
    font-family: emoji;
    color: cornflowerblue;
    font-weight: 600;
}

.wrapper_form {
    padding: 20px;
    border-radius: 5px;
    background: white;
    box-shadow: 0px 5px 10px 0px rgb(0 0 0 / 50%);
}

.form_password {
    display: flex;
    flex-direction: column;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 10px;
}

.wrapper_form_register_input {
    display: flex;
    flex-direction: column;
    margin-top: 10px;
}

.wrapper_form_change_password {
    display: flex;
    align-items: center;
}

.wrapper_form_change_password_label {
    margin-right: 5px;
    width: 140px;
}

.change_password_label {
    font-size: 17px;
}

.wrapper_form_change_password_input {
    width: 200px;
}

/* .form_register_input {} */

.form_register_input {
    /*margin: 5px;*/
    height: 30px;
    width: 100%;
    /*padding-left: 3px;*/
}

.error-msg {
    margin-left: 5px;
    color: red;
    font-size: 14px;
}

.wrapper_save_password_btn {
    display: flex;
    justify-content: center;
}

.save_password_btn {
    width: 150px;
    margin: 10px;
    display: flex;
    justify-content: center;
}

.error_password {
    color: red;
    margin: 5px;
    font-size: 14px;
}

.wrapper_save_password {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 20px;
}

.save_password {
    font-size: 18px;
    margin: 10px;
}

.btn_save_password {
    width: 100px;
    height: 35px;
    margin-top: 10px;
}

@media (max-width: 761px) {

.wrapper_form {
  width: 350px;
}

.wrapper_form_change_password_input {
  width: 190px;
}
}

</style>