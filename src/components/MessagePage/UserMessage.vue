<template>
    <div @mouseover="showBtnDelete(dialog)" @mouseleave="notShowBtnDelete(dialog)" class="wrapper_message_user">
        <div class="wrapper_message_user_content">
            <div class="message_user_ava" @click="$router.push({ name: 'mypage', params: { id: `${dialog.userID}` } })">
                <UIAva :ava="dialog.ava" />
            </div>
            <div class="message_user_content">
                <div class="message_user_name">
                    <p @click="$router.push({ name: 'mypage', params: { id: dialog.userID } })">
                        {{ dialog.name + " " + dialog.surname }}
                    </p>
                    <div class="message_user_del">
                        <UIbtn v-show="dialog.isDialogDel"
                            @click="DELETE_DIALOGS({ convID: dialog.convId, photos: dialog.photos })">
                            Удалить переписку
                        </UIbtn>
                    </div>
                </div>
                <div class="message_user_text" :class="{ 'new_message_color': dialog.unread }">
                    <p @click="openDialogUser(dialog.userID)">
                        <img class="new_message_icon_photo" src="../../assets/icons/icon_photo.png" alt="photo"
                            v-if="dialogText(dialog.message) === ''">
                        {{ (dialogText(dialog.message) === "") ? "Фотография" : dialogText(dialog.message) }}
                    </p>
                </div>
            </div>
        </div>

        <div class="wrapper_message_user_btn">
            <div class="message_user_date">
                <p class="message_user_date_date">{{ dialog.date.slice(0, 10) }}</p>
                <p class="show_btn_delete" v-if="dialog.isShowBtnDelete" @click="btnDialogDel(dialog)">...</p>
                <p class="show_btn_delete_mobile" @click="btnDialogDel(dialog)">...</p>

            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import UIbtn from '../UI/UIbtn.vue';
export default {
    name: "UserMessage",
    components: { UIbtn },
    props: {
        dialog: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },

    methods: {
        ...mapMutations({ setArrayMessages: "messageStore/setArrayMessages" }),

        ...mapActions({
            DELETE_DIALOGS: "messageStore/DELETE_DIALOGS",
            LOAD_DIALOGS: "messageStore/LOAD_DIALOGS",
        }),

        openDialogUser(id) {
            this.setArrayMessages([])

            this.$router.push({
                name: `dialoguser`,
                params: {
                    id: id
                }
            })
        },

        showBtnDelete(dialog) {
            dialog.isShowBtnDelete = true;
        },

        notShowBtnDelete(dialog) {
            dialog.isShowBtnDelete = false;
        },

        btnDialogDel(dialog) {
            dialog.isDialogDel = !dialog.isDialogDel;
        },

        dialogText(value) {
            let doc = new DOMParser().parseFromString(value, "text/html");
            if (value.length > 200) {
                return doc.documentElement.textContent.slice(0, 200) + "..."
            }
            return doc.documentElement.textContent;
        }
    },

    computed: {
        ...mapGetters({ getArrayDialogs: "messageStore/getArrayDialogs" })
    }
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
.ava_posts {
    width: 90px;
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
    max-height: 35px;
    margin-bottom: 10px;
    font-family: Russo One, fantasy, sans-serif;
    font-size: 16px;
}

.message_user_content p {
    cursor: pointer;
}

.message_user_text {
    border-radius: 5px;
    box-shadow: 0px 2px 5px 0px rgb(0 0 0 / 40%);
    padding: 5px 5px 5px 5px;
    margin-bottom: 10px;
    cursor: pointer;
}

.message_user_text p {
    word-break: break-word;
    display: flex;
    align-items: center;
}

.wrapper_message_user_btn {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-left: 10px;
    margin-bottom: 10px;
}

.message_user_date {
    font-size: 12px;
    font-family: Roboto Condensed, Arial, Helvetica, sans-serif;
    display: flex;
    justify-content: flex-end;
    flex-direction: column;
    align-items: center;
}

.show_btn_delete {
    font-size: 25px;
    font-family: fantasy;
    cursor: pointer;
}

.show_btn_delete_mobile {
    display: none;
}

.message_user_del {
    width: max-content;
}

.new_message_color {
    background: #ddffe6b3;
}

.new_message_icon_photo {
    width: 30px;
    height: 30px;
    margin-right: 5px;
}

/* МЕДИА-ЗАПРОСЫ */

@media (max-width: 761px) {
    .wrapper_message_user_content {
        /* max-width: 270px; */
    }

    .message_user_text {
        /* max-width: 80%; */
    }

    .message_user_date_date {
        display: none;
    }

    .ava_posts {
        width: 60px;
    }

    .message_user_name {
        max-height: 60px;
    }

    .message_user_content p {
        max-width: 100%;
        word-wrap: break-word;
        font-size: 14px;

    }

    .message_user_del {
        max-width: 75px;
    }

    .message_user_del button {
        font-size: 12px;
        padding: 5px 2px;
    }

    .show_btn_delete {
        display: none;
    }

    .show_btn_delete_mobile {
        display: flex;
        font-size: 25px;
        font-family: fantasy;
        line-height: 1px;
        cursor: pointer;
    }

}</style>