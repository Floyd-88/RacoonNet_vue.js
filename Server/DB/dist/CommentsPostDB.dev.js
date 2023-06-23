"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var mysql = require('mysql2');

var config = require('./config');

var CommentsPostDB =
/*#__PURE__*/
function () {
  function CommentsPostDB() {
    _classCallCheck(this, CommentsPostDB);

    this.connection = mysql.createConnection(config); // подключаем базу данных

    this.createTableCommentsPost();
    this.createTableCommentsComment();
  } //создаем таблицу БД с комментариями к постам


  _createClass(CommentsPostDB, [{
    key: "createTableCommentsPost",
    value: function createTableCommentsPost() {
      var sql = "CREATE TABLE IF NOT EXISTS comments_post (id integer PRIMARY KEY AUTO_INCREMENT, post_id integer not null, comment_post_text text not null, author_comment_id integer not null, user_page_id integer not null, date varchar(50) not null, CONSTRAINT FK_CommentsPost_Author FOREIGN KEY (author_comment_id) REFERENCES users (userID), CONSTRAINT FK_CommentsPost_userPage  FOREIGN KEY (user_page_id) REFERENCES users (userID), CONSTRAINT FK_CommentsPost_Post FOREIGN KEY (post_id) REFERENCES posts (id)  ON DELETE CASCADE)";
      this.connection.execute(sql);
    } //создаем таблицу БД с комментариями к комментариям

  }, {
    key: "createTableCommentsComment",
    value: function createTableCommentsComment() {
      var sql = "CREATE TABLE IF NOT EXISTS comments_comment (id integer PRIMARY KEY AUTO_INCREMENT, comment_id integer not null, comment_comment_text text not null, author_comment integer not null, nameAddressee varchar(150), user_page integer not null, date varchar(50) not null, comment_commentID integer null, author_comment_comment integer null, answer_comment_comment_text text null, CONSTRAINT FK_CommentsComment_Author FOREIGN KEY (author_comment) REFERENCES users (userID), CONSTRAINT FK_CommentsComment_userPage  FOREIGN KEY (user_page) REFERENCES users (userID), CONSTRAINT FK_CommentsComment_Comment FOREIGN KEY (comment_id) REFERENCES comments_post (id)  ON DELETE CASCADE)";
      this.connection.execute(sql);
    } //получаем комментарии к постам

  }, {
    key: "load_comments_DB",
    value: function load_comments_DB(params, callback) {
      return this.connection.query("SELECT id, name, surname, ava, post_id, comment_post_text, author_comment_id, date FROM comments_post INNER JOIN users ON author_comment_id = userID WHERE user_page_id=? AND post_id IN (?)", params, function (err, comments) {
        callback(err, comments);
      });
    } //получаем комментарии к одномк посту

  }, {
    key: "load_comments_one_DB",
    value: function load_comments_one_DB(id, callback) {
      return this.connection.query("SELECT id, name, surname, ava, post_id, comment_post_text, author_comment_id, date FROM comments_post INNER JOIN users ON author_comment_id = userID WHERE post_id=?", id, function (err, comments) {
        callback(err, comments);
      });
    } //получаем комментарии к комментарию

  }, {
    key: "load_comments_comment_DB",
    value: function load_comments_comment_DB(params, callback) {
      return this.connection.query("SELECT id, name, surname, ava, comment_id, comment_comment_text, author_comment, date, nameAddressee FROM comments_comment INNER JOIN users ON author_comment = userID WHERE user_page=? AND comment_id IN (?)", params, function (err, comment) {
        callback(err, comment);
      });
    } //получаем комментарии к комментарию к одному посту

  }, {
    key: "load_comments_comment_one_DB",
    value: function load_comments_comment_one_DB(id, callback) {
      return this.connection.query("SELECT id, name, surname, ava, comment_id, comment_comment_text, author_comment, date, nameAddressee FROM comments_comment INNER JOIN users ON author_comment = userID WHERE comment_id=?", id, function (err, comment) {
        callback(err, comment);
      });
    } //добавляем комментарий к посту в БД

  }, {
    key: "add_commentPost_DB",
    value: function add_commentPost_DB(body, callback) {
      return this.connection.execute("INSERT INTO comments_post (post_id, comment_post_text, author_comment_id, user_page_id, date) VALUES (?,?,?,?,?)", body, function (err, row) {
        callback(err, row);
      });
    } //получаем новый комментарий из БД

  }, {
    key: "load_one_comment_DB",
    value: function load_one_comment_DB(newCommentID, callback) {
      return this.connection.execute("SELECT comments_post.id, name, surname, ava, post_id, comment_post_text, author_comment_id, authorPost, comments_post.date FROM comments_post INNER JOIN users ON author_comment_id = userID INNER JOIN posts ON comments_post.post_id = posts.id WHERE comments_post.id = ?", [newCommentID], function (err, row) {
        callback(err, row[0]);
      });
    } //добавляем комментарий к другому комментарию в БД

  }, {
    key: "add_commentComment_DB",
    value: function add_commentComment_DB(body, callback) {
      return this.connection.execute("INSERT INTO comments_comment (comment_id, comment_comment_text, author_comment, nameAddressee, user_page, date, comment_commentID, author_comment_comment, answer_comment_comment_text) VALUES (?,?,?,?,?,?,?,?,?)", body, function (err, row) {
        callback(err, row);
      });
    } //получаем новый комментарий из БД

  }, {
    key: "load_one_comment_comment_DB",
    value: function load_one_comment_comment_DB(newCommentID, callback) {
      return this.connection.execute("SELECT comments_comment.id, name, surname, ava, comment_id, comment_comment_text, author_comment, author_comment_id, comments_comment.date FROM comments_comment INNER JOIN users ON author_comment = userID INNER JOIN comments_post ON comment_id = comments_post.id WHERE comments_comment.id = ?", [newCommentID], function (err, row) {
        callback(err, row[0]);
      });
    } //удаление комментария к комментарию

  }, {
    key: "remove_comment_comment_DB",
    value: function remove_comment_comment_DB(commentID, callback) {
      return this.connection.execute("DELETE from comments_comment WHERE id = ?", [commentID], function (err) {
        callback(err);
      });
    } //удаление комментария к посту

  }, {
    key: "remove_comment_post_DB",
    value: function remove_comment_post_DB(commentID, callback) {
      return this.connection.execute("DELETE from comments_post WHERE id = ?", [commentID], function (err) {
        callback(err);
      });
    }
  }]);

  return CommentsPostDB;
}();

module.exports = CommentsPostDB;