const mysql = require("mysql2");
const config = require("./config");

class AuthorizationUserDB {
    constructor() {
        this.connection = mysql.createConnection(config); // подключаем базу данных
        this.createTableUsers();
    }

    // создаем таблицу с зарегистрированными пользователями
   createTableUsers() {
       const sql = `CREATE TABLE IF NOT EXISTS user (id integer PRIMARY KEY AUTO_INCREMENT, name text, email varchar(50) UNIQUE, user_pass text, is_admin integer)`;
       this.connection.execute(sql);
    }

    // возвращаем пользователя при попытке входа по его почте
    selectByEmail(email, callback) {
       this.connection.execute(
            `SELECT * FROM user WHERE email = ?`, [email],function(err,row){
                callback(err,row[0]);
            })
    }

    // добавляем пользователя в базу данных с пометкой админ
    insertAdmin(user, callback) {
        return this.connection.execute(
            'INSERT INTO user (name,email,user_pass,is_admin) VALUES (?,?,?,?)', user, (err) => {
                callback(err);
            })
    }

    //возвращаем список всех зарегестрированных пользователей
    selectAll(callback) {
        return this.connection.execute(`SELECT * FROM user`, function(err,rows){
            callback(err,rows);
        })
    }
    // добавляем пользователя в базу данных без метки админ
    insert(user, callback) {
        return this.connection.execute(
            'INSERT INTO user (name,email,user_pass) VALUES (?,?,?)', user, (err) => {
                callback(err);
            })
    }
}
module.exports = AuthorizationUserDB;
