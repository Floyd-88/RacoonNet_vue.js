<template>
  <!--  Закрыть модальное окно-->
  <CloseModal @click="setModalWriteMessage(false)" />

  <h4 class="form_message_title">Написать сообщение</h4>

  <div class="wrapper_form_message">
    <form class="form_message" @submit.prevent="submitMessage()" novalidate>

      <div class="wrapper_message_user_content">
        <div class="message_user_ava">
          <img class="ava_message" :src="pathAva" alt="ava" ref="ava">
        </div>
        <div class="message_user_content">
          <div class="message_user_name">
            <p>{{ user.name + " " + user.surname }}</p>
          </div>
        </div>
      </div>

      <!--блок с сообщением-->
      <div class="wrapper_form_message_name">
        <div class="wrapper_form_message_input">
          <div class="input-errors" v-for="(error, index) of v$.messageUser.$errors" :key="index">
            <div class="error-msg" v-if="error.$message === 'Value is required'">
              Вы не можете отправить пустое сообщение
            </div>
          </div>

          <textarea class="new_message" id="name" placeholder="Введите сообщение" v-model="changeMessage"
            :class="{ invalid: (v$.messageUser.$error) }">
          </textarea>
        </div>
      </div>
      <!-- ---------------- -->

      <div class="wrapper_form_message_btn">
        <button class="form_message_btn" type="submit" :disabled="v$.$invalid">
          Отправить
        </button>
      </div>

    </form>

  </div>
</template>

<script>
import { useVuelidate } from "@vuelidate/core";
import { required, minLength } from "@vuelidate/validators";

import { mapActions, mapGetters, mapMutations, mapState } from "vuex";
import CloseModal from "@/components/UI/CloseModal";

// import SocketioService from "../../services/socketio.service"

export default {
  name: "WriteMessage",
  components: { CloseModal },

  props: {
    user: {
      type: Object,
      default: function () {
        return {}
      }
    }

  },

  setup() {
    return { v$: useVuelidate() }
  },

  data() {
    return {}
  },

  validations: {
    messageUser: {
      required,
      min: minLength(1),
    },
  },

  methods: {
    ...mapActions({
      WRITE_MESSAGE_USER: "messageStore/WRITE_MESSAGE_USER"
    }),
    ...mapMutations({
      setModalWriteMessage: "messageStore/setModalWriteMessage",
      setMessageUser: "messageStore/setMessageUser",
    }),

    //отправляем сообщение
    submitMessage() {

      //создаем имя комнаты
      // const CHAT_ROOM = "50";

      //отправляем сообщение в сокет
      // const message = this.getMessageUser;
      // SocketioService.sendMessage({ message, roomName: +this.$route.params.id  }, cb => {
      //   console.log(cb);
      // });

      //сохраянем сообщение в БД
      this.WRITE_MESSAGE_USER(this.$route.params.id);
    },
  },

  computed: {
    ...mapGetters({
      getMessageUser: "messageStore/getMessageUser",

    }),
    ...mapState({
      messageUser: (state) => state.messageStore.messageUser,

    }),

    //двухстороннее связывание + валидация
    changeMessage: {
      get() {
        return this.getMessageUser
      },
      set(value) {
        this.setMessageUser(value)
        this.v$.messageUser.$touch()
      }
    },

    pathAva() {
      try {
        return require(`../../assets/photo/${this.user.ava}`);
      } catch {
        return require(`../../assets/ava/ava_1.jpg`);
      }

    },
  }

}
</script>

<style scoped>
.form_message_title {
  display: flex;
  justify-content: center;
  margin: 15px;
  font-size: 23px;
  border-bottom: 2px solid;
  padding-bottom: 5px;
}

.wrapper_form_message {
  display: flex;
  justify-content: center;
  padding: 0 13px;
}

.form_message {
  width: 400px;
}

.wrapper_message_user_content {
  display: flex;
  margin-bottom: 10px;
}

/* .message_user_ava {} */

.ava_message {
  width: 40px;
  border-radius: 100%;
}

.message_user_content {
  padding-left: 10px;
  display: flex;
  align-items: center;
}

.message_user_name {
  margin-bottom: 10px;
  font-family: fantasy;
  font-size: 16px;
}

.new_message {
  width: 100%;
  min-height: 100px;
  resize: none;
}

.wrapper_form_message_name {
  display: flex;
  justify-content: space-around;
}

.wrapper_form_message_input {
  width: 100%;
  margin-bottom: 0px;
}

.wrapper_form_message_btn {
  display: flex;
  justify-content: flex-end;
  height: 35px;
  margin: 5px 0px 10px 5px;
}

.form_message_btn {
  width: 130px;
  height: 100%;
  border: 1px solid;
  border-radius: 5px;
  background: cornflowerblue;
  cursor: pointer;
  font-size: 23px;
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


