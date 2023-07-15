<template>
    <div class="wrapper_contents_myPhoto wrapper_contents_myPhoto_header">
        <div class="wrapper_header_btns">
            <div class="header_btn_show cat">
                <UIbtn class="header_btn_filter" @click="setIsShowCat">Отфильтровать по темам</UIbtn>
            </div>
            <div class="header_btns_load_photo">

                <!-- выбрать как загружать фото - с темой или без -->
                <div>
                    <select class="select_cat_photo_sel_change" v-model="selectedLoadPhoto">
                        <option selected disabled value="">Загрузить фотографии</option>
                        <option value="thema">Загрузить с темой</option>
                        <option value="not_thema">Загрузить без темы</option>
                    </select>
                </div>

                <!-- загрузка с темой -->
                <template v-if="selectedLoadPhoto === 'thema'">
                    <div class="btn_load_cat_photo">
                        <div class="select_cat_photo">
                            <select class="select_cat_photo_sel" v-model="changeThemaPhoto">
                                <option class="select_cat_photo_opt" disabled selected value="">Выбрать тему</option>
                                <option class="select_cat_photo_opt" value="Абстрактные/Графика/3D">Абстрактные/Графика/3D
                                </option>
                                <option class="select_cat_photo_opt" value="Аниме">Аниме</option>
                                <option class="select_cat_photo_opt" value="Арты">Арты</option>
                                <option class="select_cat_photo_opt" value="Город">Город</option>
                                <option class="select_cat_photo_opt" value="Горы">Горы</option>
                                <option class="select_cat_photo_opt" value="Девушки">Девушки</option>
                                <option class="select_cat_photo_opt" value="Друзья">Друзья</option>
                                <option class="select_cat_photo_opt" value="Животные">Животные</option>
                                <option class="select_cat_photo_opt" value="Компьютер">Компьютер</option>
                                <option class="select_cat_photo_opt" value="Космос">Космос</option>
                                <option class="select_cat_photo_opt" value="Любовь">Любовь</option>
                                <option class="select_cat_photo_opt" value="Машины">Машины</option>
                                <option class="select_cat_photo_opt" value="Море">Море</option>
                                <option class="select_cat_photo_opt" value="Музыка">Музыка</option>
                                <option class="select_cat_photo_opt" value="Мультфильмы">Мультфильмы</option>
                                <option class="select_cat_photo_opt" value="Отношения">Отношения</option>
                                <option class="select_cat_photo_opt" value="Пейзажи">Пейзажи</option>
                                <option class="select_cat_photo_opt" value="Персонажи">Персонажи</option>
                                <option class="select_cat_photo_opt" value="Приколы">Приколы</option>
                                <option class="select_cat_photo_opt" value="Природа">Природа</option>
                                <option class="select_cat_photo_opt" value="Развлечение">Развлечение</option>
                                <option class="select_cat_photo_opt" value="Разные">Разные</option>
                                <option class="select_cat_photo_opt" value="Романтика">Романтика</option>
                                <option class="select_cat_photo_opt" value="Семья">Семья</option>
                                <option class="select_cat_photo_opt" value="Спорт">Спорт</option>
                                <option class="select_cat_photo_opt" value="Страшные">Страшные</option>
                                <option class="select_cat_photo_opt" value="Фильмы">Фильмы</option>
                                <option class="select_cat_photo_opt" value="Фэнтези">Фэнтези</option>
                                <option class="select_cat_photo_opt" value="Цветы">Цветы</option>
                                <option class="select_cat_photo_opt" value="Черно-белые">Черно-белые</option>
                            </select>
                        </div>
                    </div>
                </template>
                
                <!-- загрузка без темы -->
                <template v-if="selectedLoadPhoto === 'not_thema'">
                    <div class="btn_load_photo">
                        <UIbtn class="show_more_photo_btn" @click="loadPhotoNotThema">
                            Загрузить фото
                        </UIbtn>
                    </div>
                </template>

            </div>
        </div>
</div>
</template>
  
<script>
import UIbtn from "@/components/UI/UIbtn.vue";
import { mapGetters, mapMutations, mapActions } from "vuex";


export default {
    name: "HeaderGallery",
    data() {
        return {
            selectedLoadPhoto: "",
        };
    },

    methods: {
        ...mapMutations({
            setIsModalLoadPhoto: "loadPhotoStore/setIsModalLoadPhoto",
            setIsShowCat: "galleryStore/setIsShowCat",
            setSelectedLoadThemaPhoto: "galleryStore/setSelectedLoadThemaPhoto"
        }),

        ...mapActions({}),

        loadPhotoNotThema() {
            this.setSelectedLoadThemaPhoto("");
            this.setIsModalLoadPhoto(true);
        }

    },

    computed: {
        ...mapGetters({
            getSelectedLoadThemaPhoto: "galleryStore/getSelectedLoadThemaPhoto"
        }),

        changeThemaPhoto: {
            get() {
                return this.getSelectedLoadThemaPhoto;
            },
            set(value) {
                this.setSelectedLoadThemaPhoto(value)
            }
        }
    },

    watch: {
        getSelectedLoadThemaPhoto() {
            this.setIsModalLoadPhoto(true)
        }
    },

    components: { UIbtn }
}
</script>
  
  
<style scoped>
.wrapper_contents_myPhoto_header {
    margin-bottom: 10px;
}

.wrapper_header_btns {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 50px;
    padding: 5px 5px 5px 15px;
}

.header_btn_show {}

.header_btns_load_photo {
    display: flex;
    align-items: center;
}

.btn_load_cat_photo {
    display: flex;
    align-items: center;
    margin-left: 10px;
}

.select_cat_photo {}

.select_cat_photo_sel_change {
    width: 190px;
    border-radius: 5px;
    border: 0px solid black;
    padding: 5px;
    font-family: Russo One, fantasy, sans-serif;
    cursor: pointer;
    color: black;
    box-shadow: 0px 2px 3px 0px rgb(0 0 0 / 40%);
    outline: none;
}

.select_cat_photo_sel {
    width: 135px;
    border-radius: 5px;
    border: 0px solid black;
    padding: 5px;
    background: gainsboro;
    font-family: Russo One, fantasy, sans-serif;
    cursor: pointer;
    color: black;
    box-shadow: 0px 2px 3px 0px rgb(0 0 0 / 40%);
    outline: none;
}

.select_cat_photo_opt {}

.btn_load_photo {}

.show_more_photo_btn {}


@media (max-width: 761px) {
    .wrapper_header_btns {
    height: auto;
    flex-direction: column;
}

.header_btn_show {
    margin-bottom: 10px;
}

.btn_load_cat_photo {
    display: flex;
    align-items: center;
    margin-left: 0px;
    margin-top: 10px;
}

.btn_load_photo {
    margin-top: 10px;
}

.select_cat_photo_sel {
width: 190px;
    font-size: 13px;
}

.show_more_photo_btn {
    width: 190px;
}

.header_btns_load_photo{
    flex-direction: column;
}

.header_btn_filter {
    width: 190px;
}
}
</style>
  