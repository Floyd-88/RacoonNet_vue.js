const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const fs = require('fs')
    // const multer = require('multer')
    // const path = require('path')
const fileUpload = require('express-fileupload');
const {
    validationResult
} = require('express-validator');

//подключаем серкретный ключ для токена
const tokenKey = require('./tokenKey');

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


app.use(express.static('public'));
app.use(fileUpload());





// let storage = multer.diskStorage({
//     destination: (req, file, callBack) => {
//         callBack(null, './public/images/') // './public/images/' directory name where save the file
//     },
//     filename: (req, file, callBack) => {
//         callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
//     }
// })

// var upload = multer({
//     storage: storage
// });




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

        let passwordIsValid = bcrypt.compareSync(req.body.password, user.user_pass);
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

        //удаление всех фотографий пользователя
        req.body.allPhoto.forEach((photo) => {
            fs.unlink(`../src/assets/photo/${photo.photo_name}`, (err) => {
                if (err) return res.status(500).send('Фотография не найдена, возможно она уже удалена ранее');
            });
        })

        //удаление пользователя
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
        req.body.name,
        req.body.surname,
        req.body.date,
        req.body.postText,
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


//загружаем фото в БД
router.post('/upload_photo', (req, res) => {
    //допустимые форматы
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

    //проверка на наличией файла
    if (!req.files) {
        return res.status(500).send("Файлы не отправлены")
    }
    //обновление аватарки
    if (req.body.flag === "ava") {

        const myFile = req.files['files[0]'];

        // console.log(req.files['files[0]'].size)

        //проверка загруженных файлов
        if (!allowedTypes.includes(myFile.mimetype)) {
            return res.status(422).send('Формат выбранного файла не поддерживается');
        }
        if (myFile.size > 10000000) {
            return res.status(422).send('Размер фотографии слишком большой');
        }
        //загрузка в папку на сервере
        let updateName = Date.now() + myFile.name.toLowerCase();
        myFile.mv(`../src/assets/photo/${updateName}`,
            function(err) {
                if (err) {
                    console.log(err)
                    return res.status(500).send("Ошибка при загрузке файлов");
                }
            }
        );
        authorization.updateAva([updateName, req.body.id], (err) => {
            if (err) return res.status(500).send('Аватар пользователь не сменился');

            authorization.selectByEmail(req.body.email, (err, user) => {
                if (err) return res.status(500).send("Ошибка на сервере.");
                res.status(200).send({
                    // auth: true,
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
    } else if (req.body.flag === "photos") {

        //переберем массив фотографий
        for (let file in req.files) {
            const myFile = req.files[file];

            //проверка загруженных файлов
            if (!allowedTypes.includes(myFile.mimetype)) {
                return res.status(422).send('Формат выбранного файла не поддерживается');
            }
            if (myFile.size > 10000000) {
                return res.status(422).send('Размер фотографии слишком большой');
            }
            //загрузка в папку на сервере
            let updateName = Date.now() + myFile.name.toLowerCase();
            myFile.mv(`../src/assets/photo/${updateName}`,
                function(err) {
                    if (err) {
                        console.log(err)
                        return res.status(500).send("Ошибка при загрузке файлов");
                    }
                }
            );
            //загрузка в БД
            photos.add_photo_DB([updateName, req.body.id], (err) => {
                if (err) return res.status(500).send('Error on the server.');
            })
        }
        res.status(200).send("Фото успешно загрузились на сервер");
    }
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



app.use(router)

let port = process.env.PORT || 8000;
app.listen(port, function() {
    console.log('Express server listening on port ' + port)
});