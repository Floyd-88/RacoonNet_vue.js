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
                                        <div class="wrapper_block_photo_post_first">
                                            <template v-for="(photo) in getPhotosPostNotice.slice(0, 1)" :key="photo.id">
                                                <div class="wrapper_photo_post size_photo_1">
                                                    <UIPhoto :photo="photo" />
                                                </div>
                                            </template>
                                        </div>

                                        <div class="wrapper_block_photo_post_another"
                                            v-if="getPhotosPostNotice.slice(1).length > 0">
                                            <template v-for="(photo) in getPhotosPostNotice.slice(1)" :key="photo.id">
                                                <div class="wrapper_photo_post photo_another">
                                                    <UIPhoto :photo="photo" />
                                                </div>
                                            </template>
                                        </div>
                                    </div>
                                    <!-- ------ -->

                                    <!-- пост -->
                                    <div class="wrapper_text_post wrapper_text_post_comment"
                                        v-if="getSelectNotice.postText.length < 400">
                                        <p class="text_post">
                                            {{ postText(getSelectNotice.postText) }}
                                        </p>
                                    </div>
                                    <div class="wrapper_text_post" v-else>
                                        <p class="text_post" v-if="!getSelectNotice.isFullText">
                                            {{ postText(getSelectNotice.postText).slice(0, 400) }}
                                        </p>
                                        <p class="text_post" v-else>
                                            {{ postText(getSelectNotice.postText) }}
                                        </p>
                                        <p class="more_text_post" v-if="!getSelectNotice.isFullText"
                                            @click="moreTextPost(getSelectNotice)">
                                            Показать еще
                                        </p>
                                    </div>

                                    <!-- ----- -->

                                    <!-- комент -->
                                    <div class="wrapper_message_user">
                                        <div class="message_name_user">
                                            <div class="dialog_ava_user"
                                                @click="$emit('getUserNotice', getSelectNotice.userID_addressee)">
                                                <UIAva :ava="getSelectNotice.ava_addressee" />
                                            </div>
                                            <p class="message_name"
                                                @click="$emit('getUserNotice', getSelectNotice.userID_addressee)">
                                                {{ getSelectNotice.name_addressee + " " +
                                                    getSelectNotice.surname_addressee }}
                                            </p>
                                        </div>
                                    </div>

                                    <div class="message_text">
                                        <div v-if="getSelectNotice.comment_post_text.length < 200">
                                            <p class="text_post text_post_comment">
                                                {{ postText(getSelectNotice.comment_post_text) }}
                                            </p>
                                        </div>
                                        <div v-else>
                                            <p class="text_post text_post_comment"
                                                v-if="!getSelectNotice.isFullTextComment">
                                                {{ postText(getSelectNotice.comment_post_text).slice(0, 200) }}
                                            </p>
                                            <p class="text_post text_post_comment" v-else>
                                                {{ postText(getSelectNotice.comment_post_text) }}
                                            </p>
                                            <p class="more_text_post" v-if="!getSelectNotice.isFullTextComment"
                                                @click="moreTextComment(getSelectNotice)">
                                                Показать еще
                                            </p>
                                        </div>

                                        <!-- ---- -->

                                        <!-- ответ на комент -->
                                        <div class="wrapper_under_comment">
                                            <div class="wrapper_block_under_comment_user">
                                                <div class="wrapper_under_comment_user">
                                                    <div class="under_comment_name_user">
                                                        <div class="under_comment_ava_user"
                                                            @click="$emit('getUserNotice', getSelectNotice.userID)">
                                                            <UIAva :ava="getSelectNotice.ava" />
                                                        </div>
                                                        <p class="under_comment_name"
                                                            @click="$emit('getUserNotice', getSelectNotice.userID)">{{
                                                                getSelectNotice.name + " " +
                                                                getSelectNotice.surname }}</p>
                                                    </div>
                                                    <div class="under_comment_time">
                                                        <p>{{ getSelectNotice.date.slice(0, 10) }}</p>
                                                    </div>
                                                </div>
                                                <div class="under_comment_text">

                                                    <div v-if="getSelectNotice.comment_comment_text.length < 200">
                                                        <p class="text_post text_post_under_comment">
                                                            {{ postText(getSelectNotice.comment_comment_text) }}
                                                        </p>
                                                    </div>
                                                    <div v-else>
                                                        <p class="text_post text_post_under_comment"
                                                            v-if="!getSelectNotice.isFullTextUnderComment">
                                                            {{ postText(getSelectNotice.comment_comment_text).slice(0,
                                                                200) }}
                                                        </p>
                                                        <p cclass="text_post text_post_under_comment" v-else>
                                                            {{ postText(getSelectNotice.comment_comment_text) }}
                                                        </p>
                                                        <p class="more_text_post more_text_under_post"
                                                            v-if="!getSelectNotice.isFullTextUnderComment"
                                                            @click="moreTextCommentComments(getSelectNotice)">
                                                            Показать еще
                                                        </p>

                                                    </div>
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
                        <div class="wrapper_ava_posts" @click="$emit('getUserNotice', getSelectNotice.userID_addressee)">
                            <UIAva :ava="getSelectNotice.ava_addressee" />
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
                                        <div class="wrapper_block_photo_post_first">
                                            <template v-for="(photo) in getPhotosPostNotice.slice(0, 1)" :key="photo.id">
                                                <div class="wrapper_photo_post size_photo_1">
                                                    <UIPhoto :photo="photo" />
                                                </div>
                                            </template>
                                        </div>

                                        <div class="wrapper_block_photo_post_another"
                                            v-if="getPhotosPostNotice.slice(1).length > 0">
                                            <template v-for="(photo) in getPhotosPostNotice.slice(1)" :key="photo.id">
                                                <div class="wrapper_photo_post photo_another">
                                                    <UIPhoto :photo="photo" />

                                                </div>
                                            </template>
                                        </div>
                                    </div>

                                    <!-- пост -->
                                    <div class="wrapper_text_post" v-if="getSelectNotice.postText.length < 400">
                                        <p class="text_post">
                                            {{ postText(getSelectNotice.postText) }}
                                        </p>
                                    </div>
                                    <div class="wrapper_text_post" v-else>
                                        <p class="text_post" v-if="!getSelectNotice.isFullText">
                                            {{ postText(getSelectNotice.postText).slice(0, 400) }}
                                        </p>
                                        <p class="text_post" v-else>
                                            {{ postText(getSelectNotice.postText) }}
                                        </p>
                                        <p class="more_text_post" v-if="!getSelectNotice.isFullText"
                                            @click="moreTextPost(getSelectNotice)">
                                            Показать еще
                                        </p>
                                    </div>

                                    <!-- -- -->

                                    <div class="wrapper_message_user">
                                        <div class="message_name_user">
                                            <div class="dialog_ava_user"
                                                @click="$emit('getUserNotice', getSelectNotice.userID)">
                                                <UIAva :ava="getSelectNotice.ava" />
                                            </div>
                                            <p class="message_name" @click="$emit('getUserNotice', getSelectNotice.userID)">
                                                {{ getSelectNotice.name + " " + getSelectNotice.surname }}
                                            </p>
                                        </div>
                                        <div class="message_time">
                                            <p>{{ getSelectNotice.date.slice(0, 10) }}</p>
                                        </div>
                                    </div>

                                    <!-- комментарий к посту -->
                                    <div class="message_text">
                                        <div v-if="getSelectNotice.comment_post_text.length < 200">
                                            <p class="text_post text_post_comment">
                                                {{ postText(getSelectNotice.comment_post_text) }}
                                            </p>
                                        </div>
                                        <div v-else>
                                            <p class="text_post text_post_comment"
                                                v-if="!getSelectNotice.isFullTextComment">
                                                {{ postText(getSelectNotice.comment_post_text).slice(0, 200) }}
                                            </p>
                                            <p class="text_post text_post_comment" v-else>
                                                {{ postText(getSelectNotice.comment_post_text) }}
                                            </p>
                                            <p class="more_text_post" v-if="!getSelectNotice.isFullTextComment"
                                                @click="moreTextComment(getSelectNotice)">
                                                Показать еще
                                            </p>
                                        </div>
                                    </div>
                                    <!-- -- -->

                                </div>
                            </div>
                        </div>

                    </template>

                    <!-- уведомление о новом посте или лайке поста -->
                    <template v-else-if="getSelectNotice.postText || getSelectNotice.photos">

                        <template v-if="getSelectNotice.text_notice === 'написал что то на Вашей стене'">
                            <div class="wrapper_ava_posts" @click="$emit('getUserNotice', getSelectNotice.userID)">
                                <UIAva :ava="getSelectNotice.ava" />

                            </div>
                            <div class="wrapper_post_user">

                                <div class="wrapper_post_name">
                                    <p class="post_name" @click="$emit('getUserNotice', getSelectNotice.userID)">
                                        {{ getSelectNotice.name + " " + getSelectNotice.surname }}
                                    </p>
                                </div>

                                <div class="wrapper_data_post">
                                    <p class="data_post">{{ getSelectNotice.date }}</p>
                                </div>

                                <!-- фотографии к посту -->
                                <div class="wrapper_block_photo_post" v-if="getSelectNotice.photos">
                                    <div class="wrapper_block_photo_post_first">
                                        <template v-for="(photo) in getPhotosPostNotice.slice(0, 1)" :key="photo.id">
                                            <div class="wrapper_photo_post size_photo_1">
                                                <UIPhoto :photo="photo" />
                                            </div>
                                        </template>
                                    </div>

                                    <div class="wrapper_block_photo_post_another"
                                        v-if="getPhotosPostNotice.slice(1).length > 0">
                                        <template v-for="(photo) in getPhotosPostNotice.slice(1)" :key="photo.id">
                                            <div class="wrapper_photo_post photo_another">
                                                <UIPhoto :photo="photo" />
                                            </div>
                                        </template>
                                    </div>
                                </div>

                                <div class="wrapper_text_post" v-if="getSelectNotice.postText.length < 400">
                                    <div>
                                        <p class="text_post">{{ postText(getSelectNotice.postText) }}</p>
                                    </div>
                                </div>
                                <div class="wrapper_text_post" v-else>
                                    <p class="text_post" v-if="!getSelectNotice.isFullText">
                                        {{ postText(getSelectNotice.postText.slice(0, 400)) }}
                                    </p>
                                    <p class="text_post" v-else>
                                        {{ postText(getSelectNotice.postText) }}
                                    </p>
                                    <p class="more_text_post" v-if="!getSelectNotice.isFullText"
                                        @click="moreTextPost(getSelectNotice)">
                                        Показать еще
                                    </p>
                                </div>
                            </div>
                        </template>

                        <template v-else-if="getSelectNotice.text_notice === 'отметил Вашу запись'">
                            <div class="wrapper_ava_posts"
                                @click="$emit('getUserNotice', getSelectNotice.userID_addressee)">
                                <UIAva :ava="getSelectNotice.ava_addressee" />
                            </div>
                            <div class="wrapper_post_user">
                                <div class="wrapper_post_name">
                                    <p class="post_name" @click="$emit('getUserNotice', getSelectNotice.userID_addressee)">
                                        {{ getSelectNotice.name_addressee + " " + getSelectNotice.surname_addressee }}
                                    </p>
                                </div>

                                <!-- фотографии к посту -->
                                <div class="wrapper_block_photo_post" v-if="getSelectNotice.photos">
                                    <div class="wrapper_block_photo_post_first">
                                        <template v-for="(photo) in getPhotosPostNotice.slice(0, 1)" :key="photo.id">
                                            <div class="wrapper_photo_post size_photo_1">
                                                <UIPhoto :photo="photo" />
                                            </div>
                                        </template>
                                    </div>

                                    <div class="wrapper_block_photo_post_another"
                                        v-if="getPhotosPostNotice.slice(1).length > 0">
                                        <template v-for="(photo) in getPhotosPostNotice.slice(1)" :key="photo.id">
                                            <div class="wrapper_photo_post photo_another">
                                                <UIPhoto :photo="photo" />
                                            </div>
                                        </template>
                                    </div>
                                </div>

                                <div class="wrapper_text_post" v-if="getSelectNotice.postText.length < 400">
                                    <div>
                                        <p class="text_post">{{ postText(getSelectNotice.postText) }}</p>
                                    </div>
                                </div>
                                <div class="wrapper_text_post" v-else>
                                    <p class="text_post" v-if="!getSelectNotice.isFullText">
                                        {{ postText(getSelectNotice.postText.slice(0, 400)) }}
                                    </p>
                                    <p class="text_post" v-else>
                                        {{ postText(getSelectNotice.postText) }}
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
                        <div class="wrapper_ava_posts" @click="$emit('getUserNotice', getSelectNotice.userID_addressee)">
                            <UIAva :ava="getSelectNotice.ava_addressee" />
                        </div>

                        <div class="wrapper_post_user">
                            <div class="wrapper_post_name">
                                <p class="post_name" @click="$emit('getUserNotice', getSelectNotice.userID_addressee)">
                                    {{ getSelectNotice.name_addressee + " " + getSelectNotice.surname_addressee }}
                                </p>
                            </div>

                            <div class="wrapper_text_post">
                                <div class="text_post">
                                    <div class="wrapper_block_photo_post_first wrapper_block_photo_post_first_one_photo">
                                        <div class="wrapper_photo_post size_photo_1" v-if="getSelectNotice.photo_name">
                                            <UIPhoto :photo="getSelectNotice" />
                                        </div>
                                    </div>


                                    <div class="wrapper_message_user">
                                        <div class="message_name_user">
                                            <div class="dialog_ava_user"
                                                @click="$emit('getUserNotice', getSelectNotice.userID)">
                                                <UIAva :ava="getSelectNotice.ava" />
                                            </div>
                                            <p class="message_name" @click="$emit('getUserNotice', getSelectNotice.userID)">
                                                {{ getSelectNotice.name + " " + getSelectNotice.surname }}
                                            </p>
                                        </div>
                                        <div class="message_time">
                                            <p>{{ getSelectNotice.date.slice(0, 10) }}</p>
                                        </div>
                                    </div>

                                    <div class="message_text">

                                        <div v-if="getSelectNotice.comment_photo_text.length < 100">
                                            <p class="text_post">
                                                {{ postText(getSelectNotice.comment_photo_text) }}
                                            </p>
                                        </div>
                                        <div v-else>
                                            <p class="text_post" v-if="!getSelectNotice.isFullTextCommentPhoto">
                                                {{ postText(getSelectNotice.comment_photo_text).slice(0, 100) }}
                                            </p>
                                            <p class="text_post" v-else>
                                                {{ postText(getSelectNotice.comment_photo_text) }}
                                            </p>
                                            <p class="more_text_post" v-if="!getSelectNotice.isFullTextCommentPhoto"
                                                @click="moreTextCommentPhoto(getSelectNotice)">
                                                Показать еще
                                            </p>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>

                    <!-- уведомление о новом лайке фотографии-->
                    <template v-else-if="getSelectNotice.photo_name">
                        <div class="wrapper_ava_posts" @click="$emit('getUserNotice', getSelectNotice.userID_addressee)">
                            <UIAva :ava="getSelectNotice.ava_addressee" />

                        </div>

                        <div class="wrapper_post_user">
                            <div class="wrapper_post_name">
                                <p class="post_name" @click="$emit('getUserNotice', getSelectNotice.userID_addressee)">
                                    {{ getSelectNotice.name_addressee + " " + getSelectNotice.surname_addressee }}
                                </p>
                            </div>

                            <div class="wrapper_text_post">
                                <div class="text_post">
                                    <div class="wrapper_block_photo_post_first wrapper_block_photo_post_first_one_photo">
                                        <div class="wrapper_photo_post size_photo_1">
                                            <UIPhoto :photo="getSelectNotice" />
                                        </div>
                                    </div>
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
import CloseModal from '../UI/CloseModal.vue';
import { mapActions, mapGetters, mapMutations } from "vuex";
export default {
    name: "NoticeOneUser",
    components: { CloseModal },
    emits: ['getUserNotice'],

    async mounted() {
        if (this.getSelectNotice.show_notice === 0) {
            await this.REMOVE_COUNT_NOTICE_LIST(this.getSelectNotice.id);
            this.getSelectNotice.show_notice = 1;
        }

    },

    methods: {
        ...mapMutations({
            setIsShowModalWindowOneNotice: "noticeStore/setIsShowModalWindowOneNotice",
            setPhotosPostNotice: "noticeStore/setPhotosPostNotice"
        }),

        ...mapActions({
            REMOVE_COUNT_NOTICE_LIST: "noticeStore/REMOVE_COUNT_NOTICE_LIST"
        }),

        moreTextPost(getSelectNotice) {
            getSelectNotice.isFullText = true;
        },

        closeModalWindowOneNotice() {
            this.setIsShowModalWindowOneNotice(false);
            this.setPhotosPostNotice([]);
        },

        postText(value) {
            let doc = new DOMParser().parseFromString(value, "text/html");
            return doc.documentElement.textContent;
        },

        moreTextComment(getSelectNotice) {
            getSelectNotice.isFullTextComment = true;
        },

        moreTextCommentComments(getSelectNotice) {
            getSelectNotice.isFullTextUnderComment = true;
        },

        moreTextCommentPhoto(getSelectNotice) {
            getSelectNotice.isFullTextCommentPhoto = true;
        }
    },

    computed: {
        ...mapGetters({
            getNoticeArray: "noticeStore/getNoticeArray",
            getSelectNotice: "noticeStore/getSelectNotice",
            getPhotosPostNotice: "noticeStore/getPhotosPostNotice"
        }),
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
    padding-left: 10px;
}

.wrapper_post_name {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
    margin-top: 20px;
}

.post_show_btn {
    margin-right: 10px;
    font-size: 20px;
    line-height: 17px;
    cursor: pointer;
}

.post_name {
    font-size: 18px;
    font-family: Russo One, fantasy, sans-serif;
    cursor: pointer;
}

.wrapper_data_post {
    margin-bottom: 10px;
}

.data_post {
    font-size: 13px;
    font-family: Roboto Condensed, Arial, Helvetica, sans-serif;
}

.wrapper_text_post {
    padding-right: 6px;
    /* padding-left: 6px; */
}

.text_post {
    word-break: break-word;
    padding-top: 10px;
    font-size: 15px;
    font-family: Roboto Condensed, Arial, Helvetica, sans-serif;
}

.text_post_comment {
    font-size: 14px;
}

.text_post_under_comment {
    font-size: 13.5px;
}

.more_text_post {
    font-weight: 600;
    cursor: pointer;
    display: inline-block;
    font-size: 14px;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    color: black;
}

.more_text_under_post {
    font-size: 13.5px;
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
    justify-content: center;
    flex-direction: row;
    max-height: 450px;
    width: 100%;
    padding: 2% 3% 0 2%;
}

.wrapper_block_photo_post_first {
    display: flex;
    width: 75%;
    /* flex: 1.5; */
    /* background-color: rgb(0 0 0 / 10%); */
    align-items: center;
    justify-content: center;
}

.wrapper_block_photo_post_another {
    display: flex;
    flex-direction: column;
    width: 22%;
    /* flex: 1; */
    /* background-color: rgb(0 0 0 / 10%); */
    margin-left: 10px;
}

.wrapper_photo_post {
    height: -webkit-fill-available;
    /* margin: 10px; */
    padding-bottom: 10px;
    /* border-radius: 8px; */
    overflow: hidden;
}

.photo_post {
    width: 100%;
    height: 100%;
    -o-object-fit: cover;
    object-fit: cover;
    border-radius: 8px;
    /* cursor: pointer; */
}

.size_photo_1 {
    width: 100%;
    height: auto;
    max-height: 450px;
}

.size_photo_1 {
    width: 100%;
    height: 100%;
    /* max-height: 450px; */
}

.wrapper_message_user {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid;
    margin-top: 10px;
    margin-right: 20px;
    margin-left: 10px;
    padding-top: 10px;

}

.message_name_user {
    display: flex;
    align-items: center;
}

.message_name {
    padding-left: 5px;
    cursor: pointer;
    font-size: 13.5px;
    font-family: Russo One, fantasy, sans-serif;
}

.message_time {
    font-size: 13px;
    font-family: Roboto Condensed, Arial, Helvetica, sans-serif;
}

.message_text {
    margin-left: 20px;
    font-size: 14px;
    font-family: Roboto Condensed, Arial, Helvetica, sans-serif;
    padding-bottom: 10px;
    margin-right: 20px;
}

.message_text p {
    padding-top: 0;
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
    margin-top: 10px;
    margin-left: 10px;
    padding-right: 40px;
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
    font-family: Russo One, fantasy, sans-serif;
}

.under_comment_time {
    font-size: 13px;
    font-family: Roboto Condensed, Arial, Helvetica, sans-serif;
}

.under_comment_text {
    margin-left: 10px;
    /* font-size: 13px; */
}

@media (max-width: 761px) {

    .wrapper_post {
        flex-direction: column;
    }

    .wrapper_ava_posts {
        margin: 5px;
        display: flex;
        justify-content: center;
    }

    .wrapper_post_name {
        display: flex;
        justify-content: center;
        margin-top: 5px;
    }

    .wrapper_post_user {
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding-left: 10px;
        padding-right: 10px;
    }

    .wrapper_all_messages_users {
        max-width: 350px;
        min-width: 350px;
    }

    .wrapper_text_post {
        padding-right: 0px;
        padding-left: 0px;
    }

    .wrapper_block_photo_post_first_one_photo {
        margin: 0 auto;
    }
}
</style>