<template>
  <img class="photo_post" :class="{ 'full_size_img': full_size }" :src="loadPhoto" :alt="photo.photo_name">
</template>

<script>
export default {
  name: "UIPhoto",
  props: {
    photo: {
      type: Object,
      default: () => {
        return {}
      },
    },

    full_size: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    loadPhoto() {
      try {
        return require(`../../assets/${this.photo.photo_name}`);
      }
      catch (err) {
        return require(`../../assets/ava/ava_1.jpg`);
      }
    },
  }
}
</script>

<style scoped>
.myPhoto {
  width: inherit;
  height: inherit;
  object-fit: cover;
  cursor: pointer;

}

.photo_post {
  width: 100%;
  height: 100%;
  -o-object-fit: cover;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
}

.full_size_img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding-bottom: 30px;
}
</style>