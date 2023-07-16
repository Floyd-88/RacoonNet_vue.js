"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var mysql = require('mysql2');

var config = require('./config');

var MessagesDB =
/*#__PURE__*/
function () {
  function MessagesDB() {
    _classCallCheck(this, MessagesDB);

    this.connection = mysql.createConnection(config); // подключаем базу данных

    this.createTableMessages();
    this.createTableСonversation();
  } //Создаем таблицу с диалогами


  _createClass(MessagesDB, [{
    key: "createTable\u0421onversation",
    value: function createTableOnversation() {
      var sql = "CREATE TABLE IF NOT EXISTS conversation (\n            id integer PRIMARY KEY AUTO_INCREMENT,\n            first integer NOT NULL,\n            second integer NOT NULL,\n            last_message_id integer NOT NULL,\n            sender integer NOT NULL,\n            first_delete integer(1) NOT NULL,\n            second_delete integer(1) NOT NULL,\n            unread integer NOT NULL\n        )";
      return this.connection.execute(sql);
    } //создаем таблицу БД с сообщениями

  }, {
    key: "createTableMessages",
    value: function createTableMessages() {
      var sql = "CREATE TABLE IF NOT EXISTS messages (\n            id integer PRIMARY KEY AUTO_INCREMENT,\n            conv_id integer NOT NULL,\n            sender integer NOT NULL,\n            addressee integer NOT NULL,\n            readed integer(1) NOT NULL,\n            sender_delete integer(1) NOT NULL,\n            addressee_delete integer(1) NOT NULL,\n            message text NOT NULL,\n            date varchar(50) NOT NULL,\n            photos varchar(10) default 'false'\n        )";
      return this.connection.execute(sql);
    } //получаем id диалога между пользователями если он есть 

  }, {
    key: "get_conversation_id_DB",
    value: function get_conversation_id_DB(params, callback) {
      return this.connection.execute("SELECT\n        id, unread FROM conversation WHERE\n        (first = ? AND second = ?)\n            OR\n        (first = ? AND second = ?)", params, function (err, row_conversation) {
        callback(err, row_conversation);
      });
    } //создаем диалог между пользователями если его нету

  }, {
    key: "add_conversation_DB",
    value: function add_conversation_DB(params, callback) {
      return this.connection.execute("INSERT INTO conversation\n        (first, second, last_message_id, sender, first_delete, second_delete, unread) VALUES (?, ?, '0', ?, '0', '0', '0')", params, function (err, last_conversation) {
        callback(err, last_conversation);
      });
    } //добавление сообщение в базу данных

  }, {
    key: "add_message_DB",
    value: function add_message_DB(params, callback) {
      return this.connection.execute("INSERT INTO messages\n        (conv_id, sender, addressee, readed, sender_delete, addressee_delete, message, date, photos) VALUES (?, ?, ?, '0', '0', '0', ?, ?, ?)", params, function (err, row_messages) {
        callback(err, row_messages);
      });
    } //возвращаем написанное сообщение клиенту

  }, {
    key: "get_last_message_DB",
    value: function get_last_message_DB(id_message, callback) {
      return this.connection.execute("SELECT \n        M.id,\n        M.date,\n        M.message,\n        M.sender,\n        M.conv_id,\n        M.photos,\n        M.readed,\n        U.name,\n        U.surname,\n        U.ava FROM messages M LEFT JOIN users U ON M.sender = U.userID  WHERE M.id = ?", id_message, function (err, newMessage) {
        callback(err, newMessage);
      });
    } //обновление таблицы с диалогами

  }, {
    key: "update_conversation_id_DB",
    value: function update_conversation_id_DB(params, callback) {
      return this.connection.execute("UPDATE conversation C SET\n        C.last_message_id = ?,\n        C.sender = ?,\n        C.first = ?,\n        C.second = ?,\n        C.first_delete = '0',\n        C.second_delete = '0',\n        C.unread = (SELECT COUNT(*) FROM messages M WHERE\n        M.conv_id = ? AND \n        M.readed = '0' AND \n        M.sender = ?) WHERE\n        id = ?", params, function (err) {
        callback(err);
      });
    } //получаем диалоги пользователя

  }, {
    key: "get_all_conversation_DB",
    value: function get_all_conversation_DB(body, callback) {
      return this.connection.execute("SELECT\n        M.id,\n        U.userID,\n        U.name,\n        U.surname,\n        U.ava,\n        C.id as convId,\n        C.sender,\n        C.unread,\n        M.message,\n        M.date\n            FROM \n                users U, conversation C\n                LEFT JOIN messages M ON (C.id = M.conv_id)\n                    WHERE (M.sender = ".concat(body.tokenID, " OR M.addressee = ").concat(body.tokenID, ")\n                        AND CASE \n                            WHEN M.sender = ").concat(body.tokenID, "\n                        THEN M.sender_delete = '0' AND M.addressee = U.userID \n                            WHEN M.addressee = ").concat(body.tokenID, "\n                        THEN M.addressee_delete = '0' AND M.sender = U.userID \n                    END\n                    AND M.id IN (SELECT\n                        MAX(M.id) as last_message\n                            FROM users U, conversation C\n                            LEFT JOIN messages M ON (C.id = M.conv_id)\n                                WHERE (M.sender = ").concat(body.tokenID, " OR M.addressee = ").concat(body.tokenID, ")\n                                AND CASE \n                                WHEN M.sender = ").concat(body.tokenID, "\n                                    THEN M.sender_delete = '0' AND M.addressee = U.userID \n                                WHEN M.addressee = ").concat(body.tokenID, "\n                                    THEN M.addressee_delete = '0' AND M.sender = U.userID \n                                END\n                                GROUP BY U.userID\n                            ORDER BY last_message DESC) \n                        ORDER BY  M.id  DESC LIMIT ").concat(body._count, ", ").concat(body._limit), function (err, dialogs) {
        callback(err, dialogs);
      });
    } //получаем переписку с конкретным пользователем

  }, {
    key: "get_messages_user_DB",
    value: function get_messages_user_DB(params, callback) {
      return this.connection.execute("SELECT\n        M.id,\n        M.date,\n        M.message,\n        M.sender,\n        U.name,\n        U.surname,\n        M.conv_id,\n        M.photos,\n        M.readed,\n       \t(SELECT unread FROM conversation WHERE id = ? AND CASE WHEN sender = ? THEN unread = 0 ELSE unread END) as unread,\n        U.ava FROM messages M LEFT JOIN users U ON M.sender = U.userID  LEFT JOIN conversation C ON C.id = M.conv_id\n        WHERE M.conv_id = ?\n        AND CASE\n            WHEN M.sender = ?\n                THEN sender_delete = '0'\n            WHEN M.addressee = ?\n                THEN addressee_delete = '0'\n            END ORDER BY id DESC LIMIT ?, ?", params, function (err, messages_user) {
        callback(err, messages_user);
      });
    } //загрузка фотографий к сообщениям 

  }, {
    key: "load_photos_messages_DB",
    value: function load_photos_messages_DB(params, callback) {
      return this.connection.execute("SELECT \n        users.name, \n        users.surname, \n        users.ava, \n        users.userID,\n        photos.date, \n        messages.id as messageID, \n        photos.photo_name,\n        photos.id as photoID\n        FROM messages \n        INNER JOIN photos ON photos.message_id_photo = messages.id \n        INNER JOIN users ON photos.userID = users.userID \n        WHERE messages.id = ?", params, function (err, row) {
        callback(err, row);
      });
    } //обновляем флаг просмотра сообщений в таблице сообщений

  }, {
    key: "update_flag_unread_messages",
    value: function update_flag_unread_messages(id, callback) {
      return this.connection.execute("UPDATE LOW_PRIORITY messages\n        SET readed = '1'\n        WHERE conv_id = ? AND addressee = ?", id, function (err) {
        callback(err);
      });
    } //обновляем флаг просмотра сообщений в таблице диалогов

  }, {
    key: "update_flag_unread_conersation",
    value: function update_flag_unread_conersation(id, callback) {
      return this.connection.execute("UPDATE LOW_PRIORITY conversation\n        SET unread = (SELECT COUNT(*) FROM messages M WHERE\n        M.conv_id = ? AND \n        M.readed = '0' AND \n        M.addressee = ?) \n        WHERE id = ? AND second = ?", id, function (err, row) {
        callback(err, row);
      });
    } //проверяем наличие сообщения для удаления

  }, {
    key: "get_message",
    value: function get_message(params, callback) {
      return this.connection.execute("SELECT id FROM messages WHERE \n            id = ? AND (sender = ? OR addressee = ?)", params, function (err, message) {
        callback(err, message[0]);
      });
    } //обновляем флаг удаления сообщения у пользователя

  }, {
    key: "update_message_flag_delete",
    value: function update_message_flag_delete(params, callback) {
      return this.connection.execute("UPDATE messages SET\n        sender_delete =\n            CASE sender\n                WHEN ?\n                    THEN '1'\n                ELSE\n                    sender_delete\n                END,\n        addressee_delete = \n            CASE addressee\n                WHEN ?\n                    THEN '1'\n                ELSE\n                    addressee_delete\n                END\n        WHERE id = ?", params, function (err) {
        callback(err);
      });
    } //обновляем флаги удаления для всех сообщений в диалоге у пользователя

  }, {
    key: "update_messages_flag_delete",
    value: function update_messages_flag_delete(params, callback) {
      return this.connection.execute("UPDATE messages SET\n        sender_delete =\n            CASE sender\n                WHEN ?\n                    THEN '1'\n                ELSE\n                    sender_delete\n                END,\n        addressee_delete = \n            CASE addressee\n                WHEN ?\n                    THEN '1'\n                ELSE\n                    addressee_delete\n                END\n        WHERE conv_id = ?", params, function (err) {
        callback(err);
      });
    } //обновляем флаги удаления для всех сообщений во всех диалоах у пользователя перед удалением профиля

  }, {
    key: "update_all_messages_flag_delete",
    value: function update_all_messages_flag_delete(params, callback) {
      return this.connection.execute("UPDATE messages SET\n        sender_delete =\n            CASE sender\n                WHEN ?\n                    THEN '1'\n                ELSE\n                    sender_delete\n                END,\n        addressee_delete = \n            CASE addressee\n                WHEN ?\n                    THEN '1'\n                ELSE\n                    addressee_delete\n                END", params, function (err) {
        callback(err);
      });
    } //обновляем флаг удаления для диалога у пользователя что бы он не отображался

  }, {
    key: "update_conversation_flag_delete",
    value: function update_conversation_flag_delete(params, callback) {
      return this.connection.execute("UPDATE conversation SET\n        first_delete = \n            CASE first\n                WHEN ?\n                    THEN '1'\n                ELSE\n                    first_delete\n                END,\n        second_delete = \n            CASE second\n                WHEN ?\n                    THEN '1'\n                ELSE\n                    second_delete\n                END\n        WHERE id = ?", params, function (err) {
        callback(err);
      });
    } //обновляем флаг удаления для всех диалогов у пользователя что бы он не отображался перед удалением профиля 

  }, {
    key: "update_all_conversation_flag_delete",
    value: function update_all_conversation_flag_delete(params, callback) {
      return this.connection.execute("UPDATE conversation SET\n        first_delete = \n            CASE first\n                WHEN ?\n                    THEN '1'\n                ELSE\n                    first_delete\n                END,\n        second_delete = \n            CASE second\n                WHEN ?\n                    THEN '1'\n                ELSE\n                    second_delete\n                END", params, function (err) {
        callback(err);
      });
    } //проверяем наличие диалога для его удаления

  }, {
    key: "get_conversation",
    value: function get_conversation(params, callback) {
      return this.connection.execute("SELECT id FROM conversation WHERE \n            id = ? AND (first = ? OR second = ?)", params, function (err, dialog) {
        callback(err, dialog[0]);
      });
    } //проверяем на удаление сообщения обоими пользователями

  }, {
    key: "check_message_flag_delete",
    value: function check_message_flag_delete(id, callback) {
      return this.connection.execute("SELECT (CASE WHEN sender_delete=1 AND addressee_delete=1 THEN 'true' ELSE 'false' END) as bool FROM messages WHERE id = ?", id, function (err, message_flag) {
        callback(err, message_flag[0]);
      });
    } //проверяем на удаление диалога обоими пользователями

  }, {
    key: "check_dialog_flag_delete",
    value: function check_dialog_flag_delete(id, callback) {
      return this.connection.execute("SELECT (CASE WHEN first_delete=1 AND second_delete=1 THEN 'true' ELSE 'false' END) as bool FROM conversation WHERE id = ?", id, function (err, message_flag) {
        callback(err, message_flag[0]);
      });
    } //удаляем сообщение из БД

  }, {
    key: "delete_message",
    value: function delete_message(id, callback) {
      return this.connection.execute("DELETE FROM messages WHERE id=?", id, function (err) {
        callback(err);
      });
    } //удаляем диалог из БД

  }, {
    key: "delete_dialog",
    value: function delete_dialog(id, callback) {
      return this.connection.execute("DELETE FROM conversation WHERE id=?", id, function (err) {
        callback(err);
      });
    } //удаляем все сообщения из диалога

  }, {
    key: "delete_all_message_dialog",
    value: function delete_all_message_dialog(id, callback) {
      return this.connection.execute("DELETE FROM messages WHERE conv_id=?", id, function (err) {
        callback(err);
      });
    } //получаем массив фотографий из сообщения при удалении

  }, {
    key: "message_photos_DB",
    value: function message_photos_DB(id, callback) {
      return this.connection.execute("SELECT id, photo_name FROM photos WHERE message_id_photo=?", [id], function (err, photosArray) {
        callback(err, photosArray);
      });
    } //получаем массив фотографий из диалога при удалении

  }, {
    key: "dialog_photos_DB",
    value: function dialog_photos_DB(id, callback) {
      return this.connection.execute("SELECT id, photo_name FROM photos WHERE message_id_photo IN (SELECT id FROM messages WHERE conv_id=?)", [id], function (err, photosArray) {
        callback(err, photosArray);
      });
    }
  }]);

  return MessagesDB;
}();

module.exports = MessagesDB;