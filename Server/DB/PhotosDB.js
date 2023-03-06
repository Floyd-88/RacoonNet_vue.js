const mysql = require('mysql2');
const config = require('./config')

class PhotosDB {
    constructor() {
        this.connection = mysql.createConnection(config); // подключаем базу данных
        this.createTablePhotos();
    }

    //создаем таблицу БД с фотографиями
    createTablePhotos() {
        const sql = `CREATE TABLE IF NOT EXISTS photos (id integer PRIMARY KEY AUTO_INCREMENT, photo_name varchar(150) not null, date timestamp not null DEFAULT CURRENT_TIMESTAMP, userID integer not null, category varchar (50) default 'not category', CONSTRAINT FK_Photos_Users FOREIGN KEY (userID)  REFERENCES users (userID) ON DELETE CASCADE)`;
        this.connection.execute(sql);
    }

    // добавление фото в базу данных
    add_photo_DB(arrayPhotos, callback) {
        return this.connection.query(
            'INSERT INTO photos (photo_name, userID, category) VALUES ?', [arrayPhotos], (err) => {
                callback(err);
            })
    }

    // загрузка фото из базы данны
    load_photos_DB(params, callback) {
        return this.connection.execute(`SELECT photo_name FROM photos WHERE userID = ? ORDER BY id DESC limit ?, ?`, params, (err, row) => {
            callback(err, row)
        });
    }

    //загрузка всех фото из базы данных
    load_all_photos_DB(params, callback) {
        return this.connection.execute(`SELECT id, photo_name, category FROM photos WHERE userID = ? ORDER BY id DESC`, params, (err, row) => {
            callback(err, row)
        });
    }

    // удаление фотографии
    remove_photo(photo, callback) {
        return this.connection.execute(`DELETE from photos WHERE id = ? and userID = ?`, photo, (err) => {
            callback(err);
        });
    }

}
module.exports = PhotosDB;