<template>
  <!--  Закрыть модальное окно-->
  <CloseModal @click="setModulRegister(false)"/>

  <h4 class="form_register_title">Регистрация</h4>

  <div class="wrapper_form_register">

    <form class="form_register"
          @submit.prevent="handleSubmit"
          novalidate>

      <div class="wrapper_form_register_name">

        <!--вставить имя-->
        <div class="wrapper_form_register_input">
          <div class="input-errors"
               v-for="(error, index) of v$.name.$errors"
               :key="index">
            <div class="error-msg"
                 v-if="error.$message === 'Value is required'">
              Необходимо указать корректное имя
            </div>
          </div>
          <input class="form_register_input"
                 id="name"
                 type="text"
                 placeholder="Имя"
                 autofocus
                 v-model="registerName"
                 :class="{invalid: (v$.name.$error)}"
          >
        </div>

        <!--вставить фамилию-->
        <div class="wrapper_form_register_input form_register_surname ">
          <div class="input-errors"
               v-for="(error, index) of v$.surname.$errors"
               :key="index">
            <div class="error-msg"
                 v-if="error.$message === 'Value is required'">
              Необходимо указать корректную фамилию
            </div>
          </div>
          <input class="form_register_input"
                 id="surname"
                 type="text"
                 placeholder="Фамилия"
                 v-model="registerSurname"
                 :class="{invalid: (v$.surname.$error)}">
        </div>
      </div>

      <!--вставить почту-->
      <div class="wrapper_form_register_input">
        <div class="input-errors"
             v-for="(error, index) of v$.email.$errors"
             :key="index">
          <div class="error-msg"
               v-if="error.$message === 'Value is not a valid email address'">
            Некорректный адрес электронной почты
          </div>
        </div>
        <div class="error-msg" v-if="getDouble_email">
          Пользователь с такой почтой уже зарегистрирован
        </div>
        <input class="form_register_input"
               id="email"
               type="email"
               placeholder="Электронная почта"
               @input="setDouble_email(false)"
               v-model="registerEmail"
               :class="{invalid: (v$.email.$error)}"
        >
      </div>

      <!--вставить пароль-->
      <div class="wrapper_form_register_input">
        <div class="input-errors"
             v-for="(error, index) of v$.password.$errors"
             :key="index">
          <div class="error-msg" v-if="error.$message === 'This field should be at least 8 characters long'">
            Пароль должен состоять минимум из 8 символов
          </div>
        </div>
        <input class="form_register_input"
               id="password"
               type="password"
               placeholder="Пароль"
               v-model="registerPassword"
               :class="{invalid: (v$.password.$error)}"
               @change="setCheckPassword"
               >
      </div>

      <!--продублировать пароль-->
      <div class="wrapper_form_register_input">
        <div class="input-errors">
          <div class="error-msg" v-if="getDouble_password">Пароли не свопадают</div>
        </div>
        <input class="form_register_input"
               id="password-confirm"
               type="password"
               placeholder="Подтвердите пароль"
               @input="setCheckPassword"
               v-model="registerPasswordConfirmation"
               :class="{invalid: (v$.password_confirmation.$error)}"
        >
      </div>

      <!--вставить страну-->
      <div class="wrapper_form_register_input">
        <div class="input-errors"
             v-for="(error, index) of v$.country.$errors"
             :key="index">
          <div class="error-msg"
               v-if="error.$message === 'Value is required'">
            Необходимо указать корректную страну
          </div>
        </div>
        <input class="form_register_input"
               id="country"
               type="text"
               placeholder="Страна"
               v-model="registerCountry"
               :class="{invalid: (v$.country.$error)}"
        >
      </div>

      <!--вставить город-->
      <div class="wrapper_form_register_input">
        <div class="input-errors"
             v-for="(error, index) of v$.city.$errors"
             :key="index">
          <div class="error-msg"
               v-if="error.$message === 'Value is required'">
            Необходимо указать корректный населенный пункт
          </div>
        </div>
        <input class="form_register_input"
               id="city"
               type="text"
               placeholder="Населенный пункт"
               v-model="registerCity"
               :class="{invalid: (v$.city.$error)}"
        >
      </div>

      <!--указать дату рождения-->
      <label class="form_label_register" for="date_birth">Дата рождения</label>
      <div class="wrapper_form_register_date">
        <div class="form_register_date">

          <!--день-->
          <select class="select_form_register_date"
                  v-model="registerSelectedDay">
            <option class="option_form_register_date"
                    disabled
                    value="">
              день
            </option>
            <option class="option_form_register_date"
                    v-for="n in 31"
                    :key="n"
                    :value="n"
            >{{n}}
            </option>
          </select>
        </div>

         <!--месяц-->
        <div class="form_register_date form_register_date_month">
          <select class="select_form_register_date"
                  v-model="registerSelectedMonth">
            <option class="option_form_register_date"
                    disabled
                    value="">
              месяц
            </option>
            <option class="option_form_register_date"
                    v-for="(month, index) in getArrMonth"
                    :key="month"
                    :value="index"
            >{{month}}
            </option>
          </select>
        </div>

        <!--год-->
        <div class="form_register_date">
          <select class="select_form_register_date"
                  v-model="registerSelectedYear">
            <option class="option_form_register_date"
                    disabled
                    value="">
              год
            </option>
            <option class="option_form_register_date"
                    v-for="year in years"
                    :key="year"
                    :value="year"
            >{{year}}
            </option>
          </select>
        </div>
      </div>

      <!--указать пол-->
      <label class="form_label_register"
             for="gender">
        Ваш пол
      </label>
      <div class="wrapper_form_register_gender">
        <div class="form_register_gender">

          <select class="select_form_register_gender"
                  v-model="registerSelectedGender">
            <option class="option_form_register_gender"
                    value=""
                    disabled
            > пол
            </option>
            <option class="option_form_register_gender" value="man">Мужской</option>
            <option class="option_form_register_gender" value="woman">Женский</option>
          </select>

        </div>
      </div>

      <!--      <label class="form_label_register" for="password-confirm">Is this an administrator account?</label>-->
      <!--      <div>-->
      <!--        <select v-model="is_admin">-->
      <!--          <option value=1>Yes</option>-->
      <!--          <option value=0>No</option>-->
      <!--        </select>-->
      <!--      </div>-->

      <div class="wrapper_form_register_btn">
        <button class="form_register_btn"
                type="submit"
                :disabled="v$.$invalid && !getDouble_password && getUserRegister.selectedDay && getUserRegister.selectedMonth && getUserRegister.selectedYear && getUserRegister.selectedGender">
          Зарегистрироваться
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import {useVuelidate} from "@vuelidate/core";
import {required, email, minLength} from "@vuelidate/validators";
import {mapActions, mapMutations, mapGetters, mapState} from "vuex";
import CloseModal from "@/components/UI/CloseModal";

//функция для валидации имяни и фамилии
export function validName(name) {
  let validNamePattern = new RegExp("^[a-zA-Zа-яА-Я]+(?:[-'\\s][a-zA-Zа-яА-Я]+)*$");
  return validNamePattern.test(name);
}

export default {
  name: "RegisterNet",
  components: {CloseModal},
  props: ["nextUrl"],

  setup() {
    return {v$: useVuelidate()}
  },

  data() {
    return {}
  },

  validations() {
    return {
      name: {
        required, min: minLength(2), name_validation: {
          $validator: validName,
          $message: 'Invalid Name'
        }
      },
      surname: {
        required, min: minLength(2), name_validation: {
          $validator: validName,
          $message: 'Invalid Name'
        }
      },
      email: {required, email},
      password: {required, min: minLength(8)},
      password_confirmation: {required},
      country: {
        required, min: minLength(2), name_validation: {
          $validator: validName,
          $message: 'Invalid Name'
        }
      },
      city: {
        required, min: minLength(2), name_validation: {
          $validator: validName,
          $message: 'Invalid Name'
        }
      },
      selectedDay: {required},
      selectedMonth: {required},
      selectedYear: {required},
      selectedGender: {required},
    }
  },

  methods: {
    ...mapActions({register: "registrationStore/register"}),

    ...mapMutations({
      //закрыть модальное окно с регистрацией
      setModulRegister: "registrationStore/setModulRegister",

      //проверка почты на существование такого пользователя
      setDouble_email: "registrationStore/setDouble_email",

      //проверка дублирующего пароля
      setCheckPassword: "registrationStore/setCheckPassword",

      //двухстроннее связывание v-model
      setUserRegisterName: "registrationStore/setUserRegisterName",
      setUserRegisterSurname: "registrationStore/setUserRegisterSurname",
      setUserRegisterEmail: "registrationStore/setUserRegisterEmail",
      setUserRegisterCountry: "registrationStore/setUserRegisterCountry",
      setUserRegisterPassword: "registrationStore/setUserRegisterPassword",
      setUserRegisterPasswordConfirmation: "registrationStore/setUserRegisterPasswordConfirmation",
      setUserRegisterCity: "registrationStore/setUserRegisterCity",
      setUserRegisterYear: "registrationStore/setUserRegisterYear",
      setUserRegisterMonth: "registrationStore/setUserRegisterMonth",
      setUserRegisterDay: "registrationStore/setUserRegisterDay",
      setUserRegisterGender: "registrationStore/setUserRegisterGender",
    }),

    //регистрация пользователя
    handleSubmit() {
      if (this.getUserRegister.password === this.getUserRegister.password_confirmation && this.getUserRegister.password.length >= 8) {
        let user = {
          name: this.getUserRegister.name.charAt(0).toUpperCase() + this.getUserRegister.name.slice(1),
          surname: this.getUserRegister.surname.charAt(0).toUpperCase() + this.getUserRegister.surname.slice(1),
          email: this.getUserRegister.email,
          password: this.getUserRegister.password,
          year: this.getUserRegister.selectedYear,
          month: this.getUserRegister.selectedMonth,
          day: this.getUserRegister.selectedDay,
          selectedGender: this.getUserRegister.selectedGender,
          country: this.getUserRegister.country.charAt(0).toUpperCase() + this.getUserRegister.country.slice(1),
          city: this.getUserRegister.city.charAt(0).toUpperCase() + this.getUserRegister.city.slice(1),
          is_admin: this.getUserRegister.is_admin
        }
        this.register(user)
            .then((resp) => {
              this.setModulRegister(false)
              // window.location.href = '/';
              this.$router.push(`/id${resp.data.user.userID}`)
              // this.$router.push('mypage');
            })
            .catch((err) => {
              if(err === "Пользователь с такой почтой уже зарегистрирован") {
                this.setDouble_email(true);
              }
              console.log('Регистрация завершилась с ошибкой:' + JSON.stringify(err));
            })
      } else {
        this.setUserRegisterPassword("");
        this.setUserRegisterPasswordConfirmation("")
        return console.log('Повторный пароль не совпадает или менее 8 символов');
      }
    },
  },

  computed: {
    ...mapGetters({
      getUserRegister: "registrationStore/getUserRegister",
      getDouble_email: "registrationStore/getDouble_email",
      getDouble_password: "registrationStore/getDouble_password",
      getArrMonth: "registrationStore/getArrMonth",
      years: "registrationStore/years"
    
    }),

    ...mapState({
      name: (state) => state.registrationStore.userRegister.name,
      surname: (state) => state.registrationStore.userRegister.surname,
      email: (state) => state.registrationStore.userRegister.email,
      password: (state) => state.registrationStore.userRegister.password,
      password_confirmation: (state) => state.registrationStore.userRegister.password_confirmation,
      country: (state) => state.registrationStore.userRegister.country,
      city: (state) => state.registrationStore.userRegister.city,
      selectedYear: (state) => state.registrationStore.userRegister.selectedYear,
      selectedMonth: (state) => state.registrationStore.userRegister.selectedMonth,
      selectedDay: (state) => state.registrationStore.userRegister.selectedDay,
      selectedGender: (state) => state.registrationStore.userRegister.selectedGender
    }),

    //двухстороннее связывние со store
    registerName: {
      get() {
        return this.getUserRegister.name
      },
      set(value) {
        this.setUserRegisterName(value)
        this.v$.name.$touch()
      }
    },
    registerSurname: {
      get() {
        return this.getUserRegister.surname
      },
      set(value) {
        this.setUserRegisterSurname(value)
        this.v$.surname.$touch()
      }
    },
    registerEmail: {
      get() {
        return this.getUserRegister.email
      },
      set(value) {
        this.setUserRegisterEmail(value)
        this.v$.email.$touch()
      }
    },
    registerPassword: {
      get() {
        return this.getUserRegister.password
      },
      set(value) {
        this.setUserRegisterPassword(value)
        this.v$.password.$touch()
      }
    },
    registerPasswordConfirmation: {
      get() {
        return this.getUserRegister.password_confirmation
      },
      set(value) {
        this.setUserRegisterPasswordConfirmation(value)
        this.v$.password_confirmation.$touch()
      }
    },
    registerCountry: {
      get() {
        return this.getUserRegister.country
      },
      set(value) {
        this.setUserRegisterCountry(value)
        this.v$.country.$touch()
      }
    },
    registerCity: {
      get() {
        return this.getUserRegister.city
      },
      set(value) {
        this.setUserRegisterCity(value)
        this.v$.city.$touch()
      }
    },
    registerSelectedDay: {
      get() {
        return this.getUserRegister.selectedDay
      },
      set(value) {
        this.setUserRegisterDay(value)
      }
    },
    registerSelectedMonth: {
      get() {
        return this.getUserRegister.selectedMonth
      },
      set(value) {
        this.setUserRegisterMonth(value)
      }
    },
    registerSelectedYear: {
      get() {
        return this.getUserRegister.selectedYear
      },
      set(value) {
        this.setUserRegisterYear(value)
      }
    },
    registerSelectedGender: {
      get() {
        return this.getUserRegister.selectedGender
      },
      set(value) {
        this.setUserRegisterGender(value)
      }
    },
  },
}
</script>

<style scoped>
.form_register_title {
  display: flex;
  justify-content: center;
  margin: 15px;
  font-size: 23px;
  border-bottom: 2px solid;
  padding-bottom: 5px;
}

.wrapper_form_register {
  display: flex;
  justify-content: center;
  width: 450px;
  padding: 0 13px;
}

.form_register {
  width: 100%;
}

.wrapper_form_register_name {
  display: flex;
  justify-content: space-around;
}

.wrapper_form_register_input {
  width: 100%;
  margin-bottom: 15px;
}

.form_register_surname {
  margin-left: 5px;
}

.form_label_register {
  font-size: 14px;
}

.form_register_input {
  /*margin: 5px;*/
  height: 40px;
  width: 100%;
  /*padding-left: 3px;*/
}

.wrapper_form_register_date {
  display: flex;
  margin-bottom: 10px;
}

.form_register_date {
  width: 100%;
  height: 27px;
}

.select_form_register_date {
  width: 100%;
  height: 100%;
}

.form_register_date_month {
  margin: 0 5px;
}

/* .option_form_register_date {

} */

.wrapper_form_register_gender {
  margin-bottom: 15px;
}

.form_register_gender {
  height: 27px;
}

.select_form_register_gender {
  height: 100%;
  width: 32%;
}

/* .option_form_register_gender {

} */

.wrapper_form_register_btn {
  display: flex;
  justify-content: center;
  height: 45px;
  margin: 20px 5px 15px 5px;
}

.form_register_btn {
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
.error-msg {
  color: red;
  font-size: 14px;
}
.invalid {
  border: 1px solid red;
}
</style>