"use strict";

var express = require('express');

var bcrypt = require('bcrypt');

var bodyParser = require('body-parser');

var fs = require('fs');

var fileUpload = require('express-fileupload');

var sharp = require('sharp');

var _require = require('express-validator'),
    validationResult = _require.validationResult; //отправка сообщений на почту


var mailer = require('./nodemailer');

var randtoken = require('rand-token'); //используем токен JWT


var jwt = require('jsonwebtoken');

var tokenKey = require('./tokenKey');

var authenticateJWT = require('./authenticateJWT'); //подключаем экземпляры классов


var AuthorizationUserDB = require('./DB/AuthorizationUserDB');

var authorization = new AuthorizationUserDB();

var PostsDB = require('./DB/PostsDB');

var posts = new PostsDB();

var PhotosDB = require('./DB/PhotosDB');

var photos = new PhotosDB();

var MessagesDB = require('./DB/MessagesDB');

var messages = new MessagesDB();

var FriendsDB = require('./DB/FriendsDB');

var friends = new FriendsDB();

var CommentsPostDB = require('./DB/CommentsPostDB');

var commentsPost = new CommentsPostDB();

var CommentsPhotoDB = require('./DB/CommentsPhotoDB');

var commentsPhoto = new CommentsPhotoDB();

var FeedBackDB = require('./DB/FeedBackDB');

var feedBack = new FeedBackDB();

var NoticeDB = require('./DB/NoticeDB');

var notice = new NoticeDB(); //подключаем массивы с валидацией

var loginValidate = require('./validate/loginValidate');

var registerValidate = require('./validate/registerValidate');

var postValidate = require('./validate/postValidate');

var updateUserValidate = require('./validate/updateUserValidate');

var passwordValidate = require('./validate/passwordValidate');

var passwordDelValidate = require('./validate/passwordDelValidate');

var messageValidate = require('./validate/messageValidate');

var feedBackUser = require('./validate/feedBackUser');

var searchNewFriendsValidate = require('./validate/searchNewFriendsValidate');

var _require2 = require('path'),
    resolve = _require2.resolve;

var app = express();

var http = require('http').createServer(app);

var router = express.Router();
router.use(bodyParser.urlencoded({
  extended: false
}));
router.use(bodyParser.json()); //прослушивание событий

var io = require('socket.io')(http, {
  cors: {
    origins: ['http://localhost:8080']
  }
}); // CORS middleware


var allowCrossDomain = function allowCrossDomain(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
};

app.use(allowCrossDomain);
app.use(express["static"]('public'));
app.use(fileUpload());
app.use(bodyParser.json({
  limit: '200mb'
}));
app.use(bodyParser.urlencoded({
  limit: '200mb',
  extended: true
})); // РЕГЕСТРИРУЕМ ПРОСТОГО ПОЛЬЗОВАТЕЛЯ

router.post('/register', registerValidate, function (req, res) {
  //валидация полей
  var errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array()
    });
  }

  if (!req.body.name || !req.body.surname || !req.body.email || !req.body.password || !req.body.year || !req.body.month || !req.body.day || !req.body.selectedGender || !req.body.country || !req.body.city) {
    return res.status(500).send("При регистрации пользователя возникли проблемы(заполните все требуемые поля)");
  }

  authorization.insert([req.body.name, req.body.surname, req.body.email, bcrypt.hashSync(req.body.password, 8), req.body.year, req.body.month, req.body.day, req.body.selectedGender, req.body.country, req.body.city], function (err) {
    if (err !== null) {
      if (err.errno == 1062) return res.status(500).send("Пользователь с такой почтой уже зарегистрирован");
    }

    if (err) return res.status(500).send("При регистрации пользователя возникли проблемы." + " " + err); //отправляем сообщение с логином и паролем на почту юзера 

    var message = {
      to: req.body.email,
      subject: 'Congratulations! You are successfully registred on our site',
      html: "\n                <h2>\u041F\u043E\u0437\u0434\u0440\u0430\u0432\u043B\u044F\u0435\u043C, \u0412\u044B \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0437\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u043B\u0438\u0441\u044C \u0432 \u0441\u043E\u0446\u0438\u0430\u043B\u044C\u043D\u043E\u0439 \u0441\u0435\u0442\u0438 RaccoonNet!</h2>  \n                <i>\u0434\u0430\u043D\u043D\u044B\u0435 \u0432\u0430\u0448\u0435\u0439 \u0443\u0447\u0435\u0442\u043D\u043E\u0439 \u0437\u0430\u043F\u0438\u0441\u0438:</i>\n                <ul>\n                    <li>login: ".concat(req.body.email, "</li>\n                    <li>password: ").concat(req.body.password, "</li>\n                </ul>\n                <p>\u0414\u0430\u043D\u043D\u043E\u0435 \u043F\u0438\u0441\u044C\u043C\u043E \u043D\u0435 \u0442\u0440\u0435\u0431\u0443\u0435\u0442 \u043E\u0442\u0432\u0435\u0442\u0430.<p>")
    };
    mailer(message); //после регистрации происходит автоматическая авторизация пользователя

    authorization.selectByEmail(req.body.email, function (err, user) {
      if (err) return res.status(500).send("Ошибка на сервере." + " " + err); //создаем токен для защиты своих данных

      var token = jwt.sign({
        name: user.name,
        id: user.userID
      }, tokenKey.secret, {
        expiresIn: 60 * 60
      });
      var refreshToken = jwt.sign({
        name: user.name,
        id: user.userID
      }, tokenKey.refreshTokenSecret);
      tokenKey.refreshTokens.push(refreshToken);
      res.status(200).send({
        auth: true,
        token: token,
        refreshToken: refreshToken,
        user: {
          userID: user.userID,
          // name: user.name,
          // surname: user.surname,
          is_admin: user.is_admin // ava: user.ava,
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
}); //РЕГЕСТРИРУЕМ ПОЛЬЗОВАТЕЛЯ С ПРАВАМИ АДМИНИСТРАТОРА

router.post('/register-admin', registerValidate, function (req, res) {
  //валидация полей
  var errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array()
    });
  }

  if (!req.body.name || !req.body.surname || !req.body.email || !req.body.password || !req.body.year || !req.body.month || !req.body.day || !req.body.selectedGender || !req.body.country || !req.body.city || !req.body.is_admin) {
    return res.status(500).send("При регистрации пользователя возникли проблемы(заполните все требуемые поля)");
  }

  ;
  authorization.insertAdmin([req.body.name, req.body.surname, req.body.email, bcrypt.hashSync(req.body.password, 8), req.body.year, req.body.month, req.body.day, req.body.selectedGender, req.body.country, req.body.city, req.body.is_admin], function (err) {
    if (err !== null) {
      if (err.errno == 1062) return res.status(500).send("Пользователь с такой почтой уже зарегистрирован");
    }

    if (err) return res.status(500).send("При регистрации пользователя возникли проблемы." + " " + err); //отправляем сообщение с логином и паролем на почту юзера 

    var message = {
      to: req.body.email,
      subject: 'Congratulations! You are successfully registred on our site',
      html: "\n                <h2>\u041F\u043E\u0437\u0434\u0440\u0430\u0432\u043B\u044F\u0435\u043C, \u0412\u044B \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0437\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u043B\u0438\u0441\u044C \u0432 \u0441\u043E\u0446\u0438\u0430\u043B\u044C\u043D\u043E\u0439 \u0441\u0435\u0442\u0438 RaccoonNet!</h2>  \n                <i>\u0434\u0430\u043D\u043D\u044B\u0435 \u0432\u0430\u0448\u0435\u0439 \u0443\u0447\u0435\u0442\u043D\u043E\u0439 \u0437\u0430\u043F\u0438\u0441\u0438:</i>\n                <ul>\n                    <li>login: ".concat(req.body.email, "</li>\n                    <li>password: ").concat(req.body.password, "</li>\n                </ul>\n                <p>\u0414\u0430\u043D\u043D\u043E\u0435 \u043F\u0438\u0441\u044C\u043C\u043E \u043D\u0435 \u0442\u0440\u0435\u0431\u0443\u0435\u0442 \u043E\u0442\u0432\u0435\u0442\u0430.<p>")
    };
    mailer(message); //после регистрации происходит автоматическая авторизация пользователя

    authorization.selectByEmail(req.body.email, function (err, user) {
      if (err) return res.status(500).send("Ошибка на сервере." + " " + err); //создаем токен для защиты своих данных

      var token = jwt.sign({
        name: user.name,
        id: user.userID
      }, tokenKey.secret, {
        expiresIn: 60 * 5
      });
      var refreshToken = jwt.sign({
        name: user.name,
        id: user.userID
      }, tokenKey.refreshTokenSecret);
      tokenKey.refreshTokens.push(refreshToken);
      res.status(200).send({
        auth: true,
        token: token,
        refreshToken: refreshToken,
        user: {
          userID: user.userID,
          // name: user.name,
          // surname: user.surname,
          is_admin: user.is_admin // ava: user.ava,
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
}); //АВТОРИЗУЕМ ПОЛЬЗОВАТЕЛЯ ПРИ ВВОДЕ ЛОГИНА И ПАРОЛЯ

router.post('/login', loginValidate, function (req, res) {
  //валидация введенных данных
  var errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array()
    });
  } //проверка на существование пользователя


  authorization.selectByEmail(req.body.email, function (err, user) {
    if (err) return res.status(500).send('Ошибка на сервере.' + " " + err);
    if (!user) return res.status(404).send({
      err: 'Такого пользователя не существует'
    }); //проверка пароля

    var passwordIsValid = bcrypt.compareSync(req.body.password, user.user_pass);
    if (!passwordIsValid) return res.status(401).send({
      auth: false,
      token: null,
      refreshToken: null,
      err: 'Вы указали не правильный пароль'
    }); //создаем токен для защиты своих данных

    var token = jwt.sign({
      name: user.name,
      id: user.userID
    }, tokenKey.secret, {
      expiresIn: 60 * 5 //срок действия токена

    });
    var refreshToken = jwt.sign({
      name: user.name,
      id: user.userID
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
}); //УДАЛЕНИЕ РЕФРЭШ-ТОКЕНА ПРИ ПРИ ВЫХОДЕ ИЗ ПРОФИЛЯ

router.post('/del_refresh_token', function (req, res) {
  var refresh = req.body.refreshToken;
  if (!refresh) return res.status(400).send("refresh-token не найден");

  if (tokenKey.refreshTokens.includes(refresh)) {
    tokenKey.refreshTokens = tokenKey.refreshTokens.filter(function (token) {
      return refresh !== token;
    });
    return res.status(200).send("refresh-token удален");
  } else {
    if (!refresh) return res.status(400).send("refresh-token не найден");
  }
}); //ОБНОВЛЕНИЕ ТОКЕНА ПРИ ИСТЕЧЕНИИ СРОКА

router.post('/refresh', function (req, res) {
  var refresh = req.body.refreshToken;
  if (!refresh) return res.status(400).send("refresh-token не найден");

  if (tokenKey.refreshTokens.includes(refresh)) {
    jwt.verify(refresh, tokenKey.refreshTokenSecret, function (err, user) {
      if (err) {
        console.log(err);
        return res.status(400).send("Неверный refresh-token");
      }

      var token = jwt.sign({
        name: user.name,
        id: user.id
      }, tokenKey.secret, {
        expiresIn: 60 * 60
      });
      res.json({
        token: token
      });
    });
  } else {
    return res.status(400).send("refresh-token не найден");
  }
}); //ПОДГРУЗКА ДАННЫХ ПОЛЬЗОВАТЕЛЯ ПРИ ПОСЕЩЕНИИ ЕГО СТРАНИЦЫ

router.post('/load_user', authenticateJWT, function (req, res) {
  userID = +req.body.id; //id из строки запроса

  tokenID = req.tokenID; //id из сохраненного токена 
  //если пользователь авторизован

  if (tokenID) {
    //если пользователь заходит на свою страницу - отображать кнопку редактирования профиля, загрузки фото и авы
    var is_editProfile = false;

    if (userID === tokenID) {
      is_editProfile = true;
    } //возвращаем данные о пользователе


    authorization.loadUser(userID, function (err, user) {
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
          "delete": user.delete_user,
          enterUser: tokenID //давать возможность редактироват и удалять посты если ты их автор

        }
      });
    });
  } else {
    authorization.loadUser(userID, function (err, user) {
      if (err) return res.status(500).send('Ошибка на сервере.' + " " + err);
      if (!user) return res.status(404).send('Такого пользователя не существует');
      res.status(200).send({
        user: {
          ava: user.ava,
          name: user.name,
          surname: user.surname,
          country: user.country,
          city: user.city,
          "delete": user.delete_user
        }
      });
    });
  }
}); //РЕДАКТИРОВАНИЕ ПРОФИЛЯ ПОЛЬЗОВОТЕЛЯ

router.put('/editProfile', authenticateJWT, updateUserValidate, function (req, res) {
  userID = +req.body.id; //id из строки запроса

  tokenID = req.tokenID; //id из сохраненного токена 

  if (userID === tokenID) {
    //валидация заполнения полей
    var errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array()
      });
    } //обновление информации о пользователе


    authorization.updateUser([req.body.name, req.body.surname, req.body.email, req.body.year, req.body.month, req.body.day, req.body.selectedGender, req.body.country, req.body.city, req.body.id], function (err) {
      //проверка по email о дублировании пользователя
      if (err !== null) {
        if (err.errno == 1062) return res.status(500).send("Пользователь с такой почтой уже зарегистрирован");
      }

      if (err) return res.status(500).send("При изменении данных пользователя возникли проблемы" + " " + err); //отправляем сообщение с логином на новую почту если юзер ее поменял 

      if (req.body.email) {
        var message = {
          to: req.body.email,
          subject: 'You have changed your mail',
          html: "\n                        <h2>\u0412\u044B \u0438\u0437\u043C\u0435\u043D\u0438\u043B\u0438 \u0430\u0434\u0440\u0435\u0441 \u0441\u0432\u043E\u0435\u0439 \u044D\u043B\u0435\u043A\u0442\u0440\u043E\u043D\u043D\u043E\u0439 \u043F\u043E\u0447\u0442\u044B!</h2>  \n                        <i>\u0434\u0430\u043D\u043D\u044B\u0435 \u0432\u0430\u0448\u0435\u0439 \u0443\u0447\u0435\u0442\u043D\u043E\u0439 \u0437\u0430\u043F\u0438\u0441\u0438 \u0431\u044B\u043B\u0438 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u044B:</i>\n                        <ul>\n                            <li>login: ".concat(req.body.email, "</li>\n                        </ul>\n                        <p>\u0414\u0430\u043D\u043D\u043E\u0435 \u043F\u0438\u0441\u044C\u043C\u043E \u043D\u0435 \u0442\u0440\u0435\u0431\u0443\u0435\u0442 \u043E\u0442\u0432\u0435\u0442\u0430.<p>")
        };
        mailer(message);
      } //обновление имени и фамилии пользователя в постах при редактировании профиля
      // posts.updateTitlePosts([req.body.name, req.body.surname, req.body.id], (err) => {
      //     if (err) return res.status(500).send("Ошибка при обновдении title в постах.");
      //получение данных о пользователе после обновления


      authorization.loadUser(tokenID, function (err, user) {
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
            city: user.city
          }
        });
      }); // });
    });
  }
}); //ИЗМЕНЕНИЕ ПАРОЛЯ

router.put('/password', authenticateJWT, passwordValidate, function (req, res) {
  userID = +req.body.id; //id из строки запроса

  tokenID = req.tokenID; //id из сохраненного токена 

  if (userID === tokenID) {
    //валидация полей
    var errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log(errors);
      return res.status(422).json({
        errors: errors.array()
      });
    } //проверка старого пароля


    if (!req.body.old_password) return res.status(500).send("Поле со старым паролем не заполнено");
    authorization.getPassword(tokenID, function (err, password) {
      if (err) return res.status(500).send("Ошибка на сервере" + " " + err);
      var passwordIsValid = bcrypt.compareSync(req.body.old_password, password.user_pass);
      if (!passwordIsValid) return res.status(401).send({
        err: 'Пароль не действителен'
      });
      if (!req.body.new_password) return res.status(500).send("Поле с новым паролем не заполнено"); //обновление старого пароля

      authorization.updateUserPassword([bcrypt.hashSync(req.body.new_password, 8), tokenID], function (err) {
        if (err) return res.status(500).send("При изменении пароля возникли проблемы" + " " + err); //получение почты пользователя

        authorization.loadUserEmail(tokenID, function (err, user) {
          if (err) return res.status(500).send('Ошибка на сервере.' + " " + err); // отправляем сообщение на новую почту если юзер поменял пароль 

          var message = {
            to: user.email,
            subject: 'You have changed your password',
            html: "\n                            <h2>\u0412\u044B \u0438\u0437\u043C\u0435\u043D\u0438\u043B\u0438 \u043F\u0430\u0440\u043E\u043B\u044C \u0441\u0432\u043E\u0435\u0439 \u0443\u0447\u0435\u0442\u043D\u043E\u0439 \u0437\u0430\u043F\u0438\u0441\u0438 \u043D\u0430 \u0441\u0430\u0439\u0442\u0435 raccoonnet.ru!</h2>  \n                            <i>\u0415\u0441\u043B\u0438 \u0432\u044B \u044D\u0442\u043E\u0433\u043E \u043D\u0435 \u0434\u0435\u043B\u0430\u043B\u0438, \u043E\u0431\u0440\u0430\u0442\u0438\u0442\u0435\u0441\u044C \u0432 \u0441\u043B\u0443\u0436\u0431\u0443 \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u043A\u0438</i>\n                            <p>\u0414\u0430\u043D\u043D\u043E\u0435 \u043F\u0438\u0441\u044C\u043C\u043E \u043D\u0435 \u0442\u0440\u0435\u0431\u0443\u0435\u0442 \u043E\u0442\u0432\u0435\u0442\u0430.<p>"
          };
          mailer(message);
          res.status(200).send("Пароль успешно обновлен");
        });
      });
    });
  }
}); //УДАЛЕНИЕ ПРОФИЛЯ ПОЛЬЗОВАТЕЛЯ

router["delete"]('/delete_user', authenticateJWT, passwordDelValidate, function (req, res) {
  userID = +req.body.id; //id из строки запроса

  tokenID = req.tokenID; //id из сохраненного токена 

  if (userID === tokenID) {
    //валидация полей
    var errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array()
      });
    }

    if (!req.body.password) return res.status(500).send("Поле с паролем не заполнено"); //проверка старого пароля

    authorization.getPassword(tokenID, function (err, password) {
      if (err) return res.status(500).send("Ошибка на сервере" + " " + err);
      var passwordIsValid = bcrypt.compareSync(req.body.password, password.user_pass);
      if (!passwordIsValid) return res.status(401).send({
        err: 'Пароль не действителен'
      }); //удаление всех фотографий пользователя

      req.body.allPhoto.forEach(function (photo) {
        fs.unlink("../src/assets/photo/".concat(photo.photo_name), function (err) {
          if (err) console.log(err);
        });
      }); //удаление аватарки из папки на сервере

      fs.unlink("../src/assets/photo/".concat(req.body.nameAva), function (err) {
        if (err) console.log(err);
      }); // удаление пользователя из друзей у других пользователей

      friends.delete_user_friends_DB([tokenID, tokenID], function (err) {
        if (err) return res.status(500).send("При удалении пользователя из друзей, произошла ошибка" + " " + err); //удаление фотографий пользователя

        photos.remove_all_photos([tokenID], function (err) {
          if (err) return res.status(500).send('Ошибка на сервере. Фотография не удалилась' + " " + err); //удаление постов пользователя на его странице

          posts.remove_all_posts_DB(tokenID, function (err) {
            if (err) return res.status(500).send('Error on the server' + " " + err);
          }); //обновляем флаги удаления сообщений у пользователей

          messages.update_all_messages_flag_delete([tokenID, tokenID], function (err) {
            if (err) return res.status(500).send("Сообщениея в диалоге небыли удалены" + " " + err); //обновляем флаги удаления диалога у пользователя

            messages.update_all_conversation_flag_delete([tokenID, tokenID], function (err) {
              if (err) return res.status(500).send("Диалог небыл удален" + " " + err); //удаление данных пользователя

              authorization.deleteUserDB([tokenID], function (err) {
                if (err) return res.status(500).send("При удалении пользователя возникли проблемы" + " " + err);
                res.status(200).send("Пользователь успешно удален");
              });
            });
          });
        });
      }); //удаление пользователя
      // authorization.deleteUserDB([tokenID], (err) => {
      //     if (err) return res.status(500).send("При удалении пользователя возникли проблемы" + " " + err);
      //     res.status(200).send("Пользователь успешно удален");
      // })
    });
  }
}); //ПОДГРУЗКА ПОСТОВ ПОЛЬЗОВАТЕЛЯ ИЗ БАЗЫ ДАННЫХ

router.get('/dataBase.js', authenticateJWT, function (req, res) {
  tokenID = req.tokenID; //id из сохраненного токена 

  posts.load_posts_DB([tokenID, req.query.userID, req.query._count, req.query._limit], function (err, allPosts) {
    if (err) return res.status(500).send('Error on the server.' + " " + err);
    if (!allPosts) return res.status(404).send('No posts found.' + " " + err); // commentsPost.load_comments_DB([req.query.userID], (err, comments) => {
    //         if (err) return res.status(500).send('Error on the server.' + " " + err);
    //         if (!comments) return res.status(404).send('No comments found.' + " " + err);
    // console.log(comments)
    // })

    res.status(200).json(allPosts);
  });
}); //ПОДГРУЗКА ФОТОГРАФИЙ К ПОСТАМ ПОЛЬЗОВАТЕЛЕЙ

router.get('/post_photos.js', authenticateJWT, function (req, res) {
  tokenID = req.tokenID; //id из сохраненного токена 
  // console.log(req.query)

  posts.load_photos_posts_DB([tokenID, req.query.postID, req.query.userID], function (err, photosPost) {
    if (err) return res.status(500).send('Error on the server.' + " " + err);
    if (!photosPost) return res.status(404).send('No posts found.' + " " + err); //массив с названиями фотографий

    var arr = []; //путь к папке где лежат фотографии

    var path = "../src/assets/photo/"; //проверка на наличие фотографии в папке, если фото есть - отправляем ответ клиенту

    photosPost.forEach(function (element) {
      try {
        //синхронный метод проверки файла ??????????????
        if (fs.existsSync("".concat(path + element.photo_name))) {
          arr.push(element);
        }
      } catch (err) {
        console.error(err);
      }
    });
    res.status(200).json(arr);
  });
}); //ДОБАВЛЯЕМ НОВЫЙ ПОСТ

router.post('/dataBase.js', authenticateJWT, postValidate, function (req, res) {
  //валидация поста
  var errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array()
    });
  }

  userID = +req.body.id; //id из строки запроса

  tokenID = req.tokenID; //id из сохраненного токена 

  var photo = "";

  if (req.body.photo) {
    photo = req.body.photo;
  } else {
    photo = false;
  }

  posts.add_post_DB([req.body.date, req.body.postText, userID, tokenID, photo], function (err, post) {
    if (err) return res.status(500).send('Error on the server' + " " + err);
    var postID = post.insertId; //возвращаем обновленный пост с информацие по автору поста

    posts.load_one_post_DB(postID, function (err, post) {
      if (err) return res.status(500).send("Ошибка на сервере." + " " + err); //уведомление о новом посте

      if (tokenID !== userID) {
        notice.add_notice_DB([userID, post.authorPost, null, "написал что то на Вашей стене", post.id, 0, 0, 0, 0, post.date], function (err) {
          if (err) return res.status(500).send('При добавлении уведомления о новом посте произошла ошибка' + " " + err);
        });
      }

      res.status(200).send(post);
    });
  });
}); //РЕДАКТИРУЕМ ПОСТ

router.put('/dataBase.js', authenticateJWT, postValidate, function (req, res) {
  tokenID = req.tokenID; //id из сохраненного токена 
  //редактировать пос может только его автор

  if (tokenID === req.body.authorPost) {
    //валидация поста
    var errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array()
      });
    }

    posts.edit_post_DB([req.body.postText, req.body.date, req.body.postID], function (err) {
      if (err) return res.status(500).send('Error on the server' + ' ' + err);
      res.status(200);
    });
  }
}); //УДАЛЯЕМ ПОСТ

router["delete"]('/dataBase_delete', authenticateJWT, function (req, res) {
  tokenID = req.tokenID; //id из сохраненного токена 
  //удалять посты может только автор поста или хозяин страницы

  if (tokenID === req.body.authorPost || tokenID === req.body.pageID) {
    posts.remove_post_likes_DB(req.body.postID, function (err) {
      if (err) return res.status(500).send('При удалении лайков поста возникли проблемы' + " " + err);
      posts.remove_post_DB(req.body.postID, function (err) {
        if (err) return res.status(500).send('Error on the server' + " " + err); //удаление уведомления о новом посте

        console.log(req.body.authorPost);
        console.log(tokenID);
        console.log(req.body.postID);
        notice.delete_notice_post_DB([req.body.postID], function (err) {
          if (err) return res.status(500).send('При удалении уведомления о лайке произошла ошибка' + " " + err);
        });
        res.status(200).send("пост удален");
      });
    });
  }
}); //ЛАЙКАЕМ ПОСТ

router.post('/likes_post', authenticateJWT, function (req, res) {
  tokenID = req.tokenID; //id из сохраненного токена 
  //проверяем лайкал ли ранее уже юзер данный пост

  posts.not_double_likes_post_author([req.body.postID, tokenID], function (err, row) {
    if (err) return res.status(500).send("При проверке на повторный лайк произошла ошибка" + " " + err);

    if (row.length > 0) {
      //удаляем автора лайка из таблицы если ранее атор лайкал пост
      posts.remove_author_like_post([row[0].id], function (err) {
        if (err) return res.status(500).send("При исключении автора лайка из таблицы произошла ошибка" + " " + err); //уменьшаем количество лайков в таблице с постами на 1

        posts.remove_count_likes([req.body.postID], function (err) {
          if (err) return res.status(500).send("При отмене лайка поста произошла ошибка" + " " + err); //получаем количество лайков поста

          posts.get_count_likes_post([req.body.postID], function (err, likes) {
            if (err) return res.status(500).send("При получении лайков произошда ошибка" + " " + err);

            if (tokenID !== likes.authorPost) {
              notice.delete_notice_like_DB([likes.authorPost, tokenID, req.body.postID, 0], function (err) {
                if (err) return res.status(500).send('При удалении уведомления о лайке произошла ошибка' + " " + err);
              });
            }

            res.status(200).json({
              likes: likes,
              flag: false
            });
          });
        });
      });
    } else {
      //добавляем автора лайка в таблицу лайков если ранее атор не лайкал пост
      posts.add_author_likes_post([req.body.postID, tokenID], function (err) {
        if (err) return res.status(500).send("При лайке поста произошла ошибка" + " " + err); //увеличиваем количество лайков в таблице с постами на 1

        posts.add_count_likes([req.body.postID], function (err) {
          if (err) return res.status(500).send("При лайке поста произошла ошибка" + " " + err); //получаем количество лайков поста

          posts.get_count_likes_post([req.body.postID], function (err, likes) {
            if (err) return res.status(500).send("При получении лайков произошда ошибка" + " " + err);

            if (tokenID !== likes.authorPost) {
              notice.add_notice_DB([likes.authorPost, tokenID, null, "отметил Вашу запись", req.body.postID, 0, 0, 0, 0, req.body.date], function (err) {
                if (err) return res.status(500).send('При добавлении уведомления о новом посте произошла ошибка' + " " + err);
              });
            }

            res.status(200).json({
              likes: likes,
              flag: true
            });
          });
        });
      });
    }
  });
}); //ПОЛУЧАЕМ ВСЕХ КТО ЛАЙКНУЛ ПОСТ

router.get('/get_users_likes', authenticateJWT, function (req, res) {
  posts.get_users_likes([req.query.postID], function (err, users) {
    if (err) return res.status(500).send("При получении пользователй лайкнувших пост произошла ошибка" + " " + err);
    res.status(200).send(users);
  });
}); //ПОДГРУЗКА КОММЕНТАРИЕВ К ПОСТУ

router.get("/load_comments_post.js", authenticateJWT, function (req, res) {
  tokenID = req.tokenID; //id из сохраненного токена 

  commentsPost.load_comments_DB([req.query.postID], function (err, comments) {
    if (err) return res.status(500).send('Во время загрузки комментариев произошла ошибка' + " " + err);
    if (!comments) return res.status(404).send('Комментарии к постам отстутствуют' + " " + err);
    res.status(200).json(comments);
  });
}); //ПОДГРУЗКА КОММЕНТАРИЕВ К ОДНОМУ ПОСТУ

router.get("/load_comments_one_post.js", authenticateJWT, function (req, res) {
  tokenID = req.tokenID; //id из сохраненного токена 

  commentsPost.load_comments_one_DB([req.query.postID], function (err, comments) {
    if (err) return res.status(500).send('Во время загрузки комментариев произошла ошибка' + " " + err);
    if (!comments) return res.status(404).send('Комментарии к постам отстутствуют' + " " + err);
    res.status(200).json(comments);
  });
}); //ПОДГРУЗКА КОММЕНТАРИЕВ К КОММЕНТАРИЮ

router.get("/load_comments_comment.js", authenticateJWT, function (req, res) {
  tokenID = req.tokenID; //id из сохраненного токена 

  commentsPost.load_comments_comment_DB([req.query.postID], function (err, comments) {
    if (err) return res.status(500).send('Во время загрузки комментариев произошла ошибка' + " " + err);
    if (!comments) return res.status(404).send('Комментарии отстутствуют' + " " + err);
    res.status(200).json(comments);
  });
}); //ПОДГРУЗКА КОММЕНТАРИЕВ К КОММЕНТАРИЮ ОДНОГО ПОСТА

router.get("/load_comments_comment_one_post.js", authenticateJWT, function (req, res) {
  tokenID = req.tokenID; //id из сохраненного токена 

  commentsPost.load_comments_comment_one_DB([req.query.postID], function (err, comments) {
    if (err) return res.status(500).send('Во время загрузки комментариев произошла ошибка' + " " + err);
    if (!comments) return res.status(404).send('Комментарии отстутствуют' + " " + err);
    res.status(200).json(comments);
  });
}); //ДОБАВЛЕНИЕ КОММЕНТАРИЯ К ПОСТУ В БАЗУ ДАННЫХ

router.post("/load_comments_post.js", authenticateJWT, messageValidate, function (req, res) {
  //валидация комментария
  var errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array()
    });
  }

  tokenID = req.tokenID; //id из сохраненного токена 

  commentsPost.add_commentPost_DB([req.body.postID, req.body.textMessage, tokenID, req.body.userPage, req.body.date], function (err, comment) {
    if (err) return res.status(500).send('При добавлении комментария произошла ошибка' + " " + err);
    var newCommentID = comment.insertId; // возвращаем написанный комментарий

    commentsPost.load_one_comment_DB(newCommentID, function (err, newComment) {
      if (err) return res.status(500).send("Ошибка на сервере." + " " + err);
      console.log(newComment);

      if (tokenID !== newComment.authorPost) {
        notice.add_notice_DB([newComment.authorPost, tokenID, null, "добавил комментарий к Вашей записи", newComment.post_id, 0, newComment.id, 0, 0, newComment.date], function (err) {
          if (err) return res.status(500).send('При добавлении уведомления о новом посте произошла ошибка' + " " + err);
        });
      }

      res.status(200).send(newComment);
    });
  });
}); //ДОБАВЛЕНИЕ КОММЕНТАРИЯ К КОММЕНТАРИЮ В БАЗУ ДАННЫХ

router.post("/load_comments_comment.js", authenticateJWT, messageValidate, function (req, res) {
  //валидация комментария
  var errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array()
    });
  }

  tokenID = req.tokenID; //id из сохраненного токена 

  commentsPost.add_commentComment_DB([req.body.commentID, req.body.textMessage, tokenID, req.body.userPage, req.body.date, req.body.comment_commentID || null, req.body.author_comment_comment || null, req.body.comment_comment_text || null], function (err, comment) {
    if (err) return res.status(500).send('При добавлении комментария произошла ошибка' + " " + err);
    var newCommentID = comment.insertId; // возвращаем написанный комментарий

    commentsPost.load_one_comment_comment_DB(newCommentID, function (err, newComment) {
      if (err) return res.status(500).send("Ошибка на сервере." + " " + err);

      if (tokenID !== newComment.author_comment_id) {
        notice.add_notice_DB([newComment.author_comment_id, tokenID, null, "ответил на Ваш комментарий", req.body.postID, 0, newComment.comment_id, newComment.id, 0, newComment.date], function (err) {
          if (err) return res.status(500).send('При добавлении уведомления о новом посте произошла ошибка' + " " + err);
        });
      } else if (req.body.author_comment_comment && tokenID !== req.body.author_comment_comment) {
        notice.add_notice_DB([null, tokenID, req.body.author_comment_comment, "ответил на Ваш комментарий", req.body.postID, 0, newComment.comment_id, newComment.id, 0, newComment.date], function (err) {
          if (err) return res.status(500).send('При добавлении уведомления о новом посте произошла ошибка' + " " + err);
        });
      }

      res.status(200).send(newComment);
    });
  });
}); //УДАЛЯЕМ КОММЕНТАРИ К КОММЕНТАРИЮ

router["delete"]('/load_comments_comment.js', authenticateJWT, function (req, res) {
  tokenID = req.tokenID; //id из сохраненного токена 
  //удалять комментарии может только автор поста или хозяин страницы

  if (tokenID === req.body.authorID || tokenID === req.body.pageID) {
    commentsPost.remove_comment_comment_DB(req.body.commentID, function (err) {
      if (err) return res.status(500).send('Произошла ошибка при удалении комментария' + " " + err);
      console.log(req.body.commentID);
      notice.delete_notice_comment_comments_post_DB([req.body.commentID], function (err) {
        if (err) return res.status(500).send('При удалении уведомления о лайке произошла ошибка' + " " + err);
      });
      res.status(200).send("комментарий удален");
    });
  }
}); //УДАЛЯЕМ КОММЕНТАРИ К ПОСТУ

router["delete"]('/load_comments_post.js', authenticateJWT, function (req, res) {
  tokenID = req.tokenID; //id из сохраненного токена 
  //удалять комментарии может только автор поста или хозяин страницы

  if (tokenID === req.body.authorID || tokenID === req.body.pageID) {
    commentsPost.remove_comment_post_DB(req.body.commentID, function (err) {
      if (err) return res.status(500).send('Произошла ошибка при удалении комментария' + " " + err);
      notice.delete_notice_comment_post_DB([req.body.commentID], function (err) {
        if (err) return res.status(500).send('При удалении уведомления о лайке произошла ошибка' + " " + err);
      });
      res.status(200).send("комментарий удален");
    });
  }
}); //ДОБАВЛЯЕМ АВАТАРКУ В БАЗУ ДАННЫХ

router.post('/upload_ava', authenticateJWT, function (req, res) {
  userID = +req.body.id; //id из строки запроса

  tokenID = req.tokenID; //id из сохраненного токена 

  if (userID === tokenID) {
    //удаление аватарки из папки на сервере при обновлении
    if (req.body.nameAva !== "ava_1.jpg") {
      fs.unlink("../src/assets/photo/".concat(req.body.nameAva), function (err) {
        if (err) console.log(err);
      });
    } //записываем в папку на сервер изображение сконвертированное из base64


    var imgData = req.body.img; // получаем файл в формате base64

    var base64Data = imgData.split(",")[1]; // оставляем непосредственно само закодированное изображение

    var nameImg = Date.now() + "ava.jpg"; //создаем имя фотографии

    var imgBuffer = Buffer.from(base64Data, 'base64'); //сохраняем изображение в буфер
    //сжатие и сохранение изображения в папке

    sharp(imgBuffer).toFormat('jpeg').jpeg({
      quality: 30
    }).toFile("../src/assets/photo/" + nameImg, function (err, info) {
      if (err) {
        console.error(err);
      } else {
        console.log(info);
      }
    });
    var arrayPhotos = [];
    arrayPhotos.push(nameImg, tokenID); //добавление картинки в таблицу Users базы данных 

    authorization.updateAva(arrayPhotos, function (err) {
      if (err) return res.status(500).send('Аватар пользователь не сменился'); //получение обновленного профиля после загрузки аватарки

      authorization.loadUser(tokenID, function (err, user) {
        if (err) return res.status(500).send("Не удалось получить фотографии с сервера" + " " + err);
        res.status(200).send({
          ava: user.ava
        });
      });
    });
  }
}); //ОТПРАВЛЯЕМ ФОТОГРАФИИ В БАЗУ ДАННЫХ

router.post('/upload_photo', authenticateJWT, function (req, res) {
  userID = +req.body.id; //id из строки запроса

  tokenID = req.tokenID; //id из сохраненного токена 

  if (userID === tokenID || req.body.postIDLast) {
    //допустимые форматы
    var allowedTypes = ["image/jpeg", "image/jpg", "image/png"]; //проверка на наличие файла

    if (!req.files) {
      return res.status(500).send("Файлы не отправлены");
    } //проверка на наличие категории у фото


    var category = "not category";

    if (req.body.category) {
      category = req.body.category;
    } //проверка на загрузку через пост


    var post = 0;

    if (req.body.postIDLast) {
      post = req.body.postIDLast;
    }

    var arrayPhotos = []; //переберем массив фотографий

    for (var file in req.files) {
      var myFile = req.files[file]; //проверка загруженных файлов

      if (allowedTypes.includes(myFile.mimetype) && myFile.size < 5000000) {
        var updateName = Date.now() + myFile.name.toLowerCase(); //сжатие и сохранение изображения в папке

        sharp(myFile.data).toFormat('jpeg').jpeg({
          quality: 30
        }).toFile("../src/assets/photo/".concat(updateName), function (err, info) {
          if (err) {
            console.error(err);
          } else {
            console.log(info);
          }
        }); // myFile.mv(`../src/assets/photo/${updateName}`,
        //     function(err) {
        //         if (err) {
        //             return res.status(500).send("Ошибка при загрузке файлов");
        //         }
        //     }
        // );
        //добавляем в массив название фото и id юзера

        arrayPhotos.push([updateName, tokenID, userID, category, post]);
      }
    } //загрузка в БД


    photos.add_photo_DB(arrayPhotos, function (err) {
      if (err) return res.status(500).send('Error on the server' + " " + err);
      res.status(200).send("Фото успешно загрузились на сервер");
    });
  }
}); //ПОЛУЧАЕМ ФОТОГРАФИИ ИЗ БАЗЫ ДАННЫХ

router.get('/upload_all_photo', authenticateJWT, function (req, res) {
  tokenID = req.tokenID; //id из сохраненного токена 

  if (tokenID) {
    photos.load_all_photos_DB([tokenID, req.query.id], function (err, allPhotos) {
      if (err) return res.status(500).send('Ошибка на сервере. Фото не загрузились' + " " + err);
      if (!allPhotos) return res.status(404).send('Фотографии не найдены' + " " + err); //массив с названиями фотографий

      var arr = []; //путь к папке где лежат фотографии

      var path = "../src/assets/photo/"; //проверка на наличие фотографии в папке, если фото есть - отправляем ответ клиенту

      allPhotos.forEach(function (element) {
        try {
          //синхронный метод проверки файла ??????????????
          if (fs.existsSync("".concat(path + element.photo_name))) {
            arr.push(element);
          }
        } catch (err) {
          console.error(err);
        } // fs.access(`${path + element.photo_name}`, fs.F_OK, (err) => {
        //     if (!err) {
        //         console.log(element)
        //         arr.push(element)
        //     } else {
        //         // console.log('not files')
        //     }
        // })

      });
      res.json(arr); // res.status(200).send("Фотографии получены");;
    });
  }
}); //УДАЛЕНИЕ ФОТОГРАФИИ

router["delete"]('/remove_photo', authenticateJWT, function (req, res) {
  userID = +req.query.id; //id из строки запроса

  tokenID = req.tokenID; //id из сохраненного токена 

  if (userID === tokenID) {
    fs.unlink("../src/assets/photo/".concat(req.query.namePhoto), function (err) {
      if (err) return res.status(500).send('Фотография не найдена, возможно она уже удалена ранее' + " " + err);
    });
    photos.remove_photo_likes([req.query.idPhoto], function (err) {
      if (err) return res.status(500).send('Ошибка на сервере при удалении лайков' + " " + err);
      photos.remove_photo([req.query.idPhoto, tokenID], function (err) {
        if (err) return res.status(500).send('Ошибка на сервере. Фотография не удалилась' + " " + err); //удаляем уведомление о лайке фото и комментарие

        notice.delete_notice_photo_DB([req.query.idPhoto], function (err) {
          if (err) return res.status(500).send('При удалении уведомления о лайке и комментарие произошла ошибка' + " " + err);
        });
        res.status(200).send("Фотография удалена");
      });
    });
  }
}); //УДАЛЕНИЕ ФОТОГАФИИ ИЗ ПОСТА

router.put('/remove_photo_post', authenticateJWT, function (req, res) {
  userID = +req.body.id; //id из строки запроса

  tokenID = req.tokenID; //id из сохраненного токена 

  if (userID === tokenID) {
    photos.remove_photo_post([req.body.idPhoto, tokenID], function (err) {
      if (err) return res.status(500).send('Ошибка на сервере. Фотография не удалилась из поста' + " " + err);
      res.status(200).send("Фотография удалена из поста");
      ;
    });
  }
}); //УДАЛЕНИЕ АВАТАРКИ

router.put('/remove_ava_photo', authenticateJWT, function (req, res) {
  userID = +req.body.id; //id из строки запроса

  tokenID = req.tokenID; //id из сохраненного токена 

  if (userID === tokenID) {
    //удаление аватарки из папки на сервере
    fs.unlink("../src/assets/photo/".concat(req.body.nameAva), function (err) {
      if (err) console.log(err);
    });
    authorization.updateAva(["ava_1.jpg", tokenID], function (err) {
      if (err) return res.status(500).send('Ошибка на сервере. Аватарка не удалилась' + " " + err); //получение обновленного профиля после удаления аватарки

      authorization.loadUser(tokenID, function (err, user) {
        if (err) return res.status(500).send("Не удалось получить фотографии с сервера" + " " + err);
        res.status(200).send({
          user: {
            ava: user.ava
          }
        });
      });
    });
  }
}); //ЛАЙКАЕМ ФОТОГРАФИЮ

router.post('/likes_photo', authenticateJWT, function (req, res) {
  tokenID = req.tokenID; //id из сохраненного токена 
  //проверяем лайкал ли ранее уже юзер данное фото

  photos.not_double_likes_photo_author([req.body.photoID, tokenID], function (err, row) {
    if (err) return res.status(500).send("При проверке на повторный лайк произошла ошибка" + " " + err);

    if (row.length > 0) {
      //удаляем автора лайка из таблицы если ранее атор лайкал фото
      photos.remove_author_like_photo([row[0].id], function (err) {
        if (err) return res.status(500).send("При исключении автора лайка из таблицы произошла ошибка" + " " + err); //уменьшаем количество лайков в таблице с фотографиями на 1

        photos.remove_count_likes([req.body.photoID], function (err) {
          if (err) return res.status(500).send("При отмене лайка фотографии произошла ошибка" + " " + err); //получаем количество лайков фотогафии

          photos.get_count_likes_photo([req.body.photoID], function (err, likes) {
            if (err) return res.status(500).send("При получении лайков произошла ошибка" + " " + err); //удаляем уведомление о лайке фото

            if (tokenID !== likes.userID) {
              notice.delete_notice_like_DB([likes.userID, tokenID, 0, req.body.photoID], function (err) {
                if (err) return res.status(500).send('При удалении уведомления о лайке произошла ошибка' + " " + err);
              });
            }

            res.status(200).json({
              likes: likes,
              flag: false
            });
          });
        });
      });
    } else {
      //добавляем автора лайка в таблицу лайков если ранее атор не лайкал фото
      photos.add_author_likes_photo([req.body.photoID, tokenID], function (err) {
        if (err) return res.status(500).send("При лайке фото произошла ошибка" + " " + err); //увеличиваем количество лайков в таблице с постами на 1

        photos.add_count_likes([req.body.photoID], function (err) {
          if (err) return res.status(500).send("При лайке фото произошла ошибка" + " " + err); //получаем количество лайков поста

          photos.get_count_likes_photo([req.body.photoID], function (err, likes) {
            if (err) return res.status(500).send("При получении лайков произошла ошибка" + " " + err);

            if (tokenID !== likes.userID) {
              notice.add_notice_DB([likes.userID, tokenID, null, "отметил Вашу фотографию", 0, req.body.photoID, 0, 0, 0, req.body.date], function (err) {
                if (err) return res.status(500).send('При добавлении уведомления о новой отметка фотографии произошла ошибка' + " " + err);
              });
            }

            res.status(200).json({
              likes: likes,
              flag: true
            });
          });
        });
      });
    }
  });
}); //ПОЛУЧАЕМ ВСЕХ КТО ЛАЙКНУЛ ФОТО

router.get('/get_users_likes_photo', authenticateJWT, function (req, res) {
  photos.get_users_likes_photo([req.query.photoID], function (err, users) {
    if (err) return res.status(500).send("При получении пользователй лайкнувших фото произошла ошибка" + " " + err);
    res.status(200).send(users);
  });
}); //ДОБАВЛЕНИЕ КОММЕНТАРИЯ К ФОТОГРАФИИ В БАЗУ ДАННЫХ

router.post("/load_comments_photo.js", authenticateJWT, messageValidate, function (req, res) {
  //валидация комментария
  var errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array()
    });
  }

  tokenID = req.tokenID; //id из сохраненного токена 

  commentsPhoto.add_commentPhoto_DB([req.body.photoID, req.body.textMessage, tokenID, req.body.userPage, req.body.date], function (err, commentPhoto) {
    if (err) return res.status(500).send('При добавлении комментария произошла ошибка' + " " + err);
    var newCommentID = commentPhoto.insertId; // возвращаем написанный комментарий

    commentsPhoto.load_one_comment_photo_DB(newCommentID, function (err, newCommentPhoto) {
      if (err) return res.status(500).send("Ошибка на сервере." + " " + err);
      console.log(newCommentPhoto);

      if (tokenID !== newCommentPhoto.userID) {
        notice.add_notice_DB([newCommentPhoto.userID, tokenID, null, "добавил комментарий к Вашей фотографии", 0, newCommentPhoto.photo_id, 0, 0, newCommentPhoto.id, newCommentPhoto.date], function (err) {
          if (err) return res.status(500).send('При добавлении уведомления о новом посте произошла ошибка' + " " + err);
        });
      }

      res.status(200).send(newCommentPhoto);
    });
  });
}); //ПОДГРУЗКА КОММЕНТАРИЕВ К ФОТОГРАФИИ

router.get("/load_comments_photo.js", authenticateJWT, function (req, res) {
  tokenID = req.tokenID; //id из сохраненного токена 

  commentsPhoto.load_commentsPhoto_DB([req.query.photoID], function (err, comments) {
    if (err) return res.status(500).send('Во время загрузки комментариев произошла ошибка' + " " + err);
    if (!comments) return res.status(404).send('Комментарии к постам отстутствуют' + " " + err);
    res.status(200).json(comments);
  });
}); //УДАЛЯЕМ КОММЕНТАРИЙ К ФОТО

router["delete"]('/load_comments_photo.js', authenticateJWT, function (req, res) {
  tokenID = req.tokenID; //id из сохраненного токена 
  //удалять комментарии может только автор поста или хозяин страницы

  if (tokenID === req.body.authorID || tokenID === req.body.pageID) {
    commentsPhoto.remove_comment_photo_DB(req.body.commentID, function (err) {
      if (err) return res.status(500).send('Произошла ошибка при удалении комментария' + " " + err);
      notice.delete_notice_comment_photo_DB([req.body.commentID], function (err) {
        if (err) return res.status(500).send('При удалении уведомления о лайке произошла ошибка' + " " + err);
      });
      res.status(200).send("Комментарий к фотографии был удален");
    });
  }
}); //ДОБАВЛЕНИЕ СООБЩЕНИЯ В БАЗУ ДАННЫХ

router.post('/user_message', authenticateJWT, messageValidate, function (req, res) {
  //валидация сообщения
  var errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array()
    });
  }

  tokenID = req.tokenID; //кто пишет 

  destinationID = req.body.destinationID; //кому мы пишем

  if (tokenID != req.body.destinationID) {
    //ищем диалог между пользователями
    messages.get_conversation_id_DB([tokenID, destinationID, destinationID, tokenID], function (err, row_conversation) {
      if (err) return res.status(500).send(err);
      return new Promise(function (resolve) {
        // Если диалог не создан ранее - создаем
        if (row_conversation.length === 0) {
          messages.add_conversation_DB([tokenID, destinationID, tokenID], function (err, last_conversation) {
            if (err) return res.status(500).send(err);
            resolve(last_conversation.insertId); // ID последнего диалога
          });
        } else {
          resolve(row_conversation[0].id); // ID последнего диалога
        }
      }).then(function (last_conversation_id) {
        // Добавляем сообщение
        messages.add_message_DB([last_conversation_id, tokenID, destinationID, req.body.textMessage, req.body.date], function (err, row_messages) {
          if (err) return res.status(500).send('При записи сообщения в базу данных произошла ошибка' + ' ' + err); //получаем id последнего сообщения в диалоге

          var row_messages_id = row_messages.insertId; // Обновляем таблицу с диалогом

          messages.update_conversation_id_DB([row_messages_id, tokenID, tokenID, destinationID, last_conversation_id, tokenID, last_conversation_id], function (err) {
            if (err) return res.status(500).send('При обновлении таблицы диалогов произошла ошибка' + ' ' + err);
          }); //возвращаем отправленное сообщение

          messages.get_last_message_DB([row_messages_id], function (err, newMessage) {
            if (err) return res.status(500).send('Неудалось вернуть добавленное сообщение' + ' ' + err);
            res.status(200).send(newMessage);
          });
        });
      });
    });
  }
}); //  ПОЛУЧЕНИЕ ВСЕХ ДИАЛОГОВ С ДРУГИМИ ПОЛЬЗОВАТЕЛЯМИ

router.get('/user_dialogs', authenticateJWT, function (req, res) {
  console.log(req.query);
  tokenID = req.tokenID; //id из сохраненного токена   

  if (tokenID) {
    // Вывод диалогов пользователя
    messages.get_all_conversation_DB({
      tokenID: tokenID,
      _count: req.query._count,
      _limit: req.query._limit
    }, function (err, dialogs) {
      if (err) return res.status(500).send('При получении диалогов из БД произошла ошибка:' + ' ' + err); //определяем количство непрочитанных сообщений для адресата

      var newDialogs = dialogs.map(function (dialog) {
        if (dialog.sender === tokenID) {
          dialog.unread = 0;
        } else {
          if (req.query.isExitMessage && req.query.convID == dialog.convId) {
            // Обновляем флаг просмотров сообщений
            messages.update_flag_unread_messages([req.query.convID, tokenID], function (err) {
              if (err) return res.status(500).send('При обновлении флага в таблице сообщений произошла ошибка:' + ' ' + err); //обновляем флаг с непрочитанными сообщениями в таблице диалогов

              messages.update_flag_unread_conersation([req.query.convID, tokenID, req.query.convID, tokenID], function (err) {
                if (err) return res.status(500).send('При обновлении флага в таблице диалогов произошла ошибка:' + ' ' + err);
              });
            });
            dialog.unread = 0;
          }
        }

        return dialog;
      });
      return res.status(200).send(newDialogs);
    });
  }
}); //ПОЛУЧЕНИЕ ПЕРЕПИСКИ С КОНКРЕТНЫМ ПОЛЬЗОВАТЕЛЕМ

router.get('/user_messages', authenticateJWT, function (req, res) {
  tokenID = req.tokenID; //id из сохраненного токена

  user_companion = req.query.user_companion; //id собеседника по переписки

  if (tokenID != user_companion) {
    // Поиск диалога
    messages.get_conversation_id_DB([tokenID, user_companion, user_companion, tokenID], function (err, row_conversation) {
      if (err) return res.status(500).send('При получении id переписки из БД произошла ошибка:' + ' ' + err); // Если диалог не создан ранее

      if (row_conversation.length == 0) {
        return res.status(200);
      } else {
        //иначе возвращаем переписку из БД
        messages.get_messages_user_DB([row_conversation[0].id, tokenID, row_conversation[0].id, tokenID, tokenID, req.query._count, req.query._limit], function (err, messages_user) {
          if (err) return res.status(500).send('При получении сообщений из БД произошла ошибка:' + ' ' + err);

          if (messages_user.length === 0) {
            return res.status(200);
          } // if (row_conversation[0].unread !== 0) {
          // Обновляем флаг просмотров сообщений


          messages.update_flag_unread_messages([row_conversation[0].id, tokenID], function (err) {
            if (err) return res.status(500).send('При обновлении флага в таблице сообщений произошла ошибка:' + ' ' + err); //обновляем флаг с непрочитанными сообщениями в таблице диалогов

            messages.update_flag_unread_conersation([row_conversation[0].id, tokenID, row_conversation[0].id, tokenID], function (err) {
              if (err) return res.status(500).send('При обновлении флага в таблице диалогов произошла ошибка:' + ' ' + err);
            });
          }); // }

          return res.status(200).send(messages_user);
        });
      }
    });
  }
}); //УДАЛЕНИЕ СООБЩЕНИЕ В ПЕРЕПИСКЕ

router["delete"]('/user_messages', authenticateJWT, function (req, res) {
  tokenID = req.tokenID; //id из сохраненного токена
  // Проверяем существование сообщения

  messages.get_message([req.body.deleteID, tokenID, tokenID], function (err, message) {
    if (err) return res.status(500).send(err);

    if (!message) {
      return res.status(200).send("Сообщение не найдено");
    } else {
      //обновляем флаги удаления сообщения у пользователей
      messages.update_message_flag_delete([tokenID, tokenID, req.body.deleteID], function (err) {
        if (err) return res.status(500).send("Сообщение небыло удалено" + " " + err);
        return res.status(200).send("Сообщение удалено");
      });
    }
  });
}); //УДАЛЕНИЕ ДИАЛОГА

router.put('/user_messages', authenticateJWT, function (req, res) {
  tokenID = req.tokenID; //id из сохраненного токена
  // Проверяем существование диалога

  messages.get_conversation([req.body.dialogsID, tokenID, tokenID], function (err, dialog) {
    if (err) return res.status(500).send(err);

    if (!dialog) {
      return res.status(200).send("Данный диалог не найден");
    } else {
      //обновляем флаги удаления сообщений у пользователей
      messages.update_messages_flag_delete([tokenID, tokenID, req.body.dialogsID], function (err) {
        if (err) return res.status(500).send("Сообщениея в диалоге небыли удалены" + " " + err); //обновляем флаги удаления диалога у пользователя

        messages.update_conversation_flag_delete([tokenID, tokenID, req.body.dialogsID], function (err) {
          if (err) return res.status(500).send("Диалог небыл удален" + " " + err);
          return res.status(200).send(dialog);
        });
      });
    }
  });
}); //ОТПРАВЛЕНИЕ ЗАПРОСА В ДРУЗЬЯ

router.post("/add_friend", authenticateJWT, function (req, res) {
  tokenID = req.tokenID; //id из сохраненного токена

  if (tokenID != req.body.id) {
    //проверка на ранее отправленную заявку
    friends.get_confirm_friend_DB([tokenID, req.body.id, req.body.id, tokenID], function (err, confirmID) {
      if (err) return res.status(500).send("При поиске приглашения в друзья, произошла ошибка" + " " + err); //если запроса ранее небыло создаем его

      if (confirmID.length === 0) {
        friends.add_friend_DB([tokenID, req.body.id], function (err) {
          if (err) return res.status(500).send("При отправке запроса в друзья, произошла ошибка" + " " + err);
          res.status(200).send("Заявка отправлена");
          notice.add_notice_DB([req.body.id, tokenID, null, "пригласил Вас в друзья", 0, 0, 0, 0, 0, req.body.date], function (err) {
            if (err) return res.status(500).send('При добавлении уведомления о новом посте произошла ошибка' + " " + err);
          });
        });
      } else {
        //если запрос ранее был - отменяем его
        friends.cancel_add_friend_DB([confirmID[0].id], function (err) {
          if (err) return res.status(500).send("При отмене заявки в друзья произошла ошибка" + " " + err); //убераем уведомление

          notice.delete_notice_like_DB([req.body.id, tokenID, 0, 0], function (err) {
            if (err) return res.status(500).send('При удалении уведомления о лайке произошла ошибка' + " " + err);
          });
          res.status(200).send("Добавить в друзья");
        });
      }
    });
  }
}); //ПРОВЕРКА НА РАНЕЕ ОТПРАВЛЕННУЮ ЗАЯВКУ В ДРУЗЬЯ

router.get("/check_request_friend", authenticateJWT, function (req, res) {
  tokenID = req.tokenID; //id из сохраненного токена
  // if (tokenID != req.query.id) {
  //проверка на ранее отправленную заявку

  friends.get_confirm_friend_DB([tokenID, req.query.id, req.query.id, tokenID], function (err, confirmID) {
    if (err) return res.status(500).send("При поиске приглашения в друзья, произошла ошибка" + " " + err);
    console.log(confirmID); //если запроса небыло - оставляем как есть

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
  }); // }
}); //ПРОВЕРКА НА ПОЛУЧЕНИЕ ЗАПРОСОВ В ДРУЗЬЯ

router.get("/check_confirm_friends", authenticateJWT, function (req, res) {
  tokenID = req.tokenID; //id из сохраненного токена

  if (tokenID) {
    //проверка отправленных мне запросов
    friends.get_confirm_friends_DB([tokenID], function (err, confirm) {
      if (err) return res.status(500).send("При поиске приглашения в друзья, произошла ошибка" + " " + err); //если запроса небыло - оставляем как есть
      // if (confirm.length === 0) {
      // res.status(200).send("Заявок не было");
      // } else {

      res.status(200).send(confirm); // }
    });
  }
}); //ПОЛУЧЕНИЕ ПЛЬЗОВАТЕЛЕЙ ОТПРАВИВШИХ МНЕ ЗАПРОС В ДРУЗЬЯ

router.get("/add_friends_me", authenticateJWT, function (req, res) {
  tokenID = req.tokenID; //id из сохраненного токена

  if (tokenID) {
    friends.get_user_confirm_friends_me_DB([tokenID], function (err, users) {
      if (err) return res.status(500).send("При получении пользователей приглашающих меня в друзья, произошла ошибка" + " " + err);
      res.status(200).send(users);
    });
  }
}); //ПОЛУЧЕНИЕ ПЛЬЗОВАТЕЛЕЙ КОТОРЫМ Я ОТПРАВИЛ ЗАПРОС В ДРУЗЬЯ

router.get("/add_friends_from_me", authenticateJWT, function (req, res) {
  tokenID = req.tokenID; //id из сохраненного токена

  if (tokenID) {
    friends.get_user_confirm_friends_from_me_DB([tokenID], function (err, users) {
      if (err) return res.status(500).send("При получении пользователей которых я пригласил в друзья, произошла ошибка" + " " + err);
      res.status(200).send(users);
    });
  }
}); //ПОЛУЧЕНИЕ МОИХ ДРУЗЕЙ

router.get("/my_friends", authenticateJWT, function (req, res) {
  tokenID = req.tokenID; //id из сохраненного токена

  if (tokenID) {
    friends.get_my_friends_DB([req.query.id, req.query.id, +req.query._count, +req.query._limit], function (err, users) {
      if (err) return res.status(500).send("При получении моих друзей, произошла ошибка" + " " + err);
      res.status(200).send(users);
    });
  }
}); //ПОИСК ДРУЗЕЙ СРЕДИ ПОЛЬЗОВАТЕЛЕЙ

router.get("/search_friends", authenticateJWT, searchNewFriendsValidate, function (req, res) {
  //валидация фильтра поиска
  var errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array()
    });
  }

  tokenID = req.tokenID; //id из сохраненного токена

  if (tokenID) {
    friends.get_users([tokenID, tokenID, tokenID, tokenID, tokenID, tokenID, "%".concat(req.query.name, "%"), "%".concat(req.query.surname, "%"), "%".concat(req.query.country, "%"), "%".concat(req.query.city, "%"), "%".concat(req.query.sex, "%"), req.query.ageAfter, req.query.ageBefore, +req.query._count, +req.query._limit], function (err, users) {
      if (err) return res.status(500).send("При получении пользователей, произошла ошибка" + " " + err);
      res.status(200).send(users);
    });
  }
}); //ПРИНЯТЬ ЗАЯВКУ В ДРУЗЬЯ

router.put("/add_friends_me", authenticateJWT, function (req, res) {
  tokenID = req.tokenID; //id из сохраненного токена

  if (tokenID) {
    friends.agree_add_friend_DB([req.body.id], function (err) {
      if (err) return res.status(500).send("При получении пользователей приглашающих меня в друзья, произошла ошибка" + " " + err); //добавляем уведомление

      notice.add_notice_DB([req.body.userID, tokenID, null, "принял Вашу заявку в друзья", 0, 0, 0, 0, 0, req.body.date], function (err) {
        if (err) return res.status(500).send('При добавлении уведомления о новом посте произошла ошибка' + " " + err); //убераем уведомление о приглашении в друзья

        notice.delete_notice_like_DB([tokenID, req.body.userID, 0, 0], function (err) {
          if (err) return res.status(500).send('При удалении уведомления о лайке произошла ошибка' + " " + err);
        });
      });
      res.status(200).send("Пользователь добавлен в Ваши друзья");
    });
  }
}); //УДАЛИТЬ ИЗ ДРУЗЕЙ

router["delete"]("/delete_friends", authenticateJWT, function (req, res) {
  tokenID = req.tokenID; //id из сохраненного токена

  console.log(req.body.params.query);

  if (tokenID == req.body.params.query) {
    friends.delete_friend_DB([req.body.params.id], function (err) {
      if (err) return res.status(500).send("При удалении пользователя из друзей, произошла ошибка" + " " + err);
      console.log(tokenID);
      console.log(req.body.params.userID); //  //убераем уведомление о приглашении в друзья

      notice.delete_notice_friend_DB([tokenID, req.body.params.userID, tokenID, req.body.params.userID], function (err) {
        if (err) return res.status(500).send('При удалении уведомления о лайке произошла ошибка' + " " + err);
      });
      res.status(200).send("Пользователь удален из ваших друзей");
    });
  }
}); //ПОДГРУЗКА НОВОСТНОЙ ЛЕНТЫ

router.get('/news_friends.js', authenticateJWT, function (req, res) {
  tokenID = req.tokenID; //id из сохраненного токена

  posts.load_news_friens_DB([tokenID, tokenID, tokenID, req.query._count, req.query._limit], function (err, newsFriends) {
    if (err) return res.status(500).send('Error on the server.' + " " + err);
    if (!newsFriends) return res.status(404).send('No news found.'); // console.log(newsFriends)

    res.status(200).json(newsFriends);
  });
}); //ОБРАТНАЯ СВЯЗЬ С ПОЛЬЗОВАТЕЛЕМ

router.post('/problem_user', authenticateJWT, feedBackUser, function (req, res) {
  tokenID = req.tokenID; //id из сохраненного токена
  //валидация заполнения полей

  var errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array()
    });
  }

  authorization.loadUserInfo([tokenID], function (err, user) {
    if (err) return res.status(500).send('Error on the server.' + " " + err);
    feedBack.add_new_problem([tokenID, user.name, user.surname, user.email, req.body.cause, req.body.title, req.body.description], function (err) {
      if (err) return res.status(500).send('Error on the server.' + " " + err); //отправляем сообщение на почту юзера после его обращения в поддержку

      var message = {
        to: user.email,
        subject: 'FeedBack RaccoonNet.ru',
        html: "\n                <h2>\u0414\u043E\u0431\u0440\u044B\u0439 \u0434\u0435\u043D\u044C, \u0412\u0430\u0448\u0435 \u043E\u0431\u0440\u0430\u0449\u0435\u043D\u0438\u0435 \u043F\u0440\u0438\u043D\u044F\u0442\u043E \u0432 \u043E\u0431\u0440\u0430\u0431\u043E\u0442\u043A\u0443 \u0441\u043B\u0443\u0436\u0431\u043E\u0439 \u0442\u0435\u0445\u043D\u0438\u0447\u0435\u0441\u043A\u043E\u0439 \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u043A\u0438 \u0441\u0430\u0439\u0442\u0430 RaccoonNet.ru</h2>  \n                <i>\u0434\u0430\u043D\u043D\u044B\u0435 \u043F\u043E \u0412\u0430\u0448\u0435\u043C\u0443 \u043E\u0431\u0440\u0430\u0449\u0435\u043D\u0438\u044E:</i>\n                <ul>\n                    <li>\u041F\u0440\u0438\u0447\u0438\u043D\u0430 \u043E\u0431\u0440\u0430\u0449\u0435\u043D\u0438\u044F: ".concat(req.body.cause, "</li>\n                    <li>\u041A\u0440\u0430\u0442\u043A\u043E\u0435 \u043D\u0430\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435: ").concat(req.body.title, "</li>\n                    <li>\u041F\u043E\u0434\u0440\u043E\u0431\u043D\u043E\u0435 \u043E\u043F\u0438\u0441\u0430\u043D\u0438\u0435: ").concat(req.body.description, "</li>\n                </ul>\n                <p>\u0414\u0430\u043D\u043D\u043E\u0435 \u043F\u0438\u0441\u044C\u043C\u043E \u043D\u0435 \u0442\u0440\u0435\u0431\u0443\u0435\u0442 \u043E\u0442\u0432\u0435\u0442\u0430.<p>")
      };
      mailer(message);
      res.status(200).send("Ваша заявка принята");
    });
  });
}); //ЗАПРОС НА ВОССТАНОВЛЕНИЕ ПАРОЛЯ

router.post('/restore_password', loginValidate, function (req, res) {
  //валидация заполнения полей
  var errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array()
    });
  }

  authorization.selectByEmail(req.body.email, function (err, user) {
    if (err) return res.status(500).send('Ошибка на сервере.' + " " + err);
    if (!user) return res.status(200).send("Ссылка для сброса пароля отправлена на Ваш почтовый ящик");
    var randomToken = randtoken.generate(20);
    var tokenLink = jwt.sign({
      email: req.body.email
    }, randomToken, {
      expiresIn: 600
    });
    authorization.add_token_pass_user([randomToken, req.body.email], function (err) {
      if (err) return res.status(500).send('Error on the server.' + " " + err);
      var message = {
        to: req.body.email,
        subject: 'Сброс пароля RaccoonNet',
        html: "\n                    <p>\u0414\u043B\u044F \u0441\u0431\u0440\u043E\u0441\u0430 \u043F\u0430\u0440\u043E\u043B\u044F \u043E\u0442 \u0432\u0430\u0448\u0435\u0433\u043E \u043F\u0440\u043E\u0444\u0438\u043B\u044F \u043D\u0430 \u0441\u0430\u0439\u0442\u0435 RaccoonNet \u043F\u0435\u0440\u0435\u0439\u0434\u0438\u0442\u0435 \u043F\u043E \u0441\u0441\u044B\u043B\u043A\u0435 \u0438 \u0441\u043B\u0435\u0434\u0443\u0439\u0442\u0435 \u0434\u0430\u043B\u044C\u043D\u0435\u0439\u0448\u0438\u043C \u0438\u043D\u0441\u0442\u0440\u0443\u043A\u0446\u0438\u044F\u043C</p>  \n                   <a href='http://localhost:8080/reset-password?token=".concat(tokenLink, "'>\u0441\u0441\u044B\u043B\u043A\u0430 \u0434\u043B\u044F \u0441\u0431\u0440\u043E\u0441\u0430 \u043F\u0430\u0440\u043E\u043B\u044F</a>\n\n                   <p>\u0415\u0441\u043B\u0438 \u0412\u044B \u043D\u0435 \u043F\u044B\u0442\u0430\u043B\u0438\u0441\u044C \u0441\u0431\u0440\u043E\u0441\u0438\u0442\u044C \u043F\u0430\u0440\u043E\u043B\u044C, \u043F\u0440\u043E\u0441\u0442\u043E \u043F\u0440\u043E\u0438\u0433\u043D\u043E\u0440\u0438\u0440\u0443\u0439\u0442\u0435 \u044D\u0442\u043E \u043F\u0438\u0441\u044C\u043C\u043E.</p>\n               \n                    <p>\u0414\u0430\u043D\u043D\u043E\u0435 \u043F\u0438\u0441\u044C\u043C\u043E \u043D\u0435 \u0442\u0440\u0435\u0431\u0443\u0435\u0442 \u043E\u0442\u0432\u0435\u0442\u0430.<p>")
      };
      mailer(message);
      res.status(200).send("Ссылка для сброса пароля отправлена на Ваш почтовый ящик");
    });
  });
}); // })
//ИЗМЕНЕНИЕ ПАРОЛЯ ПОСЛЕ ЕГО ОБНОВЛЕНИЯ

router.put('/update_password_restore', passwordValidate, function (req, res) {
  //валидация полей
  var errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors);
    return res.status(422).json({
      errors: errors.array()
    });
  }

  var decoded = jwt.decode(req.body.token).email; //проверка ссылки с токеном на токен в БД

  authorization.get_user_token(decoded, function (err, user) {
    if (err) return res.status(500).send("Ошибка на сервере" + " " + err);
    if (!user.pass_token) return res.status(401).send({
      err: 'Cсылка по которой Вы перешли устарела'
    });
    jwt.verify(req.body.token, user.pass_token, function (err) {
      if (err) {
        return res.status(401).send({
          err: 'Cсылка по которой Вы перешли устарела'
        });
      }

      if (!req.body.new_password) return res.status(500).send("Поле с новым паролем не заполнено"); //обновление старого пароля

      authorization.updateUserPassword([bcrypt.hashSync(req.body.new_password, 8), user.userID], function (err) {
        if (err) return res.status(500).send("При изменении пароля возникли проблемы" + " " + err); //получение почты пользователя

        authorization.loadUserEmail(user.userID, function (err, user) {
          if (err) return res.status(500).send('Ошибка на сервере.' + " " + err); // отправляем сообщение на новую почту если юзер поменял пароль 

          var message = {
            to: user.email,
            subject: 'You have changed your password',
            html: "\n                                <h2>\u0412\u044B \u0438\u0437\u043C\u0435\u043D\u0438\u043B\u0438 \u043F\u0430\u0440\u043E\u043B\u044C \u0441\u0432\u043E\u0435\u0439 \u0443\u0447\u0435\u0442\u043D\u043E\u0439 \u0437\u0430\u043F\u0438\u0441\u0438 \u043D\u0430 \u0441\u0430\u0439\u0442\u0435 raccoonnet.ru!</h2>  \n                                <i>\u0415\u0441\u043B\u0438 \u0432\u044B \u044D\u0442\u043E\u0433\u043E \u043D\u0435 \u0434\u0435\u043B\u0430\u043B\u0438, \u043E\u0431\u0440\u0430\u0442\u0438\u0442\u0435\u0441\u044C \u0432 \u0441\u043B\u0443\u0436\u0431\u0443 \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u043A\u0438</i>\n                                <p>\u0414\u0430\u043D\u043D\u043E\u0435 \u043F\u0438\u0441\u044C\u043C\u043E \u043D\u0435 \u0442\u0440\u0435\u0431\u0443\u0435\u0442 \u043E\u0442\u0432\u0435\u0442\u0430.<p>"
          };
          mailer(message);
          res.status(200).send("Пароль успешно обновлен");
        });
      });
    });
  });
}); //ПОЛУЧЕНИЕ НОВЫХ УВЕДОМЛЕНИЙ

router.get('/new_notice', authenticateJWT, function (req, res) {
  tokenID = req.tokenID; //id из сохраненного токена

  notice.get_notice_DB([tokenID, tokenID], function (err, newNotice) {
    if (err) return res.status(500).send('При получении уведомлений произошла ошибка' + " " + err);
    res.status(200).json(newNotice);
  });
}); //УДАЛЕНИЕ УВЕДОМЛЕНИЙ ИЗ СПИСКА

router["delete"]('/notice_delete', authenticateJWT, function (req, res) {
  tokenID = req.tokenID; //id из сохраненного токена

  notice.delete_notice_DB([req.body.noticeID], function (err) {
    if (err) return res.status(500).send('При удалении уведомления произошла ошибка' + " " + err);
    res.status(200).send("уведомление удалено");
  });
}); //ОТМЕТИТЬ УВЕДОМЛЕНИЕ КАК ПРОСМОТРЕННОЕ РАНЕЕ

router.put('/notice_remove_count', authenticateJWT, function (req, res) {
  tokenID = req.tokenID; //id из сохраненного токена

  console.log(req.body.noticeID);
  notice.notice_remove_count_DB([req.body.noticeID], function (err) {
    if (err) return res.status(500).send('При попытке отметить уведомление как прочитанное произошла ошибка' + " " + err);
    res.status(200).send("уведомление прочитано");
  });
}); //ПОЛУЧЕНИЕ ФОТОГРАФИЙ К ПОСТУ ИЗ УВЕДОМЛЕНИЯ

router.get('/new_notice_photos', authenticateJWT, function (req, res) {
  notice.get_notice_photos_post_DB([req.query.post_id], function (err, newPhotoNotice) {
    if (err) return res.status(500).send('При получении фотографий к посту из уведомления произошла ошибка' + " " + err);
    res.status(200).json(newPhotoNotice);
  });
}); //ПОЛУЧЕНИЕ СООБЩЕНИЙ БЕЗ ПЕРЕЗАГРУЗКИ

io.use(function _callee(socket, next) {
  var token, user;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          // получаем токен от клиента
          token = socket.handshake.auth.token;
          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(jwt.verify(token, tokenKey.secret));

        case 4:
          user = _context.sent;
          // сохраняем информацию из токена в сокете
          socket.user = user;
          next();
          _context.next = 13;
          break;

        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](1);
          console.log('error', _context.t0.message);
          return _context.abrupt("return", next(new Error(_context.t0.message)));

        case 13:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 9]]);
});
io.on("connection", function (socket) {
  socket.join(socket.user.id); // let arr = [];
  // arr[socket.user.id] = socket.rooms;
  // console.log(arr)
  // const { id, userID } = socket.rooms;
  //записываем id пользователя в комнату
  // socket.join(socket.user.id);
  // console.log(socket.user.id)
  // socket.join(roomName);

  console.log("a user connected"); //выходим из комнаты

  socket.on("disconnect", function () {
    // socket.leave(roomName);
    console.log("user disconnected");
  }); // socket.on("my message", (msg) => {
  //     console.log("message: " + msg);
  //     io.emit("my broadcast", `server: ${msg}`);
  // });
  //записываем имя комнаты
  // socket.on("join", ({ roomName }) => {
  //     console.log("join: " + roomName);
  //     socket.join('50');
  // });
  //получаем сообщение

  socket.on("message", function (newMessage) {
    //отправляем сообщение всем кто находится в комнате кроме отправителя
    socket.to(Number(newMessage.destinationID)).emit("message", newMessage); // отправляем сообщение всем кто находится в комнате включая отправителя
    // io.to(roomName).emit("message", outgoingMessage);
  });
});
app.use(router);
var port = process.env.PORT || 8000;
http.listen(port, function () {
  console.log('Express server listening on port ' + port);
});