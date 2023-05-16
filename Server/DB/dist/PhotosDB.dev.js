"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var mysql = require('mysql2');

var config = require('./config');

var PhotosDB =
/*#__PURE__*/
function () {
  function PhotosDB() {
    _classCallCheck(this, PhotosDB);

    this.connection = mysql.createConnection(config); // подключаем базу данных

    this.createTablePhotos();
    this.createTablePhotosLikes(); // this.createTablePhotosPost();
  } //создаем таблицу БД с фотографиями


  _createClass(PhotosDB, [{
    key: "createTablePhotos",
    value: function createTablePhotos() {
      var sql = "CREATE TABLE IF NOT EXISTS photos (id integer PRIMARY KEY AUTO_INCREMENT, photo_name varchar(150) not null, date timestamp not null DEFAULT CURRENT_TIMESTAMP, userID integer not null, pageID integer not null, category varchar (50) default 'not category', likes integer default 0, post_id_photo integer, CONSTRAINT FK_Photos_Users FOREIGN KEY (userID) REFERENCES users (userID) ON DELETE CASCADE)";
      this.connection.execute(sql);
    } //создаем таблицу БД с лайками к фото

  }, {
    key: "createTablePhotosLikes",
    value: function createTablePhotosLikes() {
      var sql = "CREATE TABLE IF NOT EXISTS photos_likes (\n            id integer PRIMARY KEY AUTO_INCREMENT,\n            photo_id integer, \n            author_likes_photo integer,\n            CONSTRAINT FK_PhotosLikes_Photos FOREIGN KEY (photo_id) REFERENCES photos (id) ON DELETE CASCADE,\n            CONSTRAINT FK_PhotosLikes_Users FOREIGN KEY (author_likes_photo) REFERENCES users (userID) ON DELETE CASCADE)";
      this.connection.execute(sql);
    } // добавление фото в базу данных

  }, {
    key: "add_photo_DB",
    value: function add_photo_DB(arrayPhotos, callback) {
      return this.connection.query('INSERT INTO photos (photo_name, userID, pageID, category, post_id_photo) VALUES ?', [arrayPhotos], function (err) {
        callback(err);
      });
    } // загрузка фото из базы данны

  }, {
    key: "load_photos_DB",
    value: function load_photos_DB(params, callback) {
      return this.connection.execute("SELECT photo_name FROM photos WHERE userID = ? ORDER BY id DESC limit ?, ?", params, function (err, row) {
        callback(err, row);
      });
    } //загрузка всех фото из базы данных

  }, {
    key: "load_all_photos_DB",
    value: function load_all_photos_DB(params, callback) {
      return this.connection.execute("SELECT \n        photos.id, \n        photos.photo_name, \n        photos.category, \n        users.name, \n        users.surname, \n        users.ava, \n        users.userID,\n        photos.date, \n        photos.likes,\n        SUM(CASE WHEN photos_likes.author_likes_photo = ? THEN 1 ELSE 0 END) as like_photo \n        FROM \n        photos INNER JOIN users ON photos.userID = users.userID LEFT JOIN photos_likes ON photos_likes.photo_id = photos.id\n        WHERE pageID = ? AND pageID = photos.userID GROUP BY \n        photos.id, \n        photos.photo_name, \n        photos.category, \n        users.name, \n        users.surname, \n        users.ava, \n        users.userID,\n        photos.date, \n        photos.likes\n        ORDER BY id DESC", params, function (err, row) {
        callback(err, row);
      });
    } // удаление лайков перед удалением фотографии

  }, {
    key: "remove_photo_likes",
    value: function remove_photo_likes(photoID, callback) {
      return this.connection.execute("DELETE from photos_likes WHERE photo_id = ?", photoID, function (err) {
        callback(err);
      });
    } // удаление фотографии

  }, {
    key: "remove_photo",
    value: function remove_photo(photo, callback) {
      return this.connection.execute("DELETE from photos WHERE id = ?", photo, function (err) {
        callback(err);
      });
    }
  }, {
    key: "remove_photo_post",
    value: function remove_photo_post(photo, callback) {
      return this.connection.execute("UPDATE photos SET post_id_photo=0 WHERE id = ? and userID = ?", photo, function (err) {
        callback(err);
      });
    } // удаление фотографий перед удалением профиля

  }, {
    key: "remove_all_photos",
    value: function remove_all_photos(user, callback) {
      return this.connection.execute("\n                    DELETE from photos WHERE pageID = ? ", user, function (err) {
        callback(err);
      });
    } //поверяем на повторный лайк фото

  }, {
    key: "not_double_likes_photo_author",
    value: function not_double_likes_photo_author(params, callback) {
      return this.connection.execute("\n                    SELECT id FROM photos_likes WHERE photo_id = ? AND author_likes_photo = ? ", params, function (err, row) {
        callback(err, row);
      });
    } //добавляем автора лайка фото в БД

  }, {
    key: "add_author_likes_photo",
    value: function add_author_likes_photo(params, callback) {
      return this.connection.execute("\n                    INSERT INTO photos_likes(photo_id, author_likes_photo) VALUES( ? , ? )\n                    ", params, function (err) {
        callback(err);
      });
    }
  }, {
    key: "remove_author_like_photo",
    //убираем автора лайка фото при повторном клике
    value: function remove_author_like_photo(id, callback) {
      return this.connection.execute("\n                    DELETE from photos_likes WHERE id = ? ", id, function (err) {
        callback(err);
      });
    } // лайкаем фото

  }, {
    key: "add_count_likes",
    value: function add_count_likes(params, callback) {
      return this.connection.execute("\n                    UPDATE photos SET likes = likes + 1 WHERE id = ? ", params, function (err) {
        callback(err);
      });
    } // отменяем лайк фото

  }, {
    key: "remove_count_likes",
    value: function remove_count_likes(params, callback) {
      return this.connection.execute("\n                    UPDATE photos SET likes = likes - 1 WHERE id = ? ", params, function (err) {
        callback(err);
      });
    } //получаем количество лайков у фото

  }, {
    key: "get_count_likes_photo",
    value: function get_count_likes_photo(id, callback) {
      return this.connection.execute("\n                    SELECT likes, userID FROM photos WHERE id = ? ", id, function (err, likes) {
        callback(err, likes[0]);
      });
    } //получаем пользоватей лайкнувших фото

  }, {
    key: "get_users_likes_photo",
    value: function get_users_likes_photo(photoID, callback) {
      return this.connection.execute("\n                    SELECT author_likes_photo, ava, name, surname FROM photos_likes INNER JOIN users ON author_likes_photo = userID WHERE photo_id = ? ", photoID, function (err, users) {
        callback(err, users);
      });
    }
  }]);

  return PhotosDB;
}();

module.exports = PhotosDB;