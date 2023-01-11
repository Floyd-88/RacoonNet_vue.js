// const http = require('http');
// const fs = require("fs");
// const path = require('path');
const mysql = require('mysql2/promise');
const config = require('./config')
const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express();



// загрузка постов из базы данны
async function load_posts_DB(params) {
    const connection = await mysql.createConnection(config);
    const [arr] = await connection.execute(`SELECT * FROM posts ORDER BY id DESC LIMIT ${params._count}, ${params._limit}`);
    connection.end();
    return arr;
}

//добавление поста в базу данных
async function add_post_DB(body) {
    const connection = await mysql.createConnection(config);
    await connection.execute(`INSERT INTO posts(ava, name, surname, date, body, flag, nameBtnEdit) VALUES ('${body.ava}', '${body.name}', '${body.surname}', '${body.date}', '${body.body}', '${body.flag}', '${body.nameBtnEdit}' )`);
    connection.end();
}

// редактирование поста
async function edit_post_DB(body) {
    const connection = await mysql.createConnection(config);
    await connection.execute(`UPDATE posts SET body='${body.body}' WHERE id = ${body.id}`);
    connection.end();
}

// удаление поста
async function remove_post_DB(id) {
    const connection = await mysql.createConnection(config);
    await connection.execute(`DELETE from posts WHERE id = ${id}`);
    connection.end();
}

app.use(cors())
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());


app.get('/dataBase.js', async function(req, res) {
    console.log(req.query)
    let a = await load_posts_DB(req.query);
    res.json(a);
});
app.post('/dataBase.js', async function(req, res) {
    await add_post_DB(req.body);
    res.send(req.body)
});
app.put('/dataBase.js', async function(req, res) {
    await edit_post_DB(req.body);
    res.send(req.body)
});
app.delete('/dataBase.js', async function(req, res) {
    await remove_post_DB(req.query.id);
    res.send(req.body)
});


app.listen(8000, function() {
    console.log('Ok');
});



