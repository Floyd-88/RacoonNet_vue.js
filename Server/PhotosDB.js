const mysql = require('mysql2');
const config = require('./config')

class PhotosDB {
    constructor() {
        this.connection = mysql.createConnection(config); // подключаем базу данных
        this.createTablePosts();
    }

    //создаем таблицу БД с фотографиями
    createTablePosts() {
        const sql = `CREATE TABLE IF NOT EXISTS photos (id integer PRIMARY KEY AUTO_INCREMENT, photo_name varchar(150) not null, date timestamp not null DEFAULT CURRENT_TIMESTAMP, userID integer not null, CONSTRAINT FK_Photos_Users FOREIGN KEY (userID)  REFERENCES users (userID) ON DELETE CASCADE)`;
        this.connection.execute(sql);
    }

    // добавление фото в базу данных
    add_photo_DB(photo, callback) {
        return this.connection.execute(
            'INSERT INTO photos (photo_name, userID) VALUES (?, ?)', photo, (err) => {
                callback(err);
            })
    }

    // // загрузка фото из базы данны
    load_photos_DB(params, callback) {
        return this.connection.execute(`SELECT photo_name FROM photos WHERE userID = ? ORDER BY id DESC limit ?, ?`, params, (err, row) => {
            callback(err, row)
        });
    }

    // //добавление поста в базу данных
    // add_post_DB(body, callback) {
    //     return this.connection.execute(`INSERT INTO posts(ava, name, surname, date, postText, userID) VALUES (?,?,?,?,?,?)`, body, (err, row) => {
    //         callback(err, row);
    //     });
    // }

    // // редактирование поста
    // edit_post_DB(body, callback) {
    //     return this.connection.execute(`UPDATE posts SET postText=?, date=? WHERE id =?`, body, (err) => {
    //         callback(err);
    //     });
    // }

    // // удаление поста
    // remove_post_DB(id, callback) {
    //     return this.connection.execute(`DELETE from posts WHERE id = ?`, [id], (err) => {
    //         callback(err);
    //     });
    // }

    // //обновление имени и фамилии в постах при редактировании профиля
    // updateTitlePosts(name, callback) {
    //     return this.connection.execute(`UPDATE posts SET name=?, surname=? WHERE userID =?`, name, (err) => {
    //         callback(err);
    //     })
    // }

}
module.exports = PhotosDB;