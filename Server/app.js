const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const {
    validationResult
} = require('express-validator');

//подключаем серкретный ключ для токена
const tokenKey = require('./tokenKey');

//подключаем экземпляры классов
const AuthorizationUserDB = require('./AuthorizationUserDB');
const PostsDB = require('./PostsDB');

//создаем объекты на основе экземпляров классов
const authorization = new AuthorizationUserDB();
const posts = new PostsDB();

//подключаем массивы с валидацией
const loginValidate = require('./validate/loginValidate')
const registerValidate = require('./validate/registerValidate')
const postValidate = require('./validate/postValidate')
const updateUserValidate = require('./validate/updateUserValidate')
const passwordValidate = require('./validate/passwordValidate')
const passwordDelValidate = require('./validate/passwordDelValidate')



const app = express();

const router = express.Router();
router.use(bodyParser.urlencoded({
    extended: false
}));
router.use(bodyParser.json());

// CORS middleware
const allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Headers', '*');
    next();
}
app.use(allowCrossDomain);

// регистрируем обычного пользователя
router.post('/register', registerValidate, function(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    if (!req.body.name || !req.body.surname || !req.body.email || !req.body.password || !req.body.year || !req.body.month || !req.body.day || !req.body.selectedGender || !req.body.country || !req.body.city) return res.status(500).send("При регистрации пользователя возникли проблемы(заполните все требуемые поля).");

    authorization.insert([
        req.body.name,
        req.body.surname,
        req.body.email,
        bcrypt.hashSync(req.body.password, 8),
        req.body.year,
        req.body.month,
        req.body.day,
        req.body.selectedGender,
        req.body.country,
        req.body.city
    ], (err) => {
        if (err !== null) {
            if (err.errno == 1062) return res.status(500).send("Пользователь с такой почтой уже зарегистрирован");
        }

        if (err) return res.status(500).send("При регистрации пользователя возникли проблемы." + " " + err);

        authorization.selectByEmail(req.body.email, (err, user) => {
            if (err) return res.status(500).send("Ошибка на сервере." + " " + err);

            let token = jwt.sign( //???????????????????????????????????????????????????
                {
                    id: user.id
                }, //????????????????????????????????????????????
                tokenKey.secret, //??????????????????????????????????????????????????????
                {
                    expiresIn: 86400
                } // expires in 24 hours  //???????????????????????????????/
            );
            res.status(200).send({
                auth: true,
                token: token,
                user: user
            });
        });
    });
});

//регистрируем пользователя с правми администротора
router.post('/register-admin', registerValidate, function(req, res) {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    if (!req.body.name || !req.body.surname || !req.body.email || !req.body.password || !req.body.year || !req.body.month || !req.body.day || !req.body.selectedGender || !req.body.country || !req.body.city) return res.status(500).send("При регистрации пользователя возникли проблемы(заполните все требуемые поля).");

    authorization.insertAdmin([
        req.body.name,
        req.body.surname,
        req.body.email,
        bcrypt.hashSync(req.body.password, 8),
        req.body.year,
        req.body.month,
        req.body.day,
        req.body.selectedGender,
        req.body.country,
        req.body.city,
        req.body.is_admin
    ], (err) => {
        if (err !== null) {
            if (err.errno == 1062) return res.status(500).send("Пользователь с такой почтой уже зарегистрирован");
        }
        if (err) return res.status(500).send("При регистрации пользователя возникли проблемы.")

        authorization.selectByEmail(req.body.email, (err, user) => {
            if (err) return res.status(500).send("Ошибка на сервере.")

            let token = jwt.sign({
                    id: user.id
                },
                tokenKey.secret, {
                    expiresIn: 86400
                }, // expires in 24 hours
            );
            res.status(200).send({
                auth: true,
                token: token,
                user: user
            });
        });
    });
});

//авторизуем пользователя при вводе логина и пароля
router.post('/login', loginValidate, function(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors)
        return res.status(422).json({
            errors: errors.array()
        });
    }
    authorization.selectByEmail(req.body.email, (err, user) => {
        if (err) return res.status(500).send('Ошибка на сервере.');
        if (!user) return res.status(404).send({
            err: 'Такого пользователя не существует'
        });

        let passwordIsValid = bcrypt.compareSync(req.body.password, user.user_pass); //???????????????????????????????
        if (!passwordIsValid) return res.status(401).send({
            auth: false,
            token: null,
            err: 'Пароль не действителен'
        });

        let token = jwt.sign({
                id: user.id
            },
            tokenKey.secret, {
                expiresIn: 86400
            }, // expires in 24 hours
        );
        res.status(200).send({
            auth: true,
            token: token,
            user: user
        });
    });
})

//редактирование профиля пользователя
router.put('/editProfile', updateUserValidate, function(req, res) {

    //валидация заполнения полей
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }
    //обновление информации о пользователе
    authorization.updateUser([
        req.body.name,
        req.body.surname,
        req.body.email,
        req.body.year,
        req.body.month,
        req.body.day,
        req.body.selectedGender,
        req.body.country,
        req.body.city,
        req.body.id
    ], (err) => {

        //проверка по email о дублировании пользователя
        if (err !== null) {
            if (err.errno == 1062) return res.status(500).send("Пользователь с такой почтой уже зарегистрирован");
        }
        if (err) return res.status(500).send("При изменении данных пользователя возникли проблемы");

        //обновление имени и фамилии пользователя в постах при редактировании профиля
        posts.updateTitlePosts([req.body.name, req.body.surname, req.body.id], (err) => {
            if (err) return res.status(500).send("Ошибка при обновдении title в постах.");

            //получение данных о пользователе после обновления
            authorization.selectByEmail(req.body.email, (err, user) => {
                if (err) return res.status(500).send("Ошибка на сервере.");
                res.status(200).send({
                    auth: true,
                    user: user
                });
            })
        });
    });
})

//изменение старого пароля
router.put('/password', passwordValidate, function(req, res) {

    //валидация полей
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors)
        return res.status(422).json({
            errors: errors.array()
        });
    }

    //проверка старого пароля
    if (!req.body.old_password) return res.status(500).send("Поле со старым паролем не заполнено");

    authorization.selectByEmail(req.body.email, (err, user) => {
        if (err) return res.status(500).send("Ошибка на сервере");

        let passwordIsValid = bcrypt.compareSync(req.body.old_password, user.user_pass);
        if (!passwordIsValid) return res.status(401).send({
            err: 'Пароль не действителен'
        });

        if (!req.body.new_password) return res.status(500).send("Поле с новым паролем не заполнено");

        //обновление старого пароля
        authorization.updateUserPassword([
                bcrypt.hashSync(req.body.new_password, 8),
                req.body.userID
            ],
            (err) => {
                if (err) return res.status(500).send("При изменении пароля возникли проблемы");

                res.status(200).send("Пароль успешно обновлен");
            })

    })
})

//удаление профиля пользователя
router.delete('/delete_user', passwordDelValidate, function(req, res) {

    //валидация полей
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    if (!req.body.password) return res.status(500).send("Поле с паролем не заполнено");

    authorization.selectByEmail(req.body.email, (err, user) => {
        if (err) return res.status(500).send("Ошибка на сервере");

        let passwordIsValid = bcrypt.compareSync(req.body.password, user.user_pass);
        if (!passwordIsValid) return res.status(401).send({
            err: 'Пароль не действителен'
        });

        authorization.deleteUserDB([req.body.userID], (err) => {
            if (err) return res.status(500).send("При удалении пользователя возникли проблемы");
            res.status(200).send("Пользователь успешно удален");
        })

    })
})

//подгружаем посты пользователя при посещении 'Моей страницы'
router.get('/dataBase.js', function(req, res) {
    posts.load_posts_DB([
        req.query.userID,
        req.query._count,
        req.query._limit
    ], (err, allPosts) => {
        if (err) return res.status(500).send('Error on the server.');
        if (!allPosts) return res.status(404).send('No posts found.');
        res.json(allPosts);
        res.status(200);
    });
});

//добавляем новый пост
router.post('/dataBase.js', postValidate, function(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }
    posts.add_post_DB([
        req.body.ava,
        req.body.name,
        req.body.surname,
        req.body.date,
        req.body.postText,
        req.body.flag,
        req.body.nameBtnEdit,
        req.body.userID
    ], (err, post) => {
        if (err) return res.status(500).send('Error on the server.');
        res.json(post);
        res.status(200);
    });
});

//редактируем пост
router.put('/dataBase.js', postValidate, function(req, res) {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }
    posts.edit_post_DB([
        req.body.postText,
        req.body.date,
        req.body.id
    ], (err) => {
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