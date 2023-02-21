<template>

    <div class="wrapper_message_user" >
        <div class="wrapper_message_user_content">
            <div class="message_user_ava">
                <img class="ava_posts" :src="loadAva(dialog.ava)"  alt="ava">
            </div>
            <div class="message_user_content">
                <div class="message_user_name">
                    <p>{{dialog.name + " " + dialog.surname}}</p>
                </div>
                <div class="message_user_text" 
                    @click="openDialogUser(dialog.userID)">
                    <p>{{ dialog.message }}</p>
                </div>
            </div>
        </div>

        <div class="wrapper_message_user_btn">
            <div class="message_user_date">
                <p>{{ dialog.date }}</p>
            </div>
            <div class="message_user_del">
            <UIbtn 
                @click="DELETE_DIALOGS" >
                Удалить переписку
            </UIbtn>
            </div>
        </div>

    </div>

</template>

<script>
import { mapActions } from 'vuex';
import UIbtn from '../UI/UIbtn.vue';

export default {
    name: "UserMessage",
    components: { UIbtn },

    props: {
        dialog: {
            type: Object,
            default: ()=> {
                return {}
            }
        }
    },

    methods: {

        ...mapActions({ DELETE_DIALOGS: "messageStore/DELETE_DIALOGS"}),

        openDialogUser(id) {
            this.$router.push( {path: `/message/id${id}`, query: {
                ava: this.dialog.ava, 
                name: this.dialog.name, 
                surname: this.dialog.surname
            }})
        },

        loadAva(ava) {
          try{
            return require(`../../assets/photo/${ava}`)
          } catch {
            return require(`../../assets/ava/ava_1.jpg`);
          }

        },
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

}

.message_user_content {
    padding-left: 10px;
}

.message_user_name {
    margin-bottom: 10px;
    font-family: fantasy;
    font-size: 18px;
    cursor: pointer;

}

.message_user_text {
    border-radius: 5px;
    background: aliceblue;
    box-shadow: 0px 2px 5px 0px rgb(0 0 0 / 40%);
    padding: 5px 5px 5px 5px;
    margin-bottom: 10px;
    cursor: pointer;

}
.message_user_text p {
    word-break: break-word;
   

}
.wrapper_message_user_btn {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-left: 10px;
    margin-bottom: 10px;
}
.message_user_date {
    font-size: 14px;
    display: flex;
    justify-content: flex-end;
}
.message_user_del {
    width: max-content;
}
</style>