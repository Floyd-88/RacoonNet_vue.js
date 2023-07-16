<template>
  <NavigationNetEnter />
  <div class="wrapper_main">
    <template v-if="getModulRegister">
      <UImodal>
        <RegisterNet />
      </UImodal>
    </template>


    <div class="wrapper_mainPage">
      <div class="wrapper_title">
        <h2 class=" name_net_title">
          RacсoonNet
        </h2>
        <h3 class="welcome_title">Добро пожаловать в социальную сеть для общения со своими друзьями и родными</h3>
      </div>
      <div class="wrapper_form">
        <LoginNet />
      </div>
    </div>

  </div>
</template>

<script>
import SocketioService from "../services/socketio.service";
import { mapGetters } from 'vuex';
export default {
  name: "MainPage",
  created() {
    SocketioService.disconnect();
  },
  computed: {
    ...mapGetters({ getModulRegister: "registrationStore/getModulRegister" })
  },
}
</script>

<style scoped>
.wrapper_main {
  padding: 120px 20px 5px;
}

.wrapper_mainPage {
  display: flex;
  flex-direction: row;
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
  opacity: 0.7;
  font-family: Pattaya-Regular, cursive, sans-serif;
}

.name_net_title {
  margin-bottom: 10px;
  font-size: 50px;
  padding-top: 10px;
  font-family: Russo One, fantasy, sans-serif;
  color: cornflowerblue;
}

.wrapper_form {
  padding: 20px;
  border-radius: 5px;
  background: white;
  box-shadow: 0px 5px 10px 0px rgb(0 0 0 / 50%);
}

/* МЕДИА-ЗАПРОСЫ */
@media (max-width: 761px) {
  .wrapper_main {
    padding: 105px 0px 5px;
  }

  .name_net_title {
    display: none;
  }

  .wrapper_mainPage {
    flex-direction: column;
    margin-top: 0;
  }

  .welcome_title {
    text-align: center;
    font-size: 22px;

  }

  .wrapper_form {
    width: 350px;
  }
}</style>