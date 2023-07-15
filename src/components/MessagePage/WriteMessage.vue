<template>
  <!--  Закрыть модальное окно-->
  <CloseModal @click="closeModalWriteMessage()" />

  <h4 class="form_message_title">Написать сообщение</h4>

  <div class="wrapper_form_message">
    <form class="form_message" @submit.prevent="submitMessage()" novalidate>

      <div class="wrapper_message_user_content">
        <div class="message_user_ava">
          <div class="ava_message">
            <UIAva :ava="this.user.ava"/>
          </div>
          <!-- <img class="ava_message" :src="pathAva" alt="ava" ref="ava"> -->
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

            <div class="error-msg" v-else-if="error.$message === 'The maximum length allowed is 10000'">
              Вы превысили допустимое количество символов
            </div>
          </div>

          <textarea class="new_message" id="name" placeholder="Введите сообщение" v-model="changeMessage"
            :class="{ invalid: (v$.messageUser.$error) }">
          </textarea>
        </div>
      </div>
      <!-- ---------------- -->

      

      <div class="wrapper_form_message_btn">
          <UIbtn class="btn_addPhoto" @click.prevent="addPostPhoto()"></UIbtn>

        <button class="form_message_btn" type="submit" :disabled="v$.$invalid">
          Отправить
        </button>
      </div>

    </form>

  </div>
</template>

<script>
import { useVuelidate } from "@vuelidate/core";
import { required, minLength, maxLength } from "@vuelidate/validators";
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
      max: maxLength(10000),
    },
  },
  methods: {
    ...mapActions({
      WRITE_MESSAGE_USER: "messageStore/WRITE_MESSAGE_USER"
    }),
    ...mapMutations({
      setModalWriteMessage: "messageStore/setModalWriteMessage",
      setMessageUser: "messageStore/setMessageUser",
      setIsModalLoadPhoto: "loadPhotoStore/setIsModalLoadPhoto",
      setIsLoadPhotoMessage: "loadPhotoStore/setIsLoadPhotoMessage",
    }),

    closeModalWriteMessage() {
      this.setModalWriteMessage(false);
      this.setMessageUser("");

    },

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
      this.WRITE_MESSAGE_USER({ addresseeID: this.user.userID });
    },

    addPostPhoto() {
            this.setIsLoadPhotoMessage(true);
            this.setIsModalLoadPhoto(true);
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
  }
}
</script>

<style scoped>
.form_message_title {
  display: flex;
  justify-content: center;
  margin: 15px;
  font-size: 21px;
  border-bottom: 2px solid;
  padding-bottom: 5px;
  font-family: Russo One, fantasy, sans-serif;
  font-weight: 400;  
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
  font-family: Russo One, fantasy, sans-serif;
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
    font-size: 19px;
    color: white;
    font-family: Russo One, fantasy, sans-serif;
    letter-spacing: 1px;
}
.error-msg {
  color: red;
  font-size: 14px;
}
.invalid {
  border: 1px solid red;
}

.btn_addPhoto {
  background-image: url(http://localhost:8080/img/camera_4.a75f9837.svg);
    background-size: 45%;
    background-repeat: no-repeat;
    width: 60px;
    background-position: center;
    margin-right: 10px;
    height: 90%;
}

@media (max-width: 761px) {

  .form_message {
  width: 330px;
}
}

</style>

