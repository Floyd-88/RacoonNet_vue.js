<template>
    <CloseModal @click="setIsModalLoadPhoto(false)" />

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
                <div class="preview_remove" @click="removePreviewImage(url.name)">&times;</div>
                <img class="preview_photo" :src="url.url" :alt="url.name">
                <div class="preview_info">
                    <span>{{ url.name }}</span>
                    {{ bytesToSize(url.size) }}
                </div>
            </div>
        </div>

        <div class="wrapper_add_photo">
            <UIbtn v-if="!getArrayLoadImage.length" @click.prevent="choosePhoto()">
                Выбрать фотографии
            </UIbtn>

            <UIbtn v-if="getArrayLoadImage.length > 0" @click.prevent="addPhotoServer" :disabled="getArrayLoadImage.length < 1">
                Добавить фотографии
            </UIbtn>
        </div>


    </form>
</template>

<script>
import CloseModal from './CloseModal.vue';
import UIbtn from './UIbtn.vue';
import { mapActions, mapGetters, mapMutations} from 'vuex';


export default {
    components: { CloseModal, UIbtn },
    name: "FileUpload",

    data() {
        return {
        };
    },

    methods: {
        ...mapMutations({
            setIsModalLoadPhoto: "loadPhotoStore/setIsModalLoadPhoto",
            setArrayLoadImage: "loadPhotoStore/setArrayLoadImage",
            setMessageLoadPhoto: "loadPhotoStore/setMessageLoadPhoto",
            setUrlsImages: "loadPhotoStore/setUrlsImages"
        }),
        
        ...mapActions({
            removePreviewImage: "loadPhotoStore/removePreviewImage",
            addPhotoServer: "loadPhotoStore/addPhotoServer"
        }),

        choosePhoto() {
            //сбрасываем загрузчик что бы можно было выбрать тот же файл еще раз
            this.$refs.files.value = null;

            //при клике на кнопку срабатывает инпут
            this.$refs.files.click();
            this.setMessageLoadPhoto("");
        },

        choosePhotoInput() {
            //указываем допустимые форматы картинки
            const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

            //проверяем выбрана ли картинка
            if (!this.$refs.files.files) {
                return
            }

            //трансформируем выбранные картинки в массив
            this.setArrayLoadImage(Array.from(this.$refs.files.files))          

            //переберам массив выбранных картинок
            this.getArrayLoadImage.forEach(file => {

                //если картинка не соответствует формату или размеру показываем сообщение
                if (!allowedTypes.includes(file.type)) {
                    this.setMessageLoadPhoto("Формат выбранного файла не поддерживается, попробуйте выбрать другой файл");
                    this.setArrayLoadImage([]);
                    return
                }
                if (file.size > 10000000) {
                    this.setMessageLoadPhoto("Размер загружаемого файла слишком большой, попробуйте выбрать другой файл");
                    this.setArrayLoadImage([]);
                    return
                }

                //получаем исходный код по выбранным картинкам
                const reader = new FileReader;
                reader.onload = ev => {
                    this.setUrlsImages({ url: ev.target.result, name: file.name, size: file.size })
                }
                reader.readAsDataURL(file)
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
            getUser: "authorizationStore/getUser",
            getMessageLoadPhoto: "loadPhotoStore/getMessageLoadPhoto",
            getArrayLoadImage: "loadPhotoStore/getArrayLoadImage",
            getUrlsImages: "loadPhotoStore/getUrlsImages",
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

