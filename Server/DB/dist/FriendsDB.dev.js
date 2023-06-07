"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var mysql = require('mysql2');

var config = require('./config');

var FriendsDB =
/*#__PURE__*/
function () {
  function FriendsDB() {
    _classCallCheck(this, FriendsDB);

    this.connection = mysql.createConnection(config); // подключаем базу данных

    this.createTableFriends();
  } //создаем таблицу БД с фотографиями


  _createClass(FriendsDB, [{
    key: "createTableFriends",
    value: function createTableFriends() {
      var sql = "CREATE TABLE IF NOT EXISTS friends (id integer PRIMARY KEY AUTO_INCREMENT, sender_user_id integer not null, addressee_user_id integer not null, confirm_sender integer default \"1\", confirm_addressee integer default \"0\",  CONSTRAINT FK_Friends_Sender FOREIGN KEY (sender_user_id)  REFERENCES users (userID), CONSTRAINT FK_Friends_Addressee FOREIGN KEY (addressee_user_id) REFERENCES users (userID)  ON DELETE CASCADE)";
      this.connection.execute(sql);
    } //проверяем на наличие ранее отправленных заявок в друзья

  }, {
    key: "get_confirm_friend_DB",
    value: function get_confirm_friend_DB(users, callback) {
      return this.connection.query("SELECT id, sender_user_id, addressee_user_id, confirm_sender, confirm_addressee FROM friends WHERE (sender_user_id=? AND addressee_user_id=?) OR (sender_user_id=? AND addressee_user_id=?)", users, function (err, confirmID) {
        callback(err, confirmID);
      });
    } //проверяем на наличие полученных заявок в друзья

  }, {
    key: "get_confirm_friends_DB",
    value: function get_confirm_friends_DB(userID, callback) {
      return this.connection.query("SELECT * FROM friends WHERE addressee_user_id=?", userID, function (err, confirm) {
        callback(err, confirm);
      });
    } //получаем моих друзей

  }, {
    key: "get_my_friends_DB",
    value: function get_my_friends_DB(userID, callback) {
      return this.connection.query("SELECT \n        F.id, U.userID, U.name, U.surname, U.country, U.ava, U.city FROM users U \n        INNER JOIN friends F ON \n        CASE\n            WHEN addressee_user_id=?\n        THEN\n            U.userID=sender_user_id\n        WHEN\n            sender_user_id = ?\n        THEN\n            U.userID=addressee_user_id\n        END\n        WHERE (confirm_addressee=1 AND confirm_sender=1) LIMIT ?, ?", userID, function (err, users) {
        callback(err, users);
      });
    } //получаем пользователй отправивших мне заявку в друзья

  }, {
    key: "get_user_confirm_friends_me_DB",
    value: function get_user_confirm_friends_me_DB(userID, callback) {
      return this.connection.query("SELECT F.id, U.userID, U.name, U.surname, U.country, U.ava, U.city FROM users U INNER JOIN friends F ON U.userID = F.sender_user_id WHERE addressee_user_id=? AND confirm_addressee NOT IN (1) LIMIT ?, ?", userID, function (err, users) {
        callback(err, users);
      });
    } //получаем пользователй которым я отправил заявку в друзья

  }, {
    key: "get_user_confirm_friends_from_me_DB",
    value: function get_user_confirm_friends_from_me_DB(userID, callback) {
      return this.connection.query("SELECT F.id, U.userID, U.name, U.surname, U.country, U.ava, U.city FROM users U INNER JOIN friends F ON U.userID = F.addressee_user_id WHERE sender_user_id=? AND confirm_addressee NOT IN (1) LIMIT ?, ?", userID, function (err, users) {
        callback(err, users);
      });
    } // отправляем заявку в друзья

  }, {
    key: "add_friend_DB",
    value: function add_friend_DB(users, callback) {
      return this.connection.query('INSERT INTO friends (sender_user_id, addressee_user_id) VALUES (?,?)', users, function (err, friendID) {
        callback(err, friendID);
      });
    } //отменяем запрос в друзья

  }, {
    key: "cancel_add_friend_DB",
    value: function cancel_add_friend_DB(confirmID, callback) {
      return this.connection.execute("DELETE from friends WHERE id = ?", confirmID, function (err) {
        callback(err);
      });
    } //согласие на принятие заявки в друзья

  }, {
    key: "agree_add_friend_DB",
    value: function agree_add_friend_DB(id, callback) {
      return this.connection.execute("UPDATE friends SET confirm_addressee=\"1\" WHERE id = ?", id, function (err) {
        callback(err);
      });
    } //удаление пользователя из друзей

  }, {
    key: "delete_friend_DB",
    value: function delete_friend_DB(body, callback) {
      return this.connection.execute("DELETE from friends WHERE id=?", body, function (err) {
        callback(err);
      });
    } // поиск среди пользователй друзей

  }, {
    key: "get_users",
    value: function get_users(params, callback) {
      return this.connection.query("SELECT userID, name, surname, country, city, ava, friends.id, \n        (SELECT\n                CASE \n                    WHEN confirm_sender = 1 AND confirm_addressee = 1\n                        THEN '\u0434\u0440\u0443\u0437\u044C\u044F'\n                    WHEN sender_user_id = ?  AND confirm_sender = 1 AND confirm_addressee = 0\n                        THEN '\u044F \u043E\u0442\u043F\u0440\u0430\u0432\u0438\u043B \u0437\u0430\u044F\u0432\u043A\u0443'\n                    WHEN sender_user_id = userID  AND confirm_sender = 1 AND confirm_addressee = 0\n                        THEN '\u043C\u043D\u0435 \u043E\u0442\u043F\u0440\u0430\u0432\u0438\u043B\u0438 \u0437\u0430\u044F\u0432\u043A\u0443'\n                END\n                FROM friends  WHERE (sender_user_id = userID AND addressee_user_id = ?) OR (sender_user_id = ? AND addressee_user_id = userID)  \n            ) type_user FROM users LEFT JOIN friends ON (sender_user_id = userID AND addressee_user_id = ?) OR (sender_user_id = ? AND addressee_user_id = userID) WHERE \n        userID NOT IN (?) AND\n        name LIKE ? AND \n        surname LIKE ? AND\n        country LIKE ? AND\n        city LIKE ? AND\n        selectedGender LIKE ? AND\n        (TIMESTAMPDIFF(year, CONCAT(year_user,\"-\", month_user,\"-\", day_user), now())) BETWEEN ? AND ? LIMIT ?, ?", params, function (err, users) {
        callback(err, users);
      });
    } //удаление всех друзей пользователя при удалении профиля

  }, {
    key: "delete_user_friends_DB",
    value: function delete_user_friends_DB(body, callback) {
      return this.connection.execute("DELETE from friends WHERE sender_user_id=? OR addressee_user_id=?", body, function (err) {
        callback(err);
      });
    }
  }]);

  return FriendsDB;
}();

module.exports = FriendsDB;