<template>
    <CloseModal @click="closeModalPhoto(false)" />

    <form class="form_load_photo">

        <div class="wrapper_load_photo">
            <input class="load_photo" type="file" ref="files" @change="onSelect" multiple>
        </div>
        {{ message }}

        <div class="wrapper_preview_photos">
            <div class="preview_image" v-for="(url, index) in urls" :key="index">
                <div class="preview_remove" @click="removeFile(url.name)">&times;</div>
                <img class="preview_photo" :src="url.url" :alt="url.name">
                <div class="preview_info">
                    <span>{{ url.name }}</span>
                    {{ bytesToSize(url.size) }}
                </div>
            </div>
        </div>

        <div class="wrapper_add_photo">
            <UIbtn v-if="!files.length" @click.prevent="addFiles()">
                Открыть фотографии
            </UIbtn>

            <UIbtn v-if="files.length > 0" @click.prevent="onSubmit" :disabled="files.length < 1">
                Загрузить фотографии
            </UIbtn>
        </div>


    </form>
</template>

<script>
import axios from 'axios';
import CloseModal from './CloseModal.vue';
import UIbtn from './UIbtn.vue';


export default {

    components: { CloseModal, UIbtn },

    name: "FileUpload",
    emits: ["showModalPhoto"],

    data() {
        return {
            message: "",
            files: [],
            urls: [],
        };
    },
    methods: {
        //закрытие окна с загрузкой картинок
        closeModalPhoto: function (bool) {
            this.$emit("showModalPhoto", bool)
        },

        //при клике на кнопку срабатывае инпут
        addFiles() {
            this.$refs.files.click();
        },

        onSelect() {
            //указываем допустимые форматы картинки
            const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

            //проверяем выбрана ли картинка
            if (!this.$refs.files.files) {
                return
            }



            //трансформируем выбранные картинки в массив
            this.files = Array.from(this.$refs.files.files);

            //переберам массив выбранных картинок
            this.files.forEach(file => {

                //если картинка не соответствует формату или размеру показываем сообщение
                if (!allowedTypes.includes(file.type)) {
                    this.message = "Формат выбранного файла не поддерживается"
                    this.files = [];
                    return
                }
                if (file.size > 5000000) {
                    this.message = 'Размер фотографии слишком большой'
                    this.files = [];
                    return
                }

                //получаем исходный код по выбранным картинкам
                const reader = new FileReader;
                reader.onload = ev => {
                    this.urls.push({ url: ev.target.result, name: file.name, size: file.size })
                }
                reader.readAsDataURL(file)
            })
        },

        //удаление картинок на предпросмотре
        removeFile(name) {
            this.files = this.files.filter(i => i.name != name);
            this.urls = this.urls.filter(i => i.name != name);
        },

        //загрузка картинок на сервер
        onSubmit: function () {
            const formData = new FormData();

            for (let i = 0; i < this.files.length; i++) {
                let file = this.files[i];
                formData.append('files[' + i + ']', file);
            }

            axios.post(
                'http://localhost:8000/upload_photo',
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            ).then((res) => {
                console.log(res.data);
                this.message = "Фото загрузились!"
                this.closeModalPhoto(false)
                this.files = [];
                this.urls = [];
            })
                .catch((err) => {
                    console.log(err);
                    this.message = "При загрузке фото произошла ошибка, попробуйте еще раз"
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

.load_photo {}

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
</style>

