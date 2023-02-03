<template>
    <div>
        <!-- <transition-group name='fade' tag='div'> -->
        <div class="wrapper_full_size_img">
            <img class="full_size_img" :src="require(`../../assets/photo/${currentImg.photo_name}`)" alt="currentImg" />
        </div>
        <!-- </transition-group> -->
        <a class="prev" @click="setPrevIndexPhoto" href='#'>&#10094;</a>
        <a class="next" @click="setNextIndexPhoto" href='#'>&#10095;</a>
    </div>


</template>

<script>
import { mapGetters, mapMutations } from "vuex";
export default {
    name: 'SliderPhoto',
    data() {
        return {
        }
    },
    methods: {
        ...mapMutations({
            setIndexPhoto: "showFullPhotoStore/setIndexPhoto",

            setNextIndexPhoto: "showFullPhotoStore/setNextIndexPhoto",
            setPrevIndexPhoto: "showFullPhotoStore/setPrevIndexPhoto"
        }),
    },
    computed: {
        ...mapGetters({ 
            getAllPhotosMyPage: "loadPhotoStore/getAllPhotosMyPage",
            getIndexPhoto: "showFullPhotoStore/getIndexPhoto"
    }),
        currentImg: function () {
            if(this.getIndexPhoto === -1) {
                this.setIndexPhoto(this.getAllPhotosMyPage.length - 1);
            } 
            return this.getAllPhotosMyPage[Math.abs(this.getIndexPhoto) % this.getAllPhotosMyPage.length];
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


.wrapper_full_size_img {
    display: flex;
    height: 90vh;
    width: auto;
}

.full_size_img {
    width: 100%;
    height: auto;
}

.prev,
.next {
    cursor: pointer;
    position: absolute;
    top: 40%;
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
.next:hover, .prev:hover {
    opacity: 1;
}

.wrapper_full_size_img:hover~.prev{
    opacity: 1;
}
.wrapper_full_size_img:hover~.next{
    opacity: 1;
}
</style>