<template>
<div class="wrapper_load_more_contents">
  <div class="dot_load_more_contents" :class="{'active_dot_load_more_contents_1': showDot_1}"></div>
  <div class="dot_load_more_contents" :class="{'active_dot_load_more_contents_2': showDot_2}"></div>
  <div class="dot_load_more_contents" :class="{'active_dot_load_more_contents_3': showDot_3}"></div>  
</div>
</template>

<script>
// import {mapActions} from "vuex";

export default {
  name: "UIloadMoreContent",

  data() {
    return {
      showDot_1: false,
      showDot_2: false,
      showDot_3: false,
      timerDot: () => {},
    }
  },

  mounted() {
    console.log('start dot')
    this.showLoadDot();
      this.timerDot = setInterval(() => {
      this.showLoadDot()
    }, 1200)
  },

  beforeUnmount() {
    console.log('end dot')
    clearInterval(this.timerDot);
  },

  methods: {
    showLoadDot() {

      setTimeout(() => {
        this.showDot_1 = true;
        
        setTimeout(() => {
            this.showDot_2 = true;

            setTimeout(() => {
              this.showDot_3 = true;

              setTimeout(() => {
                  this.showDot_1 = false;
                  this.showDot_2 = false;
                  this.showDot_3 = false;
              }, 300)

            }, 300)

          }, 300)

      }, 300)
    }
  }
}
</script>

<style scoped>
.wrapper_load_more_contents {
  display: flex;
  justify-content: center;
  margin-bottom: 5px;
}
.dot_load_more_contents {
  margin: 0 5px 0 5px;
    display: inline-block;
    width: 0.7em;
    height: 0.7em;
    vertical-align: middle;
    text-decoration: none;
    border-radius: 100%;
    background: rgb(245,245,245) linear-gradient(rgb(245,245,245), rgb(188,192,193)) 50% 50% / calc(1.5em + 0.5em*2) calc(1.5em + 0.5em*2);
    box-shadow: inset 0 -3px 10px rgba(255,255,255,1), inset 0 3px 10px rgba(0,0,0,.4), 0 2px 4px rgba(0,0,0,.9);
    opacity: 0;
}
.active_dot_load_more_contents_1 {
opacity: 1;
}
.active_dot_load_more_contents_2 {
  opacity: 1;

}
.active_dot_load_more_contents_3 {
  opacity: 1;
}
</style>