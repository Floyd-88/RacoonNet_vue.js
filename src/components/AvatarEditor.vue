<template>
    <div class="wrapper_edit_ava">
        <div class="block_vue_avatar">
            <vue-avatar class="vue_avatar" :width="400" :height="400" :borderRadius="borderRadius" :scale="scale"
                ref="vueavatar" @vue-avatar-editor:image-ready="onImageReady"
                :image="photo_name ? require(`../assets/${photo_name}`) : ''">
            </vue-avatar>
            <div class="preview_info" :class="{ 'active_load': getProgressLoadPhoto }">
                <!-- полоса загрузки фото -->
                <template v-if="getProgressLoadPhoto">
                    <div class="preview_info_progress" :style="{ 'width': getProgressLoadPhoto }">
                        {{ getProgressLoadPhoto }}
                    </div>
                </template>
            </div>
        </div>
        <div class="block_scale">
            <label>
                Zoom : {{ computedScaleNumber }}x
                <br>
                <input type="range" min=1 max=3 step=0.02 v-model='computedScaleNumber' />
            </label>
        </div>
        <div class="block_radius">
            <label>
                Radius : {{ computedRadiusNumber }}px
                <br>
                <input type="range" min=0 max=200 step=1 v-model='computedRadiusNumber' />
            </label>
        </div>

        <div class="block_btn_save_ava">
            <UIbtn @:click="saveClicked" v-if="btn_save">Сохранить изображение</UIbtn>
        </div>
    </div>
</template>

<script>
import { VueAvatar } from 'vue-avatar-editor-improved'
import UIbtn from './UI/UIbtn.vue';
import { mapActions, mapGetters, mapMutations } from "vuex";

export default {
    name: "AvatarEditor",
    components: {
        VueAvatar,
        UIbtn
    },
    props: {
        photo_name: {
            type: String,
            default: "",
        }
    },

    data: function data() {
        return {
            scale: 1,
            borderRadius: 0,
            btn_save: false

        };
    },

    methods: {
        ...mapActions({
            addAvaServer: "loadPhotoStore/addAvaServer",
        }),
        ...mapMutations({ setUserAva: "authorizationStore/setUserAva" }),

        saveClicked: function saveClicked() {
            let img = this.$refs.vueavatar.getImageScaled();
            this.addAvaServer(img.toDataURL())
                .then((res) => {
                    setTimeout(() => {
                        this.setUserAva(res.data.ava);
                    }, 3000)
                })
            this.btn_save = false
        },

        onImageReady: function onImageReady() {
            this.scale = 1;
            this.btn_save = true;
        },
    },

    computed: {

        ...mapGetters({ getProgressLoadPhoto: "loadPhotoStore/getProgressLoadPhoto" }),

        computedScaleNumber: {
            get() {
                return +this.scale
            },
            set(val) {
                this.scale = +val
            }
        },

        computedRadiusNumber: {
            get() {
                return +this.borderRadius
            },
            set(val) {
                this.borderRadius = +val
            }
        }
    }
}
</script>

<style scoped>
.wrapper_edit_ava {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.vue_avatar {
    height: 450px;
    background: whitesmoke;
}

.block_scale {
    margin-top: 10px;
    color: whitesmoke;
}

.block_radius {
    margin-bottom: 10px;
    color: whitesmoke;

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

.active_load {
    bottom: 4px;
}
</style>