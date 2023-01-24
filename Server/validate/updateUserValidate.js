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
    loginValidate[0],

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