<template>
  <div>

    <UImodal
        :show-modal="showModal"
        @setNotShowModalWindow="setNotShowModalWindow"
    >
      <RegisterNet/>
    </UImodal>

    <div class="wrapper_mainPage">

      <div class="wrapper_title">
        <h2 class="welcome_title"><span class="name_net_title">RacсoonNet</span>Добро пожаловать в социальную сеть для общения со своими близкими </h2>
      </div>

      <div class="wrapper_form">
        <LoginNet @showModalTrue = "showModalTrue"/>
      </div>

    </div>

  </div>

</template>

<script>

export default {
  name: "MainPage",
  data() {
    return {
      showModal: false,
    }
  },

  methods: {
    showModalTrue: function () {
      this.showModal = true;
    },
    setNotShowModalWindow: function () {
      this.showModal = false;
    }
  }
}
</script>

<style scoped>
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