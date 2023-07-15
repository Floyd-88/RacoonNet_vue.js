<template>
    <div class="wrapper_contents_myPhoto wrapper_contents_myPhoto_header" v-if="getIsShowCat">
        <div class="wrapper_header_checkboxes">
            <div class="header_checkboxes">
                <input type="checkbox" id="1" value="Абстрактные/Графика/3D" v-model="chooseCat" />
                <label for="1">Абстрактные/Графика/3D</label>
            </div>
            <div class="header_checkboxes">
                <input type="checkbox" id="2" value="Аниме" v-model="chooseCat" />
                <label for="2">Аниме</label>
            </div>
            <div class="header_checkboxes">
                <input type="checkbox" id="3" value="Арты" v-model="chooseCat" />
                <label for="3">Арты</label>
            </div>
            <div class="header_checkboxes">
                <input type="checkbox" id="4" value="Город" v-model="chooseCat" />
                <label for="4">Город</label>
            </div>
            <div class="header_checkboxes">
                <input type="checkbox" id="5" value="Горы" v-model="chooseCat" />
                <label for="5">Горы</label>
            </div>
            <div class="header_checkboxes">
                <input type="checkbox" id="6" value="Девушки" v-model="chooseCat" />
                <label for="6">Девушки</label>
            </div>
            <div class="header_checkboxes">
                <input type="checkbox" id="7" value="Животные" v-model="chooseCat" />
                <label for="7">Животные</label>
            </div>
            <div class="header_checkboxes">
                <input type="checkbox" id="8" value="Компьютер" v-model="chooseCat" />
                <label for="8">Компьютер</label>
            </div>
            <div class="header_checkboxes">
                <input type="checkbox" id="9" value="Космос" v-model="chooseCat" />
                <label for="9">Космос</label>
            </div>
            <div class="header_checkboxes">
                <input type="checkbox" id="10" value="Любовь" v-model="chooseCat" />
                <label for="10">Любовь</label>
            </div>
            <div class="header_checkboxes">
                <input type="checkbox" id="11" value="Машины" v-model="chooseCat" />
                <label for="11">Машины</label>
            </div>
            <div class="header_checkboxes">
                <input type="checkbox" id="12" value="Море" v-model="chooseCat" />
                <label for="12">Море</label>
            </div>
            <div class="header_checkboxes">
                <input type="checkbox" id="13" value="Музыка" v-model="chooseCat" />
                <label for="13">Музыка</label>
            </div>
            <div class="header_checkboxes">
                <input type="checkbox" id="14" value="Мультфильмы" v-model="chooseCat" />
                <label for="14">Мультфильмы</label>
            </div>
            <div class="header_checkboxes">
                <input type="checkbox" id="15" value="Отношения" v-model="chooseCat" />
                <label for="15">Отношения</label>
            </div>
            <div class="header_checkboxes">
                <input type="checkbox" id="16" value="Пейзажи" v-model="chooseCat" />
                <label for="16">Пейзажи</label>
            </div>
            <div class="header_checkboxes">
                <input type="checkbox" id="17" value="Персонажи" v-model="chooseCat" />
                <label for="17">Персонажи</label>
            </div>
            <div class="header_checkboxes">
                <input type="checkbox" id="18" value="Приколы" v-model="chooseCat" />
                <label for="18">Приколы</label>
            </div>
            <div class="header_checkboxes">
                <input type="checkbox" id="19" value="Природа" v-model="chooseCat" />
                <label for="19">Природа</label>
            </div>
            <div class="header_checkboxes">
                <input type="checkbox" id="20" value="Развлечение" v-model="chooseCat" />
                <label for="20">Развлечение</label>
            </div>
            <div class="header_checkboxes">
                <input type="checkbox" id="21" value="Разные" v-model="chooseCat" />
                <label for="21">Разные</label>
            </div>
            <div class="header_checkboxes">
                <input type="checkbox" id="22" value="Романтика" v-model="chooseCat" />
                <label for="22">Романтика</label>
            </div>
            <div class="header_checkboxes">
                <input type="checkbox" id="23" value="Семья" v-model="chooseCat" />
                <label for="23">Семья</label>
            </div>
            <div class="header_checkboxes">
                <input type="checkbox" id="24" value="Спорт" v-model="chooseCat" />
                <label for="24">Спорт</label>
            </div>
            <div class="header_checkboxes">
                <input type="checkbox" id="25" value="Страшные" v-model="chooseCat" />
                <label for="25">Страшные</label>
            </div>
            <div class="header_checkboxes">
                <input type="checkbox" id="26" value="Фильмы" v-model="chooseCat" />
                <label for="26">Фильмы</label>
            </div>
            <div class="header_checkboxes">
                <input type="checkbox" id="27" value="Фэнтези" v-model="chooseCat" />
                <label for="27">Фэнтези</label>
            </div>
            <div class="header_checkboxes">
                <input type="checkbox" id="28" value="Цветы" v-model="chooseCat" />
                <label for="28">Цветы</label>
            </div>
            <div class="header_checkboxes">
                <input type="checkbox" id="29" value="Черно-белые" v-model="chooseCat" />
                <label for="29">Черно-белые</label>
            </div>
            <div class="header_checkboxes">
                <input type="checkbox" id="30" value="not category" v-model="chooseCat" />
                <label for="30">Без темы</label>
            </div>
        </div>

        <!-- <div class="wrapper_checkboxes_filter">
            <p>Отмеченные имена: {{ getCheckedCat }}</p>
        </div> -->

        <div class="wrapper_checkboxes_filter_btn">
            <UIbtn class="checkboxes_filter_btn" @click="GET_PHOTO_FILTER_THEMA()">Отфильтровать</UIbtn>
            <UIbtn class="checkboxes_filter_btn checkboxes_filter_btn_not" @click="GET_PHOTO_NOT_FILTER()">Убрать все фильтры </UIbtn>

        </div>
</div>
</template>

<script>
import UIbtn from "@/components/UI/UIbtn.vue";
import { mapGetters, mapMutations, mapActions } from "vuex";

export default {
    name: "CategoryFilter",
    data() {
        return {
            // checkedCat: [],
        }
    },

    methods: {
        ...mapMutations({setCheckedCat: "galleryStore/setCheckedCat"}),
        ...mapActions({
            GET_PHOTO_FILTER_THEMA: "galleryStore/GET_PHOTO_FILTER_THEMA",
            GET_PHOTO_NOT_FILTER: "galleryStore/GET_PHOTO_NOT_FILTER"
        })
    },

    computed: {
        ...mapGetters({
            getIsShowCat: "galleryStore/getIsShowCat",
            getCheckedCat: "galleryStore/getCheckedCat"
        }),

        chooseCat: {
            get() {
               return this.getCheckedCat;
            },
            set(value) {
                this.setCheckedCat(value);
            }
        }
    },

  components: { UIbtn }
}

</script>

<style scoped>
.wrapper_header_checkboxes {
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
}

.header_checkboxes {
  padding: 0 10px 5px 2px;
  display: flex;
  align-items: center;
}

.header_checkboxes label {
  padding-left: 3px;
}

.wrapper_checkboxes_filter {
  margin-bottom: 15px;
}

.wrapper_checkboxes_filter_btn {
  margin-bottom: 15px;
}

.checkboxes_filter_btn {
  background: #0197d6c2;
}
.checkboxes_filter_btn_not {
    margin-left: 10px;
    background: whitesmoke;
}
</style>