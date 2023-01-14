const mysql = require('mysql2');
const config = require('./config')

class PostsDB {
    constructor() {
        this.connection = mysql.createConnection(config); // подключаем базу данных
        this.createTablePosts();
    }

    //создаем таблицу БД с постами
    createTablePosts() {
        const sql = `CREATE TABLE IF NOT EXISTS posts (id integer PRIMARY KEY AUTO_INCREMENT, ava varchar(100),  name varchar(30), surname varchar(30), date varchar(50), body text, flag integer, nameBtnEdit varchar(30))`;
        this.connection.execute(sql);
    }

    // загрузка постов из базы данны
    load_posts_DB(params, callback) {
      return this.connection.execute(`SELECT * FROM posts ORDER BY id DESC LIMIT ?, ?`,params, (err, row) => {
            callback(err, row)
        });
    }

//добавление поста в базу данных
    add_post_DB(body, callback) {
      return   this.connection.execute(`INSERT INTO posts(ava, name, surname, date, body, flag, nameBtnEdit) VALUES (?,?,?,?,?,?,?)`, body, (err) => {
          callback(err);
      });
    }

// редактирование поста
    edit_post_DB(body, callback) {
       return this.connection.execute(`UPDATE posts SET body=? WHERE id =?`, body, (err) => {
           callback(err);
       });
    }

// удаление поста
    remove_post_DB(id, callback) {
       return this.connection.execute(`DELETE from posts WHERE id = ?`, [id], (err) => {
           callback(err);
       });
    }
}
module.exports = PostsDB;


