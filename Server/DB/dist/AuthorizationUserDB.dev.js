"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var mysql = require("mysql2");

var config = require("./config");

var AuthorizationUserDB =
/*#__PURE__*/
function () {
  function AuthorizationUserDB() {
    _classCallCheck(this, AuthorizationUserDB);

    this.connection = mysql.createConnection(config); // подключаем базу данных

    this.createTableUsers();
  } // создаем таблицу с зарегистрированными пользователями


  _createClass(AuthorizationUserDB, [{
    key: "createTableUsers",
    value: function createTableUsers() {
      var sql = "CREATE TABLE IF NOT EXISTS users (userID integer PRIMARY KEY AUTO_INCREMENT, ava varchar(100) DEFAULT 'ava_1.jpg', name varchar(50) NOT NULL, surname varchar(50) NOT NULL, email varchar(50) UNIQUE, user_pass text NOT NULL, year_user integer NOT NULL, month_user integer NOT NULL, day_user integer NOT NULL, selectedGender varchar(20) NOT NULL, country varchar(50), city varchar(50),  is_admin integer, delete_user integer default 0, pass_token varchar(250) NULL)";
      this.connection.execute(sql);
    } // возвращаем пользователя при попытке входа по его почте

  }, {
    key: "selectByEmail",
    value: function selectByEmail(email, callback) {
      this.connection.execute("SELECT userID, name, surname, ava, user_pass, is_admin FROM users WHERE email = ?", [email], function (err, row) {
        callback(err, row[0]);
      });
    } // добавляем пользователя в базу данных с пометкой админ

  }, {
    key: "insertAdmin",
    value: function insertAdmin(user, callback) {
      return this.connection.execute('INSERT INTO users (name,surname,email,user_pass,year_user,month_user,day_user,selectedGender,country,city,is_admin) VALUES (?,?,?,?,?,?,?,?,?,?,?)', user, function (err) {
        callback(err);
      });
    } //возвращаем список всех зарегестрированных пользователей

  }, {
    key: "selectAll",
    value: function selectAll(callback) {
      return this.connection.execute("SELECT * FROM users", function (err, rows) {
        callback(err, rows);
      });
    } //возвращаем информацию по пользователю

  }, {
    key: "loadUser",
    value: function loadUser(id, callback) {
      return this.connection.execute("SELECT userID,ava,email, name,surname,year_user,month_user,day_user,selectedGender,country,city,delete_user FROM users WHERE userID = ?", [id], function (err, row) {
        callback(err, row[0]);
      });
    } //возвращаем электронную почту пользователя

  }, {
    key: "loadUserEmail",
    value: function loadUserEmail(id, callback) {
      return this.connection.execute("SELECT email FROM users WHERE userID = ?", [id], function (err, user) {
        callback(err, user[0]);
      });
    } //возвращаем данные пользователя при обращении его в поддержку

  }, {
    key: "loadUserInfo",
    value: function loadUserInfo(id, callback) {
      return this.connection.execute("SELECT email, name, surname FROM users WHERE userID = ?", id, function (err, user) {
        callback(err, user[0]);
      });
    } //проверка на существование почты в базе данны

  }, {
    key: "check_double_email",
    value: function check_double_email(email, callback) {
      return this.connection.execute("SELECT email FROM users WHERE email = ?", [email], function (err, email) {
        callback(err, email);
      });
    } // добавляем пользователя в базу данных без метки админ

  }, {
    key: "insert",
    value: function insert(user, callback) {
      return this.connection.execute('INSERT INTO users (name,surname,email,user_pass,year_user,month_user,day_user,selectedGender,country,city) VALUES (?,?,?,?,?,?,?,?,?,?)', user, function (err) {
        callback(err);
      });
    } //редактирование информации о пользователе

  }, {
    key: "updateUser",
    value: function updateUser(user, callback) {
      return this.connection.execute("UPDATE users SET name=?, surname=?, email=COALESCE(NULLIF(?, ''),email), year_user=?, month_user=?, day_user=?, selectedGender=?, country=?, city=? WHERE userID =?", user, function (err) {
        callback(err);
      });
    } //добавляем токен для восстановления пароля пользователя

  }, {
    key: "add_token_pass_user",
    value: function add_token_pass_user(body, callback) {
      return this.connection.execute("UPDATE users SET pass_token=? WHERE email =?", body, function (err) {
        callback(err);
      });
    } //проверяем токен перед изменением пароля

  }, {
    key: "get_user_token",
    value: function get_user_token(token, callback) {
      return this.connection.execute("SELECT userID, pass_token FROM users WHERE email = ?", [token], function (err, user) {
        callback(err, user[0]);
      });
    } //получение пароля для сверки

  }, {
    key: "getPassword",
    value: function getPassword(id, callback) {
      this.connection.execute("SELECT user_pass FROM users WHERE userID = ?", [id], function (err, row) {
        callback(err, row[0]);
      });
    } //обновление пароля

  }, {
    key: "updateUserPassword",
    value: function updateUserPassword(body, callback) {
      return this.connection.execute("UPDATE users SET user_pass=?, pass_token=NULL WHERE userID = ?", body, function (err) {
        callback(err);
      });
    } //отправка пароля пользователю по запросу

  }, {
    key: "get_password_email",
    value: function get_password_email(email, callback) {
      this.connection.execute("SELECT user_pass FROM users WHERE email = ?", [email], function (err, row) {
        callback(err, row[0]);
      });
    } //удаление пользователя

  }, {
    key: "deleteUserDB",
    value: function deleteUserDB(user, callback) {
      return this.connection.execute("UPDATE users SET name='\u0423\u0414\u0410\u041B\u0415\u041D', surname='', email=NULL, year_user=0, month_user=0, day_user=0, selectedGender='', country='', city='', delete_user=1 WHERE userID =?", user, function (err) {
        callback(err);
      });
    } // меняем аватарку пользователя

  }, {
    key: "updateAva",
    value: function updateAva(ava, callback) {
      return this.connection.execute("UPDATE users SET ava=? WHERE userID =?", ava, function (err) {
        callback(err);
      });
    }
  }]);

  return AuthorizationUserDB;
}();

module.exports = AuthorizationUserDB;