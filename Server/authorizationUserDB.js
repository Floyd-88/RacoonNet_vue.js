// "use strict";
const mysql = require("mysql2");
const config = require("./config");

class Db {
    constructor() {
        this.db = mysql.createConnection(config);
        this.createTable();
    }

   createTable() {
       const sql = `CREATE TABLE IF NOT EXISTS user (id integer PRIMARY KEY AUTO_INCREMENT, name text, email varchar(50) UNIQUE, user_pass text, is_admin integer)`;
       this.db.execute(sql);
    }

    selectByEmail(email, callback) {
       this.db.execute(
            `SELECT * FROM user WHERE email = ?`,
            [email],function(err,row){
                callback(err,row[0]);
            })
    }

    insertAdmin(user, callback) {
        return this.db.execute(
            'INSERT INTO user (name,email,user_pass,is_admin) VALUES (?,?,?,?)',
            user, (err) => {
                callback(err);
            })
    }

    selectAll(callback) {
        return this.db.execute(`SELECT * FROM user`, function(err,rows){
            callback(err,rows);
        })
    }

    insert(user, callback) {
        return this.db.execute(
            'INSERT INTO user (name,email,user_pass) VALUES (?,?,?)',
            user, (err) => {
                callback(err);
            })
    }
}
module.exports = Db;
