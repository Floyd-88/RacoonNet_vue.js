// const http = require('http');
// const fs = require("fs");
// const path = require('path');
const mysql = require('mysql2/promise');
const config = require('./config')
const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express();




async function load_posts_DB() {
    const connection = await mysql.createConnection(config);
    const [arr] = await connection.execute("SELECT * FROM posts ORDER BY id DESC ");
    connection.end();
    return arr;
}

async function add_post_DB(body) {
    const connection = await mysql.createConnection(config);
    await connection.execute(`INSERT INTO posts(ava, name, surname, date, body, flag, nameBtnEdit) VALUES ('${body.ava}', '${body.name}', '${body.surname}', '${body.date}', '${body.body}', '${body.flag}', '${body.nameBtnEdit}' )`);
    connection.end();
}

app.use(cors())
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
// app.use(bodyParser.json())

app.get('/dataBase.js', async function(req, res) {
    let a = await load_posts_DB();
    res.json(a);
});
app.post('/dataBase.js', async function(req, res) {
    await add_post_DB(req.body);
    res.send(req.body)
});

app.listen(8000, function() {
    console.log('Ok');
});



