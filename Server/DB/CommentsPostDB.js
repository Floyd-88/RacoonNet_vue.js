const mysql = require('mysql2');
const config = require('./config')

class CommentsPostDB {
    constructor() {
        this.connection = mysql.createConnection(config); // подключаем базу данных
        this.createTableCommentsPost();
        this.createTableCommentsComment();
    }

    //создаем таблицу БД с комментариями к постам
    createTableCommentsPost() {
        const sql = `CREATE TABLE IF NOT EXISTS comments_post (id integer PRIMARY KEY AUTO_INCREMENT, post_id integer not null, comment_post_text text not null, author_comment_id integer not null, user_page_id integer not null, date varchar(50) not null, CONSTRAINT FK_CommentsPost_Author FOREIGN KEY (author_comment_id) REFERENCES users (userID), CONSTRAINT FK_CommentsPost_userPage  FOREIGN KEY (user_page_id) REFERENCES users (userID), CONSTRAINT FK_CommentsPost_Post FOREIGN KEY (post_id) REFERENCES posts (id)  ON DELETE CASCADE)`;
        this.connection.execute(sql);
    }

    //создаем таблицу БД с комментариями к комментариям
    createTableCommentsComment() {
        const sql = `CREATE TABLE IF NOT EXISTS comments_comment (id integer PRIMARY KEY AUTO_INCREMENT, comment_id integer not null, comment_comment_text text not null, author_comment integer not null, user_page integer not null, date varchar(50) not null, CONSTRAINT FK_CommentsComment_Author FOREIGN KEY (author_comment) REFERENCES users (userID), CONSTRAINT FK_CommentsComment_userPage  FOREIGN KEY (user_page) REFERENCES users (userID), CONSTRAINT FK_CommentsComment_Comment FOREIGN KEY (comment_id) REFERENCES comments_post (id)  ON DELETE CASCADE)`;
        this.connection.execute(sql);
    }

    //получаем комментарии к постам
    load_comments_DB(id, callback) {
        return this.connection.query(`SELECT id, name, surname, ava, post_id, comment_post_text, author_comment_id, date FROM comments_post INNER JOIN users ON author_comment_id = userID WHERE user_page_id=?`, id, (err, comments) => {
            callback(err, comments);
        })
    }

    //получаем комментарии к комментарию
    load_comments_comment_DB(id, callback) {
        return this.connection.query(`SELECT id, name, surname, ava, comment_id, comment_comment_text, author_comment, date FROM comments_comment INNER JOIN users ON author_comment = userID WHERE user_page=?`, id, (err, comment) => {
            callback(err, comment);
        })
    }

    //добавляем комментарий к посту в БД
    add_commentPost_DB(body, callback) {
        return this.connection.execute(`INSERT INTO comments_post (post_id, comment_post_text, author_comment_id, user_page_id, date) VALUES (?,?,?,?,?)`, body, (err, row) => {
            callback(err, row);
        });
    }

    //получаем новый комментарий из БД
    load_one_comment_DB(newCommentID, callback) {
        return this.connection.execute(`SELECT id, name, surname, ava, post_id, comment_post_text, author_comment_id, date FROM comments_post INNER JOIN users ON author_comment_id = userID WHERE id = ?`, [newCommentID], (err, row) => {
            callback(err, row[0])
        });
    }

    //добавляем комментарий к другому комментарию в БД
    add_commentComment_DB(body, callback) {
        return this.connection.execute(`INSERT INTO comments_comment (comment_id, comment_comment_text, author_comment, user_page, date) VALUES (?,?,?,?,?)`, body, (err, row) => {
            callback(err, row);
        });
    }

    //получаем новый комментарий из БД
    load_one_comment_comment_DB(newCommentID, callback) {
        return this.connection.execute(`SELECT id, name, surname, ava, comment_id, comment_comment_text, author_comment, date FROM comments_comment INNER JOIN users ON author_comment = userID WHERE id = ?`, [newCommentID], (err, row) => {
            callback(err, row[0])
        });
    }

    //удаление комментария к комментарию
    remove_comment_comment_DB(commentID, callback) {
        return this.connection.execute(`DELETE from comments_comment WHERE id = ?`, [commentID], (err) => {
            callback(err);
        });
    }

    //удаление комментария к посту
    remove_comment_post_DB(commentID, callback) {
        return this.connection.execute(`DELETE from comments_post WHERE id = ?`, [commentID], (err) => {
            callback(err);
        });
    }

    //проверяем на наличие ранее отправленных заявок в друзья
    // get_confirm_friend_DB(users, callback) {
    //     return this.connection.query(`SELECT id, sender_user_id, addressee_user_id, confirm_sender, confirm_addressee FROM friends WHERE (sender_user_id=? AND addressee_user_id=?) OR (addressee_user_id=? AND sender_user_id=?)`, users, (err, confirmID) => {
    //         callback(err, confirmID)
    //     })
    // }

    // //проверяем на наличие полученных заявок в друзья
    // get_confirm_friends_DB(userID, callback) {
    //     return this.connection.query(`SELECT * FROM friends WHERE addressee_user_id=?`, userID, (err, confirm) => {
    //         callback(err, confirm)
    //     })
    // }

    // //получаем моих друзей
    // get_my_friends_DB(userID, callback) {
    //     return this.connection.query(`SELECT 
    //     F.id, U.userID, U.name, U.surname, U.country, U.ava, U.city FROM users U 
    //     INNER JOIN friends F ON 
    //     CASE
    //         WHEN addressee_user_id=?
    //     THEN
    //         U.userID=sender_user_id
    //     WHEN
    //         sender_user_id = ?
    //     THEN
    //         U.userID=addressee_user_id
    //     END
    //     WHERE (confirm_addressee=1 AND confirm_sender=1)`, userID, (err, users) => {
    //         callback(err, users)
    //     })
    // }

    // //получаем пользователй отправивших мне заявку в друзья
    // get_user_confirm_friends_me_DB(userID, callback) {
    //     return this.connection.query(`SELECT F.id, U.userID, U.name, U.surname, U.country, U.ava, U.city FROM users U INNER JOIN friends F ON U.userID = F.sender_user_id WHERE addressee_user_id=? AND confirm_addressee NOT IN (1)`, userID, (err, users) => {
    //         callback(err, users)
    //     })
    // }

    // //получаем пользователй которым я отправил заявку в друзья
    // get_user_confirm_friends_from_me_DB(userID, callback) {
    //     return this.connection.query(`SELECT F.id, U.userID, U.name, U.surname, U.country, U.ava, U.city FROM users U INNER JOIN friends F ON U.userID = F.addressee_user_id WHERE sender_user_id=? AND confirm_addressee NOT IN (1)`, userID, (err, users) => {
    //         callback(err, users)
    //     })
    // }

    // // отправляем заявку в друзья
    // add_friend_DB(users, callback) {
    //     return this.connection.query(
    //         'INSERT INTO friends (sender_user_id, addressee_user_id) VALUES (?,?)', users, (err) => {
    //             callback(err);
    //         })
    // }

    // //отменяем запрос в друзья
    // cancel_add_friend_DB(confirmID, callback) {
    //     return this.connection.execute(`DELETE from friends WHERE id = ?`, confirmID, (err) => {
    //         callback(err);
    //     });
    // }

    // //согласие на принятие заявки в друзья
    // agree_add_friend_DB(id, callback) {
    //     return this.connection.execute(`UPDATE friends SET confirm_addressee="1" WHERE id = ?`, id, (err) => {
    //         callback(err);
    //     });
    // }

    // //удаление пользователя из друзей
    // delete_friend_DB(body, callback) {
    //     return this.connection.execute(`DELETE from friends WHERE id=?`, body, (err) => {
    //         callback(err)
    //     })
    // }


}
module.exports = CommentsPostDB;