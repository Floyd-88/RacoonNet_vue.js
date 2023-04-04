<template>
    <!--  Закрыть модальное окно-->
   <CloseModal @click="setIsModalFeedBack(false)"/>

    <h4 class="form_feedBack_title">Форма обратной связи</h4>

    <div class="wrapper_form_feedBack">

        <form class="form_feedBack" @submit.prevent="feedBackSubmit" novalidate>

            <div class="wrapper_form_feedBack_name">

                <!--тема обращения-->
                <label class="form_label_feedBack" for="cause">
                    Выберите причину вашего обращения
                </label>
                <div class="wrapper_form_feedBack_cause">
                    <div class="form_feedBack_cause">

                        <select class="select_form_feedBack_cause">
                            <option class="option_form_feedBack_cause" value="" disabled selected> Выбрать причину
                            </option>
                            <option class="option_form_feedBack_cause" value="error">Возникла ошибка во время работы сайта
                            </option>
                            <option class="option_form_feedBack_cause" value="recommendation">Рекомендации и пожелания по
                                работе с сайтом</option>
                            <option class="option_form_feedBack_cause" value="thanks">Поблагодарить разработчиков</option>
                            <option class="option_form_feedBack_cause" value="other">Другая причина</option>
                        </select>
                    </div>
                </div>

                <!--название проблемы-->
                <div class="wrapper_form_feedBack_input">
                    <!-- <div class="input-errors"
             v-for="(error, index) of v$.name.$errors"
             :key="index">
          <div class="error-msg"
               v-if="error.$message === 'Value is required'">
            Необходимо указать корректное имя
          </div>
        </div> -->
                    <input class="form_feedBack_input_name_problem" id="name_problem" type="text"
                        placeholder="Сформулируйте причину Вашего обращения" autofocus>
                </div>

                <!--описание проблемы-->
                <div class="form_feedBack_input_description_problem ">
                    <!-- <div class="input-errors"
             v-for="(error, index) of v$.surname.$errors"
             :key="index">
          <div class="error-msg"
               v-if="error.$message === 'Value is required'">
            Необходимо указать корректную фамилию
          </div>
        </div> -->
                    <textarea class="form_feedBack_description_problem" 
                        id="description_problem"
                        placeholder="Подробно опишите возникшую у Вас проблему"></textarea>
                </div>
            </div>

            <div class="wrapper_form_feedBack_btn">
                <button class="form_feedBack_btn" type="submit">
                    Отправить обращение
                </button>
            </div>

        </form>
    </div>
</template>

<script>
import { mapMutations } from 'vuex';
import CloseModal from './UI/CloseModal.vue';


export default {
    name: "FeedBack",
    components: { CloseModal },

   methods: {
    ...mapMutations({setIsModalFeedBack: "feedBackStore/setIsModalFeedBack"})
   }
}
</script>

<style scoped>
.form_feedBack_title {
    font-size: 20px;
    display: flex;
    justify-content: center;
    margin: 20px;
}
.wrapper_form_feedBack {
    padding: 0 20px 20px 20px;
}
.form_feedBack {
}
.wrapper_form_feedBack_name {
}
.form_label_feedBack {
}
.wrapper_form_feedBack_cause {
    margin-bottom: 10px;
}
.form_feedBack_cause {
}
.select_form_feedBack_cause {
}
.option_form_feedBack_cause {
}
.wrapper_form_feedBack_input {
}
.form_feedBack_input_name_problem {
    width: 100%;
    height: 30px;
    margin-bottom: 10px;
}
.form_feedBack_input_description_problem {
}
.form_feedBack_description_problem {
    width: 100%;
    min-height: 100px;
    resize: none;
}
.wrapper_form_feedBack_btn {
    display: flex;
    justify-content: center;
    height: 45px;
    margin: 10px 5px 0px 5px;
}
.form_feedBack_btn {
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