<template>
    <!--  Закрыть модальное окно-->
    <CloseModal @click="closeModalWindowOneNotice()" />
    <h4 class="notice_title">Ваши уведомления</h4>
    <template v-if="getNoticeArray.length > 0">
        <div class="wrapper_all_messages_users">
            <div class="post">
                <div class="wrapper_post">

                    <!-- уведомление о новом комментарии к комментарию в посте-->
                    <template v-if="getSelectNotice.comment_comment_text">

                        <!-- содержание поста -->
                        <div class="wrapper_post_user">
                            <div class="wrapper_text_post">
                                <div>

                                <!-- фотографии к посту -->
                                <div class="wrapper_block_photo_post" v-if="getSelectNotice.photos">
                                    
                                    <template v-for="(photo, index) in getPhotosPostNotice"
                                              :key="photo.id">
                                        <div class="wrapper_photo_post" :class="{ 'size_photo_1': index === 0 }">
                                            <img class="photo_post" :src="myPhotos(photo.photo_name)" :alt="'photo' + photo.id">
                                        </div>
                                    </template>
                                </div>
                                <!-- ------ -->

                            <p class="text_post">{{ getSelectNotice.postText }}</p>
                        <!-- ----- -->

                                    <!-- комент -->
                                    <div class="wrapper_message_user">
                                        <div class="message_name_user">
                                            <div class="dialog_ava_user">
                                                <img :src="loadAva(getSelectNotice.ava_addressee)" alt="ava" @click="$emit('getUserNotice', getSelectNotice.userID_addressee)">
                                            </div>
                                            <p class="message_name" @click="$emit('getUserNotice', getSelectNotice.userID_addressee)">
                                                {{ getSelectNotice.name_addressee + " " + getSelectNotice.surname_addressee }}
                                            </p>
                                        </div>
                                    </div>

                                    <div class="message_text">
                                        <p>
                                            {{  getSelectNotice.comment_post_text }}
                                        </p>
                                        <!-- ---- -->

                                        <!-- ответ на комент -->
                                        <div class="wrapper_under_comment">
                                            <div class="wrapper_block_under_comment_user">
                                                <div class="wrapper_under_comment_user">
                                                    <div class="under_comment_name_user">
                                                        <div class="under_comment_ava_user">
                                                            <img @click="$emit('getUserNotice', getSelectNotice.userID)" :src="loadAva(getSelectNotice.ava)" alt="ava">
                                                        </div>
                                                        <p class="under_comment_name" @click="$emit('getUserNotice', getSelectNotice.userID)">{{ getSelectNotice.name + " " +
                                                            getSelectNotice.surname }}</p>
                                                    </div>
                                                    <div class="under_comment_time">
                                                        <p>{{ getSelectNotice.date.slice(0, 10) }}</p>
                                                    </div>
                                                </div>
                                                <div class="under_comment_text">
                                                    <p>
                                                        {{ getSelectNotice.comment_comment_text }}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <!-- ----- -->

                                    </div>
                                </div>
                            </div>
                        </div>

                    </template>

                    <!-- уведомление о коммениатрии к посту -->
                    <template v-else-if="getSelectNotice.comment_post_text">
                        <div class="wrapper_ava_posts">
                            <img class="ava_posts" alt="ava" ref="img" :src="loadAva(getSelectNotice.ava_addressee)" @click="$emit('getUserNotice', getSelectNotice.userID_addressee)">
                        </div>

                        <div class="wrapper_post_user">
                            <div class="wrapper_post_name">
                                <p class="post_name" @click="$emit('getUserNotice', getSelectNotice.userID_addressee)">
                                    {{ getSelectNotice.name_addressee + " " + getSelectNotice.surname_addressee }}
                                </p>
                            </div>

                            <div class="wrapper_text_post">
                                <div>

                                     <!-- фотографии к посту -->
                                <div class="wrapper_block_photo_post" v-if="getSelectNotice.photos">
                                    
                                    <template v-for="(photo, index) in getPhotosPostNotice"
                                              :key="photo.id">
                                        <div class="wrapper_photo_post" :class="{ 'size_photo_1': index === 0 }">
                                            <img class="photo_post" :src="myPhotos(photo.photo_name)" :alt="'photo' + photo.id">
                                        </div>
                                    </template>
                                </div>
                                    
                                    <p class="text_post">{{ getSelectNotice.postText }}</p>

                                    <div class="wrapper_message_user">
                                        <div class="message_name_user">
                                            <div class="dialog_ava_user">
                                                <img 
                                                    @click="$emit('getUserNotice', getSelectNotice.userID)" 
                                                    :src="loadAva(getSelectNotice.ava)" alt="ava">
                                            </div>
                                            <p class="message_name"
                                                @click="$emit('getUserNotice', getSelectNotice.userID)">
                                                {{ getSelectNotice.name + " " + getSelectNotice.surname }}
                                            </p>
                                        </div>
                                        <div class="message_time">
                                            <p>{{ getSelectNotice.date.slice(0, 10) }}</p>
                                        </div>
                                    </div>

                                    <div class="message_text">
                                        <p>
                                            {{ getSelectNotice.comment_post_text }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </template>

                    <!-- уведомление о новом посте или лайке поста -->
                    <template v-else-if="getSelectNotice.postText || getSelectNotice.photos">

                        <template v-if="getSelectNotice.text_notice === 'написал что то на Вашей стене'">
                            <div class="wrapper_ava_posts">
                                <img class="ava_posts" alt="ava" ref="img" 
                                    @click="$emit('getUserNotice', getSelectNotice.userID)"
                                    :src="loadAva(getSelectNotice.ava)">
                            </div>
                            <div class="wrapper_post_user">

                                <div class="wrapper_post_name">
                                    <p class="post_name"
                                        @click="$emit('getUserNotice', getSelectNotice.userID)">
                                        {{ getSelectNotice.name + " " + getSelectNotice.surname }}
                                    </p>
                                </div>

                                <div class="wrapper_data_post">
                                    <p class="data_post">{{ getSelectNotice.date }}</p>
                                </div>

                               <!-- фотографии к посту -->
                               <div class="wrapper_block_photo_post" v-if="getSelectNotice.photos">
                                    <template v-for="(photo, index) in getPhotosPostNotice"
                                              :key="photo.id">
                                        <div class="wrapper_photo_post" :class="{ 'size_photo_1': index === 0 }">
                                            <img class="photo_post" :src="myPhotos(photo.photo_name)" :alt="'photo' + photo.id">
                                        </div>
                                    </template>
                                </div>

                                <div class="wrapper_text_post" v-if="getSelectNotice.postText.length < 800">
                                    <div>
                                        <p class="text_post">{{ getSelectNotice.postText }}</p>
                                    </div>
                                </div>
                                <div class="wrapper_text_post" v-else>
                                    <p class="text_post" v-if="!getSelectNotice.isFullText">
                                        {{ getSelectNotice.postText.slice(0, 800) }}
                                    </p>
                                    <p class="text_post" v-else>
                                        {{ getSelectNotice.postText }}
                                    </p>
                                    <p class="more_text_post" v-if="!getSelectNotice.isFullText"
                                        @click="moreTextPost(getSelectNotice)">
                                        Показать еще
                                    </p>
                                </div>
                            </div>
                        </template>

                        <template v-else-if="getSelectNotice.text_notice === 'отметил Вашу запись'">
                            <div class="wrapper_ava_posts">
                                <img class="ava_posts" 
                                alt="ava" 
                                ref="img" 
                                @click="$emit('getUserNotice', getSelectNotice.userID_addressee)" 
                                :src="loadAva(getSelectNotice.ava_addressee)">
                            </div>
                            <div class="wrapper_post_user">
                                <div class="wrapper_post_name">
                                    <p class="post_name"
                                        @click="$emit('getUserNotice', getSelectNotice.userID_addressee)">
                                        {{ getSelectNotice.name_addressee + " " + getSelectNotice.surname_addressee }}
                                    </p>
                                </div>

                                <!-- фотографии к посту -->
                               <div class="wrapper_block_photo_post" v-if="getSelectNotice.photos">
                                    <template v-for="(photo, index) in getPhotosPostNotice"
                                              :key="photo.id">
                                        <div class="wrapper_photo_post" :class="{ 'size_photo_1': index === 0 }">
                                            <img class="photo_post" :src="myPhotos(photo.photo_name)" :alt="'photo' + photo.id">
                                        </div>
                                    </template>
                                </div>

                                <div class="wrapper_text_post" v-if="getSelectNotice.postText.length < 800">
                                    <div>
                                        <p class="text_post">{{ getSelectNotice.postText }}</p>
                                    </div>
                                </div>
                                <div class="wrapper_text_post" v-else>
                                    <p class="text_post" v-if="!getSelectNotice.isFullText">
                                        {{ getSelectNotice.postText.slice(0, 800) }}
                                    </p>
                                    <p class="text_post" v-else>
                                        {{ getSelectNotice.postText }}
                                    </p>
                                    <p class="more_text_post" v-if="!getSelectNotice.isFullText"
                                        @click="moreTextPost(getSelectNotice)">
                                        Показать еще
                                    </p>
                                </div>
                            </div>
                        </template>
                        
                    </template>

                    <!-- уведомление о новом комментарии к фотографии-->
                    <template v-else-if="getSelectNotice.comment_photo_text">
                        <div class="wrapper_ava_posts">
                            <img class="ava_posts" alt="ava" ref="img" 
                                :src="loadAva(getSelectNotice.ava_addressee)"
                                @click="$emit('getUserNotice', getSelectNotice.userID_addressee)">
                        </div>

                        <div class="wrapper_post_user">
                            <div class="wrapper_post_name">
                                <p class="post_name" @click="$emit('getUserNotice', getSelectNotice.userID_addressee)">
                                    {{ getSelectNotice.name_addressee + " " + getSelectNotice.surname_addressee }}
                                </p>
                            </div>

                            <div class="wrapper_text_post">
                                <div class="text_post">
                                    <div v-if="getSelectNotice.photo_name">
                                        <img class="photo_post" :src="myPhotos(getSelectNotice.photo_name)"
                                            :alt="'photo' + getSelectNotice.id">
                                    </div>

                                    <div class="wrapper_message_user">
                                        <div class="message_name_user">
                                            <div class="dialog_ava_user"
                                                @click="$emit('getUserNotice', getSelectNotice.userID)">
                                                <img :src="loadAva(getSelectNotice.ava)" alt="ava">
                                            </div>
                                            <p class="message_name"
                                                @click="$emit('getUserNotice', getSelectNotice.userID)">
                                                {{ getSelectNotice.name + " " + getSelectNotice.surname }}
                                            </p>
                                        </div>
                                        <div class="message_time">
                                            <p>{{ getSelectNotice.date.slice(0, 10) }}</p>
                                        </div>
                                    </div>

                                    <div class="message_text">
                                        <p>
                                            {{ getSelectNotice.comment_photo_text }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>

                    <!-- уведомление о новом лайке фотографии-->
                    <template v-else-if="getSelectNotice.photo_name">
                        <div class="wrapper_ava_posts">
                            <img class="ava_posts"  alt="ava" ref="img" 
                                :src="loadAva(getSelectNotice.ava_addressee)"
                                @click="$emit('getUserNotice', getSelectNotice.userID_addressee)">
                        </div>

                        <div class="wrapper_post_user">
                            <div class="wrapper_post_name">
                                <p class="post_name" @click="$emit('getUserNotice', getSelectNotice.userID_addressee)">
                                    {{ getSelectNotice.name_addressee + " " + getSelectNotice.surname_addressee }}
                                </p>
                            </div>

                            <div class="wrapper_text_post">
                                <div class="text_post">
                                    <img class="photo_post" 
                                        :src="myPhotos(getSelectNotice.photo_name)"
                                        :alt="'photo' + getSelectNotice.id">
                                </div>
                            </div>
                        </div>
                    </template>
                </div>
            </div>

        </div>

    </template>
</template>

<script>
import CloseModal from './UI/CloseModal.vue';
import { mapActions, mapGetters, mapMutations } from "vuex";
export default {
    name: "NoticeOneUser",
    components: { CloseModal },
    emits:['getUserNotice'],

   async mounted() {
        if(this.getSelectNotice.show_notice === 0) {
           await this.REMOVE_COUNT_NOTICE_LIST(this.getSelectNotice.id);
           this.getSelectNotice.show_notice = 1;
        }

    },

    methods: {
        ...mapMutations({
            setNoticeArrayDelete: "noticeStore/setNoticeArrayDelete",
            setIsShowModalWindowOneNotice: "noticeStore/setIsShowModalWindowOneNotice",
            setPhotosPostNotice: "noticeStore/setPhotosPostNotice"
        }),

        ...mapActions({
            NOTICE_ARRAY_DELETE: "noticeStore/NOTICE_ARRAY_DELETE",
            REMOVE_COUNT_NOTICE_LIST: "noticeStore/REMOVE_COUNT_NOTICE_LIST"
        }),

        loadAva(ava) {
            try {
                return require(`../assets/photo/${ava}`)
            } catch {
                return require(`../assets/ava/ava_1.jpg`);
            }
        },
        myPhotos(photo) {
            try {
                return require(`../assets/photo/${photo}`);
            } catch (err) {
                console.log(err)
                return require(`../assets/ava/ava_1.jpg`);
            }
        },

        moreTextPost(getSelectNotice) {
            getSelectNotice.isFullText = true;
        },

        closeModalWindowOneNotice() {
            this.setIsShowModalWindowOneNotice(false);
            this.setPhotosPostNotice([]);
        }
    },

    computed: {
        ...mapGetters({
            getNoticeArray: "noticeStore/getNoticeArray",
            noticeTextArray: "noticeStore/noticeTextArray",
            getIsShowModalWindowOneNotice: "noticeStore/getIsShowModalWindowOneNotice",
            getSelectNotice: "noticeStore/getSelectNotice",
            getPhotosPostNotice: "noticeStore/getPhotosPostNotice"
        })
    }
}
</script>

<style scoped>
.notice_title {
    font-size: 20px;
    display: flex;
    justify-content: center;
    padding: 10px;
    background: #0197d6;
    color: transparent;
}

.wrapper_all_messages_users {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    max-height: 330px;
    max-width: 600px;
    border-radius: 5px;
    box-shadow: 0px 2px 5px 0px rgb(0 0 0 / 40%);
    min-height: 89px;
    min-width: 600px;
}

/* ------------------------------ */

.post {
    padding-bottom: 20px;
    border-radius: 5px;
    background: #f8f8f9;
    box-shadow: 0px 2px 5px 0px rgb(0 0 0 / 40%);
}

.wrapper_post {
    display: flex;
    /* margin-bottom: 10px; */
    width: 100%;
    justify-content: flex-start;
}

.wrapper_post_redaction_btn {
    display: flex;
}

.wrapper_ava_posts {
    margin: 5px;
    /* cursor: pointer */
}

.ava_posts {
    width: 90px;
    border-radius: 100%;
    cursor: pointer
}

.wrapper_post_user {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
}

.wrapper_post_name {
    margin-bottom: 5px;
    display: flex;
    justify-content: space-between;
}

.post_show_btn {
    margin-right: 10px;
    font-size: 20px;
    line-height: 17px;
    cursor: pointer;
}

.post_name {
    font-size: 18px;
    font-family: cursive;
    font-weight: 600;
    cursor: pointer;
}

.wrapper_data_post {
    margin-bottom: 10px;
}

.data_post {
    font-size: 13px;
    font-family: cursive;
}

.wrapper_text_post {
    padding-right: 6px;
    padding-left: 6px;
}

.text_post {
    word-break: break-word;
    padding-top: 10px;
}

.more_text_post {
    font-weight: 600;
    cursor: pointer;
    display: inline-block;
    color: #008edb;
}

.more_text_post:hover {
    filter: brightness(80%);
}

.btn_post {
    display: flex;
    display: flex;
    justify-content: flex-end;
    /* margin: 5px; */
}

.redaction_post_btn {
    width: 100px;
    font-size: 13px;
    margin-right: 5px;
    margin-bottom: 5px;
}

.delete_post_btn {
    width: 70px;
    font-size: 13px;
    margin-bottom: 5px;
    margin-right: 5px;

}

.wrapper_edit_text_body {
    width: 100%;
    padding-right: 5px;
}

.edit_text_body {
    resize: none;
    height: 150px;
    width: 250px;
}

.wrapper_save_editPost {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 15px;
}

.save_editPost_title {
    margin: 10px;
    font-size: 17px;
}

/* .wrapper_save_editPost_btn {} */

.save_editPost_btn {
    width: 70px;
    margin-left: 5px;
    margin-right: 5px;
}

.wrapper_title_text {
    margin: 0px 10px 10px;
    font-size: 17px;
}

.wrapper_write_comments {
    border-top: 1px solid;
    padding: 0px 8px 13px 8px;
}

.wrapper_block_photo_post {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}

.wrapper_photo_post {
    width: 20%;
    height: 150px;
    margin: 10px;
    border-radius: 8px;
    overflow: hidden;
}

.photo_post {
    width: 100%;
    /* height: 240px; */
    height: inherit;
    -o-object-fit: cover;
    object-fit: cover;
}

.size_photo_1 {
    width: 100%;
    height: auto;
    max-height: 450px;
}

.wrapper_message_user {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid;
    margin-top: 10px;
    padding-top: 10px;

}

.message_name_user {
    display: flex;
    align-items: center;
}

.message_name {
    padding-left: 5px;
    font-size: 14px;
    cursor: pointer;
    font-family: cursive;
    font-weight: 600;
}

.message_time {
    font-size: 15px;
}

.message_text {
    margin-left: 10px;
    font-size: 15px;
    /* border-bottom: 1px solid; */
    padding-bottom: 10px;
}

.message_text p {
    word-break: break-word;
}

.dialog_ava_user img {
    width: 30px;
    border-radius: 100%;
    cursor: pointer;
}

wrapper_under_comment {
    display: flex;
    margin: 10px 10px 20px 30px;
}

.under_comment_ava_user img {
    width: 25px;
    border-radius: 100%;
    cursor: pointer;
}

.wrapper_block_under_comment_user {
    width: 100%;
}

.wrapper_under_comment_user {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.under_comment_name_user {
    display: flex;
    align-items: center;
}

.under_comment_name {
    padding-left: 5px;
    font-size: 13px;
    cursor: pointer;
    font-family: cursive;
    font-weight: 600;
}

.under_comment_time {
    font-size: 13px;
}

.under_comment_text {
    margin-left: 10px;
    font-size: 14px;
}

.under_comment_text p {
    word-break: break-word;
}
</style>