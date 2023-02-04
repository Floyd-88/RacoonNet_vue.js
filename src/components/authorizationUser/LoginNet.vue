<template>
  <div>
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
        <input class="form_login_input" id="email" type="text" placeholder="Введите электронный адрес" autofocus
          v-model="autorizationEmail" :class="{ invalid: (v$.email.$error) }">
      </div>

      <div class="form_login">
        <div class="input-errors" v-for="(error, index) of v$.password.$errors" :key="index">
          <div class="error-msg" v-if="error.$message === 'Value is required'">
            Введите пароль указанный при регистрации
          </div>
        </div>
        <input class="form_login_input" id="password" type="password" placeholder="Введите пароль"
          v-model="autorizationPassword" :class="{ invalid: (v$.password.$error) }">
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
        <button class="form_not_password" @click="$router.push('/')">
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
</template>

<script>
import { useVuelidate } from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'
import { mapActions, mapMutations, mapGetters, mapState } from "vuex"


export default {
  name: "LoginNet",

  setup() {
    return { v$: useVuelidate() }
  },

  data() {
    return {}
  },

  validations() {
    return {
      email: { required, email },
      password: { required },
    }
  },

  methods: {
    ...mapActions({ login: "authorizationStore/login" }),
    ...mapMutations({
      setModulRegister: "registrationStore/setModulRegister",
      setErrorLogin: "authorizationStore/setErrorLogin",
      setEmail: "authorizationStore/setEmail",
      setPassword: "authorizationStore/setPassword",
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
              this.$router.push('mypage')
            }
          })
          .catch((err) => {
            if (err.err) {
              this.setErrorLogin(JSON.stringify(err.err).slice(1, -1))
            }
            console.log("Авторизация завершилась с ошибкой: " + JSON.stringify(err))
          })
      }
    }
  },

  computed: {
    ...mapGetters({
      getErrorLogin: "authorizationStore/getErrorLogin",
      getEmail: "authorizationStore/getEmail",
      getPassword: "authorizationStore/getPassword",
    }),

    ...mapState({
      email: state => state.authorizationStore.email,
      password: state => state.authorizationStore.password,
    }),

    autorizationEmail: {
      get() {
        return this.getEmail
      },
      set(value) {
        this.setEmail(value);
        this.v$.email.$touch();
      }
    },

    autorizationPassword: {
      get() {
        return this.getPassword
      },
      set(value) {
        this.setPassword(value);
        this.v$.password.$touch();
      }
    }
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
</style>