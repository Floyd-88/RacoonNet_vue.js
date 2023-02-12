const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const fs = require('fs')
    // const multer = require('multer')
    // const path = require('path')
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
const PostsDB = require('./DB/PostsDB');
const PhotosDB = require('./DB/PhotosDB');

//создаем объекты на основе экземпляров классов
const authorization = new AuthorizationUserDB();
const posts = new PostsDB();
const photos = new PhotosDB();

//подключаем массивы с валидацией
const loginValidate = require('./validate/loginValidate')
const registerValidate = require('./validate/registerValidate')
const postValidate = require('./validate/postValidate')
const updateUserValidate = require('./validate/updateUserValidate')
const passwordValidate = require('./validate/passwordValidate')
const passwordDelValidate = require('./validate/passwordDelValidate');

// const {name} = require('file-loader');


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

// регистрируем обычного пользователя
router.post('/register', registerValidate, function(req, res) {
    //валидайия полей
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
                    ava: user.ava,
                    name: user.name,
                    email: user.email,
                    surname: user.surname,
                    year_user: user.year_user,
                    month_user: user.month_user,
                    day_user: user.day_user,
                    selectedGender: user.selectedGender,
                    country: user.country,
                    city: user.city,
                    is_admin: user.is_admin
                }
            });
        });
    });
});

//регистрируем пользователя с правми администротора
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
                    ava: user.ava,
                    name: user.name,
                    email: user.email,
                    surname: user.surname,
                    year_user: user.year_user,
                    month_user: user.month_user,
                    day_user: user.day_user,
                    selectedGender: user.selectedGender,
                    country: user.country,
                    city: user.city,
                    is_admin: user.is_admin
                }
            });
        });
    });
});

//авторизуем пользователя при вводе логина и пароля
router.post('/login', loginValidate, function(req, res) {
    //валидация введенных данных
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors)
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
            err: 'Пароль не действителен'
        });

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
                ava: user.ava,
                name: user.name,
                email: user.email,
                surname: user.surname,
                year_user: user.year_user,
                month_user: user.month_user,
                day_user: user.day_user,
                selectedGender: user.selectedGender,
                country: user.country,
                city: user.city,
                is_admin: user.is_admin
            }
        });
    });
})



//подгружаем данные пользователя
router.post('/load_user', authenticateJWT, function(req, res) {
    // console.log(req.body)
    userID = +req.body.id; //id из строки запроса
    tokenID = req.tokenID; //id из сохраненного токена 
    console.log(userID)
    console.log(tokenID)

    if (userID === tokenID) {
        console.log("ok")

        authorization.loadUser(userID, (err, user) => {
            if (err) return res.status(500).send('Ошибка на сервере.');
            if (!user) return res.status(404).send({
                err: 'Такого пользователя не существует'
            });
            res.status(200).send({
                user: {
                    userID: user.userID,
                    ava: user.ava,
                    name: user.name,
                    email: user.email,
                    surname: user.surname,
                    year_user: user.year_user,
                    month_user: user.month_user,
                    day_user: user.day_user,
                    selectedGender: user.selectedGender,
                    country: user.country,
                    city: user.city,
                    is_admin: user.is_admin
                }
            });
        });
    } else {
        console.log("not")
        authorization.loadUser(userID, (err, user) => {
            if (err) return res.status(500).send('Ошибка на сервере.');
            if (!user) return res.status(404).send({
                err: 'Такого пользователя не существует'
            });
            res.status(200).send({
                user: {
                    userID: user.userID,
                    ava: user.ava,
                    name: user.name,
                    // email: user.email,
                    surname: user.surname,
                    year_user: user.year_user,
                    month_user: user.month_user,
                    day_user: user.day_user,
                    selectedGender: user.selectedGender,
                    country: user.country,
                    city: user.city,
                    // is_admin: user.is_admin
                }
            });
        });
    }
})


//редактирование профиля пользователя
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
            if (err) return res.status(500).send("При изменении данных пользователя возникли проблемы");

            //обновление имени и фамилии пользователя в постах при редактировании профиля
            // posts.updateTitlePosts([req.body.name, req.body.surname, req.body.id], (err) => {
            //     if (err) return res.status(500).send("Ошибка при обновдении title в постах.");

            //получение данных о пользователе после обновления
            authorization.loadUser(req.body.id, (err, user) => {
                    if (err) return res.status(500).send("Ошибка на сервере." + " " + err);
                    res.status(200).send({
                        user
                    });
                })
                // });
        });
    }
})

//изменение старого пароля
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
                    req.body.id
                ],
                (err) => {
                    if (err) return res.status(500).send("При изменении пароля возникли проблемы");

                    res.status(200).send("Пароль успешно обновлен");
                })

        })
    }
})



//удаление профиля пользователя
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

        authorization.selectByEmail(req.body.email, (err, user) => {
            if (err) return res.status(500).send("Ошибка на сервере");

            let passwordIsValid = bcrypt.compareSync(req.body.password, user.user_pass);
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
            authorization.deleteUserDB([req.body.id], (err) => {
                if (err) return res.status(500).send("При удалении пользователя возникли проблемы");
                res.status(200).send("Пользователь успешно удален");
            })
        })
    }
})

//подгружаем посты пользователя при посещении 'Моей страницы'
router.get('/dataBase.js', authenticateJWT, function(req, res) {
    posts.load_posts_DB([
        req.query.userID,
        req.query._count,
        req.query._limit
    ], (err, allPosts) => {
        console.log(err)
        if (err) return res.status(500).send('Error on the server.');
        if (!allPosts) return res.status(404).send('No posts found.');
        res.json(allPosts);
        res.status(200);
    });
});

//добавляем новый пост
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
        req.body.id,
        req.tokenID
    ], (err, post) => {
        if (err) return res.status(500).send('Error on the server.');
        console.log(post)
        const postID = post.insertId
        authorization.loadUser(tokenID, (err, user) => {
            res.status(200).send({
                user: {
                    postID: postID,
                    userID: user.userID,
                    ava: user.ava,
                    name: user.name,
                    surname: user.surname,
                }
            });
        });
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

//загружаем аватарку
router.post('/upload_ava', (req, res) => {

    //удаление аватарки из папки на сервере при обновлении
    if (req.body.nameAva !== "ava_1.jpg") {
        fs.unlink(`../src/assets/photo/${req.body.nameAva}`, (err) => {
            if (err) console.log(err)
        });
    }

    let imgData = req.body.img // получаем файл в формате base64
    let base64Data = imgData.split(",")[1]; // оставляем непосредственно само закодированное изображение
    let nameImg = Date.now() + "ava.jpg"; //создаем имя фотографии

    let imgBuffer = Buffer.from(base64Data, 'base64'); //сохраняем изображение в буфер

    //записываем в папку на сервер изображение сконвертированное из base64
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

    // require("fs").writeFile("../src/assets/photo/" + nameImg, base64Data, 'base64',
    //     function(err) {
    //         if (err) {
    //             return res.status(422).send('Изображение не смогло конвертироваться из base64');
    //         }
    //     })

    let arrayPhotos = [];
    arrayPhotos.push(nameImg, req.body.userId);

    //добавление картинки в таблицу Users
    authorization.updateAva(arrayPhotos, (err) => {
        if (err) return res.status(500).send('Аватар пользователь не сменился');

        //получение обновленного профиля после загрузки аватарки
        authorization.selectByEmail(req.body.email, (err, user) => {
            if (err) return res.status(500).send("Не удалось получить фотографии с сервера");
            res.status(200).send({
                user: {
                    userID: user.userID,
                    ava: user.ava,
                    name: user.name,
                    email: user.email,
                    surname: user.surname,
                    year_user: user.year_user,
                    month_user: user.month_user,
                    day_user: user.day_user,
                    selectedGender: user.selectedGender,
                    country: user.country,
                    city: user.city,
                    is_admin: user.is_admin
                }
            });
        })
    });
});


//загружаем фотографии в БД
router.post('/upload_photo', (req, res) => {
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
            arrayPhotos.push([updateName, req.body.id]);
        }
    }
    //загрузка в БД
    photos.add_photo_DB(arrayPhotos, (err) => {
        if (err) return res.status(500).send('Error on the server.');
    })
    res.status(200).send("Фото успешно загрузились на сервер");
});


//получаем все фотографии
router.get('/upload_all_photo', function(req, res) {
    photos.load_all_photos_DB([
        req.query.userID,
    ], (err, allPhotos) => {
        if (err) return res.status(500).send('Ошибка на сервере. Фото не загрузились');
        if (!allPhotos) return res.status(404).send('Фотографии не найдены');

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
})

//удаление фотографии
router.delete('/remove_photo', function(req, res) {
    fs.unlink(`../src/assets/photo/${req.query.namePhoto}`, (err) => {
        if (err) return res.status(500).send('Фотография не найдена, возможно она уже удалена ранее');;
        console.log('Deleted');
    });

    photos.remove_photo([
        req.query.id,
        req.query.userID,
    ], (err) => {
        if (err) return res.status(500).send('Ошибка на сервере. Фотография не удалилась');

        res.status(200).send("Фотография удалена");;
    })
})

//удаление аватарки
router.put('/remove_ava_photo', function(req, res) {

    //удаление аватарки из папки на сервере
    fs.unlink(`../src/assets/photo/${req.body.nameAva}`, (err) => {
        if (err) console.log(err)
    });

    authorization.updateAva([
        "ava_1.jpg",
        req.body.userID
    ], (err) => {
        if (err) return res.status(500).send('Ошибка на сервере. Аватарка не удалилась');

        //получение обновленного профиля после удаления аватарки
        authorization.selectByEmail(req.body.email, (err, user) => {
            if (err) return res.status(500).send("Не удалось получить фотографии с сервера");
            res.status(200).send({
                user: {
                    userID: user.userID,
                    ava: user.ava,
                    name: user.name,
                    email: user.email,
                    surname: user.surname,
                    year_user: user.year_user,
                    month_user: user.month_user,
                    day_user: user.day_user,
                    selectedGender: user.selectedGender,
                    country: user.country,
                    city: user.city,
                    is_admin: user.is_admin
                }
            });
        })
    })
})



app.use(router)

let port = process.env.PORT || 8000;
app.listen(port, function() {
    console.log('Express server listening on port ' + port)
});