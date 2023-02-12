// const mysql = require('mysql2');
// const config = require('./config')

// class Post_userDB {
//     constructor() {
//         this.connection = mysql.createConnection(config); // подключаем базу данных
//         this.createTablePostUser();
//     }

//     //создаем таблицу БД с постами
//     createTablePostUser() {
//         const sql = `CREATE TABLE IF NOT EXISTS post_user (
//             id integer PRIMARY KEY AUTO_INCREMENT, 
//             post_id integer, 
//             FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE, 
//             authorPost integer, 
//             FOREIGN KEY (authorPost) REFERENCES users (userID) ON DELETE CASCADE)`;
//         this.connection.execute(sql);
//     }

// загрузка постов из базы данны
// load_posts_DB(params, callback) {
//     return this.connection.execute(`SELECT * FROM posts WHERE userID = ? ORDER BY id DESC LIMIT ?, ?`, params, (err, row) => {
//         callback(err, row)
//     });
// }

// //добавление поста в базу данных
// add_post_DB(body, callback) {
//     return this.connection.execute(`INSERT INTO posts(name, surname, date, postText, userID) VALUES (?,?,?,?,?)`, body, (err, row) => {
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

// }
// module.exports = Post_userDB;