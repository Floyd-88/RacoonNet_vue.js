<template>
  <h4 class="form_register_title">Изменить личные данные</h4>
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
                 v-model="changeName"
                 :class="{invalid: (v$.name.$error)}">
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
                 v-model="changeSurname"
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
        <div class="error-msg" v-if="double_email">
          Пользователь с такой почтой уже зарегистрирован
        </div>
        <input class="form_register_input"
               id="email"
               type="email"
               placeholder="Электронная почта"
               v-model="changeEmail"
               :class="{invalid: (v$.email.$error)}"
        >
      </div>

      <!--вставить пароль-->
      <!--      <div class="wrapper_form_register_input">-->
      <!--        <div class="input-errors"-->
      <!--             v-for="(error, index) of v$.password.$errors"-->
      <!--             :key="index">-->
      <!--          <div class="error-msg" v-if="error.$message === 'This field should be at least 8 characters long'">-->
      <!--            Пароль должен состоять минимум из 8 символов-->
      <!--          </div>-->
      <!--        </div>-->
      <!--        <input class="form_register_input"-->
      <!--               id="password"-->
      <!--               type="password"-->
      <!--               placeholder="Пароль"-->
      <!--               v-model="v$.password.$model"-->
      <!--               :class="{invalid: (v$.password.$error)}"-->
      <!--               @change="checkPassword"-->
      <!--        >-->
      <!--      </div>-->

      <!--продублировать пароль-->
      <!--      <div class="wrapper_form_register_input">-->
      <!--        <div class="input-errors">-->
      <!--          <div class="error-msg" v-if="double_password">Пароли не свопадают</div>-->
      <!--        </div>-->
      <!--        <input class="form_register_input"-->
      <!--               id="password-confirm"-->
      <!--               type="password"-->
      <!--               placeholder="Подтвердите пароль"-->
      <!--               @change="checkPassword"-->
      <!--               v-model="v$.password_confirmation.$model"-->
      <!--               :class="{invalid: (v$.password_confirmation.$error)}"-->
      <!--        >-->
      <!--      </div>-->

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
               v-model="changeCountry"
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
               v-model="changeCity"
               :class="{invalid: (v$.city.$error)}"
        >
      </div>

      <!--указать дату родения-->
      <label class="form_label_register" for="date_birth">Дата рождения</label>

      <!--день-->
      <div class="wrapper_form_register_date">
        <div class="form_register_date">
          <select class="select_form_register_date"
                  v-model="changeDay">
            <option class="option_form_register_date"
                    disabled
                    value="">
              день
            </option>
            <option class="option_form_register_date"
                    v-for="n in 31"
                    :key="n"
                    :value="n"
            >{{ n }}
            </option>
          </select>
        </div>

        <!--месяц-->
        <div class="form_register_date form_register_date_month">
          <select class="select_form_register_date"
                  v-model="changeMonth">
            <option class="option_form_register_date"
                    disabled
                    value="">
              месяц
            </option>
            <option class="option_form_register_date"
                    v-for="(month, index) in arrMonth"
                    :key="month"
                    :value="index"
            >{{ month }}
            </option>
          </select>
        </div>

        <!--год-->
        <div class="form_register_date">
          <select class="select_form_register_date"
                  v-model="changeYear">
            <option class="option_form_register_date"
                    disabled
                    value="">
              год
            </option>
            <option class="option_form_register_date"
                    v-for="year in years"
                    :key="year"
                    :value="year"
            >{{ year }}
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
                  v-model="changeGender">
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

      <div class="wrapper_form_register_btn">
        <button class="form_register_btn"
                type="submit"
                :disabled="v$.$invalid"
        >
          Сохранить изменения
        </button>
      </div>
    </form>

  </div>
</template>

<script>
import {useVuelidate} from "@vuelidate/core";
import {required, email, minLength} from "@vuelidate/validators";

import {mapActions, mapGetters, mapMutations, mapState} from "vuex";

//функция для валидации имяни и фамилии
export function validName(first_name) {
  let validNamePattern = new RegExp("^[a-zA-Zа-яА-Я]+(?:[-'\\s][a-zA-Zа-яА-Я]+)*$");
  return validNamePattern.test(first_name);
}

export default {
  name: "editProfile",
  props: ["nextUrl"],

  setup() {
    return {v$: useVuelidate()}
  },

  data() {
    return {
      is_admin: null,
      arrMonth: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
      double_password: false,
      double_email: false,
    }
  },

  validations: {
      name: {
        required,
        min: minLength(2),
        name_validation: {
          $validator: validName,
          $message: 'Invalid Name'
        },
      },
      surname: {
        required, min: minLength(2), name_validation: {
          $validator: validName,
          $message: 'Invalid Name'
        }
      },
      email: {required, email},
      // password: {required, min: minLength(8)},
      // password_confirmation: {required},
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
  },

  methods: {
    ...mapActions({updateProfile: "authorizationStore/updateProfile"}),
    ...mapMutations({
      setName: "authorizationStore/setName",
      setSurname: "authorizationStore/setSurname",
      setEmail: "authorizationStore/setEmail",
      setCountry: "authorizationStore/setCountry",
      setCity: "authorizationStore/setCity",
      setYear: "authorizationStore/setYear",
      setMonth: "authorizationStore/setMonth",
      setDay: "authorizationStore/setDay",
      setGender: "authorizationStore/setGender",

      setUser: "authorizationStore/setUser",
      setNotShowModalWindow: "modalStore/setNotShowModalWindow",
    }),

    handleSubmit() {
      this.setUser()
      this.setNotShowModalWindow();
      // if () {
        let user = {
          name: this.getEditingUser.name.charAt(0).toUpperCase() + this.name.slice(1),
          surname: this.getEditingUser.surname.charAt(0).toUpperCase() + this.surname.slice(1),
          email: this.getEditingUser.email,
          // password: this.password,
          day: this.getEditingUser.day_user,
          month: this.getEditingUser.month_user,
          year: this.getEditingUser.year_user,
          selectedGender: this.selectedGender,
          country: this.getEditingUser.country.charAt(0).toUpperCase() + this.country.slice(1),
          city: this.getEditingUser.city.charAt(0).toUpperCase() + this.city.slice(1),
          // is_admin: this.is_admin
        }
        this.updateProfile(user)
            .then(() => {
              this.$router.push('mypage');
            })
            .catch((err) => {
              if (err === "Пользователь с такой почтой уже зарегистрирован") {
                this.double_email = true;
              }
              console.log('Регистрация завершилась с ошибкой:' + JSON.stringify(err));
            })
      // }
      // else {
      //   this.password = ""
      //   this.password_confirmation = ""
      //   return console.log('Повторный пароль не совпадает или менее 8 символов');
      // }
    },

    //проверка пароля и второго пароля на свопадение
    // checkPassword() {
    //   this.double_password = this.password !== this.password_confirmation;
    // },
  },

  computed: {
    ...mapGetters({getEditingUser: "authorizationStore/getEditingUser"}),
    ...mapState({
      name: (state) => state.authorizationStore.editingUser.name,
      surname: (state) => state.authorizationStore.editingUser.surname,
      email: (state) => state.authorizationStore.editingUser.email,
      country: (state) => state.authorizationStore.editingUser.country,
      city: (state) => state.authorizationStore.editingUser.city,
      selectedYear: (state) => state.authorizationStore.editingUser.year_user,
      selectedMonth: (state) => state.authorizationStore.editingUser.month_user,
      selectedDay: (state) => state.authorizationStore.editingUser.day_user,
      selectedGender: (state) => state.authorizationStore.editingUser.selectedGender
    }),

    changeName: {
      get() {
        return this.getEditingUser.name
      },
      set(value) {
        this.setName(value)
        this.v$.name.$touch()
      }
    },
    changeSurname: {
      get() {
        return this.getEditingUser.surname
      },
      set(value) {
        this.setSurname(value)
        this.v$.surname.$touch()
      }
    },
    changeEmail: {
      get() {
        return this.getEditingUser.email
      },
      set(value) {
        this.setEmail(value)
        this.v$.email.$touch()
      }
    },
    changeCountry: {
      get() {
        return this.getEditingUser.country
      },
      set(value) {
        this.setCountry(value)
        this.v$.country.$touch()
      }
    },
    changeCity: {
      get() {
        return this.getEditingUser.city
      },
      set(value) {
        this.setCity(value)
        this.v$.city.$touch()
      }
    },
    changeDay: {
      get() {
        return this.getEditingUser.day_user
      },
      set(value) {
        this.setDay(value)
      }
    },
    changeMonth: {
      get() {
        return this.getEditingUser.month_user
      },
      set(value) {
        this.setMonth(value)
      }
    },
    changeYear: {
      get() {
        return this.getEditingUser.year_user
      },
      set(value) {
        this.setYear(value)
      }
    },
    changeGender: {
      get() {
        return this.getEditingUser.selectedGender
      },
      set(value) {
        this.setGender(value)
      }
    },


    //в поле option доступны годы от 1900 до текущего
    years() {
      const year = new Date().getFullYear()
      return Array.from({length: year - 1900}, (value, index) => year - index)
    },
  },

  watch: {
    //при вводе в поле email сбрасывается ошибка "такой пользователь уже существует"
    email() {
      this.double_email = false;
    },

  }
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

.option_form_register_date {

}

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

.option_form_register_gender {

}

.wrapper_form_register_btn {
  display: flex;
  justify-content: center;
  height: 45px;
  margin: 20px 5px 5px 5px;
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


