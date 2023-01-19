const mysql = require("mysql2");
const config = require("./config");

class AuthorizationUserDB {
    constructor() {
        this.connection = mysql.createConnection(config); // подключаем базу данных
        this.createTableUsers();
    }

    // создаем таблицу с зарегистрированными пользователями
   createTableUsers() {
       const sql = `CREATE TABLE IF NOT EXISTS users (userID integer PRIMARY KEY AUTO_INCREMENT, name varchar(50) NOT NULL, surname varchar(50) NOT NULL, email varchar(50) UNIQUE NOT NULL, user_pass text NOT NULL, birthday datetime NOT NULL, selectedGender varchar(20) NOT NULL, country varchar(50), city varchar(50),  is_admin integer)`;
       this.connection.execute(sql);
    }

    // возвращаем пользователя при попытке входа по его почте
    selectByEmail(email, callback) {
       this.connection.execute(
            `SELECT * FROM users WHERE email = ?`, [email],function(err,row){
                callback(err,row[0]);
            })
    }

    // добавляем пользователя в базу данных с пометкой админ
    insertAdmin(user, callback) {
        return this.connection.execute(
            'INSERT INTO users (name,surname,email,user_pass,birthday,selectedGender,country,city,is_admin) VALUES (?,?,?,?,?,?,?,?,?)', user, (err) => {
                callback(err);
            })
    }

    //возвращаем список всех зарегестрированных пользователей
    selectAll(callback) {
        return this.connection.execute(`SELECT * FROM users`, function(err,rows){
            callback(err,rows);
        })
    }
    // добавляем пользователя в базу данных без метки админ
    insert(user, callback) {
        return this.connection.execute(
            'INSERT INTO users (name,surname,email,user_pass,birthday,selectedGender,country,city) VALUES (?,?,?,?,?,?,?,?)', user, (err) => {
                callback(err);
            })
    }
}
module.exports = AuthorizationUserDB;
