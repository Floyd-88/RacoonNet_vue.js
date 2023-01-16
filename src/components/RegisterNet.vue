<template>
  <h4 class="form_register_title">Регистрация</h4>
  <div class="wrapper_form_register">

    <form class="form_register">
      <div class="wrapper_form_register_name">
        <!--        <label class="form_label_register" for="name">Имя</label>-->
        <div class="wrapper_form_register_input">
          <input class="form_register_input" id="name" type="text" placeholder="Имя" v-model="name" required autofocus>
        </div>

        <!--        <label class="form_label_register" for="surname">Фамилия</label>-->
        <div class="wrapper_form_register_input form_register_surname ">
          <input class="form_register_input" id="surname" type="text" placeholder="Фамилия" v-model="surname" required>
        </div>
      </div>

      <!--      <label class="form_label_register" for="email">Электронная почта</label>-->
      <div class="wrapper_form_register_input">
        <input class="form_register_input" id="email" type="email" placeholder="Электронная почта" v-model="email"
               required>
      </div>

      <!--      <label class="form_label_register" for="password">Пароль</label>-->
      <div class="wrapper_form_register_input">
        <input class="form_register_input" id="password" type="password" placeholder="Пароль" v-model="password"
               required>
      </div>

      <!--      <label class="form_label_register" for="password-confirm">Подтвердите пароль</label>-->
      <div class="wrapper_form_register_input">
        <input class="form_register_input" id="password-confirm" type="password" placeholder="Подтвердите пароль"
               v-model="password_confirmation" required>
      </div>

      <label class="form_label_register" for="date_birth">Дата рождения</label>
      <div class="wrapper_form_register_date">
        <div class="form_register_date">
          <select class="select_form_register_date" v-model="selectedDay">
            <option class="option_form_register_date" disabled value="">день</option>
            <option class="option_form_register_date"
                    v-for="n in 31"
                    :key="n"
                    :value="n"
            >{{n}}
            </option>
          </select>
        </div>
        <div class="form_register_date form_register_date_month">
          <select class="select_form_register_date" v-model="selectedMonth">
            <option class="option_form_register_date" disabled value="">месяц</option>
            <option class="option_form_register_date"
                    v-for="(month, index) in arrMonth"
                    :key="month"
                    :value="index"
            >
              {{month}}
            </option>
          </select>
        </div>
        <div class="form_register_date">
          <select class="select_form_register_date" v-model="selectedYear">
            <option class="option_form_register_date" disabled value="">год</option>
            <option class="option_form_register_date"
                    v-for="year in years"
                    :key="year"
                    :value="year"
            >{{year}}
            </option>
          </select>
        </div>
      </div>

      <label class="form_label_register" for="gender">Ваш пол</label>
      <div class="wrapper_form_register_gender">
        <div class="form_register_gender">
          <select class="select_form_register_gender" v-model="selectedGender">
            <option class="option_form_register_gender" value="" disabled>пол</option>
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
        <button class="form_register_btn" type="submit" @click="handleSubmit">
          Зарегистрироваться
        </button>
      </div>
    </form>
  </div>
</template>

<script>
// import axios from "axios";

export default {
  name: "RegisterNet",
  props: ["nextUrl"],
  data() {
    return {
      name: "",
      surname: "",
      email: "",
      password: "",
      password_confirmation: "",
      is_admin: null,
      selectedDay: "",
      selectedMonth: "",
      selectedYear: "",
      arrMonth: ['Январь' , 'Февраль' , 'Март' , 'Апрель' , 'Май' , 'Июнь' , 'Июль' , 'Август' , 'Сентябрь' , 'Октябрь' , 'Ноябрь' , 'Декабрь' ],
      selectedGender: ""
    }
  },

  methods: {

    handleSubmit(e) {
      e.preventDefault();

      if (this.password === this.password_confirmation && this.password.length >= 8) {
        let user = {
          name: this.name,
          surname: this.surname,
          email: this.email,
          password: this.password,
          birthday: this.selectedYear +"-"+ this.selectedMonth +"-"+ this.selectedDay,
          selectedGender: this.selectedGender,
          is_admin: this.is_admin
        }
        this.$store.dispatch('register', user)
            .then(() => {
              this.$router.push('mypage');
            })
            .catch(err => console.log('Регистрация заершилась с ошибкой:' + err))
      } else {
            this.password = ""
            this.password_confirmation = ""
            return console.log('Повторный пароль не совпадает или менее 8 символов')
          }
      //   if (this.password === this.password_confirmation && this.password.length > 0)
      //   {
      //     let url = "http://localhost:8000/register"
      //
      //     if (this.is_admin === '1') {
      //       url = "http://localhost:8000/register-admin"
      //     }
      //     axios.post(url, {
      //       name: this.name,
      //       email: this.email,
      //       password: this.password,
      //       is_admin: this.is_admin
      //     })
      //         .then(response => {
      //           localStorage.setItem('user', JSON.stringify(response.data.user))
      //           localStorage.setItem('jwt', response.data.token)
      //           if (localStorage.getItem('jwt') != null){
      //             this.$emit('loggedIn')
      //             if(this.$route.params.nextUrl != null){
      //               this.$router.push(this.$route.params.nextUrl)
      //             }
      //             else{
      //               this.$router.push('/')
      //             }
      //           }
      //         })
      //         .catch(error => {
      //           console.error(error);
      //         });
      //   } else {
      //     this.password = ""
      //     this.password_confirmation = ""
      //     return alert("Passwords do not match")
      //   }
    }
  },
  computed: {
    years () {
      const year = new Date().getFullYear()
      return Array.from({length: year - 1900}, (value, index) => year - index)
    }
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
</style>