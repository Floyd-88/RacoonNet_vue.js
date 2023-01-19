const {check} = require("express-validator");
const loginValidate = require('./loginValidate');

let registerValidate = [
    // Check Name
    check('name')
        .isLength({min: 2})
        .withMessage('Имя должно содержать не менее 2 символов')
        .trim()
        .escape(),

    // Check Surname
    check('surname')
        .isLength({min: 2})
        .withMessage('Фамилия должна содержать не менее 2 символов')
        .trim()
        .escape(),

    //Check Email
    loginValidate[0],

    // Check Password
    check('password')
        .isLength({min: 8})
        .withMessage('Пароль должен содержать не менее 8 символов')
        // .matches('[0-9]')
        // .withMessage('Password Must Contain a Number')
        // .matches('[A-Z]')
        // .withMessage('Password Must Contain an Uppercase Letter')
        .trim()
        .escape(),

    // Check Country
    check('country')
        .isLength({min: 2})
        .withMessage('Название страны должна содержать не менее 2 символов')
        .trim()
        .escape(),

    // Check City
    check('city')
        .isLength({min: 2})
        .withMessage('Название города должно содержать не менее 2 символов')
        .trim()
        .escape(),
];
module.exports = registerValidate;