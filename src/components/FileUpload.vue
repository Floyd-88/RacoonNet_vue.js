<template>
    <CloseModal @click="cancelLoadPhoto()" />

    <form class="form_load_photo">

        <div class="wrapper_load_photo">
            <input class="load_photo" type="file" ref="files" @change="choosePhotoInput" multiple>
        </div>
        <div class="wrapper_message_error">
            <p class="message_error">
                {{ getMessageLoadPhoto }}
            </p>
        </div>
        
        <div class="wrapper_preview_photos">
            <div class="preview_image" v-for="(url, index) in getUrlsImages" :key="index">

                <div class="preview_remove"
                     v-if="!getProgressLoadPhoto" 
                     @click="removePreviewImage(url.name)">
                     &times;
                </div>

                <img class="preview_photo" 
                    :src="url.url" 
                    :alt="url.name">

                <div class="preview_info" :class="{'active_load': getProgressLoadPhoto}">
                    <!-- размер фото -->
                   <template v-if="!getProgressLoadPhoto">
                    <span>
                        {{ url.name }}
                    </span>
                        {{ bytesToSize(url.size) }}
                   </template> 
                
                   <!-- полоса загрузки фото -->
                   <template v-if="getProgressLoadPhoto">
                    <div class="preview_info_progress" 
                         :style="{'width': getProgressLoadPhoto}">
                        {{getProgressLoadPhoto}}
                    </div>
                   </template>
                </div>
                
            </div>
        </div>

        <div class="wrapper_add_photo">
            <UIbtn v-if="!getUrlsImages.length" @click.prevent="choosePhoto()">
                Выбрать фотографии
            </UIbtn>

            <UIbtn v-if="getUrlsImages.length > 0" @click.prevent="addNewPhotoServer($event)" :disabled="getArrayLoadImage.length < 1">
                Добавить фотографии
            </UIbtn>
        </div>

    </form>
</template>

<script>
import CloseModal from './UI/CloseModal.vue';
import UIbtn from './UI/UIbtn.vue';
import { mapActions, mapGetters, mapMutations} from 'vuex';


export default {
    components: { CloseModal, UIbtn },
    name: "FileUpload",

    props:{
        addresseeID: {
            type: String,
            default: "",
        }
    },

    data() {
        return {

        };
    },

    methods: {
        ...mapMutations({
            setIsModalLoadPhoto: "loadPhotoStore/setIsModalLoadPhoto",
            setArrayLoadImage: "loadPhotoStore/setArrayLoadImage",
            setMessageLoadPhoto: "loadPhotoStore/setMessageLoadPhoto",
            setUrlsImages: "loadPhotoStore/setUrlsImages",
            removeArrayLoadImage: "loadPhotoStore/removeArrayLoadImage"
        }),
        
        ...mapActions({
            removePreviewImage: "loadPhotoStore/removePreviewImage",
            addPhotoServer: "loadPhotoStore/addPhotoServer",
            cancelLoadPhoto: "loadPhotoStore/cancelLoadPhoto"
        }),

        choosePhoto() {
            //сбрасываем загрузчик что бы можно было выбрать тот же файл еще раз
            this.$refs.files.value = null;

            //при клике на кнопку срабатывает инпут
            this.$refs.files.click();
            this.setMessageLoadPhoto("");
        },

        choosePhotoInput() {
            let photoFiles = {};

            //указываем допустимые форматы картинки
            const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

            //проверяем выбрана ли картинка
            if (!this.$refs.files.files) {
                return
            }

            if(this.$refs.files.files.length > 5) {
                this.setMessageLoadPhoto("Вы не можете загрузить больше 5 фотографий за один раз");
                photoFiles = Array.prototype.slice.call(this.$refs.files.files, 0, 5);
            } else {
                photoFiles = this.$refs.files.files;
            }
            
            //трансформируем выбранные картинки в массив
            this.setArrayLoadImage(Array.from(photoFiles));  
            
            //переберам массив выбранных картинок
            this.getArrayLoadImage.forEach(file => {
                //если картинка не соответствует формату или размеру показываем сообщение
                if (!allowedTypes.includes(file.type)) {
                    this.setMessageLoadPhoto("Формат одного из выбранных файлов не поддерживается, он не будет загружен");
                    this.removeArrayLoadImage(file.name);
                    return   
                }
                if (file.size > 5000000) {
                    this.setMessageLoadPhoto("Размер одной из фоторгафий превышает допустимый, она не будет загружена");
                    this.removeArrayLoadImage(file.name);
                    return
                }

                //получаем исходный код по выбранным картинкам
                const reader = new FileReader;
                reader.onload = ev => {
                    this.setUrlsImages({ url: ev.target.result, name: file.name.toLowerCase(), size: file.size })
                }
                reader.readAsDataURL(file)
            })
        },

        addNewPhotoServer(event) {
                console.log(this.addresseeID)
                this.addPhotoServer({event: event, addresseeID: this.addresseeID})
                .then((resp) => {
                    if(resp[0][5] === 0 || resp[0][5] === undefined) {
                    window.location.href = `/id${JSON.parse(this.getUser.userID)}`;
                    }
                })
            },

        //конвертирует байты
        bytesToSize: function (bytes) {
            const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
            if (!bytes) {
                return '0 Byte'
            }
            const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
            return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i]
        }
    },

    computed: {
        ...mapGetters({
            getMessageLoadPhoto: "loadPhotoStore/getMessageLoadPhoto",
            getArrayLoadImage: "loadPhotoStore/getArrayLoadImage",
            getUrlsImages: "loadPhotoStore/getUrlsImages",
            getProgressLoadPhoto: "loadPhotoStore/getProgressLoadPhoto",
            getUser: "authorizationStore/getUser"
    })
    }
}
</script>

<style>
.form_load_photo {
    display: flex;
    width: 600px;
    flex-direction: column-reverse;
}

.wrapper_load_photo {
    display: none;
}

.wrapper_add_photo {
    margin: 5px 10px
}

/* .load_photo {} */

.wrapper_preview_photos {
    display: flex;
    justify-content: center;
    max-height: 600px;
    flex-wrap: wrap;
    padding: .5rem;
}

.preview_image {
    width: 180px;
    height: 180px;
    position: relative;
    margin-bottom: .5rem;
    margin-right: .5rem;
    overflow: hidden;
}

.preview_photo {
    width: 100%;
    height: auto;
}

/* .preview_image.removing {
    transform: scale(0);
    transition: transform .3s;
} */

.preview_image:hover .preview_remove {
    opacity: 1;
}

.preview_image:hover .preview_info {
    bottom: 4px;
}

.preview_remove {
    opacity: 0;
    width: 20px;
    height: 20px;
    position: absolute;
    right: 0;
    top: 0;
    font-weight: bold;
    background: rgba(255, 255, 255, .5);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: opacity .22s;
}

.preview_info {
    position: absolute;
    right: 0;
    bottom: -30px;
    left: 0;
    height: 24px;
    font-size: .8rem;
    background: rgba(255, 255, 255, .5);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 5px;
    transition: bottom .22s;
}

.preview_info_progress {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    background: #42b983;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: width .22s;
    /* bottom: 4px; */
}

.active_load {
    bottom: 4px;
}

.wrapper_message_error {
    margin: 0 10px 10px;
    font-family: emoji;
    font-size: 14px;
    color: red;
}

/* .message_error {
} */
</style>

