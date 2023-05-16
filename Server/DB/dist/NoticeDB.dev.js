"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var mysql = require('mysql2');

var config = require('./config');

var NoticeDB =
/*#__PURE__*/
function () {
  function NoticeDB() {
    _classCallCheck(this, NoticeDB);

    this.connection = mysql.createConnection(config); // подключаем базу данных

    this.createTableNotice();
  } //создаем таблицу БД с уведомлениями


  _createClass(NoticeDB, [{
    key: "createTableNotice",
    value: function createTableNotice() {
      var sql = "CREATE TABLE IF NOT EXISTS notice (\n            id integer PRIMARY KEY AUTO_INCREMENT,\n            user_id_addressee integer NULL,\n            user_id_sender integer NOT NULL,\n            user_comments_comment_addressee integer NULL,\n            text_notice varchar(250) NOT NULL,\n            post_id integer,\n            photo_id integer,\n            comment_post_id integer,\n            comment_comments_post_id integer,\n            comment_photo_id integer,\n            date varchar(50) NOT NULL,\n            show_notice integer default 0\n        )";
      return this.connection.execute(sql);
    } //добавление уведомления в базу данных

  }, {
    key: "add_notice_DB",
    value: function add_notice_DB(params, callback) {
      return this.connection.execute("INSERT INTO notice\n        (user_id_addressee, user_id_sender, user_comments_comment_addressee, text_notice, post_id, photo_id, comment_post_id, comment_comments_post_id, comment_photo_id, date) VALUES (?,?,?,?,?,?,?,?,?,?)", params, function (err, row_notice) {
        callback(err, row_notice);
      });
    } // возвращаем уведомление пользователю

  }, {
    key: "get_notice_DB",
    value: function get_notice_DB(user, callback) {
      return this.connection.execute("SELECT \n        N.id,\n        N.date,\n        N.text_notice,\n        N.post_id,\n        N.photo_id,\n        N.comment_post_id,\n        N.comment_comments_post_id,\n        N.comment_photo_id,\n        show_notice,\n        U.userID,\n        U.name,\n        U.surname,\n        U.ava, \n        (SELECT users.name FROM users LEFT JOIN notice ON users.userID = IFNULL(notice.user_id_addressee, notice.user_comments_comment_addressee) WHERE notice.id = N.id) as name_addressee,\n        (SELECT users.surname FROM users LEFT JOIN notice ON users.userID = IFNULL(notice.user_id_addressee, notice.user_comments_comment_addressee) WHERE notice.id = N.id) as surname_addressee,\n        (SELECT users.ava FROM users LEFT JOIN notice ON users.userID = IFNULL(notice.user_id_addressee, notice.user_comments_comment_addressee) WHERE notice.id = N.id) as ava_addressee,\n        (SELECT users.userID FROM users LEFT JOIN notice ON users.userID = IFNULL(notice.user_id_addressee, notice.user_comments_comment_addressee) WHERE notice.id = N.id) as userID_addressee,\n        U.selectedGender,\n        P.postText,\n        P.photos,\n        IFNULL(CCP.answer_comment_comment_text, CP.comment_post_text) as comment_post_text,\n        CCP.comment_comment_text,\n        CPh.comment_photo_text,\n        Ph.photo_name\n        FROM notice N LEFT JOIN users U ON N.user_id_sender = U.userID \n        LEFT JOIN posts P ON N.post_id = P.id \n        LEFT JOIN comments_post CP ON N.comment_post_id = CP.id\n        LEFT JOIN comments_comment CCP ON N.comment_comments_post_id = CCP.id\n        LEFT JOIN comments_photo CPh ON N.comment_photo_id = CPh.id\n        LEFT JOIN photos Ph ON N.photo_id = Ph.id\n        WHERE N.user_id_addressee = ? OR user_comments_comment_addressee = ? ORDER BY N.id DESC", user, function (err, newNotice) {
        callback(err, newNotice);
      });
    } //получение фотографий к посту из уведомления

  }, {
    key: "get_notice_photos_post_DB",
    value: function get_notice_photos_post_DB(postID, callback) {
      return this.connection.execute("SELECT \n        id,\n        photo_name FROM photos\n        WHERE post_id_photo = ?", postID, function (err, newNotice) {
        callback(err, newNotice);
      });
    } //пометить уведомление как прочитанное

  }, {
    key: "notice_remove_count_DB",
    value: function notice_remove_count_DB(id, callback) {
      return this.connection.execute("UPDATE notice SET show_notice = 1 WHERE id=?", id, function (err) {
        callback(err);
      });
    } // удаление уведомления

  }, {
    key: "delete_notice_DB",
    value: function delete_notice_DB(id, callback) {
      return this.connection.execute("DELETE from notice WHERE id= ?", id, function (err) {
        callback(err);
      });
    }
  }, {
    key: "delete_notice_like_DB",
    value: function delete_notice_like_DB(params, callback) {
      return this.connection.execute("DELETE from notice WHERE user_id_addressee=? AND user_id_sender=? AND post_id=? AND photo_id=?", params, function (err) {
        callback(err);
      });
    }
  }, {
    key: "delete_notice_friend_DB",
    value: function delete_notice_friend_DB(params, callback) {
      return this.connection.execute("DELETE from notice WHERE (user_id_addressee=? AND user_id_sender=? OR user_id_sender=? AND user_id_addressee=?) AND post_id=0 AND photo_id=0", params, function (err) {
        callback(err);
      });
    }
  }, {
    key: "delete_notice_post_DB",
    value: function delete_notice_post_DB(params, callback) {
      return this.connection.execute("DELETE from notice WHERE post_id=? AND photo_id=0", params, function (err) {
        callback(err);
      });
    }
  }, {
    key: "delete_notice_comment_post_DB",
    value: function delete_notice_comment_post_DB(params, callback) {
      return this.connection.execute("DELETE from notice WHERE comment_post_id=?", params, function (err) {
        callback(err);
      });
    }
  }, {
    key: "delete_notice_comment_comments_post_DB",
    value: function delete_notice_comment_comments_post_DB(params, callback) {
      return this.connection.execute("DELETE from notice WHERE comment_comments_post_id=?", params, function (err) {
        callback(err);
      });
    }
  }, {
    key: "delete_notice_comment_photo_DB",
    value: function delete_notice_comment_photo_DB(params, callback) {
      return this.connection.execute("DELETE from notice WHERE comment_photo_id=?", params, function (err) {
        callback(err);
      });
    }
  }, {
    key: "delete_notice_photo_DB",
    value: function delete_notice_photo_DB(params, callback) {
      return this.connection.execute("DELETE from notice WHERE photo_id=?", params, function (err) {
        callback(err);
      });
    }
  }]);

  return NoticeDB;
}();

module.exports = NoticeDB;