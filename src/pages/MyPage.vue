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

      posts: [
        {
          id: "01",
          ava: '/img/ava_1.776f687c.jpg',
          name: 'Илья',
          surname: 'Сазонов',
          date: '111',
          body: 'fff',
          flag: true,
          nameBtnEdit: "Редактировать",
        },
        // {
        //   id: "2",
        //   ava: '/img/ava_1.776f687c.jpg',
        //   name: 'Илья',
        //   surname: 'Сазонов',
        //   date: '222',
        //   body: 'jjjjjj',
        //   flag: true,
        //   nameBtnEdit: "Редактировать",
        // },
        // {
        //   id: "3",
        //   ava: '/img/ava_1.776f687c.jpg',
        //   name: 'Илья',
        //   surname: 'Сазонов',
        //   date: '333',
        //   body: 'kkkkkkk',
        //   flag: true,
        //   nameBtnEdit: "Редактировать",
        // },
        // {
        //   id: "4",
        //   ava: '/img/ava_1.776f687c.jpg',
        //   name: 'Илья',
        //   surname: 'Сазонов',
        //   date: '111',
        //   body: 'fff',
        //   flag: true,
        //   nameBtnEdit: "Редактировать",
        // },
        // {
        //   id: "5",
        //   ava: '/img/ava_1.776f687c.jpg',
        //   name: 'Илья',
        //   surname: 'Сазонов',
        //   date: '222',
        //   body: 'jjjjjj',
        //   flag: true,
        //   nameBtnEdit: "Редактировать",
        // },
        // {
        //   id: "6",
        //   ava: '/img/ava_1.776f687c.jpg',
        //   name: 'Илья',
        //   surname: 'Сазонов',
        //   date: '333',
        //   body: 'kkkkkkk',
        //   flag: true,
        //   nameBtnEdit: "Редактировать",
        // },
        // {
        //   id: "7",
        //   ava: '/img/ava_1.776f687c.jpg',
        //   name: 'Илья',
        //   surname: 'Сазонов',
        //   date: '111',
        //   body: 'fff',
        //   flag: true,
        //   nameBtnEdit: "Редактировать",
        // },
        // {
        //   id: "8",
        //   ava: '/img/ava_1.776f687c.jpg',
        //   name: 'Илья',
        //   surname: 'Сазонов',
        //   date: '222',
        //   body: 'jjjjjj',
        //   flag: true,
        //   nameBtnEdit: "Редактировать",
        // },
        // {
        //   id: "9",
        //   ava: '/img/ava_1.776f687c.jpg',
        //   name: 'Илья',
        //   surname: 'Сазонов',
        //   date: '333',
        //   body: 'kkkkkkk',
        //   flag: true,
        //   nameBtnEdit: "Редактировать",
        // },
        // {
        //   id: "10",
        //   ava: '/img/ava_1.776f687c.jpg',
        //   name: 'Илья',
        //   surname: 'Сазонов',
        //   date: '111',
        //   body: 'fff',
        //   flag: true,
        //   nameBtnEdit: "Редактировать",
        // },
        // {
        //   id: "11",
        //   ava: '/img/ava_1.776f687c.jpg',
        //   name: 'Илья',
        //   surname: 'Сазонов',
        //   date: '222',
        //   body: 'jjjjjj',
        //   flag: true,
        //   nameBtnEdit: "Редактировать",
        // },
        // {
        //   id: "12",
        //   ava: '/img/ava_1.776f687c.jpg',
        //   name: 'Илья',
        //   surname: 'Сазонов',
        //   date: '333',
        //   body: 'kkkkkkk',
        //   flag: true,
        //   nameBtnEdit: "Редактировать",
        // },
        // {
        //   id: "13",
        //   ava: '/img/ava_1.776f687c.jpg',
        //   name: 'Илья',
        //   surname: 'Сазонов',
        //   date: '111',
        //   body: 'fff',
        //   flag: true,
        //   nameBtnEdit: "Редактировать",
        // },
        // {
        //   id: "14",
        //   ava: '/img/ava_1.776f687c.jpg',
        //   name: 'Илья',
        //   surname: 'Сазонов',
        //   date: '222',
        //   body: 'jjjjjj',
        //   flag: true,
        //   nameBtnEdit: "Редактировать",
        // },
        // {
        //   id: "15",
        //   ava: '/img/ava_1.776f687c.jpg',
        //   name: 'Илья',
        //   surname: 'Сазонов',
        //   date: '333',
        //   body: 'kkkkkkk',
        //   flag: true,
        //   nameBtnEdit: "Редактировать",
        // },
        // {
        //   id: "16",
        //   ava: '/img/ava_1.776f687c.jpg',
        //   name: 'Илья',
        //   surname: 'Сазонов',
        //   date: '111',
        //   body: 'fff',
        //   flag: true,
        //   nameBtnEdit: "Редактировать",
        // },
        // {
        //   id: "17",
        //   ava: '/img/ava_1.776f687c.jpg',
        //   name: 'Илья',
        //   surname: 'Сазонов',
        //   date: '222',
        //   body: 'jjjjjj',
        //   flag: true,
        //   nameBtnEdit: "Редактировать",
        // },
        // {
        //   id: "18",
        //   ava: '/img/ava_1.776f687c.jpg',
        //   name: 'Илья',
        //   surname: 'Сазонов',
        //   date: '333',
        //   body: 'kkkkkkk',
        //   flag: true,
        //   nameBtnEdit: "Редактировать",
        // },
        // {
        //   id: "19",
        //   ava: '/img/ava_1.776f687c.jpg',
        //   name: 'Илья',
        //   surname: 'Сазонов',
        //   date: '111',
        //   body: 'fff',
        //   flag: true,
        //   nameBtnEdit: "Редактировать",
        // },
        // {
        //   id: "20",
        //   ava: '/img/ava_1.776f687c.jpg',
        //   name: 'Илья',
        //   surname: 'Сазонов',
        //   date: '222',
        //   body: 'jjjjjj',
        //   flag: true,
        //   nameBtnEdit: "Редактировать",
        // },
        // {
        //   id: "21",
        //   ava: '/img/ava_1.776f687c.jpg',
        //   name: 'Илья',
        //   surname: 'Сазонов',
        //   date: '333',
        //   body: 'kkkkkkk',
        //   flag: true,
        //   nameBtnEdit: "Редактировать",
        // },
        // {
        //   id: "22",
        //   ava: '/img/ava_1.776f687c.jpg',
        //   name: 'Илья',
        //   surname: 'Сазонов',
        //   date: '111',
        //   body: 'fff',
        //   flag: true,
        //   nameBtnEdit: "Редактировать",
        // },
        // {
        //   id: "23",
        //   ava: '/img/ava_1.776f687c.jpg',
        //   name: 'Илья',
        //   surname: 'Сазонов',
        //   date: '222',
        //   body: 'jjjjjj',
        //   flag: true,
        //   nameBtnEdit: "Редактировать",
        // },
        // {
        //   id: "24",
        //   ava: '/img/ava_1.776f687c.jpg',
        //   name: 'Илья',
        //   surname: 'Сазонов',
        //   date: '333',
        //   body: 'kkkkkkk',
        //   flag: true,
        //   nameBtnEdit: "Редактировать",
        // },
        // {
        //   id: "25",
        //   ava: '/img/ava_1.776f687c.jpg',
        //   name: 'Илья',
        //   surname: 'Сазонов',
        //   date: '111',
        //   body: 'fff',
        //   flag: true,
        //   nameBtnEdit: "Редактировать",
        // },
        // {
        //   id: "26",
        //   ava: '/img/ava_1.776f687c.jpg',
        //   name: 'Илья',
        //   surname: 'Сазонов',
        //   date: '222',
        //   body: 'jjjjjj',
        //   flag: true,
        //   nameBtnEdit: "Редактировать",
        // },
        // {
        //   id: "27",
        //   ava: '/img/ava_1.776f687c.jpg',
        //   name: 'Илья',
        //   surname: 'Сазонов',
        //   date: '333',
        //   body: 'kkkkkkk',
        //   flag: true,
        //   nameBtnEdit: "Редактировать",
        // },
        // {
        //   id: "28",
        //   ava: '/img/ava_1.776f687c.jpg',
        //   name: 'Илья',
        //   surname: 'Сазонов',
        //   date: '111',
        //   body: 'fff',
        //   flag: true,
        //   nameBtnEdit: "Редактировать",
        // },
        // {
        //   id: "29",
        //   ava: '/img/ava_1.776f687c.jpg',
        //   name: 'Илья',
        //   surname: 'Сазонов',
        //   date: '222',
        //   body: 'jjjjjj',
        //   flag: true,
        //   nameBtnEdit: "Редактировать",
        // },
        // {
        //   id: "30",
        //   ava: '/img/ava_1.776f687c.jpg',
        //   name: 'Илья',
        //   surname: 'Сазонов',
        //   date: '333',
        //   body: 'kkkkkkk',
        //   flag: true,
        //   nameBtnEdit: "Редактировать",
        // },
        // {
        //   id: "31",
        //   ava: '/img/ava_1.776f687c.jpg',
        //   name: 'Илья',
        //   surname: 'Сазонов',
        //   date: '111',
        //   body: 'fff',
        //   flag: true,
        //   nameBtnEdit: "Редактировать",
        // },
        // {
        //   id: "32",
        //   ava: '/img/ava_1.776f687c.jpg',
        //   name: 'Илья',
        //   surname: 'Сазонов',
        //   date: '222',
        //   body: 'jjjjjj',
        //   flag: true,
        //   nameBtnEdit: "Редактировать",
        // },
        // {
        //   id: "33",
        //   ava: '/img/ava_1.776f687c.jpg',
        //   name: 'Илья',
        //   surname: 'Сазонов',
        //   date: '333',
        //   body: 'kkkkkkk',
        //   flag: true,
        //   nameBtnEdit: "Редактировать",
        // },
        // {
        //   id: "34",
        //   ava: '/img/ava_1.776f687c.jpg',
        //   name: 'Илья',
        //   surname: 'Сазонов',
        //   date: '111',
        //   body: 'fff',
        //   flag: true,
        //   nameBtnEdit: "Редактировать",
        // },
        // {
        //   id: "35",
        //   ava: '/img/ava_1.776f687c.jpg',
        //   name: 'Илья',
        //   surname: 'Сазонов',
        //   date: '222',
        //   body: 'jjjjjj',
        //   flag: true,
        //   nameBtnEdit: "Редактировать",
        // },
        // {
        //   id: "36",
        //   ava: '/img/ava_1.776f687c.jpg',
        //   name: 'Илья',
        //   surname: 'Сазонов',
        //   date: '333',
        //   body: 'kkkkkkk',
        //   flag: true,
        //   nameBtnEdit: "Редактировать",
        // },
        // {
        //   id: "37",
        //   ava: '/img/ava_1.776f687c.jpg',
        //   name: 'Илья',
        //   surname: 'Сазонов',
        //   date: '111',
        //   body: 'fff',
        //   flag: true,
        //   nameBtnEdit: "Редактировать",
        // },
        // {
        //   id: "38",
        //   ava: '/img/ava_1.776f687c.jpg',
        //   name: 'Илья',
        //   surname: 'Сазонов',
        //   date: '222',
        //   body: 'jjjjjj',
        //   flag: true,
        //   nameBtnEdit: "Редактировать",
        // },
        // {
        //   id: "39",
        //   ava: '/img/ava_1.776f687c.jpg',
        //   name: 'Илья',
        //   surname: 'Сазонов',
        //   date: '333',
        //   body: 'kkkkkkk',
        //   flag: true,
        //   nameBtnEdit: "Редактировать",
        // },
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
    },

async loadPostServer() {
      try {
        await axios.get('http://localhost:8000/dataBase.js').then((response) => {
          const dd = response.data;
          if(dd.length === 0) {
            console.log('Посты не найдены')
          } else {
            console.log(dd);
              this.posts = [...this.posts, ...dd]
              console.log(this.posts)
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