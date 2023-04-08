<template>
  <div v-if="getIsForgetPassword">
    <form @submit.prevent="handleSubmit" novalidate>

      <div class="form_login">
        <div class="input-errors" v-for="(error, index) of v$.email.$errors" :key="index">
          <div class="error-msg" v-if="error.$message === 'Value is not a valid email address'">
            Некорректный адрес электронной почты
          </div>
          <div class="error-msg" v-if="error.$message === 'Value is required'">
            Введите электронную почту указанную при регистрации
          </div>
        </div>
        <input class="form_login_input" id="email" type="text" placeholder="Введите электронный адрес"
          v-model="v$.email.$model" :class="{ invalid: (v$.email.$error) }">
      </div>

      <div class="form_login">
        <div class="input-errors" v-for="(error, index) of v$.password.$errors" :key="index">
          <div class="error-msg" v-if="error.$message === 'Value is required'">
            Введите пароль указанный при регистрации
          </div>
        </div>
        <input class="form_login_input" id="password" type="password" placeholder="Введите пароль"
          v-model="v$.password.$model" :class="{ invalid: (v$.password.$error) }">
      </div>
      <div class="wrapper_error_login" v-if="getErrorLogin">
        <p class="error_login">{{ getErrorLogin }}</p>
      </div>

      <div class="wrapper_form_login_btn">
        <button class="form_login_btn" type="submit" :disabled="v$.$invalid">
          Вход
        </button>
      </div>

      <div class="wrapper_form_not_password">
        <button class="form_not_password" @click.prevent="forgetPassword()">
          Забыли пароль?
        </button>
      </div>

      <div class="wrapper_form_login_btn">
        <button class="form_register_btn" @click.prevent="setModulRegister(true)">
          Создать новый аккаунт
        </button>
      </div>
    </form>
  </div>

  <div v-else>
    <form @submit.prevent="restorePassword()" novalidate>

      <div class="form_login">
        <p class="form_restore_text">Введите электронную почту указанную при регестрации</p>
        <div class="input-errors" v-for="(error, index) of v$.email.$errors" :key="index">
          <div class="error-msg" v-if="error.$message === 'Value is not a valid email address'">
            Некорректный адрес электронной почты
          </div>
          <div class="error-msg" v-if="error.$message === 'Value is required'">
            Введите электронную почту указанную при регистрации
          </div>
        </div>
        <input class="form_login_input" id="email" type="text" placeholder="Введите электронный адрес"
          v-model="v$.email.$model" :class="{ invalid: (v$.email.$error) }">
      </div>

      <div class="wrapper_error_login" v-if="getErrorLogin">
        <p class="error_login">{{ getErrorLogin }}</p>
      </div>
      <div class="wrapper_message_email" v-if="getMessageEmailPassword">
        <p class="message_email">{{ getMessageEmailPassword }}</p>
      </div>

      <div class="wrapper_form_login_btn">
        <button class="form_register_btn"
        :disabled="v$.$invalid"
          >
          Восстановить пароль
        </button>
      </div>

      <div class="wrapper_form_not_password">
        <button class="form_not_password" 
          @click.prevent="enterLogin()">
          Ввести логин и пароль
        </button>
      </div>
    </form>
  </div>
  
</template>

<script>
import { useVuelidate } from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'
import { mapActions, mapMutations, mapGetters } from "vuex"


export default {
  name: "LoginNet",

  setup() {
    return { v$: useVuelidate() }
  },

  data() {
    return {
      email: "",
      password: "",
    }
  },

  validations() {
    return {
      email: { required, email },
      password: { required },
    }
  },

  methods: {
    ...mapActions({ 
      login: "authorizationStore/login",
      RESSTORE_PASSWORD_USER: "authorizationStore/RESSTORE_PASSWORD_USER"
    }),

    ...mapMutations({
      setModulRegister: "registrationStore/setModulRegister",
      setErrorLogin: "authorizationStore/setErrorLogin",
      setIsForgetPassword: "authorizationStore/setIsForgetPassword",
      setMessageEmailPassword: "authorizationStore/setMessageEmailPassword"
    }),

    handleSubmit() {
      if (this.password.length > 0) {
        let email = this.email;
        let password = this.password;

        this.login({ email, password })
          .then((resp) => {
            if (resp.data.user.is_admin === 1) {
              this.$router.push('admin')
            } else {
              // window.location.href = `/${resp.data.user.userID}`;
              this.$router.push(`/id${resp.data.user.userID}`)
            }
          })
          .catch((err) => {
            let messageErr = err.response.data.err;
            this.setErrorLogin(JSON.stringify(messageErr).slice(1, -1))
            console.log("Авторизация завершилась с ошибкой: " + JSON.stringify(messageErr))
          }
          )
      }
    },

    forgetPassword() {
      this.email = "";
      this.password ="1";
      this.v$.$reset();
      this.setErrorLogin("");
      this.setMessageEmailPassword("");
      this.setIsForgetPassword(false)
    },

    enterLogin() {
      this.email = "";
      this.password ="";
      this.v$.$reset();
      this.setErrorLogin("");
      this.setMessageEmailPassword("");
      this.setIsForgetPassword(true)
    },

    restorePassword() {
      let email = this.email;
      this.RESSTORE_PASSWORD_USER({email})
      .then((resp) => {
        this.setMessageEmailPassword(resp.data);
          })
          .catch((err) => {
            let messageErr = err.response.data.err;
            this.setErrorLogin(JSON.stringify(messageErr).slice(1, -1));
            console.log("Авторизация завершилась с ошибкой: " + JSON.stringify(messageErr));
          }
          )
    }
  },

  computed: {
    ...mapGetters({
      getErrorLogin: "authorizationStore/getErrorLogin",
      getIsForgetPassword: "authorizationStore/getIsForgetPassword",
      getMessageEmailPassword: "authorizationStore/getMessageEmailPassword"
    }),

  }
}
</script>

<style scoped>
.form_login_input {
  height: 45px;
  min-width: 330px;
  border-radius: 4px;
  border: 1px solid;
  padding: 5px;
  margin: 5px;
}

.form_login {
  margin-bottom: 15px;
}

.form_label_login {
  padding-left: 5px;
}

.wrapper_form_login_btn {
  display: flex;
  justify-content: center;
  height: 45px;
  margin: 20px 5px 5px 5px;
}

.form_login_btn {
  width: 100%;
  height: 100%;
  border: 1px solid;
  border-radius: 5px;
  background: cornflowerblue;
  cursor: pointer;
  font-size: 28px;
  color: white;
  font-family: emoji;
}

.form_wrapper_not_password {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.wrapper_form_not_password {
  display: flex;
  justify-content: center;
}

.form_not_password {
  background: white;
  border: none;
  cursor: pointer;
  text-decoration: underline;
}

.form_register_btn {
  width: 70%;
  height: 100%;
  border: 1px solid;
  border-radius: 5px;
  background: forestgreen;
  cursor: pointer;
  font-size: 19px;
  color: white;
  font-family: emoji;
}

.error-msg {
  color: red;
  font-size: 14px;
}

.invalid {
  border: 1px solid red;
}

/* .wrapper_error_login {

} */

.error_login {
  color: red;
}

.message_email {
  font-weight: 600;
}

.form_restore_text {
  text-align: center;
  font-size: 16px;
  width: 340px;
  margin-bottom: 10px;
}
</style>