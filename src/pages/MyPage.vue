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

          <div class="wrapper_not_posts"
          v-if="posts.length === 0"
          >
            <p class="not_posts">Посты не найдены!!!</p>
          </div>
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

export default {
  name: "MyPage",

  data() {
    return {
      changePost: "", //текс измененного поста при редактировании
      posts: [], //массив постов подгружаемый из базы данных
      countPosts: 0, //номер массива страницы
      limitPosts: 0, //количество постов на одной странице
      totalCount: 0, //всего страниц
    }
  },

  methods: {
    // добавление нового поста на мою страницу
    addPost(body) {
      const newPost = {
        id: Date.now(),
        ava: '/img/ava_1.776f687c.jpg',
        name: 'Илья',
        surname: 'Сазонов',
        date: this.newDate(),
        body: body,
        flag: '1',
        nameBtnEdit: "Редактировать",
      }
      this.posts.unshift(newPost);
      axios.post('http://localhost:8000/dataBase.js', newPost)
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });
    },

    //удаление поста
    removePost(id) {
      this.posts = this.posts.filter(post => post.id !== id);
    },

    // изменение поста
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
          axios.put('http://localhost:8000/dataBase.js', {
            id: post.id,
            body: post.body,
          })
              .then(function(response) {
                console.log(response)
              })
              .catch(function(error) {
                console.log(error)
              })

          post.date = "Изменено: " + this.newDate();
          post.flag = !post.flag;
          post.nameBtnEdit = "Редактировать";
        }
      })
    },

    //функция устанавливает отредактированный формат даты и времени
    newDate() {
      const date = new Date();
      const dateNow = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
      return dateNow;
    },

    //загрузка постов с базы данных
    async loadPostServer() {
      try {
        await axios.get('http://localhost:8000/dataBase.js', {
          params: {
            _count: this.countPosts,
            _limit: this.limitPosts,
          }
        }).then((response) => {
          const arr_posts = response.data;
          // if (arr_posts.length === 0) {
          //   console.log('Посты не найдены');
          // } else {
            this.posts = [...this.posts, ...arr_posts];
          // }
        });
      } catch (err) {
        console.error(err);
      }
    },
  },

  mounted() {
    // обсервер срабатывает каждый раз когда докручиваем страницу донизу
    const options = {
      rootMargin: '0px',
      threshold: 1.0
    };
    const callback = (entries) => {
      if (entries[0].isIntersecting) {
          this.limitPosts = 3;
        this.countPosts = this.posts.length;
          this.loadPostServer();
      }
    };
    const observer = new IntersectionObserver(callback, options);
    observer.observe(this.$refs.observer);

  },

  computed: {},


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

.not_posts {
  margin: 10px 0;
  font-size: 18px;
  font-family: cursive;
  font-weight: 600;
}
</style>