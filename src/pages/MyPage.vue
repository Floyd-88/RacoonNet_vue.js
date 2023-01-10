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
          <div ref="observer" class="observer"></div>
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

import axios from "axios";
// import connection from "/src/connection.php"

export default {
  name: "MyPage",

  data() {
    return {
      changePost: "",
      posts: [],
    }
  },

  methods: {
    addPost(body) {
      axios.post('http://localhost:8000/dataBase.js', {
              ava: '/img/ava_1.776f687c.jpg',
              name: 'Илья',
              surname: 'Сазонов',
              date: this.newDate(),
              body: body,
              flag: '1',
              nameBtnEdit: "Редактировать",
      })
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });

      // const newPost = {
      //   id: Date.now(),
      //   ava: '/img/ava_1.776f687c.jpg',
      //   name: 'Илья',
      //   surname: 'Сазонов',
      //   date: this.newDate(),
      //   body: body,
      //   flag: true,
      //   nameBtnEdit: "Редактировать",
      // }
      // this.posts.unshift(newPost);
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
    },

async loadPostServer() {
      try {
        await axios.get('http://localhost:8000/dataBase.js').then((response) => {
          const dd = response.data;
          if(dd.length === 0) {
            console.log('Посты не найдены')
          } else {
              this.posts = [...this.posts, ...dd]
            }
        });
      } catch (err) {
        console.error(err);
      }
    },
  },

  mounted() {
    this.loadPostServer();

    const options = {
      rootMargin: '0px',
      threshold: 1.0
    };
    const callback = (entries) => {
      if (entries[0].isIntersecting) {
        console.log(entries[0].isIntersecting)
        // this.loadPostServer()
      }
    };
    const observer = new IntersectionObserver(callback, options);
    observer.observe(this.$refs.observer);
  },

  computed: {}
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

.observer {
  display: block;
  width: 100%;
  border: 1px solid;
  height: 1px;
  background: black;
}
</style>