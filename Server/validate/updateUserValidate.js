const { check } = require("express-validator");
const loginValidate = require('./loginValidate');

let updateUserValidate = [
    // Check Name
    check('name')
    .isLength({ min: 2 })
    .withMessage('Имя должно содержать не менее 2 символов')
    .trim()
    .escape(),

    // Check Surname
    check('surname')
    .isLength({ min: 2 })
    .withMessage('Фамилия должна содержать не менее 2 символов')
    .trim()
    .escape(),

    //Check Email
    check('email')
    .isEmail() //проверяет адрес электронной почты
    .withMessage('Некорректный адрес электронной почты')
    .trim() //уберает пробелы в начале и конце строки
    .escape() //превращает спецсимволы в код html
    .normalizeEmail(), //преводи адрес почты к стандартному формату

    // Check Country
    check('country')
    .isLength({ min: 2 })
    .withMessage('Название страны должна содержать не менее 2 символов')
    .trim()
    .escape(),

    // Check City
    check('city')
    .isLength({ min: 2 })
    .withMessage('Название города должно содержать не менее 2 символов')
    .trim()
    .escape(),
];
module.exports = updateUserValidate;