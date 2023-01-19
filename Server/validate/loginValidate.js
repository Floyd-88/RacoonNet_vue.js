const {check} = require("express-validator");

let loginValidate = [
        // Check Email
        check('email')
            .isEmail() //проверяет адрес электронной почты
            .withMessage('Некорректный адрес электронной почты')
            .trim() //уберает пробелы в начале и конце строки
            .escape() //превращает спецсимволы в код html
            .normalizeEmail(), //преводи адрес почты к стандартному формату

        // Check Password
        check('password')
            .isLength({min: 8})
            .withMessage('Пароль должен содержать не менее 8 сиволов')
            // .matches('[0-9]')
            // .withMessage('Password Must Contain a Number')
            // .matches('[A-Z]')
            // .withMessage('Password Must Contain an Uppercase Letter')
            .trim()
            .escape(),
]
module.exports = loginValidate;