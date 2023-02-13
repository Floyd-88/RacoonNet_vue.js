<template>
    <div class="wrapper_edit_ava">
        <div class="block_vue_avatar">
            <vue-avatar class="vue_avatar" :width="400" :height="400" :borderRadius="borderRadius" :scale="scale" ref="vueavatar"
                @vue-avatar-editor:image-ready="onImageReady"
                :image="pathAva"
                
                >
            </vue-avatar>
        </div>
        <div class="block_scale">
            <label>
                Zoom : {{ computedScaleNumber }}x
                <br>
                <input type="range" min=1 max=3 step=0.02 v-model='computedScaleNumber' />
            </label>
        </div>
<!-- <div>{{ sliderAvaEdit }}</div> -->
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
import { mapActions } from "vuex";

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
        },
    },

    computed: {
     
        pathAva() {
      try {
        return require(`../assets/photo/${this.photo_name}`);
      } catch {
        return "";
      }

    },

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

.block_vue_avatar {
}

.vue_avatar  {
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

.block_btn_save_ava {}

.result_image {}
</style>