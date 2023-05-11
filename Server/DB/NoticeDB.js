const mysql = require('mysql2');
const config = require('./config')

class NoticeDB {
    constructor() {
        this.connection = mysql.createConnection(config); // подключаем базу данных
        this.createTableNotice();
    }

    //создаем таблицу БД с уведомлениями
    createTableNotice() {
        const sql = `CREATE TABLE IF NOT EXISTS notice (
            id integer PRIMARY KEY AUTO_INCREMENT,
            user_id_addressee integer NOT NULL,
            user_id_sender integer NOT NULL,
            text_notice varchar(250) NOT NULL,
            post_id integer,
            photo_id integer,
            comment_post_id integer,
            comment_comments_post_id integer,
            comment_photo_id integer,
            date varchar(50) NOT NULL
        )`
        return this.connection.execute(sql);
    }

    //добавление уведомления в базу данных
    add_notice_DB(params, callback) {
        return this.connection.execute(`INSERT INTO notice
        (user_id_addressee, user_id_sender, text_notice, post_id, photo_id, comment_post_id, comment_comments_post_id, comment_photo_id, date) VALUES (?,?,?,?,?,?,?,?,?)`, params, (err, row_notice) => {
            callback(err, row_notice);
        });
    }

    // возвращаем уведомление пользователю
    get_notice_DB(user, callback) {
        return this.connection.execute(`SELECT 
        N.id,
        N.date,
        N.text_notice,
        U.userID,
        U.name,
        U.surname,
        U.selectedGender,
        U.ava FROM notice N LEFT JOIN users U ON N.user_id_sender = U.userID  WHERE N.user_id_addressee = ? ORDER BY N.id DESC`, user, (err, newNotice) => {
            callback(err, newNotice);
        })
    }

    // удаление уведомления
    delete_notice_DB(id, callback) {
        return this.connection.execute(`DELETE from notice WHERE id= ?`, id, (err) => {
            callback(err);
        });
    }

    delete_notice_like_DB(params, callback) {
        return this.connection.execute(`DELETE from notice WHERE user_id_addressee=? AND user_id_sender=? AND post_id=? AND photo_id=?`, params, (err) => {
            callback(err);
        });
    }

    delete_notice_friend_DB(params, callback) {
        return this.connection.execute(`DELETE from notice WHERE (user_id_addressee=? AND user_id_sender=? OR user_id_sender=? AND user_id_addressee=?) AND post_id=0 AND photo_id=0`, params, (err) => {
            callback(err);
        });
    }

    delete_notice_post_DB(params, callback) {
        return this.connection.execute(`DELETE from notice WHERE post_id=? AND photo_id=0`, params, (err) => {
            callback(err);
        });
    }

    delete_notice_comment_post_DB(params, callback) {
        return this.connection.execute(`DELETE from notice WHERE comment_post_id=?`, params, (err) => {
            callback(err);
        });
    }

    delete_notice_comment_comments_post_DB(params, callback) {
        return this.connection.execute(`DELETE from notice WHERE comment_comments_post_id=?`, params, (err) => {
            callback(err);
        });
    }

    delete_notice_comment_photo_DB(params, callback) {
        return this.connection.execute(`DELETE from notice WHERE comment_photo_id=?`, params, (err) => {
            callback(err);
        });
    }

    delete_notice_photo_DB(params, callback) {
        return this.connection.execute(`DELETE from notice WHERE photo_id=?`, params, (err) => {
            callback(err);
        });
    }

}
module.exports = NoticeDB;