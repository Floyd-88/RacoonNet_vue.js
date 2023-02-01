<template>
  <div class="modal_fone">
    <div @click.stop class="modal_window">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "UImodal",

  methods: {
  },

  computed: {
    ...mapGetters({getModal: "modalStore/getModal"}),
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
  z-index: 3;
}
.modal_window {
  position: relative;
  background: white;
  width: max-content;
  height: max-content;
  padding-bottom: 10px;
  border-radius: 5px;
  background: white;
  box-shadow: 0px 5px 10px 0px rgb(0 0 0 / 70%);
  overflow: auto;
}
.close_modal {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 30px;
  height: 30px;
  cursor: pointer;
  border: 1px solid black;
    background-image: url("../../assets/icons/close.svg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

</style>