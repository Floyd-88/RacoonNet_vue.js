<template>
  <form class="form_password" @submit.prevent="deleteUserProfile">
    <div class="wrapper_title_delete_profile">
      <p class="title_delete_profile">Если Вы уверены что хотите удалить свой профиль с сайта RaccoonNet, введи пароль
        указанный Вами при регистрации. Учтите, что данные будут потеряны безвозвратно</p>
    </div>

    <div class="wrapper_form_register_input">
      <div class="input-errors" v-for="(error, index) of v$.password.$errors" :key="index">
        <div class="error-msg" v-if="error.$message === 'Value is required'">
          Введите пароль указанный при регистрации
        </div>
      </div>
      <div class="wrapper_error_login" v-if="getErrorPassword">
        <p class="error_password">{{ getErrorPassword }}</p>
      </div>
      <div class="wrapper_form_change_password">
        <div class="wrapper_form_change_password_label">
          <label class="change_password_label" for="old_password">Ваш пароль:</label>
        </div>
        <div class="wrapper_form_change_password_input">
          <input class="form_register_input" id="old_password" type="password" placeholder="Укажите Ваш пароль"
            v-model="check_password" :class="{ invalid: (v$.password.$error) }" @input="setErrorPassword('')">
        </div>
      </div>
    </div>

    <div class="wrapper_save_password_btn">
      <UIbtn class="save_password_btn" type="submit" :disabled="v$.$invalid">
        Удалить профиль
      </UIbtn>

      <UIbtn class="save_password_btn" @click.prevent="setModuleDelete(false)">
        Отменить
      </UIbtn>
    </div>


  </form>
</template>

<script>
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { mapMutations, mapGetters, mapState, mapActions } from "vuex";

export default {
  name: "DeleteUser",

  setup() {
    return { v$: useVuelidate() }
  },

  validations: {
    password: { required },
  },

  methods: {
    ...mapMutations({

      setOld_password: "updatePasswordStore/setOld_password",
      setErrorPassword: "updatePasswordStore/setErrorPassword",

      setModuleDelete: "removeUserStore/setModuleDelete",

      setPassword: "removeUserStore/setPassword",

      setModulEditProfile: "editProfileStore/setModulEditProfile",
    }),
    ...mapActions({ removeUser: "removeUserStore/removeUser" }),

    deleteUserProfile() {
      if (this.getPassword) {
        let user = {
          password: this.getPassword
        }
        this.removeUser(user)
          .then(() => {
            this.setModulEditProfile(false)
            this.setModuleDelete(false)
            this.$router.push('/')
            this.setPassword("");
          })
          .catch((err) => {
            if (err.err) {
              this.setErrorPassword(JSON.stringify(err.err).slice(1, -1));
            }
            this.setPassword("");
            console.log("Удаление профиля завершилось с ошибкой: " + JSON.stringify(err));
          })
      }
    },

  },

  computed: {
    ...mapGetters({
      getErrorPassword: "updatePasswordStore/getErrorPassword",
      getPassword: "removeUserStore/getPassword",
    }),

    ...mapState({
      password: (state) => state.removeUserStore.password,
    }),

    check_password: {
      get() {
        return this.getPassword
      },
      set(value) {
        this.setPassword(value);
        this.v$.password.$touch();
      }
    },
  }
}
</script>


<style scoped>
.form_password {
  flex-direction: column;
  display: flex;
  align-items: center;
  margin: 10px;
  width: 500px;
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
  display: flex;
  flex-direction: column;
  margin-top: 10px;
}

.form_register_input {
  height: 30px;
  width: 100%;
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

.wrapper_title_delete_profile {
  display: flex;
}

.title_delete_profile {
  display: block;
  text-align: center;
  font-size: 18px;
  font-family: Russo One, fantasy, sans-serif;
}

/* МЕДИА-ЗАПРОСЫ */
@media (max-width: 761px) {
  .form_password {
    width: 340px;
  }

  .title_delete_profile[data-v-2aeb3746] {
    font-size: 15px;
  }
}
</style>