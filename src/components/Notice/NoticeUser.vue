<template>
    <!--  Закрыть модальное окно-->
    <CloseModal @click="setIsShowModalWindowNotice(false)" />
    <h4 class="notice_title">Ваши уведомления</h4>
    <template v-if="getNoticeArray.length > 0">
        <div class="wrapper_all_messages_users">
            <div v-for="notice of getNoticeArray" :key="notice.id">
                <div class="wrapper_message_user">
                    <div class="wrapper_message_user_content">
                        <div class="message_user_ava" @click="getUserNotice(notice.userID)">
                            <UIAva :ava="notice.ava" />
                        </div>
                        <div class="message_user_content">
                            <div class="message_user_name">
                                <div class="message_user_del">
                                    <UIbtn @click="NOTICE_ARRAY_DELETE(notice.id)">
                                        Скрыть
                                    </UIbtn>
                                </div>
                            </div>
                            <div class="message_user_text" :class="{ 'active_message_user_text': notice.show_notice === 0 }"
                                @click="showModalWindowOneNotice(notice)">
                                <p>
                                    <span class="message_user_text_name" @click.stop="getUserNotice(notice.userID)">
                                        {{ `${notice.name} ${notice.surname}` }}
                                    </span>
                                    {{ (notice.selectedGender === "woman") ? (notice.text_notice.split(" ")[0] + 'a') + " "
                                        + notice.text_notice.split(' ').slice(1).join(' ') : notice.text_notice }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="wrapper_message_user_btn">
                        <div class="message_user_date">
                            <p>{{ notice.date.slice(0, 10) }}</p>
                        </div>
                    </div>
                </div>



            </div>
        </div>

    </template>
    <template v-else>
        <div class="wrapper_all_messages_users">
            <div class="not_notice">
                <p>У Вас нет новых уведомлений</p>
            </div>

        </div>
    </template>
    <UImodal v-if="getIsShowModalWindowOneNotice">
        <NoticeOneUser @getUserNotice="getUserNotice" />
    </UImodal>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import CloseModal from "../UI/CloseModal.vue";
import NoticeOneUser from "./NoticeOneUser.vue";
export default {
    name: "NoticeUser",
    methods: {
        ...mapMutations({
            setIsShowModalWindowNotice: "noticeStore/setIsShowModalWindowNotice",
            setIsShowModalWindowOneNotice: "noticeStore/setIsShowModalWindowOneNotice",
            setSelectNotice: "noticeStore/setSelectNotice",
        }),
        ...mapActions({
            NOTICE_ARRAY_DELETE: "noticeStore/NOTICE_ARRAY_DELETE",
            GET_PHOTOS_POST_NOTICE: "noticeStore/GET_PHOTOS_POST_NOTICE"
        }),

        showModalWindowOneNotice(notice) {
            if (notice.text_notice !== "пригласил Вас в друзья" && notice.text_notice !== "принял Вашу заявку в друзья") {
                this.setIsShowModalWindowOneNotice(true);
                this.setSelectNotice(notice);
                if (notice.photos !== "0" && notice.photos !== null) {
                    this.GET_PHOTOS_POST_NOTICE(notice.post_id);
                }
            }
        },
        getUserNotice(notice) {
            this.setIsShowModalWindowNotice(false);
            this.setIsShowModalWindowOneNotice(false);
            this.$router.push({ name: "mypage", params: { id: `${notice}` } });
        }
    },
    computed: {
        ...mapGetters({
            getNoticeArray: "noticeStore/getNoticeArray",
            getIsShowModalWindowOneNotice: "noticeStore/getIsShowModalWindowOneNotice"
        })
    },
    components: { CloseModal, NoticeOneUser }
}
</script>

<style scoped>
.notice_title {
    font-size: 20px;
    display: flex;
    justify-content: center;
    padding: 10px;
    background: #0197d6;
    font-family: Russo One, fantasy, sans-serif;
    font-weight: 400;
}

.wrapper_all_messages_users {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    max-height: 330px;
    border-radius: 5px;
    box-shadow: 0px 2px 5px 0px rgb(0 0 0 / 40%);
    min-height: 89px;
    min-width: 400px;
}

.wrapper_message_user {
    width: 100%;
    padding: 10px 5px 5px 10px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid black;
    background: #dcdcdc;
}

.wrapper_message_user:hover {
    filter: brightness(90%);
}

.ava_posts {
    width: 70px;
    border-radius: 100%;
    cursor: pointer;
}

.wrapper_message_user_content {
    display: flex;
    width: 100%;
}

.message_user_content {
    width: 100%;
    padding-left: 10px;
}

.message_user_name {
    display: flex;
    justify-content: space-between;
    height: 25px;
    margin-bottom: 10px;
    font-family: Russo One, fantasy, sans-serif;
    font-size: 18px;
}

.message_user_content p {
    /* cursor: pointer; */
}

.message_user_text {
    border-radius: 5px;
    box-shadow: 0px 2px 5px 0px rgb(0 0 0 / 40%);
    padding: 5px 5px 5px 5px;
    margin-bottom: 10px;
    cursor: pointer;
}

.active_message_user_text {
    background: #ddffe6b3;
}

.message_user_text_name {
    cursor: pointer;
    font-size: 13.5px;
    font-family: Russo One, fantasy, sans-serif;
}

.message_user_text p {
    font-family: 'Times New Roman', Times, serif;
    word-break: break-word;
    font-size: 15px;
    min-width: 355px;
}

.wrapper_message_user_btn {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-left: 10px;
    margin-bottom: 10px;
}

.message_user_date {
    display: flex;
    justify-content: flex-end;
    flex-direction: column;
    align-items: center;
    font-size: 13px;
    font-family: Roboto Condensed, Arial, Helvetica, sans-serif;
}

.show_btn_delete {
    font-size: 25px;
    font-family: fantasy;
    cursor: pointer;
}

.message_user_del {
    width: max-content;
}

.new_message_color {
    background: #ddffe6b3;
}

.not_notice {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 89px;
    font-size: 17px;
    font-family: Russo One, fantasy, sans-serif;
    background: #dcdcdc;
}

/* МЕДИА-ЗАПРОСЫ */

@media (max-width: 761px) {

    .wrapper_all_messages_users {
        min-width: 350px;
    }

    .ava_posts {
        width: 55px;
    }

    .wrapper_message_user {
        padding: 10px 5px 5px 5px;
        flex-direction: column-reverse;
    }

    .wrapper_message_user_content {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .message_user_content {
        display: flex;
        flex-direction: column-reverse;
        align-items: center;
        padding-left: 0px;
    }

    .message_user_text p {
        min-width: 300px;
        width: 330px;
    }
}
</style>