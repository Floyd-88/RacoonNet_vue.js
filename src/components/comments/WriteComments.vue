<template>
    <div class="write_comments">
        <div class="write_comments_text">
            <textarea placeholder="Оставить комментарий..." @click.stop></textarea>
        </div>
        <div class="write_comments_btn" @click.stop>
            <UIbtn>Отправить</UIbtn>
        </div>
</div>
</template>

<script>
import UIbtn from '../UI/UIbtn.vue';

export default {
    name: "WriteComments",
    components: { UIbtn }
}

</script>

<style scoped>
.write_comments {
    display: flex;
    width: 100%;
    align-items: center;
    margin-top: 30px;
}

.write_comments_text {
    width: 100%;
    line-height: 0px;
}

.write_comments_text textarea {
    width: 100%;
    height: 33px;
    border-radius: 5px;
    border: 1px solid;
    padding: 3px;
    resize: none;
}

.write_comments_text textarea:focus {
    border: 1px solid #0197d6;
    box-shadow: 0 0 3px #0197d6;
    outline-offset: 0px;
    outline: none;

}

.write_comments_btn {
    padding-left: 10px;
}
</style>

