const mysql = require('mysql2');
const config = require('./config')

class CommentsPhotoDB {
    constructor() {
        this.connection = mysql.createConnection(config); // подключаем базу данных
        this.createTableCommentsPhoto();
    }

    //создаем таблицу БД с комментариями к фотографиям
    createTableCommentsPhoto() {
        const sql = `CREATE TABLE IF NOT EXISTS comments_photo (id integer PRIMARY KEY AUTO_INCREMENT, photo_id integer not null, comment_photo_text text not null, author_comment_id integer not null, user_page_id integer not null, date varchar(50) not null, CONSTRAINT FK_CommentsPhoto_Author FOREIGN KEY (author_comment_id) REFERENCES users (userID), CONSTRAINT FK_CommentsPhoto_userPage FOREIGN KEY (user_page_id) REFERENCES users (userID), CONSTRAINT FK_CommentsPhoto_Photos FOREIGN KEY (photo_id) REFERENCES photos (id) ON DELETE CASCADE)`;
        this.connection.execute(sql);
    }

    //получаем комментарии к фотографиям
    load_commentsPhoto_DB(id, callback) {
        return this.connection.query(`SELECT id, name, surname, ava, photo_id, comment_photo_text, author_comment_id, date FROM comments_photo INNER JOIN users ON author_comment_id = userID WHERE photo_id=?`, id, (err, comments) => {
            callback(err, comments);
        })
    }

    //добавляем комментарий к фотографии в БД
    add_commentPhoto_DB(body, callback) {
        return this.connection.execute(`INSERT INTO comments_photo (photo_id, comment_photo_text, author_comment_id, user_page_id, date) VALUES (?,?,?,?,?)`, body, (err, row) => {
            callback(err, row);
        });
    }

    //получаем новый комментарий из БД
    load_one_comment_photo_DB(newCommentID, callback) {
        return this.connection.execute(`SELECT id, name, surname, ava, photo_id, comment_photo_text, author_comment_id, date FROM comments_photo INNER JOIN users ON author_comment_id = userID WHERE id = ?`, [newCommentID], (err, row) => {
            callback(err, row[0])
        });
    }

    // //удаление комментария к фотографии
    remove_comment_photo_DB(commentID, callback) {
        return this.connection.execute(`DELETE from comments_photo WHERE id = ?`, [commentID], (err) => {
            callback(err);
        });
    }
}
module.exports = CommentsPhotoDB