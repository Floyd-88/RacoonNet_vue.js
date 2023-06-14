const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const fs = require('fs')
const fileUpload = require('express-fileupload');
const sharp = require('sharp');
const {
    validationResult
} = require('express-validator');

//отправка сообщений на почту
const mailer = require('./nodemailer');

const randtoken = require('rand-token');

//используем токен JWT
const jwt = require('jsonwebtoken');
const tokenKey = require('./tokenKey');
const authenticateJWT = require('./authenticateJWT');


//подключаем экземпляры классов
const AuthorizationUserDB = require('./DB/AuthorizationUserDB');
const authorization = new AuthorizationUserDB();

const PostsDB = require('./DB/PostsDB');
const posts = new PostsDB();

const PhotosDB = require('./DB/PhotosDB');
const photos = new PhotosDB();

const MessagesDB = require('./DB/MessagesDB');
const messages = new MessagesDB();

const FriendsDB = require('./DB/FriendsDB');
const friends = new FriendsDB();

const CommentsPostDB = require('./DB/CommentsPostDB');
const commentsPost = new CommentsPostDB();

const CommentsPhotoDB = require('./DB/CommentsPhotoDB');
const commentsPhoto = new CommentsPhotoDB();

const FeedBackDB = require('./DB/FeedBackDB');
const feedBack = new FeedBackDB();

const NoticeDB = require('./DB/NoticeDB');
const notice = new NoticeDB();


//подключаем массивы с валидацией
const loginValidate = require('./validate/loginValidate')
const registerValidate = require('./validate/registerValidate')
const postValidate = require('./validate/postValidate')
const updateUserValidate = require('./validate/updateUserValidate')
const passwordValidate = require('./validate/passwordValidate')
const passwordDelValidate = require('./validate/passwordDelValidate');
const messageValidate = require('./validate/messageValidate');
const feedBackUser = require('./validate/feedBackUser');
const searchNewFriendsValidate = require('./validate/searchNewFriendsValidate');

const {
    resolve
} = require('path');


const app = express();
const http = require('http').createServer(app);

const router = express.Router();
router.use(bodyParser.urlencoded({
    extended: false
}));
router.use(bodyParser.json());


//прослушивание событий
const io = require('socket.io')(http, {
    cors: {
        origins: ['http://localhost:8080']
    }
});


// CORS middleware
const allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Headers', '*');
    next();
}
app.use(allowCrossDomain);


app.use(express.static('public'));
app.use(fileUpload());


app.use(bodyParser.json({
    limit: '200mb'
}));
app.use(bodyParser.urlencoded({
    limit: '200mb',
    extended: true
}));


// РЕГЕСТРИРУЕМ ПРОСТОГО ПОЛЬЗОВАТЕЛЯ
router.post('/register', registerValidate, function(req, res) {
    //валидация полей
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }
    if (!req.body.name || !req.body.surname || !req.body.email || !req.body.password || !req.body.year || !req.body.month || !req.body.day || !req.body.selectedGender || !req.body.country || !req.body.city) {
        return res.status(500).send("При регистрации пользователя возникли проблемы(заполните все требуемые поля)")
    }
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

        //отправляем сообщение с логином и паролем на почту юзера 
        const message = {
            to: req.body.email,
            subject: 'Congratulations! You are successfully registred on our site',
            html: `
                <h2>Поздравляем, Вы успешно зарегистрировались в социальной сети RaccoonNet!</h2>  
                <i>данные вашей учетной записи:</i>
                <ul>
                    <li>login: ${req.body.email}</li>
                    <li>password: ${req.body.password}</li>
                </ul>
                <p>Данное письмо не требует ответа.<p>`
        }
        mailer(message);

        //после регистрации происходит автоматическая авторизация пользователя
        authorization.selectByEmail(req.body.email, (err, user) => {
            if (err) return res.status(500).send("Ошибка на сервере." + " " + err);

            //создаем токен для защиты своих данных
            let token = jwt.sign({
                    name: user.name,
                    id: user.userID,
                },
                tokenKey.secret, {
                    expiresIn: 60 * 60
                },
            );

            const refreshToken = jwt.sign({
                name: user.name,
                id: user.userID,
            }, tokenKey.refreshTokenSecret);

            tokenKey.refreshTokens.push(refreshToken);

            res.status(200).send({
                auth: true,
                token: token,
                refreshToken: refreshToken,
                user: {
                    userID: user.userID,
                    is_admin: user.is_admin
                }
            });
        });
    });
});

//РЕГЕСТРИРУЕМ ПОЛЬЗОВАТЕЛЯ С ПРАВАМИ АДМИНИСТРАТОРА
router.post('/register-admin', registerValidate, function(req, res) {
    //валидация полей
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }
    if (!req.body.name || !req.body.surname || !req.body.email || !req.body.password || !req.body.year || !req.body.month || !req.body.day || !req.body.selectedGender || !req.body.country || !req.body.city || !req.body.is_admin) {
        return res.status(500).send("При регистрации пользователя возникли проблемы(заполните все требуемые поля)")
    };

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
        if (err) return res.status(500).send("При регистрации пользователя возникли проблемы." + " " + err)

        //отправляем сообщение с логином и паролем на почту юзера 
        const message = {
            to: req.body.email,
            subject: 'Congratulations! You are successfully registred on our site',
            html: `
                <h2>Поздравляем, Вы успешно зарегистрировались в социальной сети RaccoonNet!</h2>  
                <i>данные вашей учетной записи:</i>
                <ul>
                    <li>login: ${req.body.email}</li>
                    <li>password: ${req.body.password}</li>
                </ul>
                <p>Данное письмо не требует ответа.<p>`
        }
        mailer(message);

        //после регистрации происходит автоматическая авторизация пользователя
        authorization.selectByEmail(req.body.email, (err, user) => {
            if (err) return res.status(500).send("Ошибка на сервере." + " " + err)

            //создаем токен для защиты своих данных
            let token = jwt.sign({
                    name: user.name,
                    id: user.userID,
                },
                tokenKey.secret, {
                    expiresIn: 60 * 5
                },
            );

            const refreshToken = jwt.sign({
                name: user.name,
                id: user.userID,
            }, tokenKey.refreshTokenSecret);

            tokenKey.refreshTokens.push(refreshToken);

            res.status(200).send({
                auth: true,
                token: token,
                refreshToken: refreshToken,
                user: {
                    userID: user.userID,
                    is_admin: user.is_admin
                }
            });
        });
    });
});

//АВТОРИЗУЕМ ПОЛЬЗОВАТЕЛЯ ПРИ ВВОДЕ ЛОГИНА И ПАРОЛЯ
router.post('/login', loginValidate, function(req, res) {
    //валидация введенных данных
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    //проверка на существование пользователя
    authorization.selectByEmail(req.body.email, (err, user) => {
        if (err) return res.status(500).send('Ошибка на сервере.' + " " + err);
        if (!user) return res.status(404).send({
            err: 'Такого пользователя не существует'
        });

        //проверка пароля
        let passwordIsValid = bcrypt.compareSync(req.body.password, user.user_pass);
        if (!passwordIsValid) return res.status(401).send({
            auth: false,
            token: null,
            refreshToken: null,
            err: 'Вы указали не правильный пароль'
        });

        //создаем токен для защиты своих данных
        let token = jwt.sign({
                name: user.name,
                id: user.userID,
            },
            tokenKey.secret, {
                expiresIn: 60 * 5 //срок действия токена
            },
        );

        const refreshToken = jwt.sign({
            name: user.name,
            id: user.userID,
        }, tokenKey.refreshTokenSecret);

        tokenKey.refreshTokens.push(refreshToken);

        res.status(200).send({
            auth: true,
            token: token,
            refreshToken: refreshToken,
            user: {
                userID: user.userID,
                is_admin: user.is_admin,
            }
        });
    });
})

//УДАЛЕНИЕ РЕФРЭШ-ТОКЕНА ПРИ ПРИ ВЫХОДЕ ИЗ ПРОФИЛЯ
router.post('/del_refresh_token', (req, res) => {
    const refresh = req.body.refreshToken;

    if (!refresh) return res.status(400).send("refresh-token не найден");

    if (tokenKey.refreshTokens.includes(refresh)) {
        tokenKey.refreshTokens = tokenKey.refreshTokens.filter(token => refresh !== token);
        return res.status(200).send("refresh-token удален");
    } else {
        if (!refresh) return res.status(400).send("refresh-token не найден");
    }
});

//ОБНОВЛЕНИЕ ТОКЕНА ПРИ ИСТЕЧЕНИИ СРОКА
router.post('/refresh', (req, res) => {
    const refresh = req.body.refreshToken;

    if (!refresh) return res.status(400).send("refresh-token не найден");

    if (tokenKey.refreshTokens.includes(refresh)) {
        jwt.verify(refresh, tokenKey.refreshTokenSecret, (err, user) => {
            if (err) {
                console.log(err)
                return res.status(400).send("Неверный refresh-token");
            }
            let token = jwt.sign({
                    name: user.name,
                    id: user.id
                },
                tokenKey.secret, {
                    expiresIn: 60 * 60
                },
            );
            res.json({
                token
            });
        });
    } else {
        return res.status(400).send("refresh-token не найден");
    }
});

//ПОДГРУЗКА ДАННЫХ ПОЛЬЗОВАТЕЛЯ ПРИ ПОСЕЩЕНИИ ЕГО СТРАНИЦЫ
router.post('/load_user', authenticateJWT, function(req, res) {
    userID = +req.body.id; //id из строки запроса
    tokenID = req.tokenID; //id из сохраненного токена 

    //если пользователь авторизован
    if (tokenID) {
        //если пользователь заходит на свою страницу - отображать кнопку редактирования профиля, загрузки фото и авы
        let is_editProfile = false
        if (userID === tokenID) {
            is_editProfile = true
        }
        //возвращаем данные о пользователе
        authorization.loadUser(userID, (err, user) => {
            if (err) return res.status(500).send('Ошибка на сервере.' + " " + err);
            if (!user) return res.status(404).send({
                err: 'Такого пользователя не существует'
            });
            res.status(200).send({
                user: {
                    userID: user.userID,
                    ava: user.ava,
                    name: user.name,
                    surname: user.surname,
                    year_user: user.year_user,
                    month_user: user.month_user,
                    day_user: user.day_user,
                    selectedGender: user.selectedGender,
                    country: user.country,
                    city: user.city,
                    is_admin: user.is_admin,
                    is_editProfile: is_editProfile,
                    delete: user.delete_user,
                    enterUser: tokenID //давать возможность редактироват и удалять посты если ты их автор
                }
            });
        });
    } else {
        authorization.loadUser(userID, (err, user) => {
            if (err) return res.status(500).send('Ошибка на сервере.' + " " + err);
            if (!user) return res.status(404).send('Такого пользователя не существует');
            res.status(200).send({
                user: {
                    ava: user.ava,
                    name: user.name,
                    surname: user.surname,
                    country: user.country,
                    city: user.city,
                    delete: user.delete_user,
                }
            });
        });
    }


})

//РЕДАКТИРОВАНИЕ ПРОФИЛЯ ПОЛЬЗОВОТЕЛЯ
router.put('/editProfile', authenticateJWT, updateUserValidate, function(req, res) {

    userID = +req.body.id; //id из строки запроса
    tokenID = req.tokenID; //id из сохраненного токена 

    if (userID === tokenID) {

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
            if (err) return res.status(500).send("При изменении данных пользователя возникли проблемы" + " " + err);

            //отправляем сообщение с логином на новую почту если юзер ее поменял 
            if (req.body.email) {
                const message = {
                    to: req.body.email,
                    subject: 'You have changed your mail',
                    html: `
                        <h2>Вы изменили адрес своей электронной почты!</h2>  
                        <i>данные вашей учетной записи были изменены:</i>
                        <ul>
                            <li>login: ${req.body.email}</li>
                        </ul>
                        <p>Данное письмо не требует ответа.<p>`
                }
                mailer(message);
            }

            //обновление имени и фамилии пользователя в постах при редактировании профиля
            // posts.updateTitlePosts([req.body.name, req.body.surname, req.body.id], (err) => {
            //     if (err) return res.status(500).send("Ошибка при обновдении title в постах.");

            //получение данных о пользователе после обновления
            authorization.loadUser(tokenID, (err, user) => {
                    if (err) return res.status(500).send("Ошибка на сервере." + " " + err);
                    res.status(200).send({
                        user: {
                            userID: user.userID,
                            name: user.name,
                            surname: user.surname,
                            year_user: user.year_user,
                            month_user: user.month_user,
                            day_user: user.day_user,
                            selectedGender: user.selectedGender,
                            country: user.country,
                            city: user.city,
                        }
                    });
                })
                // });
        });
    }
})

//ИЗМЕНЕНИЕ ПАРОЛЯ
router.put('/password', authenticateJWT, passwordValidate, function(req, res) {

    userID = +req.body.id; //id из строки запроса
    tokenID = req.tokenID; //id из сохраненного токена 

    if (userID === tokenID) {
        //валидация полей
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors)
            return res.status(422).json({
                errors: errors.array()
            });
        }
        //проверка старого пароля
        if (!req.body.old_password) return res.status(401).send("Поле со старым паролем не заполнено");

        authorization.getPassword(tokenID, (err, password) => {
            if (err) return res.status(500).send("Ошибка на сервере" + " " + err);
            let passwordIsValid = bcrypt.compareSync(req.body.old_password, password.user_pass);
            if (!passwordIsValid) return res.status(401).send({
                err: 'Пароль не действителен'
            });

            if (!req.body.new_password) return res.status(401).send("Поле с новым паролем не заполнено");

            //обновление старого пароля
            authorization.updateUserPassword([
                    bcrypt.hashSync(req.body.new_password, 8),
                    tokenID
                ],
                (err) => {
                    if (err) return res.status(500).send("При изменении пароля возникли проблемы" + " " + err);

                    //получение почты пользователя
                    authorization.loadUserEmail(tokenID, (err, user) => {
                        if (err) return res.status(500).send('Ошибка на сервере.' + " " + err);

                        // отправляем сообщение на новую почту если юзер поменял пароль 
                        const message = {
                            to: user.email,
                            subject: 'You have changed your password',
                            html: `
                            <h2>Вы изменили пароль своей учетной записи на сайте raccoonnet.ru!</h2>  
                            <i>Если вы этого не делали, обратитесь в службу поддержки</i>
                            <p>Данное письмо не требует ответа.<p>`
                        }
                        mailer(message);

                        res.status(200).send("Пароль успешно обновлен");

                    });
                })
        })
    }
})

//УДАЛЕНИЕ ПРОФИЛЯ ПОЛЬЗОВАТЕЛЯ
router.delete('/delete_user', authenticateJWT, passwordDelValidate, function(req, res) {

    userID = +req.body.id; //id из строки запроса
    tokenID = req.tokenID; //id из сохраненного токена 

    if (userID === tokenID) {
        //валидация полей
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                errors: errors.array()
            });
        }
        if (!req.body.password) return res.status(500).send("Поле с паролем не заполнено");

        //проверка старого пароля
        authorization.getPassword(tokenID, (err, password) => {
            if (err) return res.status(500).send("Ошибка на сервере" + " " + err);

            let passwordIsValid = bcrypt.compareSync(req.body.password, password.user_pass);
            if (!passwordIsValid) return res.status(401).send({
                err: 'Пароль не действителен'
            });

            //удаление всех фотографий пользователя
            req.body.allPhoto.forEach((photo) => {
                    fs.unlink(`../src/assets/photo/${photo.photo_name}`, (err) => {
                        if (err) console.log(err)
                    });
                })
                //удаление аватарки из папки на сервере
            fs.unlink(`../src/assets/photo/${req.body.nameAva}`, (err) => {
                if (err) console.log(err)
            });

            // удаление пользователя из друзей у других пользователей
            friends.delete_user_friends_DB([tokenID, tokenID], (err) => {
                if (err) return res.status(500).send("При удалении пользователя из друзей, произошла ошибка" + " " + err);

                //удаление фотографий пользователя
                photos.remove_all_photos([
                    tokenID
                ], (err) => {
                    if (err) return res.status(500).send('Ошибка на сервере. Фотография не удалилась' + " " + err);

                    //удаление постов пользователя на его странице
                    posts.remove_all_posts_DB(tokenID, (err) => {
                        if (err) return res.status(500).send('Error on the server' + " " + err);
                    })

                    //обновляем флаги удаления сообщений у пользователей
                    messages.update_all_messages_flag_delete([
                        tokenID,
                        tokenID
                    ], (err) => {
                        if (err) return res.status(500).send("Сообщениея в диалоге небыли удалены" + " " + err);

                        //обновляем флаги удаления диалога у пользователя
                        messages.update_all_conversation_flag_delete([
                            tokenID,
                            tokenID,
                        ], (err) => {
                            if (err) return res.status(500).send("Диалог небыл удален" + " " + err);

                            //удаление данных пользователя
                            authorization.deleteUserDB([tokenID], (err) => {
                                if (err) return res.status(500).send("При удалении пользователя возникли проблемы" + " " + err);
                                res.status(200).send("Пользователь успешно удален");
                            })
                        })
                    })
                })
            })

            //удаление пользователя
            // authorization.deleteUserDB([tokenID], (err) => {
            //     if (err) return res.status(500).send("При удалении пользователя возникли проблемы" + " " + err);
            //     res.status(200).send("Пользователь успешно удален");
            // })
        })
    }
})

//ПОДГРУЗКА ПОСТОВ ПОЛЬЗОВАТЕЛЯ ИЗ БАЗЫ ДАННЫХ
router.get('/dataBase.js', authenticateJWT, function(req, res) {
    tokenID = req.tokenID; //id из сохраненного токена 
    posts.load_posts_DB([
        tokenID,
        req.query.userID,
        req.query._count,
        req.query._limit
    ], (err, allPosts) => {
        if (err) return res.status(500).send('Error on the server.' + " " + err);
        if (!allPosts) return res.status(404).send('No posts found.' + " " + err);

        // commentsPost.load_comments_DB([req.query.userID], (err, comments) => {
        //         if (err) return res.status(500).send('Error on the server.' + " " + err);
        //         if (!comments) return res.status(404).send('No comments found.' + " " + err);

        // console.log(comments)

        // })
        res.status(200).json(allPosts);
    });
});

//ПОДГРУЗКА ФОТОГРАФИЙ К ПОСТАМ ПОЛЬЗОВАТЕЛЕЙ
router.get('/post_photos.js', authenticateJWT, function(req, res) {
    tokenID = req.tokenID; //id из сохраненного токена 
    // console.log(req.query)
    posts.load_photos_posts_DB([
        tokenID,
        req.query.postID,
        req.query.userID
    ], (err, photosPost) => {
        if (err) return res.status(500).send('Error on the server.' + " " + err);
        if (!photosPost) return res.status(404).send('No posts found.' + " " + err);

        //массив с названиями фотографий
        let arr = [];
        //путь к папке где лежат фотографии
        let path = "../src/assets/photo/";
        //проверка на наличие фотографии в папке, если фото есть - отправляем ответ клиенту
        photosPost.forEach(element => {
            try {
                //синхронный метод проверки файла ??????????????
                if (fs.existsSync(`${path + element.photo_name}`)) {
                    arr.push(element)
                }
            } catch (err) {
                console.error(err)
            }
        });
        res.status(200).json(arr);
    });
});

//ПОДГРУЗКА ФОТОГРАФИЙ К СООБЩЕНИЯМ ПОЛЬЗОВАТЕЛЕЙ
router.get('/message_photos.js', authenticateJWT, function(req, res) {
    tokenID = req.tokenID; //id из сохраненного токена 
    // console.log(req.query)
    messages.load_photos_messages_DB([
        req.query.messageID,
        // req.query.userID
    ], (err, photosMessage) => {
        if (err) return res.status(500).send('Error on the server.' + " " + err);
        if (!photosMessage) return res.status(404).send('No message found.' + " " + err);

        //массив с названиями фотографий
        let arr = [];
        //путь к папке где лежат фотографии
        let path = "../src/assets/photo/";
        //проверка на наличие фотографии в папке, если фото есть - отправляем ответ клиенту
        photosMessage.forEach(element => {
            try {
                //синхронный метод проверки файла ??????????????
                if (fs.existsSync(`${path + element.photo_name}`)) {
                    arr.push(element)
                }
            } catch (err) {
                console.error(err)
            }
        });
        res.status(200).json(arr);
    });
});

//ДОБАВЛЯЕМ НОВЫЙ ПОСТ
router.post('/dataBase.js', authenticateJWT, postValidate, function(req, res) {

    //валидация поста
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        if (errors.array()[0].msg === 'Пост должен содержать не менее 1 символа' && !req.body.photo) {
            return res.status(422).json({
                errors: errors.array()
            });
        }
    }
    userID = +req.body.id; //id из строки запроса
    tokenID = req.tokenID; //id из сохраненного токена 

    let photo = "";
    if (req.body.photo) {
        photo = req.body.photo;
    } else {
        photo = false;
    }

    posts.add_post_DB([
        req.body.date,
        req.body.postText,
        userID,
        tokenID,
        photo
    ], (err, post) => {
        if (err) return res.status(500).send('Error on the server' + " " + err);

        const postID = post.insertId
            //возвращаем обновленный пост с информацие по автору поста
        posts.load_one_post_DB(postID, (err, post) => {
            if (err) return res.status(500).send("Ошибка на сервере." + " " + err);

            //уведомление о новом посте
            if (tokenID !== userID) {
                notice.add_notice_DB([userID, post.authorPost, null, "написал что то на Вашей стене", post.id, 0, 0, 0, 0, 0, post.date], (err) => {
                    if (err) return res.status(500).send('При добавлении уведомления о новом посте произошла ошибка' + " " + err);
                })
            }
            res.status(200).send(post);
        });
    });
});

//РЕДАКТИРУЕМ ПОСТ
router.put('/dataBase.js', authenticateJWT, postValidate, function(req, res) {

    tokenID = req.tokenID; //id из сохраненного токена 

    //редактировать пос может только его автор
    if (tokenID === req.body.authorPost) {

        //валидация поста
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                errors: errors.array()
            });
        }
        posts.edit_post_DB([
            req.body.postText,
            req.body.date,
            req.body.postID
        ], (err) => {
            if (err) return res.status(500).send('Error on the server' + ' ' + err);
            res.status(200);
        });
    }
});

//УДАЛЯЕМ ПОСТ
router.delete('/dataBase_delete', authenticateJWT, function(req, res) {

    tokenID = req.tokenID; //id из сохраненного токена 

    //удалять посты может только автор поста или хозяин страницы
    if (tokenID === req.body.authorPost || tokenID === req.body.pageID) {

        posts.remove_post_likes_DB(req.body.postID, (err) => {
            if (err) return res.status(500).send('При удалении лайков поста возникли проблемы' + " " + err);

            posts.remove_post_DB(req.body.postID, (err) => {
                if (err) return res.status(500).send('Error on the server' + " " + err);

                //удаление фото из БД в случае если пост с фото создан другим пользователем  
                if (req.body.authorPost !== req.body.pageID && req.body.photos === "1") {

                    posts.post_photos_DB(req.body.postID, (err, photosArray) => {
                        if (err) return res.status(500).send('При получении фотографий из поста произошла ошибка' + " " + err);

                        photosArray.forEach(photo => {

                            photos.remove_photo_likes([photo.id], (err) => {
                                // if (err) return res.status(500).send('Ошибка на сервере при удалении лайков' + " " + err);
                                if (err) console.log(err)

                                photos.remove_photo([photo.id], (err) => {
                                    // if (err) return res.status(500).send('Ошибка на сервере. Фотография не удалилась' + " " + err);
                                    if (err) console.log(err)

                                    //удаляем уведомление о лайке фото и комментарие
                                    notice.delete_notice_photo_DB([photo.id], (err) => {
                                        // if (err) return res.status(500).send('При удалении уведомления о лайке и комментарие произошла ошибка' + " " + err);
                                        if (err) console.log(err)

                                        //удаляем фото из папки на сервере
                                        fs.unlink(`../src/assets/photo/${photo.photo_name}`, (err) => {
                                            // if (err) return res.status(500).send('Фотография не найдена, возможно она уже удалена ранее' + " " + err);
                                            if (err) console.log(err)
                                        });
                                    })
                                })
                            })
                        })

                    })
                }
                //удаление уведомления о новом посте
                notice.delete_notice_post_DB([req.body.postID], (err) => {

                    if (err) return res.status(500).send('При удалении уведомления о лайке произошла ошибка' + " " + err);
                })
                res.status(200).send("пост удален");
            });

        })
    }
});

//ЛАЙКАЕМ ПОСТ
router.post('/likes_post', authenticateJWT, function(req, res) {
    tokenID = req.tokenID; //id из сохраненного токена 

    //проверяем лайкал ли ранее уже юзер данный пост
    posts.not_double_likes_post_author([req.body.postID, tokenID], (err, row) => {
        if (err) return res.status(500).send("При проверке на повторный лайк произошла ошибка" + " " + err);
        if (row.length > 0) {
            //удаляем автора лайка из таблицы если ранее атор лайкал пост
            posts.remove_author_like_post([row[0].id], (err) => {
                if (err) return res.status(500).send("При исключении автора лайка из таблицы произошла ошибка" + " " + err);

                //уменьшаем количество лайков в таблице с постами на 1
                posts.remove_count_likes([req.body.postID], (err) => {
                    if (err) return res.status(500).send("При отмене лайка поста произошла ошибка" + " " + err);

                    //получаем количество лайков поста
                    posts.get_count_likes_post([req.body.postID], (err, likes) => {
                        if (err) return res.status(500).send("При получении лайков произошда ошибка" + " " + err);

                        if (tokenID !== likes.authorPost) {
                            notice.delete_notice_like_DB([likes.authorPost, tokenID, req.body.postID, 0], (err) => {
                                if (err) return res.status(500).send('При удалении уведомления о лайке произошла ошибка' + " " + err);
                            })
                        }

                        res.status(200).json({
                            likes: likes,
                            flag: false
                        })
                    })
                })
            })
        } else {
            //добавляем автора лайка в таблицу лайков если ранее атор не лайкал пост
            posts.add_author_likes_post([req.body.postID, tokenID], (err) => {
                if (err) return res.status(500).send("При лайке поста произошла ошибка" + " " + err);

                //увеличиваем количество лайков в таблице с постами на 1
                posts.add_count_likes([req.body.postID], (err) => {
                    if (err) return res.status(500).send("При лайке поста произошла ошибка" + " " + err);

                    //получаем количество лайков поста
                    posts.get_count_likes_post([req.body.postID], (err, likes) => {
                        if (err) return res.status(500).send("При получении лайков произошда ошибка" + " " + err);

                        if (tokenID !== likes.authorPost) {
                            notice.add_notice_DB([likes.authorPost, tokenID, null, "отметил Вашу запись", req.body.postID, 0, 0, 0, 0, 0, req.body.date], (err) => {
                                if (err) return res.status(500).send('При добавлении уведомления о новом посте произошла ошибка' + " " + err);
                            })
                        }

                        res.status(200).json({
                            likes: likes,
                            flag: true
                        })
                    })
                })
            })
        }
    })
})

//ПОЛУЧАЕМ ВСЕХ КТО ЛАЙКНУЛ ПОСТ
router.get('/get_users_likes', authenticateJWT, function(req, res) {
    posts.get_users_likes([req.query.postID], (err, users) => {
        if (err) return res.status(500).send("При получении пользователй лайкнувших пост произошла ошибка" + " " + err);
        res.status(200).send(users);
    })

})

//ПОДГРУЗКА КОММЕНТАРИЕВ К ПОСТУ
router.get("/load_comments_post.js", authenticateJWT, function(req, res) {
    tokenID = req.tokenID; //id из сохраненного токена 
    commentsPost.load_comments_DB([req.query.userID, req.query.postID], (err, comments) => {
        if (err) return res.status(500).send('Во время загрузки комментариев произошла ошибка' + " " + err);
        res.status(200).json(comments);
    })
})

//ПОДГРУЗКА КОММЕНТАРИЕВ К ОДНОМУ ПОСТУ
router.get("/load_comments_one_post.js", authenticateJWT, function(req, res) {
    tokenID = req.tokenID; //id из сохраненного токена 

    commentsPost.load_comments_one_DB([req.query.postID], (err, comments) => {
        if (err) return res.status(500).send('Во время загрузки комментариев произошла ошибка' + " " + err);
        if (!comments) return res.status(404).send('Комментарии к постам отстутствуют' + " " + err);

        res.status(200).json(comments);
    })
})

//ПОДГРУЗКА КОММЕНТАРИЕВ К КОММЕНТАРИЮ
router.get("/load_comments_comment.js", authenticateJWT, function(req, res) {
    tokenID = req.tokenID; //id из сохраненного токена 

    commentsPost.load_comments_comment_DB([req.query.userID, req.query.postID], (err, comments) => {
        if (err) return res.status(500).send('Во время загрузки комментариев произошла ошибка' + " " + err);
        // if (!comments) return res.status(404).send('Комментарии отстутствуют' + " " + err);
        res.status(200).json(comments);
    })
})

//ПОДГРУЗКА КОММЕНТАРИЕВ К КОММЕНТАРИЮ ОДНОГО ПОСТА
router.get("/load_comments_comment_one_post.js", authenticateJWT, function(req, res) {
    tokenID = req.tokenID; //id из сохраненного токена 

    commentsPost.load_comments_comment_one_DB([req.query.postID], (err, comments) => {
        if (err) return res.status(500).send('Во время загрузки комментариев произошла ошибка' + " " + err);
        if (!comments) return res.status(404).send('Комментарии отстутствуют' + " " + err);

        res.status(200).json(comments);
    })
})

//ДОБАВЛЕНИЕ КОММЕНТАРИЯ К ПОСТУ В БАЗУ ДАННЫХ
router.post("/load_comments_post.js", authenticateJWT, messageValidate, function(req, res) {
    //валидация комментария
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    tokenID = req.tokenID; //id из сохраненного токена 

    commentsPost.add_commentPost_DB([
        req.body.postID,
        req.body.textMessage,
        tokenID,
        req.body.userPage,
        req.body.date
    ], (err, comment) => {
        if (err) return res.status(500).send('При добавлении комментария произошла ошибка' + " " + err);

        const newCommentID = comment.insertId
            // возвращаем написанный комментарий
        commentsPost.load_one_comment_DB(newCommentID, (err, newComment) => {
            if (err) return res.status(500).send("Ошибка на сервере." + " " + err);

            if (tokenID !== newComment.authorPost) {
                notice.add_notice_DB([newComment.authorPost, tokenID, null, "добавил комментарий к Вашей записи", newComment.post_id, 0, newComment.id, 0, 0, 0, newComment.date], (err) => {
                    if (err) return res.status(500).send('При добавлении уведомления о новом посте произошла ошибка' + " " + err);
                })
            }
            res.status(200).send(newComment);
        });
    });
})

//ДОБАВЛЕНИЕ КОММЕНТАРИЯ К КОММЕНТАРИЮ В БАЗУ ДАННЫХ
router.post("/load_comments_comment.js", authenticateJWT, messageValidate, function(req, res) {
    //валидация комментария
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    tokenID = req.tokenID; //id из сохраненного токена 

    commentsPost.add_commentComment_DB([
        req.body.commentID,
        req.body.textMessage,
        tokenID,
        req.body.nameAddressee,
        req.body.userPage,
        req.body.date,
        req.body.comment_commentID || null,
        req.body.author_comment_comment || null,
        req.body.comment_comment_text || null
    ], (err, comment) => {
        if (err) return res.status(500).send('При добавлении комментария произошла ошибка' + " " + err);

        const newCommentID = comment.insertId
            // возвращаем написанный комментарий
        commentsPost.load_one_comment_comment_DB(newCommentID, (err, newComment) => {
            if (err) return res.status(500).send("Ошибка на сервере." + " " + err);

            if (tokenID !== newComment.author_comment_id) {
                notice.add_notice_DB([newComment.author_comment_id, tokenID, null, "ответил на Ваш комментарий", req.body.postID, 0, newComment.comment_id, newComment.id, 0, 0, newComment.date], (err) => {
                    if (err) return res.status(500).send('При добавлении уведомления о новом посте произошла ошибка' + " " + err);
                })
            } else if (req.body.author_comment_comment && tokenID !== req.body.author_comment_comment) {
                notice.add_notice_DB([null, tokenID, req.body.author_comment_comment, "ответил на Ваш комментарий", req.body.postID, 0, newComment.comment_id, newComment.id, 0, 0, newComment.date], (err) => {
                    if (err) return res.status(500).send('При добавлении уведомления о новом посте произошла ошибка' + " " + err);
                })
            }

            res.status(200).send(newComment);
        });
    });
})

//УДАЛЯЕМ КОММЕНТАРИ К КОММЕНТАРИЮ
router.delete('/load_comments_comment.js', authenticateJWT, function(req, res) {

    tokenID = req.tokenID; //id из сохраненного токена 

    //удалять комментарии может только автор поста или хозяин страницы
    if (tokenID === req.body.authorID || tokenID === req.body.pageID) {
        commentsPost.remove_comment_comment_DB(req.body.commentID, (err) => {
            if (err) return res.status(500).send('Произошла ошибка при удалении комментария' + " " + err);

            notice.delete_notice_comment_comments_post_DB([req.body.commentID], (err) => {
                if (err) return res.status(500).send('При удалении уведомления о лайке произошла ошибка' + " " + err);
            })

            res.status(200).send("комментарий удален");
        });
    }
});

//УДАЛЯЕМ КОММЕНТАРИ К ПОСТУ
router.delete('/load_comments_post.js', authenticateJWT, function(req, res) {

    tokenID = req.tokenID; //id из сохраненного токена 

    //удалять комментарии может только автор поста или хозяин страницы
    if (tokenID === req.body.authorID || tokenID === req.body.pageID) {
        commentsPost.remove_comment_post_DB(req.body.commentID, (err) => {
            if (err) return res.status(500).send('Произошла ошибка при удалении комментария' + " " + err);

            notice.delete_notice_comment_post_DB([req.body.commentID], (err) => {
                if (err) return res.status(500).send('При удалении уведомления о лайке произошла ошибка' + " " + err);
            })

            res.status(200).send("комментарий удален");
        });
    }
});

//ДОБАВЛЯЕМ АВАТАРКУ В БАЗУ ДАННЫХ
router.post('/upload_ava', authenticateJWT, (req, res) => {

    userID = +req.body.id; //id из строки запроса
    tokenID = req.tokenID; //id из сохраненного токена 

    if (userID === tokenID) {
        //удаление аватарки из папки на сервере при обновлении
        if (req.body.nameAva !== "ava_1.jpg") {
            fs.unlink(`../src/assets/photo/${req.body.nameAva}`, (err) => {
                if (err) console.log(err)
            });
        }

        //записываем в папку на сервер изображение сконвертированное из base64
        let imgData = req.body.img // получаем файл в формате base64
        let base64Data = imgData.split(",")[1]; // оставляем непосредственно само закодированное изображение
        let nameImg = Date.now() + "ava.jpg"; //создаем имя фотографии

        let imgBuffer = Buffer.from(base64Data, 'base64'); //сохраняем изображение в буфер

        //сжатие и сохранение изображения в папке
        sharp(imgBuffer)
            .toFormat('jpeg')
            .jpeg({
                quality: 30
            })
            .toFile("../src/assets/photo/" + nameImg, (err, info) => {
                if (err) {
                    console.error(err);
                } else {
                    console.log(info);
                }
            });

        let arrayPhotos = [];
        arrayPhotos.push(nameImg, tokenID);

        //добавление картинки в таблицу Users базы данных 
        authorization.updateAva(arrayPhotos, (err) => {
            if (err) return res.status(500).send('Аватар пользователь не сменился');

            //получение обновленного профиля после загрузки аватарки
            authorization.loadUser(tokenID, (err, user) => {
                if (err) return res.status(500).send("Не удалось получить фотографии с сервера" + " " + err);
                res.status(200).send({
                    ava: user.ava,
                });
            })
        });

    }

});

//ОТПРАВЛЯЕМ ФОТОГРАФИИ В БАЗУ ДАННЫХ
router.post('/upload_photo', authenticateJWT, (req, res) => {

    userID = +req.body.id; //id из строки запроса
    tokenID = req.tokenID; //id из сохраненного токена 
    if (userID === tokenID || req.body.postIDLast || req.body.dialogIDLast) {
        //допустимые форматы
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

        //проверка на наличие файла
        if (!req.files) {
            return res.status(500).send("Файлы не отправлены")
        }

        //проверка на наличие категории у фото
        let category = "not category";
        if (req.body.category) {
            category = req.body.category;
        }

        //проверка на загрузку через пост
        let post = 0;
        if (req.body.postIDLast) {
            post = req.body.postIDLast
        }

        //проверка на загрузку через сообщение
        let dialog = 0;
        if (req.body.dialogIDLast) {
            dialog = req.body.dialogIDLast
        }

        let arrayPhotos = [];

        //переберем массив фотографий
        for (let file in req.files) {
            const myFile = req.files[file];

            //проверка загруженных файлов
            if (allowedTypes.includes(myFile.mimetype) && myFile.size < 5000000) {
                let updateName = Date.now() + myFile.name.toLowerCase();

                //сжатие и сохранение изображения в папке
                sharp(myFile.data)
                    .toFormat('jpeg')
                    .jpeg({
                        quality: 30
                    })
                    .toFile(`../src/assets/photo/${updateName}`, (err, info) => {
                        if (err) {
                            console.error(err);
                        } else {
                            console.log(info);
                        }
                    });
                // myFile.mv(`../src/assets/photo/${updateName}`,
                //     function(err) {
                //         if (err) {
                //             return res.status(500).send("Ошибка при загрузке файлов");
                //         }
                //     }
                // );

                //добавляем в массив название фото и id юзера
                arrayPhotos.push([updateName, tokenID, userID, category, post, dialog]);
            }
        }
        //загрузка в БД
        photos.add_photo_DB(arrayPhotos, (err) => {
            if (err) return res.status(500).send('Error on the server' + " " + err);
            res.status(200).send(arrayPhotos);
        })
    }
});

//ПОЛУЧАЕМ ФОТОГРАФИИ ИЗ БАЗЫ ДАННЫХ
router.get('/upload_all_photo', authenticateJWT, function(req, res) {

    tokenID = req.tokenID; //id из сохраненного токена 

    if (tokenID) {

        photos.load_all_photos_DB([
            tokenID,
            req.query.id,
            // req.query._count,
            // req.query._limit
        ], (err, allPhotos) => {
            if (err) return res.status(500).send('Ошибка на сервере. Фото не загрузились' + " " + err);
            if (!allPhotos) return res.status(404).send('Фотографии не найдены' + " " + err);

            //массив с названиями фотографий
            let arr = [];
            //путь к папке где лежат фотографии
            let path = "../src/assets/photo/";
            //проверка на наличие фотографии в папке, если фото есть - отправляем ответ клиенту
            allPhotos.forEach(element => {
                try {
                    //синхронный метод проверки файла ??????????????
                    if (fs.existsSync(`${path + element.photo_name}`)) {
                        arr.push(element)
                    }
                } catch (err) {
                    console.error(err)
                }

                // fs.access(`${path + element.photo_name}`, fs.F_OK, (err) => {
                //     if (!err) {
                //         console.log(element)
                //         arr.push(element)
                //     } else {
                //         // console.log('not files')
                //     }
                // })
            });
            res.json(arr);

            // res.status(200).send("Фотографии получены");;
        })

    }

})

//УДАЛЕНИЕ ФОТОГРАФИИ
router.delete('/remove_photo', authenticateJWT, function(req, res) {

    userID = +req.query.id; //id из строки запроса
    tokenID = req.tokenID; //id из сохраненного токена 

    if (userID === tokenID) {
        fs.unlink(`../src/assets/photo/${req.query.namePhoto}`, (err) => {
            if (err) return res.status(500).send('Фотография не найдена, возможно она уже удалена ранее' + " " + err);
        });

        photos.remove_photo_likes([req.query.idPhoto], (err) => {
            if (err) return res.status(500).send('Ошибка на сервере при удалении лайков' + " " + err);

            photos.remove_photo([
                req.query.idPhoto
            ], (err) => {
                if (err) return res.status(500).send('Ошибка на сервере. Фотография не удалилась' + " " + err);

                //удаляем уведомление о лайке фото и комментарие
                notice.delete_notice_photo_DB([req.query.idPhoto], (err) => {
                    if (err) return res.status(500).send('При удалении уведомления о лайке и комментарие произошла ошибка' + " " + err);
                })
                res.status(200).send("Фотография удалена");
            })
        })
    }
})

//УДАЛЕНИЕ ФОТОГАФИИ ИЗ ПОСТА
router.put('/remove_photo_post', authenticateJWT, function(req, res) {

    userID = +req.body.id; //id из строки запроса
    tokenID = req.tokenID; //id из сохраненного токена 
    if (userID === tokenID) {
        photos.remove_photo_post([
            req.body.idPhoto
        ], (err) => {
            if (err) return res.status(500).send('Ошибка на сервере. Фотография не удалилась из поста' + " " + err);
            res.status(200).send("Фотография удалена из поста");;
        })
    }
})


//УДАЛЕНИЕ АВАТАРКИ
router.put('/remove_ava_photo', authenticateJWT, function(req, res) {

    userID = +req.body.id; //id из строки запроса
    tokenID = req.tokenID; //id из сохраненного токена 

    if (userID === tokenID) {

        //удаление аватарки из папки на сервере
        fs.unlink(`../src/assets/photo/${req.body.nameAva}`, (err) => {
            if (err) console.log(err)
        });

        authorization.updateAva([
            "ava_1.jpg",
            tokenID
        ], (err) => {
            if (err) return res.status(500).send('Ошибка на сервере. Аватарка не удалилась' + " " + err);

            //получение обновленного профиля после удаления аватарки
            authorization.loadUser(tokenID, (err, user) => {
                if (err) return res.status(500).send("Не удалось получить фотографии с сервера" + " " + err);
                res.status(200).send({
                    user: {
                        ava: user.ava,
                    }
                });
            })
        })
    }


})

//ЛАЙКАЕМ ФОТОГРАФИЮ
router.post('/likes_photo', authenticateJWT, function(req, res) {
    tokenID = req.tokenID; //id из сохраненного токена 

    //проверяем лайкал ли ранее уже юзер данное фото
    photos.not_double_likes_photo_author([req.body.photoID, tokenID], (err, row) => {
        if (err) return res.status(500).send("При проверке на повторный лайк произошла ошибка" + " " + err);
        if (row.length > 0) {
            //удаляем автора лайка из таблицы если ранее атор лайкал фото
            photos.remove_author_like_photo([row[0].id], (err) => {
                if (err) return res.status(500).send("При исключении автора лайка из таблицы произошла ошибка" + " " + err);

                //уменьшаем количество лайков в таблице с фотографиями на 1
                photos.remove_count_likes([req.body.photoID], (err) => {
                    if (err) return res.status(500).send("При отмене лайка фотографии произошла ошибка" + " " + err);

                    //получаем количество лайков фотогафии
                    photos.get_count_likes_photo([req.body.photoID], (err, likes) => {
                        if (err) return res.status(500).send("При получении лайков произошла ошибка" + " " + err);

                        //удаляем уведомление о лайке фото
                        if (tokenID !== likes.userID) {
                            notice.delete_notice_like_DB([likes.userID, tokenID, 0, req.body.photoID], (err) => {
                                if (err) return res.status(500).send('При удалении уведомления о лайке произошла ошибка' + " " + err);
                            })
                        }

                        res.status(200).json({
                            likes: likes,
                            flag: false
                        })
                    })
                })
            })
        } else {
            //добавляем автора лайка в таблицу лайков если ранее атор не лайкал фото
            photos.add_author_likes_photo([req.body.photoID, tokenID], (err) => {
                if (err) return res.status(500).send("При лайке фото произошла ошибка" + " " + err);

                //увеличиваем количество лайков в таблице с постами на 1
                photos.add_count_likes([req.body.photoID], (err) => {
                    if (err) return res.status(500).send("При лайке фото произошла ошибка" + " " + err);

                    //получаем количество лайков поста
                    photos.get_count_likes_photo([req.body.photoID], (err, likes) => {
                        if (err) return res.status(500).send("При получении лайков произошла ошибка" + " " + err);

                        if (tokenID !== likes.userID) {
                            notice.add_notice_DB([likes.userID, tokenID, null, "отметил Вашу фотографию", 0, req.body.photoID, 0, 0, 0, 0, req.body.date], (err) => {
                                if (err) return res.status(500).send('При добавлении уведомления о новой отметка фотографии произошла ошибка' + " " + err);
                            })
                        }
                        res.status(200).json({
                            likes: likes,
                            flag: true
                        })
                    })
                })
            })
        }
    })
})

//ПОЛУЧАЕМ ВСЕХ КТО ЛАЙКНУЛ ФОТО
router.get('/get_users_likes_photo', authenticateJWT, function(req, res) {
    photos.get_users_likes_photo([req.query.photoID], (err, users) => {
        if (err) return res.status(500).send("При получении пользователй лайкнувших фото произошла ошибка" + " " + err);
        res.status(200).send(users);
    })

})

//ДОБАВЛЕНИЕ КОММЕНТАРИЯ К ФОТОГРАФИИ В БАЗУ ДАННЫХ
router.post("/load_comments_photo.js", authenticateJWT, messageValidate, function(req, res) {
    //валидация комментария
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    tokenID = req.tokenID; //id из сохраненного токена 

    commentsPhoto.add_commentPhoto_DB([
        req.body.photoID,
        req.body.textMessage,
        tokenID,
        req.body.userPage,
        req.body.date
    ], (err, commentPhoto) => {
        if (err) return res.status(500).send('При добавлении комментария произошла ошибка' + " " + err);

        const newCommentID = commentPhoto.insertId

        // возвращаем написанный комментарий
        commentsPhoto.load_one_comment_photo_DB(newCommentID, (err, newCommentPhoto) => {
            if (err) return res.status(500).send("Ошибка на сервере." + " " + err);

            if (tokenID !== newCommentPhoto.userID) {
                notice.add_notice_DB([newCommentPhoto.userID, tokenID, null, "добавил комментарий к Вашей фотографии", 0, newCommentPhoto.photo_id, 0, 0, newCommentPhoto.id, 0, newCommentPhoto.date], (err) => {
                    if (err) return res.status(500).send('При добавлении уведомления о новом посте произошла ошибка' + " " + err);
                })
            }

            res.status(200).send(newCommentPhoto);
        });
    });
})

//ПОДГРУЗКА КОММЕНТАРИЕВ К ФОТОГРАФИИ
router.get("/load_comments_photo.js", authenticateJWT, function(req, res) {
    tokenID = req.tokenID; //id из сохраненного токена 

    commentsPhoto.load_commentsPhoto_DB([req.query.photoID], (err, comments) => {
        if (err) return res.status(500).send('Во время загрузки комментариев произошла ошибка' + " " + err);
        if (!comments) return res.status(404).send('Комментарии к постам отстутствуют' + " " + err);

        res.status(200).json(comments);
    })
})

//УДАЛЯЕМ КОММЕНТАРИЙ К ФОТО
router.delete('/load_comments_photo.js', authenticateJWT, function(req, res) {

    tokenID = req.tokenID; //id из сохраненного токена 

    //удалять комментарии может только автор поста или хозяин страницы
    if (tokenID === req.body.authorID || tokenID === req.body.pageID) {
        commentsPhoto.remove_comment_photo_DB(req.body.commentID, (err) => {
            if (err) return res.status(500).send('Произошла ошибка при удалении комментария' + " " + err);

            notice.delete_notice_comment_photo_DB([req.body.commentID], (err) => {
                if (err) return res.status(500).send('При удалении уведомления о лайке произошла ошибка' + " " + err);
            })

            res.status(200).send("Комментарий к фотографии был удален");
        });
    }
});

//ДОБАВЛЕНИЕ СООБЩЕНИЯ В БАЗУ ДАННЫХ
router.post('/user_message', authenticateJWT, messageValidate, function(req, res) {
    //валидация сообщения
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        if (errors.array()[0].msg === 'Пост должен содержать не менее 1 символа' && !req.body.photo) {
            return res.status(422).json({
                errors: errors.array()
            });
        }
    }

    tokenID = req.tokenID //кто пишет 
    destinationID = req.body.destinationID //кому мы пишем

    let photo = "";
    if (req.body.photo) {
        photo = req.body.photo;
    } else {
        photo = false;
    }

    if (tokenID != req.body.destinationID) {
        //ищем диалог между пользователями
        messages.get_conversation_id_DB([
            tokenID,
            destinationID,
            destinationID,
            tokenID
        ], (err, row_conversation) => {
            if (err) return res.status(500).send(err);

            return new Promise((resolve) => {
                    // Если диалог не создан ранее - создаем
                    if (row_conversation.length === 0) {
                        messages.add_conversation_DB([
                            tokenID,
                            destinationID,
                            tokenID
                        ], (err, last_conversation) => {
                            if (err) return res.status(500).send(err);
                            resolve(last_conversation.insertId) // ID последнего диалога
                        })
                    } else {
                        resolve(row_conversation[0].id) // ID последнего диалога
                    }
                })
                .then((last_conversation_id) => {

                    // Добавляем сообщение
                    messages.add_message_DB([
                        last_conversation_id,
                        tokenID,
                        destinationID,
                        req.body.textMessage,
                        req.body.date,
                        photo
                    ], (err, row_messages) => {
                        if (err) return res.status(500).send('При записи сообщения в базу данных произошла ошибка' + ' ' + err);

                        //получаем id последнего сообщения в диалоге
                        let row_messages_id = row_messages.insertId

                        // Обновляем таблицу с диалогом
                        messages.update_conversation_id_DB([
                            row_messages_id,
                            tokenID,
                            tokenID,
                            destinationID,
                            last_conversation_id,
                            tokenID,
                            last_conversation_id
                        ], (err) => {
                            if (err) return res.status(500).send('При обновлении таблицы диалогов произошла ошибка' + ' ' + err);
                        })

                        //возвращаем отправленное сообщение
                        messages.get_last_message_DB([row_messages_id], (err, newMessage) => {
                            if (err) return res.status(500).send('Неудалось вернуть добавленное сообщение' + ' ' + err);
                            res.status(200).send(newMessage);

                        })
                    })
                })
        })
    }
})

//  ПОЛУЧЕНИЕ ВСЕХ ДИАЛОГОВ С ДРУГИМИ ПОЛЬЗОВАТЕЛЯМИ
router.get('/user_dialogs', authenticateJWT, function(req, res) {

    tokenID = req.tokenID //id из сохраненного токена   

    if (tokenID) {
        // Вывод диалогов пользователя
        messages.get_all_conversation_DB({
            tokenID,
            _count: req.query._count,
            _limit: req.query._limit
        }, (err, dialogs) => {
            if (err) return res.status(500).send('При получении диалогов из БД произошла ошибка:' + ' ' + err);

            //определяем количство непрочитанных сообщений для адресата
            let newDialogs = dialogs.map((dialog) => {
                if (dialog.sender === tokenID) {
                    dialog.unread = 0;
                } else {
                    if (req.query.isExitMessage && (req.query.convID == dialog.convId)) {
                        // Обновляем флаг просмотров сообщений
                        messages.update_flag_unread_messages([
                            req.query.convID,
                            tokenID
                        ], (err) => {
                            if (err) return res.status(500).send('При обновлении флага в таблице сообщений произошла ошибка:' + ' ' + err);

                            //обновляем флаг с непрочитанными сообщениями в таблице диалогов
                            messages.update_flag_unread_conersation([
                                req.query.convID,
                                tokenID,
                                req.query.convID,
                                tokenID
                            ], (err) => {
                                if (err) return res.status(500).send('При обновлении флага в таблице диалогов произошла ошибка:' + ' ' + err);
                            })
                        })
                        dialog.unread = 0;
                    }
                }
                return dialog
            })
            return res.status(200).send(newDialogs)
        })
    }

})

//ПОЛУЧЕНИЕ ПЕРЕПИСКИ С КОНКРЕТНЫМ ПОЛЬЗОВАТЕЛЕМ
router.get('/user_messages', authenticateJWT, function(req, res) {

    tokenID = req.tokenID //id из сохраненного токена
    user_companion = req.query.user_companion //id собеседника по переписки

    if (tokenID != user_companion) {

        // Поиск диалога
        messages.get_conversation_id_DB([
            tokenID,
            user_companion,
            user_companion,
            tokenID
        ], (err, row_conversation) => {
            if (err) return res.status(500).send('При получении id переписки из БД произошла ошибка:' + ' ' + err);

            // Если диалог не создан ранее
            if (row_conversation.length == 0) {
                return res.status(200);
            } else {
                //иначе возвращаем переписку из БД
                messages.get_messages_user_DB([
                    row_conversation[0].id,
                    tokenID,
                    row_conversation[0].id,
                    tokenID,
                    tokenID,
                    req.query._count,
                    req.query._limit
                ], (err, messages_user) => {
                    if (err) return res.status(500).send('При получении сообщений из БД произошла ошибка:' + ' ' + err);

                    if (messages_user.length === 0) {
                        return res.status(200).send(messages_user);
                    }

                    // if (row_conversation[0].unread !== 0) {
                    // Обновляем флаг просмотров сообщений
                    messages.update_flag_unread_messages([
                            row_conversation[0].id,
                            tokenID
                        ], (err) => {
                            if (err) return res.status(500).send('При обновлении флага в таблице сообщений произошла ошибка:' + ' ' + err);

                            //обновляем флаг с непрочитанными сообщениями в таблице диалогов
                            messages.update_flag_unread_conersation([
                                row_conversation[0].id,
                                tokenID,
                                row_conversation[0].id,
                                tokenID
                            ], (err) => {
                                if (err) return res.status(500).send('При обновлении флага в таблице диалогов произошла ошибка:' + ' ' + err);
                            })
                        })
                        // }

                    return res.status(200).send(messages_user)
                })
            }
        })
    }
})

router.put('/unread_messages', authenticateJWT, function(req, res) {
    tokenID = req.tokenID //id из сохраненного токена

    messages.update_flag_unread_messages([
        req.body.conv_id,
        tokenID
    ], (err) => {
        if (err) return res.status(500).send('При обновлении флага в таблице сообщений произошла ошибка:' + ' ' + err);

        //обновляем флаг с непрочитанными сообщениями в таблице диалогов
        messages.update_flag_unread_conersation([
            req.body.conv_id,
            tokenID,
            req.body.conv_id,
            tokenID
        ], (err) => {
            if (err) return res.status(500).send('При обновлении флага в таблице диалогов произошла ошибка:' + ' ' + err);

            return res.status(200).send('Сообщение прочитано')

        })
    })
})

//УДАЛЕНИЕ СООБЩЕНИЕ В ПЕРЕПИСКЕ
router.delete('/user_messages', authenticateJWT, function(req, res) {

    tokenID = req.tokenID //id из сохраненного токена
        // Проверяем существование сообщения
    messages.get_message([
        req.body.deleteID,
        tokenID,
        tokenID
    ], (err, message) => {
        if (err) return res.status(500).send(err);
        if (!message) {
            return res.status(200).send("Сообщение не найдено")
        } else {
            //обновляем флаги удаления сообщения у пользователей
            messages.update_message_flag_delete([
                tokenID,
                tokenID,
                req.body.deleteID
            ], (err) => {
                if (err) return res.status(500).send("Сообщение небыло удалено" + " " + err);

                //проверяем на удаление сообщения обоими пользователями
                messages.check_message_flag_delete([req.body.deleteID], (err, message_flag) => {
                    if (err) {
                        "Удаленное сообщение не найдено" + " " + err
                    }

                    if (message_flag.bool === "true") {
                        //удаляем сообщение из БД
                        messages.delete_message([req.body.deleteID], (err) => {
                            if (err) {
                                "Сообщение небыло удалено" + " " + err
                            }

                            if (req.body.photos === "1") {
                                messages.message_photos_DB(req.body.deleteID, (err, photosArray) => {
                                    if (err) {
                                        'При получении фотографий из сообщения произошла ошибка' + " " + err
                                    }

                                    photosArray.forEach(photo => {
                                        photos.remove_photo([photo.id], (err) => {
                                            if (err) console.log(err)

                                            //удаляем фото из папки на сервере
                                            fs.unlink(`../src/assets/photo/${photo.photo_name}`, (err) => {
                                                if (err) console.log(err);
                                            });
                                        })
                                    })
                                })
                            }

                        })
                    }
                    return res.status(200).send("Сообщение удалено")
                })

            })
        }
    })
})

//УДАЛЕНИЕ ДИАЛОГА
router.put('/user_messages', authenticateJWT, function(req, res) {

    tokenID = req.tokenID; //id из сохраненного токена

    // Проверяем существование диалога
    messages.get_conversation([
        req.body.dialogsID,
        tokenID,
        tokenID
    ], (err, dialog) => {
        if (err) return res.status(500).send(err);

        if (!dialog) {
            return res.status(200).send("Данный диалог не найден")
        } else {
            //обновляем флаги удаления сообщений у пользователей
            messages.update_messages_flag_delete([
                tokenID,
                tokenID,
                req.body.dialogsID
            ], (err) => {
                if (err) return res.status(500).send("Сообщениея в диалоге небыли удалены" + " " + err);

                //обновляем флаги удаления диалога у пользователя
                messages.update_conversation_flag_delete([
                    tokenID,
                    tokenID,
                    req.body.dialogsID
                ], (err) => {
                    if (err) return res.status(500).send("Диалог небыл удален" + " " + err);

                    //проверяем на удаление диалога обоими пользователями
                    messages.check_dialog_flag_delete([req.body.dialogsID], (err, dialog_flag) => {
                        if (err) {
                            "Удаленный диалог не найден" + " " + err
                        }

                        if (dialog_flag.bool === "true") {
                            //удаляем диалог из БД
                            messages.delete_dialog([req.body.dialogsID], (err) => {
                                if (err) {
                                    "Диалог небыл удален из БД" + " " + err
                                }

                                //получаем массив фотографий из диалога
                                messages.dialog_photos_DB(req.body.dialogsID, (err, photosArray) => {
                                    if (err) {
                                        'При получении фотографий из диалога произошла ошибка' + " " + err
                                    }

                                    //удаляем все сообщения диалога из БД
                                    messages.delete_all_message_dialog([req.body.dialogsID], (err) => {
                                        if (err) {
                                            "Сообщения из диалога небыли удалены" + " " + err
                                        }
                                        if (photosArray.length > 1) {

                                            photosArray.forEach(photo => {
                                                photos.remove_photo([photo.id], (err) => {
                                                    if (err) console.log(err)

                                                    //удаляем фото из папки на сервере
                                                    fs.unlink(`../src/assets/photo/${photo.photo_name}`, (err) => {
                                                        if (err) console.log(err);
                                                    });
                                                })
                                            })

                                        }

                                    })
                                })

                            })
                        }
                    })

                    return res.status(200).send(dialog);
                })
            })
        }
    })
})

//ОТПРАВЛЕНИЕ ЗАПРОСА В ДРУЗЬЯ
router.post("/add_friend", authenticateJWT, function(req, res) {
    tokenID = req.tokenID //id из сохраненного токена
    if (tokenID != req.body.id) {

        //проверка на ранее отправленную заявку
        friends.get_confirm_friend_DB([tokenID, req.body.id, req.body.id, tokenID], (err, confirmID) => {
            if (err) return res.status(500).send("При поиске приглашения в друзья, произошла ошибка" + " " + err);

            //если запроса ранее небыло создаем его
            if (confirmID.length === 0) {
                friends.add_friend_DB([tokenID, req.body.id], (err, friendID) => {
                    if (err) return res.status(500).send("При отправке запроса в друзья, произошла ошибка" + " " + err);
                    res.status(200).send({ status: "Заявка отправлена", userID: tokenID });

                    notice.add_notice_DB([req.body.id, tokenID, null, "пригласил Вас в друзья", 0, 0, 0, 0, 0, friendID.insertId, req.body.date], (err) => {
                        if (err) return res.status(500).send('При добавлении уведомления о новом посте произошла ошибка' + " " + err);
                    })

                })
            } else {
                //если запрос ранее был - отменяем его
                friends.cancel_add_friend_DB([confirmID[0].id], (err) => {
                    if (err) return res.status(500).send("При отмене заявки в друзья произошла ошибка" + " " + err);

                    //убераем уведомление
                    notice.delete_notice_like_DB([req.body.id, tokenID, 0, 0], (err) => {
                        if (err) return res.status(500).send('При удалении уведомления о лайке произошла ошибка' + " " + err);
                    })

                    res.status(200).send({ status: "Добавить в друзья", userID: tokenID })
                })
            }
        })
    }
})

//ПРОВЕРКА НА РАНЕЕ ОТПРАВЛЕННУЮ ЗАЯВКУ В ДРУЗЬЯ
router.get("/check_request_friend", authenticateJWT, function(req, res) {
    tokenID = req.tokenID //id из сохраненного токена

    // if (tokenID != req.query.id) {
    //проверка на ранее отправленную заявку
    friends.get_confirm_friend_DB([tokenID, req.query.id, req.query.id, tokenID], (err, confirmID) => {
            if (err) return res.status(500).send("При поиске приглашения в друзья, произошла ошибка" + " " + err);
            //если запроса небыло - оставляем как есть
            if (confirmID.length === 0) {
                res.status(200).send("Добавить в друзья");
            } else {
                if (confirmID[0].confirm_sender === 1 && confirmID[0].confirm_addressee === 0) {
                    if (confirmID[0].sender_user_id === tokenID) {
                        res.status(200).send("Заявка отправлена");
                    } else {
                        res.status(200).send("Рассмотреть заявку");
                    }
                } else if (confirmID[0].confirm_sender === 1 && confirmID[0].confirm_addressee === 1) {
                    res.status(200).send("Это Ваш друг");
                } else {
                    res.status(200).send("Моя страница");
                }

            }

        })
        // }
})

//ПРОВЕРКА НА ПОЛУЧЕНИЕ ЗАПРОСОВ В ДРУЗЬЯ
router.get("/check_confirm_friends", authenticateJWT, function(req, res) {
    tokenID = req.tokenID //id из сохраненного токена
    if (tokenID) {
        //проверка отправленных мне запросов
        friends.get_confirm_friends_DB([tokenID], (err, confirm) => {
            if (err) return res.status(500).send("При поиске приглашения в друзья, произошла ошибка" + " " + err);

            //если запроса небыло - оставляем как есть
            // if (confirm.length === 0) {
            // res.status(200).send("Заявок не было");
            // } else {

            res.status(200).send(confirm);

            // }
        })
    }
})

//ПОЛУЧЕНИЕ ПЛЬЗОВАТЕЛЕЙ ОТПРАВИВШИХ МНЕ ЗАПРОС В ДРУЗЬЯ
router.get("/add_friends_me", authenticateJWT, function(req, res) {
    tokenID = req.tokenID //id из сохраненного токена
    if (tokenID) {
        friends.get_user_confirm_friends_me_DB([tokenID, +req.query._count, +req.query._limit], (err, users) => {
            if (err) return res.status(500).send("При получении пользователей приглашающих меня в друзья, произошла ошибка" + " " + err);

            res.status(200).send(users);

        })
    }
})

//ПОЛУЧЕНИЕ ПЛЬЗОВАТЕЛЕЙ КОТОРЫМ Я ОТПРАВИЛ ЗАПРОС В ДРУЗЬЯ
router.get("/add_friends_from_me", authenticateJWT, function(req, res) {
    tokenID = req.tokenID //id из сохраненного токена
    if (tokenID) {
        friends.get_user_confirm_friends_from_me_DB([tokenID, +req.query._count, +req.query._limit], (err, users) => {
            if (err) return res.status(500).send("При получении пользователей которых я пригласил в друзья, произошла ошибка" + " " + err);

            res.status(200).send(users);

        })
    }
})

//ПОЛУЧЕНИЕ МОИХ ДРУЗЕЙ
router.get("/my_friends", authenticateJWT, function(req, res) {
    tokenID = req.tokenID //id из сохраненного токена
    if (tokenID) {
        friends.get_my_friends_DB([req.query.id, req.query.id, +req.query._count, +req.query._limit], (err, users) => {
            if (err) return res.status(500).send("При получении моих друзей, произошла ошибка" + " " + err);

            res.status(200).send(users);

        })
    }
})

//ПОИСК ДРУЗЕЙ СРЕДИ ПОЛЬЗОВАТЕЛЕЙ
router.get("/search_friends", authenticateJWT, searchNewFriendsValidate, function(req, res) {
    //валидация фильтра поиска
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    tokenID = req.tokenID //id из сохраненного токена
    if (tokenID) {
        friends.get_users([tokenID, tokenID, tokenID, tokenID, tokenID, tokenID, `%${req.query.name}%`, `%${req.query.surname}%`, `%${req.query.country}%`, `%${req.query.city}%`, `%${req.query.sex}%`, req.query.ageAfter, req.query.ageBefore, +req.query._count, +req.query._limit], (err, users) => {
            if (err) return res.status(500).send("При получении пользователей, произошла ошибка" + " " + err);
            res.status(200).send(users);
        })
    }
})

//ПРИНЯТЬ ЗАЯВКУ В ДРУЗЬЯ
router.put("/add_friends_me", authenticateJWT, function(req, res) {
    tokenID = req.tokenID //id из сохраненного токена
    if (tokenID) {
        friends.agree_add_friend_DB([req.body.id], (err) => {
            if (err) return res.status(500).send("При получении пользователей приглашающих меня в друзья, произошла ошибка" + " " + err);

            //добавляем уведомление
            notice.add_notice_DB([req.body.userID, tokenID, null, "принял Вашу заявку в друзья", 0, 0, 0, 0, 0, req.body.id, req.body.date], (err) => {
                if (err) return res.status(500).send('При добавлении уведомления о новом посте произошла ошибка' + " " + err);

                //убераем уведомление о приглашении в друзья
                notice.delete_notice_like_DB([tokenID, req.body.userID, 0, 0], (err) => {
                    if (err) return res.status(500).send('При удалении уведомления о лайке произошла ошибка' + " " + err);
                })
            })

            res.status(200).send("Пользователь добавлен в Ваши друзья");

        })
    }
})

//УДАЛИТЬ ИЗ ДРУЗЕЙ
router.delete("/delete_friends", authenticateJWT, function(req, res) {
    tokenID = req.tokenID //id из сохраненного токена
    if (tokenID == req.body.params.query) {
        friends.delete_friend_DB([req.body.params.id], (err) => {
            if (err) return res.status(500).send("При удалении пользователя из друзей, произошла ошибка" + " " + err);

            // убераем уведомление о приглашении в друзья
            notice.delete_notice_friend_DB([tokenID, req.body.params.userID, tokenID, req.body.params.userID], (err) => {
                if (err) return res.status(500).send('При удалении уведомления о лайке произошла ошибка' + " " + err);
            })

            res.status(200).send("Пользователь удален из ваших друзей");
        })
    }
})

//ПОДГРУЗКА НОВОСТНОЙ ЛЕНТЫ
router.get('/news_friends.js', authenticateJWT, function(req, res) {
    tokenID = req.tokenID //id из сохраненного токена

    posts.load_news_friens_DB([
        tokenID,
        tokenID,
        tokenID,
        req.query._count,
        req.query._limit
    ], (err, newsFriends) => {
        if (err) return res.status(500).send('Error on the server.' + " " + err);
        if (!newsFriends) return res.status(404).send('No news found.');
        // console.log(newsFriends)
        res.status(200).json(newsFriends);
    });
});

//ОБРАТНАЯ СВЯЗЬ С ПОЛЬЗОВАТЕЛЕМ
router.post('/problem_user', authenticateJWT, feedBackUser, function(req, res) {
    tokenID = req.tokenID //id из сохраненного токена

    //валидация заполнения полей
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    authorization.loadUserInfo([tokenID], (err, user) => {
        if (err) return res.status(500).send('Error on the server.' + " " + err);

        feedBack.add_new_problem([tokenID, user.name, user.surname, user.email, req.body.cause, req.body.title, req.body.description], (err) => {
            if (err) return res.status(500).send('Error on the server.' + " " + err);

            //отправляем сообщение на почту юзера после его обращения в поддержку
            const message = {
                to: user.email,
                subject: 'FeedBack RaccoonNet.ru',
                html: `
                <h2>Добрый день, Ваше обращение принято в обработку службой технической поддержки сайта RaccoonNet.ru</h2>  
                <i>данные по Вашему обращению:</i>
                <ul>
                    <li>Причина обращения: ${req.body.cause}</li>
                    <li>Краткое наименование: ${req.body.title}</li>
                    <li>Подробное описание: ${req.body.description}</li>
                </ul>
                <p>Данное письмо не требует ответа.<p>`
            }
            mailer(message);

            res.status(200).send("Ваша заявка принята");
        })
    })
})

//ЗАПРОС НА ВОССТАНОВЛЕНИЕ ПАРОЛЯ
router.post('/restore_password', loginValidate, function(req, res) {

        //валидация заполнения полей
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                errors: errors.array()
            });
        }

        authorization.selectByEmail(req.body.email, (err, user) => {
            if (err) return res.status(500).send('Ошибка на сервере.' + " " + err);
            if (!user) return res.status(200).send("Ссылка для сброса пароля отправлена на Ваш почтовый ящик");

            let randomToken = randtoken.generate(20);
            let tokenLink = jwt.sign({
                    email: req.body.email,
                },
                randomToken, {
                    expiresIn: 600
                },
            );

            authorization.add_token_pass_user([randomToken, req.body.email], (err) => {
                if (err) return res.status(500).send('Error on the server.' + " " + err);

                const message = {
                    to: req.body.email,
                    subject: 'Сброс пароля RaccoonNet',
                    html: `
                    <p>Для сброса пароля от вашего профиля на сайте RaccoonNet перейдите по ссылке и следуйте дальнейшим инструкциям</p>  
                   <a href='http://localhost:8080/reset-password?token=${tokenLink}'>ссылка для сброса пароля</a>

                   <p>Если Вы не пытались сбросить пароль, просто проигнорируйте это письмо.</p>
               
                    <p>Данное письмо не требует ответа.<p>`
                }
                mailer(message);

                res.status(200).send("Ссылка для сброса пароля отправлена на Ваш почтовый ящик");
            })
        })
    })
    // })

//ИЗМЕНЕНИЕ ПАРОЛЯ ПОСЛЕ ЕГО ОБНОВЛЕНИЯ
router.put('/update_password_restore', passwordValidate, function(req, res) {

    //валидация полей
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors)
        return res.status(422).json({
            errors: errors.array()
        });
    }
    const decoded = jwt.decode(req.body.token).email

    //проверка ссылки с токеном на токен в БД
    authorization.get_user_token(decoded, (err, user) => {
        if (err) return res.status(500).send("Ошибка на сервере" + " " + err);
        if (!user.pass_token) return res.status(401).send({
            err: 'Cсылка по которой Вы перешли устарела'
        });

        jwt.verify(req.body.token, user.pass_token, (err) => {
            if (err) {
                return res.status(401).send({
                    err: 'Cсылка по которой Вы перешли устарела'
                });
            }

            if (!req.body.new_password) return res.status(500).send("Поле с новым паролем не заполнено");

            //обновление старого пароля
            authorization.updateUserPassword([
                bcrypt.hashSync(req.body.new_password, 8),
                user.userID
            ], (err) => {
                if (err) return res.status(500).send("При изменении пароля возникли проблемы" + " " + err);

                //получение почты пользователя
                authorization.loadUserEmail(user.userID, (err, user) => {
                    if (err) return res.status(500).send('Ошибка на сервере.' + " " + err);

                    // отправляем сообщение на новую почту если юзер поменял пароль 
                    const message = {
                        to: user.email,
                        subject: 'You have changed your password',
                        html: `
                                <h2>Вы изменили пароль своей учетной записи на сайте raccoonnet.ru!</h2>  
                                <i>Если вы этого не делали, обратитесь в службу поддержки</i>
                                <p>Данное письмо не требует ответа.<p>`
                    }
                    mailer(message);

                    res.status(200).send("Пароль успешно обновлен");

                });
            })
        })
    })
})

//ПОЛУЧЕНИЕ НОВЫХ УВЕДОМЛЕНИЙ
router.get('/new_notice', authenticateJWT, function(req, res) {
    tokenID = req.tokenID //id из сохраненного токена

    notice.get_notice_DB([
        tokenID,
        tokenID
    ], (err, newNotice) => {
        if (err) return res.status(500).send('При получении уведомлений произошла ошибка' + " " + err);
        res.status(200).json(newNotice);
    });
});

//УДАЛЕНИЕ УВЕДОМЛЕНИЙ ИЗ СПИСКА
router.delete('/notice_delete', authenticateJWT, function(req, res) {
    tokenID = req.tokenID //id из сохраненного токена

    notice.delete_notice_DB([
        req.body.noticeID
    ], (err) => {
        if (err) return res.status(500).send('При удалении уведомления произошла ошибка' + " " + err);
        res.status(200).send("уведомление удалено");
    });
})

//ОТМЕТИТЬ УВЕДОМЛЕНИЕ КАК ПРОСМОТРЕННОЕ РАНЕЕ
router.put('/notice_remove_count', authenticateJWT, function(req, res) {
    tokenID = req.tokenID //id из сохраненного токена

    notice.notice_remove_count_DB([
        req.body.noticeID
    ], (err) => {
        if (err) return res.status(500).send('При попытке отметить уведомление как прочитанное произошла ошибка' + " " + err);
        res.status(200).send("уведомление прочитано");
    });
})

//ПОЛУЧЕНИЕ ФОТОГРАФИЙ К ПОСТУ ИЗ УВЕДОМЛЕНИЯ
router.get('/new_notice_photos', authenticateJWT, function(req, res) {
    notice.get_notice_photos_post_DB([
        req.query.post_id
    ], (err, newPhotoNotice) => {
        if (err) return res.status(500).send('При получении фотографий к посту из уведомления произошла ошибка' + " " + err);

        res.status(200).json(newPhotoNotice);
    });
});

//ПОЛУЧЕНИЕ ДАННЫХ БЕЗ ПЕРЕЗАГРУЗКИ
io.use(async(socket, next) => {
    // получаем токен от клиента
    const token = socket.handshake.auth.token;
    try {
        // проверяем что токен соответствует авторизованному пользователю
        const user = jwt.verify(token, tokenKey.secret);

        // сохраняем информацию из токена в сокете
        socket.user = user;

        next();
    } catch (e) {
        console.log('error', e.message);
        return next(new Error(e.message));
    }
});


io.on("connection", (socket) => {
    socket.join(socket.user.id)
        // let arr = [];
        // arr[socket.user.id] = socket.rooms;

    // console.log(arr)
    // const { id, userID } = socket.rooms;

    //записываем id пользователя в комнату
    // socket.join(socket.user.id);
    // console.log(socket.user.id)
    // socket.join(roomName);

    console.log("a user connected");

    //выходим из комнаты
    socket.on("disconnect", () => {
        // socket.leave(roomName);
        console.log("user disconnected");
    });

    // socket.on("my message", (msg) => {
    //     console.log("message: " + msg);
    //     io.emit("my broadcast", `server: ${msg}`);
    // });

    //записываем имя комнаты
    // socket.on("join", ({ roomName }) => {
    //     console.log("join: " + roomName);
    //     socket.join('50');
    // });

    //получаем сообщение
    socket.on("message", (newMessage) => {

        //отправляем сообщение всем кто находится в комнате кроме отправителя
        socket.to(Number(newMessage.destinationID)).emit("message", newMessage);

        // отправляем сообщение всем кто находится в комнате включая отправителя
        // io.to(roomName).emit("message", outgoingMessage);
    });

    //получаем уведомление
    socket.on("notice", (addresseeID) => {

        if ((Object.prototype.toString.call(addresseeID) !== '[object Object]')) {
            notice.get_notice_DB([
                addresseeID,
                addresseeID
            ], (err, newNotice) => {
                if (err) return res.status(500).send('При получении уведомлений произошла ошибка' + " " + err);

                //отправляем сообщение всем кто находится в комнате кроме отправителя
                socket.to(Number(addresseeID)).emit("notice", newNotice);
                // res.status(200).json(newNotice);
            });

            // отправляем сообщение всем кто находится в комнате включая отправителя
            // io.to(roomName).emit("message", outgoingMessage);
        } else {
            let newNotice = [addresseeID]
                //отправляем сообщение всем кто находится в комнате кроме отправителя
            socket.to(Number(addresseeID.id)).emit("notice", newNotice);
        }

    });

});

app.use(router)

let port = process.env.PORT || 8000;
http.listen(port, function() {
    console.log('Express server listening on port ' + port)
});