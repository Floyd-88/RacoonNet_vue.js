const mysql = require('mysql2');
const config = require('./config')

class PostsDB {
    constructor() {
        this.connection = mysql.createConnection(config); // подключаем базу данных
        this.createTablePosts();
    }

    //создаем таблицу БД с постами
    createTablePosts() {
        const sql = `CREATE TABLE IF NOT EXISTS posts (
            id integer PRIMARY KEY AUTO_INCREMENT,
            date varchar(50), 
            postText text, 
            page_userID integer,
            authorPost integer,
            FOREIGN KEY (authorPost) REFERENCES users (userID) ON DELETE CASCADE)`;
        this.connection.execute(sql);
    }

    // загрузка постов из базы данны
    load_posts_DB(params, callback) {
        return this.connection.execute(`SELECT 
        posts.id, 
        users.ava, 
        posts.date, 
        posts.postText, 
        users.name, 
        users.surname FROM posts 
        INNER JOIN users ON posts.authorPost = users.userID 
        WHERE page_userID = ? ORDER BY posts.id DESC LIMIT ?, ?`, params, (err, row) => {
            callback(err, row)
        });
    }

    //добавление поста в базу данных
    add_post_DB(body, callback) {
        return this.connection.execute(`INSERT INTO posts (date, postText, page_userID, authorPost) VALUES (?,?,?,?)`, body, (err, row) => {
            callback(err, row);
        });
    }

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
module.exports = PostsDB;