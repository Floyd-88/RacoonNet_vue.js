<template>
    <CloseModal @click="setIsModalAllPhotos(false)"/>

    <h2 class="title_pthoto_name">Все фотографии</h2>
    <div class="wrapper_contents_allPhotos">
        <div class="wrapper_preview_allPhotos">
            <div class="all_photos" id="preview_myPhoto" 
            v-for="(photo, index) in getAllPhotosMyPage.slice(0, getLimitAllPhoto)" 
            :key="index"
            @click="fullSizePhoto({bool: true, elem: index, id: photo.id})">
                <UIPhoto :photo="photo"/>
            </div>

            <!--при прокрутки страницы до данного элемента - подгружать следующие фотографии -->
            <div ref="observer" class="observer"></div>
        </div>

    </div>



</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import CloseModal from './UI/CloseModal.vue';

export default {
    name: "AllPhotos",
    components: { CloseModal },

    mounted() {
        // обсервер срабатывает каждый раз когда докручиваем страницу донизу
        const options = {
            rootMargin: "0px",
            threshold: 0.1
        };
        const callback = (entries) => {
            if (entries[0].isIntersecting) {
                this.setLimitAllPhoto(8);
                // this.loadAllPhotos(this.$route.params.id);
            }
        };
        const observer = new IntersectionObserver(callback, options);
        observer.observe(this.$refs.observer);
    },
    methods: {
        ...mapMutations({
            setIsModalAllPhotos: "loadPhotoStore/setIsModalAllPhotos",
            // setCountPhoto: "loadPhotoStore/setCountPhoto",
            setLimitAllPhoto: "loadPhotoStore/setLimitAllPhoto",
        }),
        ...mapActions({
            // loadAllPhotos: "loadPhotoStore/loadAllPhotos",
            fullSizePhoto: "showFullPhotoStore/fullSizePhoto"
        }),
    },
    computed: {
        ...mapGetters({
            getAllPhotosMyPage: "loadPhotoStore/getAllPhotosMyPage",
            // getUser: "authorizationStore/getUser",
            getLimitAllPhoto: "loadPhotoStore/getLimitAllPhoto"
        }),
    },
    
}

</script>

<style scoped>
.title_pthoto_name {
    margin-top: 10px;
    margin-left: 40px;
    font-family: Russo One, fantasy, sans-serif;
    font-size: 20px;
}
.wrapper_contents_allPhotos {
    width: 740px;
    display: flex;
    padding: 20px;
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
    width: inherit;
    height: inherit;
    object-fit: cover;
    cursor: pointer;
}

.observer {
    display: block;
    width: 100%;
    border: 1px solid;
    height: 1px;
    background: black;
    opacity: 0;
}

.closeModalAllPhoto {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    right: 0;
    cursor: auto;
}

/* МЕДИА-ЗАПРОСЫ */

@media (max-width: 761px) {

    .wrapper_contents_allPhotos {
    width: 360px;
    padding: 0px;
}
}
</style>

