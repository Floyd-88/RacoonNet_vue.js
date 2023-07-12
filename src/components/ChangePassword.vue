<template>
  <!-- старый пароль -->
  <form class="form_password" v-if="getModalSave" @submit.prevent="save_new_password">
    <div class="wrapper_form_register_input">
      <div class="input-errors" v-for="(error, index) of v$.old_password.$errors" :key="index">
        <div class="error-msg" v-if="error.$message === 'Value is required'">
          Введите пароль указанный при регистрации
        </div>
      </div>
      <div class="wrapper_error_login" v-if="getErrorPassword">
        <p class="error_password">{{ getErrorPassword }}</p>
      </div>
      <div class="wrapper_form_change_password">
        <div class="wrapper_form_change_password_label">
          <label class="change_password_label" for="old_password">Старый пароль:</label>
        </div>
        <div class="wrapper_form_change_password_input">
          <input class="form_register_input" id="old_password" type="password" placeholder="Укажите Ваш старый пароль"
            v-model="check_old_password" :class="{ invalid: (v$.old_password.$error) }">
        </div>
      </div>
    </div>

    <!-- новый пароль -->
    <div class="wrapper_form_register_input">
      <div class="input-errors" v-for="(error, index) of v$.new_password.$errors" :key="index">
        <div class="error-msg" v-if="error.$message === 'This field should be at least 8 characters long'">
          Пароль должен состоять минимум из 8 символов
        </div>
      </div>

      <div class="wrapper_form_change_password">
        <div class="wrapper_form_change_password_label">
          <label class="change_password_label" for="old_password">Новый пароль:</label>
        </div>
        <div class="wrapper_form_change_password_input">
          <input class="form_register_input" id="new_password" type="password" placeholder="Укажите новый пароль"
            @change="setCheckNewPassword" v-model="check_new_password" :class="{ invalid: (v$.new_password.$error) }">
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
            placeholder="Повторите новый пароль" @input="setCheckNewPassword" v-model="check_new_password_confirmation">
        </div>
      </div>
    </div>

    <div class="wrapper_save_password_btn">
      <UIbtn class="save_password_btn" type="submit" :disabled="v$.$invalid">
        Сохранить пароль
      </UIbtn>

      <UIbtn class="save_password_btn" @click.prevent="setCloseChangePassword">
        Отменить
      </UIbtn>
    </div>


  </form>
  <div v-else class="wrapper_save_password">
    <div>
      <p class="save_password">Ваш был пароль изменен!</p>
    </div>
    <div>
      <UIbtn class="btn_save_password" @click.prevent = "setCloseChangePassword">OK</UIbtn>
    </div>
  </div>
</template>

<script>
import { useVuelidate } from "@vuelidate/core";
import { required, minLength, maxLength } from "@vuelidate/validators";
import { mapMutations, mapGetters, mapState, mapActions } from "vuex";
import UIbtn from "./UI/UIbtn.vue";

export default {
  name: "ChangePassword",
  components: { UIbtn },

  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {};
  },
  validations: {
    old_password: { required },
    new_password: { required, min: minLength(8), max: maxLength(30) },
    new_password_confirmation: { required },
  },
  methods: {
    ...mapMutations({
      setCloseChangePassword: "updatePasswordStore/setCloseChangePassword",
      setOld_password: "updatePasswordStore/setOld_password",
      setNew_password: "updatePasswordStore/setNew_password",
      setNew_password_confirmation: "updatePasswordStore/setNew_password_confirmation",
      setCheckNewPassword: "updatePasswordStore/setCheckNewPassword",
      setErrorPassword: "updatePasswordStore/setErrorPassword",

      setModalSave: "updatePasswordStore/setModalSave"
    }),
    ...mapActions({ updatePasword: "updatePasswordStore/updatePasword" }),

    //изменение старого пароля
    save_new_password() {
      if (!this.getDouble_new_password) { //если пароли совпадают
        let user = {
          old_password: this.getOld_password,
          new_password: this.getNew_password
        };
        this.updatePasword(user)
          .then(() => {
            this.setModalSave(false);          
          })
          .catch((err) => {
            if (err.err) {
              this.setErrorPassword(JSON.stringify(err.err).slice(1, -1));
            }
            this.setOld_password("");
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
      getOld_password: "updatePasswordStore/getOld_password",
      getErrorPassword: "updatePasswordStore/getErrorPassword",

      getModalSave: "updatePasswordStore/getModalSave"
    }),
    ...mapState({
      old_password: (state) => state.updatePasswordStore.old_password,
      new_password: (state) => state.updatePasswordStore.new_password,
      new_password_confirmation: (state) => state.updatePasswordStore.new_password_confirmation,
    }),
    check_old_password: {
      get() {
        return this.getOld_password;
      },
      set(value) {
        this.setOld_password(value);
        this.v$.old_password.$touch();
      }
    },
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
  font-size: 13.5px;
  font-family: Russo One, fantasy, sans-serif;
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
  font-family: Russo One, fantasy, sans-serif;
}

.btn_save_password {
  width: 100px;
  height: 35px;
  margin-top: 10px;
}


</style>