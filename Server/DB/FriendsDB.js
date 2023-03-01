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
        return this.connection.query(`SELECT id, confirm_sender, confirm_addressee FROM friends WHERE sender_user_id=? AND addressee_user_id=?`, users, (err, confirmID) => {
            callback(err, confirmID)
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


    // // загрузка фото из базы данны
    // load_photos_DB(params, callback) {
    //     return this.connection.execute(`SELECT photo_name FROM photos WHERE userID = ? ORDER BY id DESC limit ?, ?`, params, (err, row) => {
    //         callback(err, row)
    //     });
    // }

    // //загрузка всех фото из базы данных
    // load_all_photos_DB(params, callback) {
    //     return this.connection.execute(`SELECT id, photo_name FROM photos WHERE userID = ? ORDER BY id DESC`, params, (err, row) => {
    //         callback(err, row)
    //     });
    // }

    // // удаление фотографии
    // remove_photo(photo, callback) {
    //     return this.connection.execute(`DELETE from photos WHERE id = ? and userID = ?`, photo, (err) => {
    //         callback(err);
    //     });
    // }

}
module.exports = FriendsDB;