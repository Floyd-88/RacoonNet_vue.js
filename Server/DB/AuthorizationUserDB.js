const mysql = require("mysql2");
const config = require("./config");

class AuthorizationUserDB {
    constructor() {
        this.connection = mysql.createConnection(config); // подключаем базу данных
        this.createTableUsers();
    }

    // создаем таблицу с зарегистрированными пользователями
    createTableUsers() {
        const sql = `CREATE TABLE IF NOT EXISTS users (userID integer PRIMARY KEY AUTO_INCREMENT, ava varchar(100) DEFAULT 'ava_1.jpg', name varchar(50) NOT NULL, surname varchar(50) NOT NULL, email varchar(50) UNIQUE, user_pass text NOT NULL, year_user integer NOT NULL, month_user integer NOT NULL, day_user integer NOT NULL, selectedGender varchar(20) NOT NULL, country varchar(50), city varchar(50),  is_admin integer, delete_user integer default 0, pass_token varchar(250) NULL)`;
        this.connection.execute(sql);
    }

    // возвращаем пользователя при попытке входа по его почте
    selectByEmail(email, callback) {
        this.connection.execute(
            `SELECT userID, name, surname, ava, user_pass, is_admin FROM users WHERE email = ?`, [email],
            function(err, row) {
                callback(err, row[0]);
            })
    }

    // добавляем пользователя в базу данных с пометкой админ
    insertAdmin(user, callback) {
        return this.connection.execute(
            'INSERT INTO users (name,surname,email,user_pass,year_user,month_user,day_user,selectedGender,country,city,is_admin) VALUES (?,?,?,?,?,?,?,?,?,?,?)', user, (err) => {
                callback(err);
            })
    }

    //возвращаем список всех зарегестрированных пользователей
    selectAll(callback) {
        return this.connection.execute(`SELECT * FROM users`, function(err, rows) {
            callback(err, rows);
        })
    }

    //возвращаем информацию по пользователю
    loadUser(id, callback) {
        return this.connection.execute(
            `SELECT userID,ava,email, name,surname,year_user,month_user,day_user,selectedGender,country,city,delete_user FROM users WHERE userID = ?`, [id],
            function(err, row) {
                callback(err, row[0]);
            })
    }

    //возвращаем электронную почту пользователя
    loadUserEmail(id, callback) {
        return this.connection.execute(
            `SELECT email FROM users WHERE userID = ?`, [id],
            function(err, user) {
                callback(err, user[0]);
            })
    }

    //возвращаем данные пользователя при обращении его в поддержку
    loadUserInfo(id, callback) {
        return this.connection.execute(
            `SELECT email, name, surname FROM users WHERE userID = ?`, id,
            function(err, user) {
                callback(err, user[0]);
            })
    }

    //проверка на существование почты в базе данны
    check_double_email(email, callback) {
        return this.connection.execute(
            `SELECT email FROM users WHERE email = ?`, [email],
            function(err, email) {
                callback(err, email);
            })
    }

    // добавляем пользователя в базу данных без метки админ
    insert(user, callback) {
        return this.connection.execute(
            'INSERT INTO users (name,surname,email,user_pass,year_user,month_user,day_user,selectedGender,country,city) VALUES (?,?,?,?,?,?,?,?,?,?)', user, (err) => {
                callback(err);
            })
    }

    //редактирование информации о пользователе
    updateUser(user, callback) {
        return this.connection.execute(`UPDATE users SET name=?, surname=?, email=COALESCE(NULLIF(?, ''),email), year_user=?, month_user=?, day_user=?, selectedGender=?, country=?, city=? WHERE userID =?`, user, (err) => {
            callback(err);
        });
    }

    //добавляем токен для восстановления пароля пользователя
    add_token_pass_user(body, callback) {
        return this.connection.execute(`UPDATE users SET pass_token=? WHERE email =?`, body, (err) => {
            callback(err);
        });
    }

    //проверяем токен перед изменением пароля
    get_user_token(token, callback) {
        return this.connection.execute(
            `SELECT userID, pass_token FROM users WHERE email = ?`, [token],
            function(err, user) {
                callback(err, user[0]);
            })
    }

    //получение пароля для сверки
    getPassword(id, callback) {
        this.connection.execute(
            `SELECT user_pass FROM users WHERE userID = ?`, [id],
            function(err, row) {
                callback(err, row[0]);
            })
    }

    //обновление пароля
    updateUserPassword(body, callback) {
        return this.connection.execute(`UPDATE users SET user_pass=?, pass_token=NULL WHERE userID = ?`, body, (err) => {
            callback(err);
        });
    }

    //отправка пароля пользователю по запросу
    get_password_email(email, callback) {
        this.connection.execute(
            `SELECT user_pass FROM users WHERE email = ?`, [email],
            function(err, row) {
                callback(err, row[0]);
            })
    }

    //удаление пользователя
    deleteUserDB(user, callback) {
        return this.connection.execute(`UPDATE users SET name='УДАЛЕН', surname='', email=NULL, year_user=0, month_user=0, day_user=0, selectedGender='', country='', city='', delete_user=1 WHERE userID =?`, user, (err) => {
            callback(err);
        });
    }

    // меняем аватарку пользователя
    updateAva(ava, callback) {
        return this.connection.execute(`UPDATE users SET ava=? WHERE userID =?`, ava, (err) => {
            callback(err);
        });
    }
}
module.exports = AuthorizationUserDB;