<template>

    <div @mouseover="showBtnDelete(dialog)" @mouseleave="notShowBtnDelete(dialog)" class="wrapper_message_user">
        <div class="wrapper_message_user_content">
            <div class="message_user_ava"
            @click="$router.push({name: 'mypage', params: {id: `${dialog.userID}`}})">
                <img class="ava_posts" :src="loadAva(dialog.ava)" alt="ava">
            </div>
            <div class="message_user_content">
                <div class="message_user_name">
                    <p @click="$router.push({name: 'mypage', params: {id: dialog.userID}})">
                        {{ dialog.name + " " + dialog.surname }}
                    </p>
                    <div class="message_user_del">
                        <UIbtn v-show="dialog.isDialogDel" @click="DELETE_DIALOGS({convID: dialog.convId, photos: dialog.photos})">
                            Удалить переписку
                        </UIbtn>
                    </div>
                </div>
                <div class="message_user_text" 
                    @click="openDialogUser(dialog.userID)"
                    :class="{'new_message_color': dialog.unread}">
                    <p>
                        <img class="new_message_icon_photo" src="../../assets/icons/icon_photo.png" alt="photo" v-if="dialogText(dialog.message) === ''">
                        {{ (dialogText(dialog.message) === "") ? "Фотография" : dialogText(dialog.message)}}
                    </p>
                </div>
            </div>
        </div>

        <div class="wrapper_message_user_btn">
            <div class="message_user_date">
                <p>{{ dialog.date.slice(0, 10) }}</p>
                <p class="show_btn_delete" v-if="dialog.isShowBtnDelete" @click="btnDialogDel(dialog)">...</p>
            </div>
        </div>
        <!-- <div ref="observer" class="observer"></div> -->
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
    date() {
        return {
            // isDialogDel: false,
        }
    },

//     mounted() {
//      //подгрузка новой партии диалогов при скроле страницы
//      const options = {
//       rootMargin: "0px",
//       threshold: 1
//     };
//     const callback = (entries) => {
//       if (entries[0].isIntersecting) {
//         if(this.getArrayDialogs.length !== 0) {
//           this.LOAD_DIALOGS()
//         }
//       }
//     };
//     const observer = new IntersectionObserver(callback, options);
//     observer.observe(this.$refs.observer);
//   },

    methods: {
        ...mapMutations({setArrayMessages: "messageStore/setArrayMessages"}),

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

        loadAva(ava) {
            try {
                return require(`../../assets/photo/${ava}`)
            } catch {
                return require(`../../assets/ava/ava_1.jpg`);
            }
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
            if(value.length > 200) {
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
/* .message_user_ava {} */
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
    height: 25px;
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
/* .observer {
    border: 1px solid;
} */
</style>