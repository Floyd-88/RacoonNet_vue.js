<template>
  <div class="wrapper_main">
    <template v-if="getModulRegister">
      <UImodal> <RegisterNet/> </UImodal>
    </template>
   

    <div class="wrapper_mainPage">
      <div class="wrapper_title">
        <h2 class="welcome_title">
          <span class="name_net_title">RacсoonNet</span>
          Добро пожаловать в социальную сеть для общения со своими близкими
        </h2>
      </div>
      <div class="wrapper_form"> <LoginNet/> </div>
    </div>

  </div>

</template>

<script>
import SocketioService from "../services/socketio.service";
import { mapGetters } from 'vuex';
export default {
  name: "MainPage",
  data() {
    return {}
  },

  created() {
    SocketioService.disconnect();
    console.log("disconnected")
  },

computed: {
  ...mapGetters({getModulRegister: "registrationStore/getModulRegister"})
}
  

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
</style>