const mysql = require('mysql2');
const config = require('./config')

class PhotosDB {
    constructor() {
        this.connection = mysql.createConnection(config); // подключаем базу данных
        this.createTablePhotos();
        this.createTablePhotosLikes();
        // this.createTablePhotosPost();
    }

    //создаем таблицу БД с фотографиями
    createTablePhotos() {
        const sql = `CREATE TABLE IF NOT EXISTS photos (id integer PRIMARY KEY AUTO_INCREMENT, photo_name varchar(150) not null, date timestamp not null DEFAULT CURRENT_TIMESTAMP, userID integer not null, pageID integer not null, category varchar (50) default 'not category', likes integer default 0, post_id_photo integer, CONSTRAINT FK_Photos_Users FOREIGN KEY (userID) REFERENCES users (userID) ON DELETE CASCADE)`;
        this.connection.execute(sql);
    }

    //создаем таблицу БД с лайками к фото
    createTablePhotosLikes() {
        const sql = `CREATE TABLE IF NOT EXISTS photos_likes (
            id integer PRIMARY KEY AUTO_INCREMENT,
            photo_id integer, 
            author_likes_photo integer,
            CONSTRAINT FK_PhotosLikes_Photos FOREIGN KEY (photo_id) REFERENCES photos (id),
            CONSTRAINT FK_PhotosLikes_Users FOREIGN KEY (author_likes_photo) REFERENCES users (userID) ON DELETE CASCADE)`;
        this.connection.execute(sql);
    }

    // добавление фото в базу данных
    add_photo_DB(arrayPhotos, callback) {
        return this.connection.query(
            'INSERT INTO photos (photo_name, userID, pageID, category, post_id_photo) VALUES ?', [arrayPhotos], (err) => {
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
        return this.connection.execute(`SELECT 
        photos.id, 
        photos.photo_name, 
        photos.category, 
        users.name, 
        users.surname, 
        users.ava, 
        users.userID,
        photos.date, 
        photos.likes,
        SUM(CASE WHEN photos_likes.author_likes_photo = ? THEN 1 ELSE 0 END) as like_photo 
        FROM 
        photos INNER JOIN users ON photos.userID = users.userID LEFT JOIN photos_likes ON photos_likes.photo_id = photos.id
        WHERE pageID = ? AND pageID = photos.userID GROUP BY 
        photos.id, 
        photos.photo_name, 
        photos.category, 
        users.name, 
        users.surname, 
        users.ava, 
        users.userID,
        photos.date, 
        photos.likes
        ORDER BY id DESC`, params, (err, row) => {
            callback(err, row)
        });
    }

    // удаление лайков перед удалением фотографии
    remove_photo_likes(photoID, callback) {
            return this.connection.execute(`DELETE from photos_likes WHERE photo_id = ?`, photoID, (err) => {
                callback(err);
            });
        }
        // удаление фотографии
    remove_photo(photo, callback) {
        return this.connection.execute(`DELETE from photos WHERE id = ? and userID = ?`, photo, (err) => {
            callback(err);
        });
    }

    //поверяем на повторный лайк фото
    not_double_likes_photo_author(params, callback) {
        return this.connection.execute(`SELECT id FROM photos_likes WHERE photo_id=? AND author_likes_photo = ?`, params, (err, row) => {
            callback(err, row)
        });
    }

    //добавляем автора лайка фото в БД
    add_author_likes_photo(params, callback) {
        return this.connection.execute(`INSERT INTO photos_likes (photo_id, author_likes_photo) VALUES (?,?)`, params, (err) => {
            callback(err);
        })
    };

    //убираем автора лайка фото при повторном клике
    remove_author_like_photo(id, callback) {
        return this.connection.execute(`DELETE from photos_likes WHERE id = ?`, id, (err) => {
            callback(err);
        });
    }

    // лайкаем фото
    add_count_likes(params, callback) {
        return this.connection.execute(`UPDATE photos SET likes = likes + 1 WHERE id=?`, params, (err) => {
            callback(err);
        })
    }

    // отменяем лайк фото
    remove_count_likes(params, callback) {
        return this.connection.execute(`UPDATE photos SET likes = likes - 1 WHERE id=?`, params, (err) => {
            callback(err);
        })
    }

    //получаем количество лайков у фото
    get_count_likes_photo(id, callback) {
        return this.connection.execute(`SELECT likes FROM photos WHERE id=?`, id, (err, likes) => {
            callback(err, likes[0]);
        })
    }

}
module.exports = PhotosDB;