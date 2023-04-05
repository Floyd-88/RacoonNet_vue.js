const mysql = require('mysql2');
const config = require('./config');

class FeedBackDB {
    constructor() {
        this.connection = mysql.createConnection(config); // подключаем базу данных
        this.createTableFeedBack();
    }

    //создаем таблицу БД с обращениями пользователей
    createTableFeedBack() {
        const sql = `CREATE TABLE IF NOT EXISTS feed_back (id integer PRIMARY KEY AUTO_INCREMENT, userID integer NOT NULL, name varchar(50) NOT NULL, surname varchar(50) NOT NULL, email varchar(50), select_cause varchar(50) NOT NULL, title varchar(50) NOT NULL, description text(600) NOT NULL)`;
        this.connection.execute(sql);
    }

    //добавляем новую заявку от пользователя
    add_new_problem(body, callback) {
        return this.connection.execute(`INSERT INTO feed_back (userID,name,surname,email,select_cause,title,description) VALUES (?,?,?,?,?,?,?)`, body, (err, row) => {
            callback(err, row);
        });
    }
}

module.exports = FeedBackDB;