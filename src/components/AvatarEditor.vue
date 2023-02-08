<template>
    <div class="wrapper_edit_ava">
        <div class="block_vue_avatar">
            <vue-avatar :width="400" :height="400" :borderRadius="borderRadius" :scale="scale" ref="vueavatar"
                @vue-avatar-editor:image-ready="onImageReady">
            </vue-avatar>
        </div>

        <div class="block_scale">
            <label>
                Zoom : {{ computedScaleNumber }}
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
// import Vue from 'vue'
import { VueAvatar } from 'vue-avatar-editor-improved'
import UIbtn from './UI/UIbtn.vue';
import { mapMutations, mapGetters, mapActions } from "vuex";


export default {
    name: "AvatarEditor",
    components: {
        VueAvatar,
        UIbtn
    },
    data: function data() {
        return {
            scale: 1,
            borderRadius: 0,
            btn_save: false
        };
    },

    methods: {
        ...mapMutations({}),
    ...mapActions({
        addAvaServer: "loadPhotoStore/addAvaServer"
        }),

        saveClicked: function saveClicked() {
            let img = this.$refs.vueavatar.getImageScaled();
            this.addAvaServer(img.toDataURL())
            this.btn_save = false
        },

        onImageReady: function onImageReady() {
            this.scale = 1;
            this.btn_save = true;
        }
    },

    computed: {
        ...mapGetters({}),

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

.block_vue_avatar {}

.block_scale {}

.block_radius {
    margin-bottom: 10px;
}

.block_btn_save_ava {}

.result_image {}
</style>