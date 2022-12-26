<template>


  <PostMyPage
      :posts="posts"
  />
</template>

<script>
export default {
  name: "PostsMyPage",
  emits: [
    "addPost",
  ],
  props: {
    // modelValue: [String, Number],
    posts: {
      type: Array,
      required: true,
    },
  },
    data() {
      return {
        post: {
          id: "",
          ava: '/img/ava_1.776f687c.jpg',
          name: 'Илья',
          surname: 'Сазонов',
          date: '',
          body: '',
        },
      }
    },

    methods: {
      addPost(body) {
        this.post.id = Date.now();
        this.post.date = new Date();
        this.body = body;
        this.$emit('addPost', this.post);
      },
    }

}
</script>

<style scoped>



</style>