<template>

    <div class="wrapper_message_user">
        <div class="wrapper_message_user_content">
            <div class="message_user_ava">
            <img class="ava_posts" src="../../assets/ava/ava_1.jpg" alt="ava">
        </div>
        <div class="message_user_content">
            <div class="message_user_name">
                <p>Илья Сазонов</p>
            </div>
            <div class="message_user_text">
                <p>Привет как дела у тебя сегодня мне просто нужно заполнить этот блок каким то текстом?</p>
            </div>
        </div>
        </div>
        

        <div class="message_user_date">
            <p>17.02.2021</p>
        </div>




    </div>

</template>

<script>


export default {
    name: "UserMessage",
}
</script>


<style scoped>
.wrapper_message_user {
    width: 100%;
    padding: 10px 5px 5px 10px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid black;
}
.message_user_ava {
}
.ava_posts {
    width: 90px;
  border-radius: 100%;
}
.wrapper_message_user_content {
display: flex;

}
.message_user_content {
    padding-left: 10px;
}
.message_user_name {
    margin-bottom: 10px;
    font-family: fantasy;
    font-size: 14px;
}
.message_user_text {
    border-radius: 5px;
    background: aliceblue;
    box-shadow: 0px 2px 5px 0px rgb(0 0 0 / 40%);
    padding: 5px 5px 5px 5px;
    margin-bottom: 10px;
}
.message_user_date {
    font-size: 14px;
}
</style>