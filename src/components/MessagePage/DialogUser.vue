<template >
    <div class="wrapper_dialog_user">

        <!-- headre -->
        <div class="wrapper_header_user">
            <div class="header_btn_back">
                <button @click="goBackMessage()">Назад</button>
            </div>
            <div class="wrapper_header_user_name">
                <div class="header_ava_user" @click="$router.push({ name: 'mypage', params: { id: getUser.userID } })">
                    <template v-if="getUser.ava != undefined || getUser.ava != null">
                        <img :src="pathAva" alt="ava">
                    </template>
                </div>
                <div class="header_name_user" @click="$router.push({ name: 'mypage', params: { id: getUser.userID } })">
                    <p>{{ (getUser.name || "") + " " + (getUser.surname || "") }}</p>
                </div>
            </div>
            <div></div>
        </div>
        <!-- -- -->

        <div class="wrapper_main_messages" ref="scrollToMe">
            <!-- message -->
            <template v-if="getIsUIloadMoreMessages">
                <UIloadMoreContent />
            </template>
            <div ref="observer" class="observer"></div>

            <div class="wrapper_message_dialog_user" v-for="(message, index) in getArrayMessages" :key="message.id">
                <div class="dialog_ava_user" :ref="'message' + message.id">
                    <template v-if="message.sender == $route.params.id">
                        <img :src="pathAva" alt="ava"
                            @click="$router.push({ name: 'mypage', params: { id: message.sender } })">
                    </template>
                    <template v-else>
                        <img :src="pathAvaMy" alt="ava">
                    </template>

                </div>
                <div class="wrapper_block_message_user">
                    <div class="wrapper_message_user">
                        <div class="message_name_user"
                            @click="$router.push({ name: 'mypage', params: { id: message.sender } })">
                            <p>{{ message.name + " " + message.surname }}</p>
                        </div>
                        <div class="message_time">
                            <p>{{ message.date }}</p>
                        </div>
                        <div class="message_btn_delete" v-if="message.isMesssageDel">
                            <UIbtn @click="DELETE_MESSAGES({messageID: message.id, photos: message.photos})">Удалить</UIbtn>
                        </div>
                    </div>

                    <div class="message_text" :class="{ 'active_text_fone': message.isMesssageDel }"
                        @click="showBtnDelete(message, index)">

                        <!-- фотографии к сообщению -->
                        <div class="wrapper_block_photo_post">
                            <template v-for="(photo, index) in getPhotosMessagesArray.filter(i => i.id === message.id)"
                                :key="index">
                                <div class="wrapper_photo_post" v-if="message.id === photo.id"
                                    :class="{ 'size_photo_1': index === 0 }">
                                    <img class="photo_post" :src="myPhotos(photo)" :alt="'photo' + photo.id"
                                        @click.stop="FULL_SIZE_PHOTO_MESSAGE({ 'bool': true, 'elem': index, id: photo.id, messageID: message.id })">
                                </div>
                            </template>
                        </div>


                        <!-- текст сообщения -->
                        <div v-if="messageText(message.message).length < 800">
                            <p>
                                {{ messageText(message.message) }}
                            </p>
                        </div>
                        <div v-else>
                            <p v-if="!message.isFullText">
                                {{ messageText(message.message).slice(0, 800) }}
                            </p>
                            <p v-else>
                                {{ messageText(message.message) }}
                            </p>
                            <p class="more_text_message" v-if="!message.isFullText" @click.stop="moreTextMessage(message)">
                                Показать еще
                            </p>
                        </div>
                    </div>

                </div>
            </div>

            <!-- -- -->
            <div class="wrapper_not_messages" v-if="getArrayMessages.length < 1 && getIsNotMessages">
                <p class="not_messages">
                    У вас отстутвует перписка с данным пользователем, но Вы можете начать общение прямо сейчас.
                </p>
            </div>
        </div>

        <div class="wrapper_block_write_message">

            <!-- block textarea -->
            <div class="wrapper_form_message_name">
                <div class="wrapper_form_message_input">
                    <div class="input-errors" v-for="(error, index) of v$.messageUser.$errors" :key="index">
                        <div class="error-msg" v-if="error.$message === 'Value is required'">
                            <!-- Вы не можете отправить пустое сообщение -->
                        </div>
                    </div>

                    <textarea class="new_message" id="name" placeholder="Введите сообщение" v-model="changeMessage"
                        :class="{ invalid: (v$.messageUser.$error) }">
                    </textarea>
                </div>
            </div>
            <!-- -- -->

            <!-- button -->
            <div class="wrapper_form_message_btn">

                <UIbtn class="btn_addPhoto" @click="addPostPhoto()">
                </UIbtn>

                <button class="form_message_btn" type="submit" @click="submitMessage()" :disabled="v$.$invalid">
                    Написать
                </button>
            </div>
            <!-- -- -->

            <div @click="closeModalFullSize(false)">
                <UImodal v-if="getIsModalFullSize">
                    <SliderPhoto />
                </UImodal>
            </div>

        </div>
        <UImodal class="modal_fone" v-if="getIsModalLoadPhoto">
            <FileUpload :addresseeID="this.$route.params.id" />
        </UImodal>
    </div>
</template>

<script>
// import SocketioService from "../../services/socketio.service";
import { useVuelidate } from "@vuelidate/core";
import { required, minLength } from "@vuelidate/validators";
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";
import UImodal from "../UI/UImodal.vue";
import FileUpload from "../FileUpload.vue";


export default {
    name: "DialogUser",
    setup() {
        return { v$: useVuelidate() };
    },
    data() {
        return {
            isBtnMessageDelete: false,
            messages: [],
            id: "",
            conv_id: "",
            scrolPhotoDown: true
        };
    },
    validations: {
        messageUser: {
            required,
            min: minLength(1),
        },
    },

    mounted() {
        this.setArrayMessages([]);
        // this.scrollToElement();
        this.id = this.$route.params.id;
        this.LOAD_MESSAGES_USER(this.id)
            .then(() => {
                if (this.$refs.scrollToMe) {
                    this.$nextTick(function () {
                        this.scrollToElement();
                    });
                }
                this.conv_id = this.getArrayMessages[0].conv_id;
            });
        // this.scrollToElement();
        // console.log(this.getArrayMessages)
        // SocketioService.subscribeToMessages((err, data) => {
        //     if (err) return console.log(err)
        //     this.setArrayMessages([...this.getArrayMessages, data])
        // });
        //подгрузка новой партии сообщений при скроле страницы
        const options = {
            rootMargin: "0px",
            threshold: 1
        };
        const callback = (entries) => {
            if (entries[0].isIntersecting) {
                if (this.getArrayMessages.length !== 0) {
                this.scrolPhotoDown = false;
                    this.LOAD_MESSAGES_USER(this.id)
                        .then((resp) => {
                            if (resp.data.length > 0) {
                                if(resp.data[resp.data.length - 4]) {
                                    let ref = "message" + resp.data[resp.data.length - 4].id;
                                    let topWriteUnderComment = this.$refs[ref][0].getBoundingClientRect().y;

                                    if (this.$refs.scrollToMe) {
                                    this.$nextTick(function () {
                                        this.scrollToElementUP(topWriteUnderComment);
                                    });
                                }
                                }
                              
                            }
                        });
                }
            }
        };
        const observer = new IntersectionObserver(callback, options);
        observer.observe(this.$refs.observer);
    },

    updated() {
        if( this.scrolPhotoDown === true) {
            if (this.$refs.scrollToMe) {
            this.$nextTick(function () {
                this.scrollToElement();
            })
        }
        }
        
    },

    async unmounted() {
        if (this.getArrayMessages.length > 0) {
            this.setCountDialogsNull();
            this.setArrayDialogs([]);
            this.LOAD_DIALOGS({ isExitMessage: true, convID: this.getArrayMessages[0].conv_id });
        }
        this.setCountMessagesNull();
        this.setArrayMessages([]);


    },



    async beforeUnmount() {
        this.UPDATE_FLAGS_UNREAD_MESSAGE(this.conv_id);
        this.setPhotosMessagesArray([]);
        this.conv_id = "";
    },

    methods: {
        ...mapActions({
            WRITE_MESSAGE_USER: "messageStore/WRITE_MESSAGE_USER",
            LOAD_MESSAGES_USER: "messageStore/LOAD_MESSAGES_USER",
            DELETE_MESSAGES: "messageStore/DELETE_MESSAGES",
            LOAD_DIALOGS: "messageStore/LOAD_DIALOGS",
            UPDATE_FLAGS_UNREAD_MESSAGE: "messageStore/UPDATE_FLAGS_UNREAD_MESSAGE",
            FULL_SIZE_PHOTO_MESSAGE: "showFullPhotoStore/FULL_SIZE_PHOTO_MESSAGE",
            closeModalFullSize: "showFullPhotoStore/closeModalFullSize",
            NULL_UNREAD_MESSAGE: "messageStore/NULL_UNREAD_MESSAGE"


        }),
        ...mapMutations({
            setModalWriteMessage: "messageStore/setModalWriteMessage",
            setMessageUser: "messageStore/setMessageUser",
            setArrayMessagesUnread: "messageStore/setArrayMessagesUnread",
            setCountMessagesNull: "messageStore/setCountMessagesNull",
            setArrayMessages: "messageStore/setArrayMessages",
            setCountDialogsNull: "messageStore/setCountDialogsNull",
            setArrayDialogs: "messageStore/setArrayDialogs",
            setIsModalLoadPhoto: "loadPhotoStore/setIsModalLoadPhoto",
            setIsLoadPhotoMessage: "loadPhotoStore/setIsLoadPhotoMessage",
            setPhotosMessagesArray: "messageStore/setPhotosMessagesArray"
        }),

        //отправляем сообщение
        async submitMessage() {
            // при отпарвке сообщения убирать фон с непрачитанных
            this.setArrayMessagesUnread();
            //сохраянем сообщение в БД
            this.WRITE_MESSAGE_USER({ addresseeID: this.$route.params.id })
                .then(() => {
                    this.$nextTick(function () {
                        this.scrollToElement();
                    });
                });
        },
        showBtnDelete(message) {
            message.isMesssageDel = !message.isMesssageDel;
        },
        //автоматическая прокрутка сообщений вниз
        scrollToElement() {
            try {
                const el = this.$refs.scrollToMe;
                if (el) {
                    el.scrollTop = el.scrollHeight;
                }
            }
            catch (err) {
                console.log(err);
            }
        },
        //прокрутка сообщений вверх
        scrollToElementUP(top) {
            try {
                const el = this.$refs.scrollToMe;
                if (el) {
                    el.scrollTop = top;
                }
            }
            catch (err) {
                console.log(err);
            }
        },
        //в случае закодированных специсимволов в текcте- переводим их обратно в читаемый вид
        messageText(value) {
            let doc = new DOMParser().parseFromString(value, "text/html");
            return doc.documentElement.textContent;
        },

        addPostPhoto() {
            this.setIsLoadPhotoMessage(true);
            this.setIsModalLoadPhoto(true);
        },

        myPhotos(photo) {
            try {
                return require(`../../assets/photo/${photo.photo_name}`);
            } catch (err) {
                console.log(err)
                return require(`../../assets/ava/ava_1.jpg`);
            }
        },

        moreTextMessage(message) {
            message.isFullText = true;
        },

        goBackMessage() {
            this.$router.go(-1);
            this.UPDATE_FLAGS_UNREAD_MESSAGE(this.getArrayMessages[0].conv_id);
        }
    },
    computed: {
        ...mapGetters({
            getMessageUser: "messageStore/getMessageUser",
            getArrayMessages: "messageStore/getArrayMessages",
            getUser: "authorizationStore/getUser",
            getIsUIloadMoreMessages: "messageStore/getIsUIloadMoreMessages",
            getIsNotMessages: "messageStore/getIsNotMessages",
            getIsModalLoadPhoto: "loadPhotoStore/getIsModalLoadPhoto",
            getPhotosMessagesArray: "messageStore/getPhotosMessagesArray",
            getIsModalFullSize: "showFullPhotoStore/getIsModalFullSize",

        }),
        ...mapState({
            messageUser: (state) => state.messageStore.messageUser,
        }),
        //двухстороннее связывание + валидация
        changeMessage: {
            get() {
                return this.getMessageUser;
            },
            set(value) {
                this.setMessageUser(value);
                this.v$.messageUser.$touch();
            }
        },
        //подгрузка автатарки с кем я переписываюсь
        pathAva() {
            try {
                return require(`../../assets/photo/${this.getUser.ava}`);
            }
            catch {
                return require(`../../assets/ava/ava_1.jpg`);
            }
        },
        //подгрузка аватрки моей
        pathAvaMy() {
            let message = this.getArrayMessages.find(message => message.sender === JSON.parse(localStorage.getItem("user")).userID);
            try {
                return require(`../../assets/photo/${message.ava}`);
            }
            catch {
                return require(`../../assets/ava/ava_1.jpg`);
            }
        },
    },
    components: { UImodal, FileUpload }
}
</script>


<style scoped>
.wrapper_dialog_user {
    display: flex;
    border-radius: 7px;
    background: #ffffff;
    box-shadow: 0px 2px 5px 0px rgb(0 0 0 / 40%);
    flex-direction: column;
    height: 80vh;
}

.wrapper_header_user {
    display: flex;
    border-bottom: 1px solid black;
    padding: 5px;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
}

/* .header_btn_back {} */
.header_btn_back button {
    padding: 6px;
    font-size: 14px;
    font-family: fantasy;
    border-radius: 5px;
    background: #0197d6;
    cursor: pointer;
    color: whitesmoke;
    border: none;
}

.wrapper_header_user_name {
    display: flex;
    align-items: center;
}

.header_ava_user {
    margin-right: 10px;
    cursor: pointer;
}

.header_ava_user img {
    width: 50px;
    border-radius: 100%;
}

.header_name_user {
    font-family: fantasy;
    font-size: 20px;
    cursor: pointer;
}

.wrapper_main_messages {
    flex-grow: 1;
    overflow: auto;
    position: relative;
    /* border: 1px solid; */
}

.wrapper_message_dialog_user {
    display: flex;
    margin: 0px 15px 25px 10px;
}

/* .dialog_ava_user {} */
.dialog_ava_user img {
    width: 40px;
    border-radius: 100%;
    cursor: pointer;
}

.wrapper_block_message_user {
    margin-left: 10px;
    width: 100%;
}

.wrapper_message_user {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
}

.message_name_user {
    margin-right: 10px;
    font-size: 17px;
    font-family: fantasy;
    cursor: pointer;
}

.message_time {
    font-size: 15px;
}

.message_text {
    cursor: pointer;
}

.message_text p {
    word-break: break-word;
}

.message_btn_delete {
    margin-left: 10px;
}

.message_btn_delete button {
    height: 20px;
    display: flex;
    align-items: center;
}

.wrapper_block_write_message {
    display: flex;
    align-items: center;
    margin: 10px;
    flex-shrink: 0;
}

.wrapper_form_message_name {
    display: flex;
    justify-content: space-around;
    width: 100%;
}

.wrapper_form_message_input {
    width: 100%;
    margin-bottom: 0px;
}

.new_message {
    width: 100%;
    min-height: 50px;
    resize: none;
    border-radius: 5px;
    padding: 5px;
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
    /* border: 1px solid red; */
}

.active_text_fone {
    background: aliceblue;
}

.not_read_message {
    background-color: #ddffe6b3;
}

.wrapper_not_messages {
    font-size: 16px;
    line-height: 26px;
    position: absolute;
    top: 50%;
    margin-top: -50px;
    text-align: center;
    padding: 0 30px;
    opacity: .3;
    font-family: fantasy;
    color: dimgray;
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

.wrapper_block_photo_post {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
}

.wrapper_photo_post {
    width: 18%;
    height: 150px;
    margin: 10px 5px;
    border-radius: 8px;
    overflow: hidden;
}

.photo_post {
    width: 100%;
    height: 100%;
    /* height: inherit; */
    -o-object-fit: cover;
    object-fit: cover;
    cursor: pointer;
}

.size_photo_1 {
    width: 18%;
    height: auto;
    max-height: 150px;
}

.more_text_message {
    font-weight: 600;
    cursor: pointer;
    display: inline-block;
    color: #008edb;
}
</style>