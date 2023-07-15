<template>
  <img class="ava_posts" :class="{'my_friend_ava_img': my_friend_ava}" alt="ava" ref="img" :src="loadAva">
</template>

<script>
export default {
  name: "UIAva",
  props: {
    ava: {
      type: String,
      default: ""
    },

    my_friend_ava: {
      type: Boolean,
      default: false
    }
  },

  computed: {
     loadAva() {
          try {
            return require(`../../assets/${this.ava}`);
          }
          catch(err) {
            return require(`../../assets/ava/ava_1.jpg`);
          }
        },
  }
}
</script>

<style scoped>

.ava_posts {
  width: 100%;
  border-radius: 100%;
  cursor: pointer;
}

.my_friend_ava_img  {
    width: 32px;
    height: 100%;
    border-radius: 100%;
    cursor: pointer;
}

@media (max-width: 761px) {

  .ava_posts {
    width: 100%;
    border-radius: 100%;
    cursor: pointer;
  }

  .my_friend_ava_img  {
    width: 32px;
    height: 100%;
    border-radius: 100%;
    cursor: pointer;
}

}
</style>