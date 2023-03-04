const mysql = require('mysql2');
const config = require('./config')

class FriendsDB {
    constructor() {
        this.connection = mysql.createConnection(config); // подключаем базу данных
        this.createTableFriends();
    }

    //создаем таблицу БД с фотографиями
    createTableFriends() {
        const sql = `CREATE TABLE IF NOT EXISTS friends (id integer PRIMARY KEY AUTO_INCREMENT, sender_user_id integer not null, addressee_user_id integer not null, confirm_sender integer default "1", confirm_addressee integer default "0",  CONSTRAINT FK_Friends_Sender FOREIGN KEY (sender_user_id)  REFERENCES users (userID), CONSTRAINT FK_Friends_Addressee FOREIGN KEY (addressee_user_id) REFERENCES users (userID)  ON DELETE CASCADE)`;
        this.connection.execute(sql);
    }

    //проверяем на наличие ранее отправленных заявок в друзья
    get_confirm_friend_DB(users, callback) {
        return this.connection.query(`SELECT id, sender_user_id, addressee_user_id, confirm_sender, confirm_addressee FROM friends WHERE (sender_user_id=? AND addressee_user_id=?) OR (addressee_user_id=? AND sender_user_id=?)`, users, (err, confirmID) => {
            callback(err, confirmID)
        })
    }

    //проверяем на наличие полученных заявок в друзья
    get_confirm_friends_DB(userID, callback) {
        return this.connection.query(`SELECT * FROM friends WHERE addressee_user_id=?`, userID, (err, confirm) => {
            callback(err, confirm)
        })
    }

    //получаем моих друзей
    get_my_friends_DB(userID, callback) {
        return this.connection.query(`SELECT 
        F.id, U.userID, U.name, U.surname, U.country, U.ava, U.city FROM users U 
        INNER JOIN friends F ON 
        CASE
            WHEN addressee_user_id=?
        THEN
            U.userID=sender_user_id
        WHEN
            sender_user_id = ?
        THEN
            U.userID=addressee_user_id
        END
        WHERE (confirm_addressee=1 AND confirm_sender=1)`, userID, (err, users) => {
            callback(err, users)
        })
    }

    //получаем пользователй отправивших мне заявку в друзья
    get_user_confirm_friends_me_DB(userID, callback) {
        return this.connection.query(`SELECT F.id, U.userID, U.name, U.surname, U.country, U.ava, U.city FROM users U INNER JOIN friends F ON U.userID = F.sender_user_id WHERE addressee_user_id=? AND confirm_addressee NOT IN (1)`, userID, (err, users) => {
            callback(err, users)
        })
    }

    //получаем пользователй которым я отправил заявку в друзья
    get_user_confirm_friends_from_me_DB(userID, callback) {
        return this.connection.query(`SELECT F.id, U.userID, U.name, U.surname, U.country, U.ava, U.city FROM users U INNER JOIN friends F ON U.userID = F.addressee_user_id WHERE sender_user_id=? AND confirm_addressee NOT IN (1)`, userID, (err, users) => {
            callback(err, users)
        })
    }

    // отправляем заявку в друзья
    add_friend_DB(users, callback) {
        return this.connection.query(
            'INSERT INTO friends (sender_user_id, addressee_user_id) VALUES (?,?)', users, (err) => {
                callback(err);
            })
    }

    //отменяем запрос в друзья
    cancel_add_friend_DB(confirmID, callback) {
        return this.connection.execute(`DELETE from friends WHERE id = ?`, confirmID, (err) => {
            callback(err);
        });
    }

    //согласие на принятие заявки в друзья
    agree_add_friend_DB(id, callback) {
        return this.connection.execute(`UPDATE friends SET confirm_addressee="1" WHERE id = ?`, id, (err) => {
            callback(err);
        });
    }

    //удаление пользователя из друзей
    delete_friend_DB(body, callback) {
        return this.connection.execute(`DELETE from friends WHERE id=?`, body, (err) => {
            callback(err)
        })
    }


}
module.exports = FriendsDB;