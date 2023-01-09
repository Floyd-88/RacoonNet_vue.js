// const http = require('http');
// const fs = require("fs");
// const path = require('path');
const mysql = require('mysql2/promise');
const config = require('./config')
const express = require("express");
const cors = require('cors')
const app = express();

app.use(cors())

async function add_posts_DB() {
    const connection = await mysql.createConnection(config);
    const [arr] = await connection.execute("SELECT * FROM posts");
    connection.end();
    return arr;
}

app.get('/dataBase.js', async function(req, res) {
    console.log('hhhh')
    let a = await add_posts_DB();
    res.json(a)
    // res.status(200)
});

app.listen(8000, function() {
    console.log('Ok')
});



