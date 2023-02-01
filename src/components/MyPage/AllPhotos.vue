<template>
    <CloseModal @click="setIsModalAllPhotos(false)" />

    <div class="wrapper_contents_allPhotos">
        <div class="wrapper_preview_allPhotos">
            <div class="all_photos" id="preview_myPhoto" v-for="(photo, index) in getAllPhotosMyPage" :key="index">

                <img class="photo" :src="require(`../../assets/photo/${photo.photo_name}`)" :alt="photo.photo_name">

            </div>

            <!--при прокрутки страницы до данного элемента - подгружать следующие фотографии -->
            <div ref="observer" class="observer"></div>
        </div>

    </div>



</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import CloseModal from '../UI/CloseModal.vue';


export default {
    components: { CloseModal },
    name: "AllPhotos",

    data() {
        return {
        };
    },

    mounted() {
        // обсервер срабатывает каждый раз когда докручиваем страницу донизу
        const options = {
            rootMargin: '0px',
            threshold: 1.0
        };
        const callback = (entries) => {
            if (entries[0].isIntersecting) {
                this.setLimitPhoto();
                this.setCountPhoto();
                this.loadAllPhotos();

            }
        };
        const observer = new IntersectionObserver(callback, options);
        observer.observe(this.$refs.observer);
    },


    methods: {

        observe() {
            console.log(111)
        },

        //закрытие окна с загрузкой картинок
        ...mapMutations({
            setIsModalAllPhotos: "loadPhotoStore/setIsModalAllPhotos",
            setCountPhoto: "loadPhotoStore/setCountPhoto",
            setLimitPhoto: "loadPhotoStore/setLimitPhoto",

        }),
        ...mapActions({
            loadAllPhotos: "loadPhotoStore/loadAllPhotos",
        }),
    },

    computed: {
        ...mapGetters({
            getAllPhotosMyPage: "loadPhotoStore/getAllPhotosMyPage",
        }),
    },
}

</script>

<style scoped>
.wrapper_contents_allPhotos {
    width: 740px;
    display: flex;
    padding: 40px 20px;
}

.wrapper_preview_allPhotos {
    display: flex;
    flex-wrap: wrap;
    max-height: 600px;
    justify-content: center;
}

.all_photos {
    width: 150px;
    height: 150px;
    margin: 10px;
    border-radius: 8px;
    overflow: hidden;
}

.photo {
    height: 100%;
    min-width: 100%;
    left: 50%;
    position: relative;
    transform: translateX(-50%);
}

.observer {
    display: block;
    width: 100%;
    border: 1px solid;
    height: 1px;
    background: black;
}
</style>

