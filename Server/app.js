const express = require('express');
const tokenKey = require('./tokenKey');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const AuthorizationUserDB = require('./AuthorizationUserDB');
const PostsDB = require('./PostsDB');

const authorization = new AuthorizationUserDB();
const posts = new PostsDB();

const app = express();

const router = express.Router();
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// CORS middleware
const allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Headers', '*');
    next();
}
app.use(allowCrossDomain);

//регистрируем обычного пользователя
router.post('/register', function(req, res) {
    authorization.insert([
            req.body.name,
            req.body.email,
            bcrypt.hashSync(req.body.password, 8)
        ],(err) => {
            if (err) return res.status(500).send("There was a problem registering the user.");

            authorization.selectByEmail(req.body.email, (err,user) => {
                if (err) return res.status(500).send("There was a problem getting user");

                let token = jwt.sign(
                    {id: user.id},
                    tokenKey.secret,
                    {expiresIn: 86400} // expires in 24 hours
                );
                res.status(200).send({auth: true, token: token, user: user});
            });
        });
});

//регистрируем пользователя с правми администротора
router.post('/register-admin', function(req, res) {
    authorization.insertAdmin([
            req.body.name,
            req.body.email,
            bcrypt.hashSync(req.body.password, 8),
            req.body.is_admin,
        ],(err) => {
            if (err) return res.status(500).send("There was a problem registering the user.")

            authorization.selectByEmail(req.body.email, (err,user) => {
                if (err) return res.status(500).send("There was a problem getting user")

                let token = jwt.sign(
                    {id: user.id},
                    tokenKey.secret,
                    {expiresIn: 86400}, // expires in 24 hours
                );
                res.status(200).send({ auth: true, token: token, user: user });
            });
        });
});

//авторизуем пользователя при вводе логина и пароля
router.post('/login', function (req, res) {
    authorization.selectByEmail(req.body.email, (err, user) => {
        if (err) return res.status(500).send('Error on the server.');
        if (!user) return res.status(404).send('No user found.');

        let passwordIsValid = bcrypt.compareSync(req.body.password, user.user_pass);
        if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });

        let token = jwt.sign(
            {id: user.id},
            tokenKey.secret,
            {expiresIn: 86400}, // expires in 24 hours
        );
        res.status(200).send({auth: true, token: token, user: user});
    });
})

//подгружаем посты пользователя при посещении 'Моей страницы'
router.get('/dataBase.js', function(req, res) {
        posts.load_posts_DB([
            req.query._count,
            req.query._limit
        ],(err, allPosts) => {
            if (err) return res.status(500).send('Error on the server.');
            if (!allPosts) return res.status(404).send('No posts found.');
            res.json(allPosts);
            res.status(200);
        });
});

//добавляем новый пост
router.post('/dataBase.js',  function(req, res) {
        posts.add_post_DB([
            req.body.ava,
            req.body.name,
            req.body.surname,
            req.body.date,
            req.body.body,
            req.body.flag,
            req.body.nameBtnEdit,
        ], (err) => {
        if (err) return res.status(500).send('Error on the server.');
            res.status(200);
    });
});

//редактируем пост
router.put('/dataBase.js', function(req, res) {
        posts.edit_post_DB([
            req.body.body,
            req.body.id
        ],(err) => {
            if (err) return res.status(500).send('Error on the server.');
            res.status(200);
        });
});

//удаляем пост
router.delete('/dataBase.js', function(req, res) {
        posts.remove_post_DB(req.query.id, (err) => {
            if (err) return res.status(500).send('Error on the server.');
            res.status(200);
        });
});

app.use(router)

let port = process.env.PORT || 8000;
app.listen(port, function() {
    console.log('Express server listening on port ' + port)
});