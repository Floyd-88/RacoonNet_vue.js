const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const fs = require('fs')
const fileUpload = require('express-fileupload');
const sharp = require('sharp');
const {
    validationResult
} = require('express-validator');

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


//подключаем массивы с валидацией
const loginValidate = require('./validate/loginValidate')
const registerValidate = require('./validate/registerValidate')
const postValidate = require('./validate/postValidate')
const updateUserValidate = require('./validate/updateUserValidate')
const passwordValidate = require('./validate/passwordValidate')
const passwordDelValidate = require('./validate/passwordDelValidate');
const messageValidate = require('./validate/messageValidate');

const {
    resolve
} = require('path');


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

        authorization.selectByEmail(req.body.email, (err, user) => {
            if (err) return res.status(500).send("Ошибка на сервере." + " " + err);

            //создаем токен для защиты своих данных
            let token = jwt.sign({
                    name: user.name,
                    id: user.userID,
                },
                tokenKey.secret, {
                    expiresIn: 86400
                }, // expires in 24 hours
            );
            res.status(200).send({
                auth: true,
                token: token,
                user: {
                    userID: user.userID,
                    // name: user.name,
                    // surname: user.surname,
                    is_admin: user.is_admin
                        // ava: user.ava,
                        // email: user.email,
                        // year_user: user.year_user,
                        // month_user: user.month_user,
                        // day_user: user.day_user,
                        // selectedGender: user.selectedGender,
                        // country: user.country,
                        // city: user.city,
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

        authorization.selectByEmail(req.body.email, (err, user) => {
            if (err) return res.status(500).send("Ошибка на сервере." + " " + err)

            //создаем токен для защиты своих данных
            let token = jwt.sign({
                    name: user.name,
                    id: user.userID,
                },
                tokenKey.secret, {
                    expiresIn: 86400
                }, // expires in 24 hours
            );

            res.status(200).send({
                auth: true,
                token: token,
                user: {
                    userID: user.userID,
                    // name: user.name,
                    // surname: user.surname,
                    is_admin: user.is_admin
                        // ava: user.ava,
                        // email: user.email,
                        // year_user: user.year_user,
                        // month_user: user.month_user,
                        // day_user: user.day_user,
                        // selectedGender: user.selectedGender,
                        // country: user.country,
                        // city: user.city,
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
            err: 'Вы указали не правильный пароль'
        });

        //создаем токен для защиты своих данных
        let token = jwt.sign({
                name: user.name,
                id: user.userID,
            },
            tokenKey.secret, {
                expiresIn: 86400 // срок действия in 24 hours
            },
        );

        res.status(200).send({
            auth: true,
            token: token,
            user: {
                userID: user.userID,
                is_admin: user.is_admin,
            }
        });
    });
})

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
        if (!req.body.old_password) return res.status(500).send("Поле со старым паролем не заполнено");

        authorization.getPassword(tokenID, (err, password) => {
            if (err) return res.status(500).send("Ошибка на сервере" + " " + err);
            let passwordIsValid = bcrypt.compareSync(req.body.old_password, password.user_pass);
            if (!passwordIsValid) return res.status(401).send({
                err: 'Пароль не действителен'
            });

            if (!req.body.new_password) return res.status(500).send("Поле с новым паролем не заполнено");

            //обновление старого пароля
            authorization.updateUserPassword([
                    bcrypt.hashSync(req.body.new_password, 8),
                    tokenID
                ],
                (err) => {
                    if (err) return res.status(500).send("При изменении пароля возникли проблемы" + " " + err);

                    res.status(200).send("Пароль успешно обновлен");
                })

        })
    }
})

//УДАЛЕНИЕ ПРОФИЛЯ ПОЛЬЗОВАТЕЛЯ
router.delete('/delete_user', authenticateJWT, passwordDelValidate, function(req, res) {


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

            //удаление пользователя
            authorization.deleteUserDB([tokenID], (err) => {
                if (err) return res.status(500).send("При удалении пользователя возникли проблемы" + " " + err);
                res.status(200).send("Пользователь успешно удален");
            })
        })
    }
})

//ПОДГРУЗКА ПОСТОВ ПОЛЬЗОВАТЕЛЯ ИЗ БАЗЫ ДАННЫХ
router.get('/dataBase.js', authenticateJWT, function(req, res) {
    posts.load_posts_DB([
        req.query.userID,
        req.query._count,
        req.query._limit
    ], (err, allPosts) => {
        console.log(err)
        if (err) return res.status(500).send('Error on the server.' + " " + err);
        if (!allPosts) return res.status(404).send('No posts found.' + " " + err);
        res.status(200).json(allPosts);
    });
});

//ДОБАВЛЯЕМ НОВЫЙ ПОСТ
router.post('/dataBase.js', authenticateJWT, postValidate, function(req, res) {
    //валидация поста
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }
    userID = +req.body.id; //id из строки запроса
    tokenID = req.tokenID; //id из сохраненного токена 

    posts.add_post_DB([
        req.body.date,
        req.body.postText,
        userID,
        tokenID
    ], (err, post) => {
        if (err) return res.status(500).send('Error on the server' + " " + err);

        const postID = post.insertId
            //возвращаем обновленный пост с информацие по автору поста
        posts.load_one_post_DB(postID, (err, post) => {
            if (err) return res.status(500).send("Ошибка на сервере." + " " + err);
            res.status(200).send(
                post
            );
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
        console.log("ok")
        posts.remove_post_DB(req.body.postID, (err) => {
            if (err) return res.status(500).send('Error on the server' + " " + err);
            res.status(200);
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

    if (userID === tokenID) {
        //допустимые форматы
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

        //проверка на наличие файла
        if (!req.files) {
            return res.status(500).send("Файлы не отправлены")
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
                            // console.log(info);
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
                arrayPhotos.push([updateName, tokenID]);
            }
        }
        //загрузка в БД
        photos.add_photo_DB(arrayPhotos, (err) => {
            if (err) return res.status(500).send('Error on the server' + " " + err);
        })
        res.status(200).send("Фото успешно загрузились на сервер");
    }
});

//ПОЛУЧАЕМ ФОТОГРАФИИ ИЗ БАЗЫ ДАННЫХ
router.get('/upload_all_photo', authenticateJWT, function(req, res) {

    tokenID = req.tokenID; //id из сохраненного токена 

    if (tokenID) {

        photos.load_all_photos_DB([
            req.query.id,
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

        photos.remove_photo([
            req.query.idPhoto,
            tokenID,
        ], (err) => {
            if (err) return res.status(500).send('Ошибка на сервере. Фотография не удалилась' + " " + err);

            res.status(200).send("Фотография удалена");;
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

//ДОБАВЛЕНИЕ СООБЩЕНИЯ В БАЗУ ДАННЫХ
router.post('/user_message', authenticateJWT, messageValidate, function(req, res) {
    //валидация сообщения
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    tokenID = req.tokenID //кто пишет 
    destinationID = req.body.destinationID //кому мы пишем

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
                        req.body.date
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
                        res.status(200).send("Сообщение добавлено в базу данных");
                    })
                })
        })
    }
})

//  ПОЛУЧЕНИЕ ВСЕХ ДИАЛОГОВ С ДРУГИМИ ПОЛЬЗОВАТЕЛЯМИ
router.get('/user_dialogs', authenticateJWT, function(req, res) {

    tokenID = req.tokenID //id из сохраненного токена   

    // Вывод диалогов пользователя
    messages.get_all_conversation_DB(tokenID, (err, dialogs) => {
        if (err) return res.status(500).send('При получении диалогов из БД произошла ошибка:' + ' ' + err);
        return res.status(200).send(dialogs)
    })
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
                return res.status(200).send("Переписка с данным пользователем отстутствует");
            } else {
                //возвращаем переписку из БД
                messages.get_messages_user_DB([
                    row_conversation[0].id,
                    tokenID,
                    tokenID
                ], (err, messages_user) => {
                    if (err) return res.status(500).send('При получении сообщений из БД произошла ошибка:' + ' ' + err);

                    if (messages_user.length === 0) {
                        return res.status(200).send("Переписка с данным пользователем отстутствует");
                    }

                    if (row_conversation[0].unread !== 0) {

                        // Обновляем флаг просмотров сообщений
                        messages.update_flag_unread_messages([
                            row_conversation[0].id,
                            tokenID
                        ], (err) => {
                            if (err) return res.status(500).send('При обновлении флага в таблице сообщений произошла ошибка:' + ' ' + err);

                            //обновляем флаг с непросчитанными сообщениями в таблице диалогов
                            messages.update_flag_unread_conersation([
                                row_conversation[0].id,
                                tokenID,
                                row_conversation[0].id
                            ], (err) => {
                                if (err) return res.status(500).send('При обновлении флага в таблице диалогов произошла ошибка:' + ' ' + err);
                            })
                        })
                    }
                    return res.status(200).send(messages_user)
                })

            }

        })
    }
})

//УДАЛЕНИЕ СООБЩЕНИЕ В ПЕРЕПИСКЕ
router.delete('/user_messages', authenticateJWT, function(req, res) {

    tokenID = req.tokenID //id из сохраненного токена
        // userID = +req.body.userID; //id пользователя с которым ведется переписка

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
            console.log(message)
            messages.update_message_flag_delete([
                tokenID,
                tokenID,
                req.body.deleteID
            ], (err) => {
                if (err) return res.status(500).send("Сообщение небыло удалено" + " " + err);

                return res.status(200).send("Сообщение удалено")
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

                    return res.status(200).send("Диалог был удален");
                })
            })
        }
    })
})



app.use(router)

let port = process.env.PORT || 8000;
app.listen(port, function() {
    console.log('Express server listening on port ' + port)
});