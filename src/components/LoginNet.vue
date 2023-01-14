<template>
  <div>
    <h4>Login</h4>
    <form>
      <label for="email" >E-Mail Address</label>
      <div>
        <input id="email" type="email" v-model="email" required autofocus>
      </div>
      <div>
        <label for="password" >Password</label>
        <div>
          <input id="password" type="password" v-model="password" required>
        </div>
      </div>
      <div>
        <button type="submit" @click="handleSubmit">
          Login
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "LoginNet",

    data(){
      return {
        email : "",
        password : ""
      }
    },

  methods: {

    handleSubmit(e){
      e.preventDefault();
      if (this.password.length > 0) {
        // console.log('ok')
        axios.post('http://localhost:8000/login', {
          email: this.email,
          password: this.password
        })
            .then( (response) => {
              let is_admin = response.data.user.is_admin
              localStorage.setItem('user',JSON.stringify(response.data.user))
              localStorage.setItem('jwt',response.data.token)
              if (localStorage.getItem('jwt') != null){
                // this.$emit('loggedIn')
                console.log(this.$route.params.nextUrl);
                if(this.$route.params.nextUrl != null){
                  this.$router.push(this.$route.params.nextUrl)
                }
                else {
                  if(is_admin === 1){
                    this.$router.push('admin')
                  }
                  else {
                    this.$router.push('mypage')
                  }
                }
              }
            })
            .catch(function (error) {
              console.error(error.response);
            });
      }
    }
  }

      // login: function () {
      //   let email = this.email
      //   let password = this.password
      //   this.$store.dispatch('login', { email, password })
      //       .then(() => this.$router.push('/'))
      //       .catch(err => console.log(err))
      // },
  // },

}
</script>

<style scoped>

</style>