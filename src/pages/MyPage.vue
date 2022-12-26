<template>
  <div class="wrapper_myPage">
    <UserInfo/>
    <div class="wrapper_contents_main">

      <div class="wrapper_contents">
        <div class="wrapper_preview_myPhoto">
          <div class="preview_myPhoto">
            <img class="myPhoto" src="@/assets/photo/man.jpg" alt="foto_1">
          </div>
          <div class="preview_myPhoto">
            <img class="myPhoto" src="@/assets/photo/man.jpg" alt="foto_1">
          </div>
          <div class="preview_myPhoto">
            <img class="myPhoto" src="@/assets/photo/man.jpg" alt="foto_1">
          </div>
          <div class="preview_myPhoto">
            <img class="myPhoto" src="@/assets/photo/man.jpg" alt="foto_1">
          </div>
          <div class="preview_myPhoto">
            <img class="myPhoto" src="@/assets/photo/man.jpg" alt="foto_1">
          </div>
          <div class="preview_myPhoto">
            <img class="myPhoto" src="@/assets/photo/man.jpg" alt="foto_1">
          </div>
        </div>

        <div class="wrapper_posts">
          <AddPost
              @addPost="addPost"
          />
          <PostMyPage
              v-model:value="changePost"
              :posts="posts"
              @removePost="removePost"
              @editPost="editPost"
          />
        </div>
      </div>

      <div class="wrapper_myFriends">
        Мои друзья
      </div>

    </div>


    <div>
    </div>

  </div>
</template>
<script>
export default {
  name: "MyPage",

  data() {
    return {
      changePost: "",

      posts: [
        {
          id: "1",
          ava: '/img/ava_1.776f687c.jpg',
          name: 'Илья',
          surname: 'Сазонов',
          date: '111',
          body: 'fff',
          flag: true,
          nameBtnEdit: "Редактировать",
        },
        {
          id: "2",
          ava: '/img/ava_1.776f687c.jpg',
          name: 'Илья',
          surname: 'Сазонов',
          date: '222',
          body: 'jjjjjj',
          flag: true,
          nameBtnEdit: "Редактировать",
        },
        {
          id: "3",
          ava: '/img/ava_1.776f687c.jpg',
          name: 'Илья',
          surname: 'Сазонов',
          date: '333',
          body: 'kkkkkkk',
          flag: true,
          nameBtnEdit: "Редактировать",
        },
      ],

    }
  },

  methods: {
    addPost(body) {
      const newPost = {
        id: Date.now(),
        ava: '/img/ava_1.776f687c.jpg',
        name: 'Илья',
        surname: 'Сазонов',
        date: this.newDate(),
        body: body,
        flag: true,
        nameBtnEdit: "Редактировать",
      }
      this.posts.unshift(newPost);
    },

    removePost(id) {
      this.posts = this.posts.filter(post => post.id !== id);
    },

    editPost(id) {
      this.posts.map(post => {
        if (post.flag) {
          if (post.id === id) {
            this.changePost = post.body;
            post.flag = !post.flag;
            post.nameBtnEdit = "Cохранить";
          }
        } else {
            post.body = this.changePost;
            post.date = "Изменено: " + this.newDate();
            post.flag = !post.flag;
            post.nameBtnEdit = "Редактировать";
        }
      })
    },

    newDate() {
      const date = new Date();
      const dateNow = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
      return dateNow;
    }

  },

  computed: {

  }
}
</script>

<style scoped>
.wrapper_myPage {

}


.wrapper_contents_main {
  display: flex;
  flex-wrap: wrap;
}

.wrapper_contents {
  white-space: nowrap;
  display: flex;
  flex-direction: column;
  flex: 0 0 70%;
}

.wrapper_preview_myPhoto {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 25px;
  border: 1px solid;
}

.preview_myPhoto {
  flex: 0 0 33.33333%;
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}

.myPhoto {
  width: 150px;
}

.wrapper_myFriends {
  display: flex;
  border: 1px solid;
  justify-content: center;
  background: floralwhite;
  flex: 0 0 30%;
}

.wrapper_posts {
  display: flex;
  flex-direction: column;
  white-space: normal;
  margin-right: 20px;
}
</style>