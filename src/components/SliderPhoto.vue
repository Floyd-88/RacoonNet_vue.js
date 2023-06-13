<template>
    <template v-if="!isEditAva">
        <div class="wrapper_block_full_size" :class="{'wrapper_block_full_size_action': getMessageID}">
            <!-- <transition-group name='fade' tag='div'> -->
            <div class="wrapper_block_full_size_img" :class="{'wrapper_block_full_size_img_action': getMessageID}">
                <div class="wrapper_full_size_img">
                    <img class="full_size_img" v-if="currentImg.photo"
                        :src="myPhotos(currentImg.photo.photo_name)" :alt="currentImg.photo.photo_name" />
                </div>
                <!-- </transition-group> -->
                <!-- <button class="prev" v-on:click.left="setPrevIndexPhoto" >&#10094;</button> -->
                <a class="prev" @click.prevent="setPrevIndexPhoto" href='#'>&#10094;</a>
                <a class="next" @click.prevent="setNextIndexPhoto" href='#'>&#10095;</a>

                <div class="wrapper_block_info_photo">
                    <div class="wrapper_block_info_name_count_photo">
                        <div class="wrapper_block_info_name">
                            <p>Фотографии: {{ getIndexPhoto + 1 }} из {{ currentImg.photosMessageArray?.length || currentImg.photosPostArray?.length || getAllPhotosMyPage.length }}</p>
                        </div>
                    </div>
                    <div class="wrapper_block_info_remove_photo">
                        <button class="remove_photo" v-if="getUser.is_editProfile && getUser.userID === currentImg.photo.userID" @click="isEditAva = true">
                            Сделать главной
                        </button>
                        <button class="remove_photo" v-if="getUser.is_editProfile && getUser.userID === currentImg.photo.userID"
                            @click="setModulePhotoRemove(true)">Удалить</button>
                    </div>
                </div>
            </div>

            <!-- блок комментариев -->
            <template v-if="currentImg.photo && !getMessageID">
                <CommentsPhoto :currentImg="currentImg.photo" />
            </template>
        </div>

        <template v-if="getModulePhotoRemove">
            <UImodal>
                <div class="wrapper_save_editPost">
                    <div class="wrapper_title_text">
                        <p>Вы уверены что хотите удалить эту фотографию?</p>
                    </div>

                    <div class="wrapper_save_editPost_btn">
                        <UIbtn class="save_editPost_btn" type="submit"
                            @click="removePhoto({ name: currentImg.photo.photo_name, photoID: currentImg.photo.photoID || undefined, countPhotoPost: currentImg.photosPostArray?.length })">
                            Удалить
                        </UIbtn>

                        <UIbtn class="save_editPost_btn" @click="setModulePhotoRemove(false)">
                            Отменить
                        </UIbtn>

                    </div>
                </div>
            </UImodal>
        </template>
    </template>

    <template v-else>
        <div class="wrapper_block_full_size_ava">
            <div class="wrapper_block_full_size_img_ava">
                <div class="wrapper_full_size_img_ava">
                    <AvatarEditor :photo_name="currentImg.photo.photo_name" />
                </div>
            </div>
        </div>
    </template>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
export default {
    name: "SliderPhoto",
    data() {
        return {
            isEditAva: false,
        };
    },
    created() {
        //перелистывание фото стрелками клавиатуры
        document.onkeydown = (e) => {
            switch (e.keyCode) {
                case 37:
                    if (!this.getIsFocusComment) {
                        this.setPrevIndexPhoto();
                    }
                    break;
                case 39:
                    if (!this.getIsFocusComment) {
                        this.setNextIndexPhoto();
                    }
                    break;
                case 27:
                    this.closeModalFullSize(false);
                    break;
            }
        };
    },

    beforeUnmount() {
        this.setCommentsPhotoArray([])
    },

    methods: {
        ...mapMutations({
            setIndexPhoto: "showFullPhotoStore/setIndexPhoto",
            setNextIndexPhoto: "showFullPhotoStore/setNextIndexPhoto",
            setPrevIndexPhoto: "showFullPhotoStore/setPrevIndexPhoto",
            setModulePhotoRemove: "loadPhotoStore/setModulePhotoRemove",
            setPhotoId: "loadPhotoStore/setPhotoId",
            setCommentsPhotoArray: "commentsPhoto/setCommentsPhotoArray",
            setIsModalFullSize: "showFullPhotoStore/setIsModalFullSize",
            setPostID: "showFullPhotoStore/setPostID",
            setMessageID: "showFullPhotoStore/setMessageID"
        }),
        ...mapActions({
            removePhoto: "loadPhotoStore/removePhoto",
            closeModalFullSize: "showFullPhotoStore/closeModalFullSize",
            LOAD_COMMENTS_PHOTO: "commentsPhoto/LOAD_COMMENTS_PHOTO"
        }),

        myPhotos(photo) {
            try {
                return require(`../assets/photo/${photo}`);
            } catch (err) {
                return require(`../assets/ava/ava_1.jpg`);
            }
        },
    },
    computed: {
        ...mapGetters({
            getUser: "authorizationStore/getUser",
            getAllPhotosMyPage: "loadPhotoStore/getAllPhotosMyPage",
            getIndexPhoto: "showFullPhotoStore/getIndexPhoto",
            getModulePhotoRemove: "loadPhotoStore/getModulePhotoRemove",
            getIdPhoto: "loadPhotoStore/getIdPhoto",
            getPhotosPostsArray: "postsMyPageStore/getPhotosPostsArray",
            getPhotosMessagesArray: "messageStore/getPhotosMessagesArray",
            getPostID: "showFullPhotoStore/getPostID",
            getIsFocusComment: "commentsPhoto/getIsFocusComment",
            getMessageID: "showFullPhotoStore/getMessageID"
        }),

        currentImg: function () {

            if (this.getPostID === "" && this.getMessageID === "") {
                
                if (this.getAllPhotosMyPage.length > 0) {
                    this.setCommentsPhotoArray([])

                    if (this.getIndexPhoto === -1) {
                        this.setIndexPhoto(this.getAllPhotosMyPage.length - 1);
                    }
                    let photo = this.getAllPhotosMyPage[Math.abs(this.getIndexPhoto) % this.getAllPhotosMyPage.length];
                    if (this.getIndexPhoto >= this.getAllPhotosMyPage.length) {
                        this.setIndexPhoto(0);
                    } else if (this.getIndexPhoto < 0) {
                        this.setIndexPhoto(this.getAllPhotosMyPage.length - 1);
                    }
                    this.setPhotoId(photo.id);
                    this.LOAD_COMMENTS_PHOTO(photo.id)
                    return { photo };
                }
                return [];
            } else if (this.getMessageID) {
                if (this.getPhotosMessagesArray.length > 0) {
                    let photosMessageArray = this.getPhotosMessagesArray.filter(photo => photo.id === this.getMessageID)
                    // this.setCommentsPhotoArray([])

                    if (photosMessageArray.length > 0) {
                        if (this.getIndexPhoto === -1) {
                            this.setIndexPhoto(photosMessageArray.length - 1);
                        }
                        let photo = photosMessageArray[Math.abs(this.getIndexPhoto) % photosMessageArray.length];

                        if (this.getIndexPhoto >= photosMessageArray.length) {
                            this.setIndexPhoto(0);
                        } else if (this.getIndexPhoto < 0) {
                            this.setIndexPhoto(photosMessageArray.length - 1);
                        }
                        if (photo) {
                            this.setPhotoId(photo.photoID);
                            // this.LOAD_COMMENTS_PHOTO(photo.photoID)
                            return { photo, photosMessageArray };
                        }
                    } else {
                        this.setIsModalFullSize(false);
                        document.body.style.overflow = "auto";
                        this.setMessageID("");
                    }
                }
                return [];
            } else {
                if (this.getPhotosPostsArray.length > 0) {
                    let photosPostArray = this.getPhotosPostsArray.filter(photo => photo.id === this.getPostID)
                    this.setCommentsPhotoArray([])

                    if (photosPostArray.length > 0) {
                        if (this.getIndexPhoto === -1) {
                            this.setIndexPhoto(photosPostArray.length - 1);
                        }
                        let photo = photosPostArray[Math.abs(this.getIndexPhoto) % photosPostArray.length];

                        if (this.getIndexPhoto >= photosPostArray.length) {
                            this.setIndexPhoto(0);
                        } else if (this.getIndexPhoto < 0) {
                            this.setIndexPhoto(photosPostArray.length - 1);
                        }
                        if (photo) {
                            this.setPhotoId(photo.photoID);
                            this.LOAD_COMMENTS_PHOTO(photo.photoID);
                           
                            return { photo, photosPostArray };
                        }
                    } else {
                        console.log('tttt')

                        this.setIsModalFullSize(false);
                        console.log(this.getPostID)

                        document.body.style.overflow = "auto";
                        this.setPostID("");
                    }
                }
                return [];
            }
        }

    }
}
</script>

<style scoped>
/* .fade-enter-active, .fade-leave-active {
  transition: all 1s;
} 
.fade-enter, .fade-leave-to {
  opacity: 0; 
  transform: translateX(30px);
} */

.wrapper_block_full_size_ava {
    display: flex;
    width: 700px;
    height: 90vh;
    flex-direction: row;
    overflow: hidden;
}

.wrapper_block_full_size_img_ava {
    width: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: black;
    justify-content: center;
}

.wrapper_full_size_img_ava {
    width: 100%;
    height: 100%;
    background: rgb(16 16 16);
    display: flex;
    align-items: center;
    justify-content: center;
}

.wrapper_block_full_size {
    display: flex;
    width: 1000px;
    height: 90vh;
    flex-direction: row;
    overflow: hidden;
}
.wrapper_block_full_size_action {
    width: 700px;
}


.wrapper_block_full_size_img {
    width: 70%;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: black;
    justify-content: center;
}
.wrapper_block_full_size_img_action {
    width: 100%;
}

.wrapper_full_size_img {
    width: 100%;
    height: -webkit-fill-available;
}

.full_size_img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding-bottom: 30px;
}

.prev,
.next {
    cursor: pointer;
    position: absolute;
    top: 45%;
    width: auto;
    padding: 16px;
    color: white;
    background-color: rgba(0, 0, 0, 0.9);
    font-weight: bold;
    font-size: 18px;
    transition: 0.7s ease;
    border-radius: 0 4px 4px 0;
    text-decoration: none;
    user-select: none;
    opacity: 0;
}

.next {
    right: 0;
}

.prev {
    left: 0;
}

.next:hover,
.prev:hover {
    opacity: 1;
}

.wrapper_full_size_img:hover~.prev {
    opacity: 1;
}

.wrapper_full_size_img:hover~.next {
    opacity: 1;
}

.wrapper_block_info_photo {
    display: flex;
    background: black;
    width: 100%;
    justify-content: space-between;
    padding: 6px 30px;
    position: absolute;
    bottom: 0;
    color: white;
}

.wrapper_block_info_name_count_photo {
    display: flex;
}

.wrapper_block_info_name {
    font-family: Russo One, fantasy, sans-serif;
}

.wrapper_block_info_count {}

.wrapper_block_info_remove_photo {}

.remove_photo {
    border: none;
    background: repeat;
    color: white;
    font-family: Russo One, fantasy, sans-serif;
    font-size: 15px;
    padding-left: 30px
}

.remove_photo:hover {
    filter: brightness(80%);
    cursor: pointer;
}

.wrapper_save_editPost {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 15px;
    margin-bottom: 10px;
}

.wrapper_title_text {
    margin-bottom: 15px;
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
</style>