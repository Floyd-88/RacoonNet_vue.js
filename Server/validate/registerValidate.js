const {check} = require("express-validator");
const loginValidate = require('./loginValidate');

let registerValidate = [
    // Check Name
    check('name')
        .isLength({min: 2})
        .withMessage('Имя должно содержать не менее 2 сиволов')
        .trim()
        .escape(),

    // Check Surname
    check('surname')
        .isLength({min: 2})
        .withMessage('Фамилия должна содержать не менее 2 сиволов')
        .trim()
        .escape(),

    //Check Email
    loginValidate[0],

    //Check Password
    loginValidate[1],

    // Check Country
    check('country')
        .isLength({min: 2})
        .withMessage('Название страны должна содержать не менее 2 сиволов')
        .trim()
        .escape(),

    // Check City
    check('city')
        .isLength({min: 2})
        .withMessage('Название города должно содержать не менее 2 сиволов')
        .trim()
        .escape(),
];
module.exports = registerValidate;