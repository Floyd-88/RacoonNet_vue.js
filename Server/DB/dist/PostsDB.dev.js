"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var mysql = require('mysql2');

var config = require('./config');

var PostsDB =
/*#__PURE__*/
function () {
  function PostsDB() {
    _classCallCheck(this, PostsDB);

    this.connection = mysql.createConnection(config); // подключаем базу данных

    this.createTablePosts();
    this.createTablePostsLikes();
  } //создаем таблицу БД с постами


  _createClass(PostsDB, [{
    key: "createTablePosts",
    value: function createTablePosts() {
      var sql = "CREATE TABLE IF NOT EXISTS posts (\n            id integer PRIMARY KEY AUTO_INCREMENT,\n            date varchar(50), \n            postText text, \n            page_userID integer,\n            authorPost integer,\n            likes integer default 0,\n            photos varchar(10) default 'false',\n            delete_post int(1) default 0,\n            CONSTRAINT FK_Posts_Users FOREIGN KEY (authorPost) REFERENCES users (userID) ON DELETE CASCADE)";
      this.connection.execute(sql);
    } //создаем таблицу БД с лайками к постам

  }, {
    key: "createTablePostsLikes",
    value: function createTablePostsLikes() {
      var sql = "CREATE TABLE IF NOT EXISTS posts_likes (\n            id integer PRIMARY KEY AUTO_INCREMENT,\n            post_id integer, \n            author_likes_post integer,\n            CONSTRAINT FK_PostID_Posts FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE, CONSTRAINT FK_AuthorLike_Users  FOREIGN KEY (author_likes_post) REFERENCES users (userID) ON DELETE CASCADE)";
      this.connection.execute(sql);
    } // загрузка постов из базы данны

  }, {
    key: "load_posts_DB",
    value: function load_posts_DB(params, callback) {
      return this.connection.execute("SELECT \n        posts.id, \n        users.ava, \n        posts.date, \n        posts.postText, \n        posts.likes,\n        users.name, \n        users.surname,\n        posts.authorPost,\n        posts.photos,\n        SUM(CASE WHEN posts_likes.author_likes_post = ? THEN 1 ELSE 0 END) as like_post\n        FROM posts \n        INNER JOIN users ON posts.authorPost = users.userID LEFT JOIN posts_likes ON posts_likes.post_id = posts.id\n        WHERE page_userID = ? GROUP BY \n        posts.id, \n        users.ava, \n        posts.date, \n        posts.postText, \n        posts.likes,\n        users.name, \n        users.surname,\n        posts.authorPost,\n        posts.photos\n        ORDER BY posts.id DESC LIMIT ?, ?", params, function (err, row) {
        callback(err, row);
      });
    } //загрузка фотографий к постам 

  }, {
    key: "load_photos_posts_DB",
    value: function load_photos_posts_DB(params, callback) {
      return this.connection.execute("SELECT \n        photos.category, \n        users.name, \n        users.surname, \n        users.ava, \n        users.userID,\n        photos.date, \n        photos.likes,\n        SUM(CASE WHEN photos_likes.author_likes_photo = ? THEN 1 ELSE 0 END) as like_photo, \n        posts.id, \n        photos.photo_name,\n        photos.id as photoID\n        FROM posts \n        INNER JOIN photos ON photos.post_id_photo = posts.id INNER JOIN users ON photos.userID = users.userID LEFT JOIN photos_likes ON photos_likes.photo_id = photos.id\n        WHERE posts.id = ? AND\n        pageID = ? GROUP BY \n        photos.id, \n        photos.photo_name, \n        photos.category, \n        users.name, \n        users.surname, \n        users.userID,\n        users.ava, \n        photos.date, \n        photos.likes,\n        photos.id\n        ", params, function (err, row) {
        callback(err, row);
      });
    } // получение новостной ленты от друзей

  }, {
    key: "load_news_friens_DB",
    value: function load_news_friens_DB(params, callback) {
      return this.connection.execute("SELECT \n        posts.id, \n        users.ava, \n        posts.date, \n        posts.postText, \n        users.name, \n        users.surname,\n        posts.authorPost, \n        posts.likes,\n        posts.photos,\n        SUM(CASE WHEN posts_likes.author_likes_post = ? THEN 1 ELSE 0 END) as like_post\n        FROM posts \n        INNER JOIN users ON posts.authorPost = users.userID LEFT JOIN posts_likes ON posts_likes.post_id = posts.id\n        WHERE page_userID IN (SELECT \n                             U.userID FROM users U \n                             INNER JOIN friends F ON \n                                 CASE\n                             WHEN addressee_user_id = ?\n                                 THEN\n                                U.userID=sender_user_id\n                                 WHEN\n                             sender_user_id = ?\n                                 THEN\n                             U.userID=addressee_user_id\n                                 END\n                             WHERE (confirm_addressee=1 AND confirm_sender=1))\n         AND posts.authorPost = page_userID \n         GROUP BY \n         posts.id, \n         users.ava, \n         posts.date, \n         posts.postText, \n         posts.likes,\n         users.name, \n         users.surname,\n         posts.authorPost,\n         posts.photos\n         ORDER BY posts.id DESC LIMIT ?, ?", params, function (err, row) {
        callback(err, row);
      });
    } // загрузка одного поста из базы данных

  }, {
    key: "load_one_post_DB",
    value: function load_one_post_DB(postID, callback) {
      return this.connection.execute("SELECT \n            posts.id, \n            users.ava, \n            posts.date, \n            posts.postText, \n            users.name, \n            users.surname,\n            posts.authorPost FROM posts \n            INNER JOIN users ON posts.authorPost = users.userID \n            WHERE id = ?", [postID], function (err, row) {
        callback(err, row[0]);
      });
    } //добавление поста в базу данных

  }, {
    key: "add_post_DB",
    value: function add_post_DB(body, callback) {
      return this.connection.execute("INSERT INTO posts (date, postText, page_userID, authorPost, photos) VALUES (?,?,?,?,?)", body, function (err, row) {
        callback(err, row);
      });
    } // редактирование поста

  }, {
    key: "edit_post_DB",
    value: function edit_post_DB(body, callback) {
      return this.connection.execute("UPDATE posts SET postText=?, date=? WHERE id =?", body, function (err) {
        callback(err);
      });
    } // удаление лайков поста

  }, {
    key: "remove_post_likes_DB",
    value: function remove_post_likes_DB(postID, callback) {
      return this.connection.execute("DELETE from posts_likes WHERE post_id = ?", [postID], function (err) {
        callback(err);
      });
    } // удаление поста

  }, {
    key: "remove_post_DB",
    value: function remove_post_DB(postID, callback) {
      return this.connection.execute("DELETE from posts WHERE id = ?", [postID], function (err) {
        callback(err);
      });
    } // удаление постов на странице пользователя перед удалением профиля

  }, {
    key: "remove_all_posts_DB",
    value: function remove_all_posts_DB(user, callback) {
      return this.connection.execute("DELETE from posts WHERE page_userID = ?", [user], function (err) {
        callback(err);
      });
    } //поверяем на повторный лайк поста

  }, {
    key: "not_double_likes_post_author",
    value: function not_double_likes_post_author(params, callback) {
      return this.connection.execute("SELECT id FROM posts_likes WHERE post_id=? AND author_likes_post = ?", params, function (err, row) {
        callback(err, row);
      });
    } //добавляем автора лайка поста в БД

  }, {
    key: "add_author_likes_post",
    value: function add_author_likes_post(params, callback) {
      return this.connection.execute("INSERT INTO posts_likes (post_id, author_likes_post) VALUES (?,?)", params, function (err) {
        callback(err);
      });
    }
  }, {
    key: "remove_author_like_post",
    //убираем автора лайка поста при повторном клике
    value: function remove_author_like_post(id, callback) {
      return this.connection.execute("DELETE from posts_likes WHERE id = ?", id, function (err) {
        callback(err);
      });
    } // лайкаем пост

  }, {
    key: "add_count_likes",
    value: function add_count_likes(params, callback) {
      return this.connection.execute("UPDATE posts SET likes = likes + 1 WHERE id=?", params, function (err) {
        callback(err);
      });
    } // отменяем лайк поста

  }, {
    key: "remove_count_likes",
    value: function remove_count_likes(params, callback) {
      return this.connection.execute("UPDATE posts SET likes = likes - 1 WHERE id=?", params, function (err) {
        callback(err);
      });
    } //получаем количество лайков у поста

  }, {
    key: "get_count_likes_post",
    value: function get_count_likes_post(id, callback) {
      return this.connection.execute("SELECT likes, authorPost FROM posts WHERE id=?", id, function (err, likes) {
        callback(err, likes[0]);
      });
    } //получаем пользоватей лайкнувших пост

  }, {
    key: "get_users_likes",
    value: function get_users_likes(postID, callback) {
      return this.connection.execute("SELECT author_likes_post, ava, name, surname FROM posts_likes INNER JOIN users ON author_likes_post = userID WHERE post_id=?", postID, function (err, users) {
        callback(err, users);
      });
    } //получаем фотографии одного поста

  }, {
    key: "post_photos_DB",
    value: function post_photos_DB(postID, callback) {
      return this.connection.execute("SELECT id, photo_name FROM photos WHERE post_id_photo = ?", [postID], function (err, photosArray) {
        callback(err, photosArray);
      });
    }
  }]);

  return PostsDB;
}();

module.exports = PostsDB;