<template>
  <div>
    <form>
      <label class="form_label_login" for="email" >E-Mail Address</label>
      <div class="form_login">
        <input class="form_login_input" id="email" type="email"
               placeholder="Введите электронный адрес"
               required autofocus
               v-model="email" >
      </div>
      <div>
        <label class="form_label_login" for="password" >Password</label>
        <div class="form_login">
          <input class="form_login_input" id="password" type="password"
                 placeholder="Введите пароль"
                 required
                 v-model="password" >
        </div>
      </div>
      <div class="wrapper_form_login_btn">
        <button class="form_login_btn" type="submit" @click="handleSubmit">
          Вход
        </button>
      </div>
    </form>
  </div>
</template>

<script>
// import axios from "axios";

export default {
  name: "LoginNet",

  data() {
    return {
      email: "",
      password: ""
    }
  },

  methods: {

    handleSubmit(e) {
      e.preventDefault();

      let email = this.email
      let password = this.password
      this.$store.dispatch('login', {email, password})
          .then(() => this.$router.push('mypage'))
          .catch(err => console.log(err))


      //   if (this.password.length > 0) {
      //     axios.post('http://localhost:8000/login', {
      //       email: this.email,
      //       password: this.password
      //     })
      //         .then( (response) => {
      //           let is_admin = response.data.user.is_admin

      //           localStorage.setItem('user',JSON.stringify(response.data.user))
      //           localStorage.setItem('jwt',response.data.token)

      //           if (localStorage.getItem('jwt') != null){
      //             // this.$emit('loggedIn')
      //             console.log(this.$route.params.nextUrl);
      //             if(this.$route.params.nextUrl != null){
      //               this.$router.push(this.$route.params.nextUrl)
      //             }
      //             else {
      //               if(is_admin === 1){
      //                 this.$router.push('admin')
      //               }
      //               else {
      //                 this.$router.push('mypage')
      //               }
      //             }
      //           }
      //         })
      //         .catch(function (error) {
      //           console.error(error.response);
      //         });
      //   }
      // }
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
  color: aliceblue;
  font-family: emoji;
}
</style>