const mysql = require('mysql2');
const config = require('./config')

class MessagesDB {
    constructor() {
        this.connection = mysql.createConnection(config); // подключаем базу данных
        this.createTableMessages();
    }

    //создаем таблицу БД с сообщениями
    createTableMessages() {
        const sql = `CREATE TABLE IF NOT EXISTS messages (
            id integer PRIMARY KEY AUTO_INCREMENT,
            date timestamp not null DEFAULT CURRENT_TIMESTAMP, 
            messageText text not null, 
            page_userID integer not null,
            authorMessage integer not null,
            FOREIGN KEY (authorMessage) REFERENCES users (userID) ON DELETE CASCADE)`;
        return this.connection.execute(sql);
    }

    // загрузка постов из базы данны
    // load_posts_DB(params, callback) {
    //     return this.connection.execute(`SELECT 
    //     posts.id, 
    //     users.ava, 
    //     posts.date, 
    //     posts.postText, 
    //     users.name, 
    //     users.surname,
    //     posts.authorPost FROM posts 
    //     INNER JOIN users ON posts.authorPost = users.userID 
    //     WHERE page_userID = ? ORDER BY posts.id DESC LIMIT ?, ?`, params, (err, row) => {
    //         callback(err, row)
    //     });
    // }

    // загрузка одного сообщения из базы данных
    load_message_DB(messageID, callback) {
        return this.connection.execute(`SELECT 
            messages.id, 
            users.ava, 
            messages.date, 
            messages.messageText, 
            users.name, 
            users.surname,
            messages.authorMessage FROM messages 
            INNER JOIN users ON messages.authorMessage = users.userID 
            WHERE id = ?`, [messageID], (err, row) => {
            console.log(row)
            callback(err, row[0])
        });
    }

    // //добавление сообщения в базу данных
    add_message_DB(message, callback) {
        return this.connection.execute(`INSERT INTO messages (messageText, page_userID, authorMessage) VALUES (?,?,?)`, message, (err, row) => {
            callback(err, row);
        });
    }

    // // // редактирование поста
    // edit_post_DB(body, callback) {
    //     return this.connection.execute(`UPDATE posts SET postText=?, date=? WHERE id =?`, body, (err) => {
    //         callback(err);
    //     });
    // }

    // // // удаление поста
    // remove_post_DB(postID, callback) {
    //     return this.connection.execute(`DELETE from posts WHERE id = ?`, [postID], (err) => {
    //         callback(err);
    //     });
    // }

}
module.exports = MessagesDB;