<template>
  <div class="modal_fone"
       v-if="showModal">
    <div @click.stop class="modal_window">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "UImodal",

  props: {
    showModal: {
      type: Boolean,
    }
  }

}
</script>

<style scoped>
.modal_fone {
  display: flex;
  position: fixed;
  background: rgba(0,0,0,0.5);
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  align-items: center;
  justify-content: center;
  z-index: 1;
}
.modal_window {
  background: white;
  /*border-radius: 18px;*/
  width: 450px;
  height: 80%;
  border-radius: 5px;
  background: white;
  box-shadow: 0px 5px 10px 0px rgb(0 0 0 / 70%);
}
</style>