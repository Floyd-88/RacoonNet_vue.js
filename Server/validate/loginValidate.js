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
            .trim()
            .escape(),
]
module.exports = loginValidate;