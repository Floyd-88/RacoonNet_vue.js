const { check } = require("express-validator");

let passwordValidate = [
    //chek old_password
    check('old_password')
    .trim()
    .escape(),

    // Check new_password
    check('new_password')
    .isLength({ min: 8 })
    .withMessage('Пароль должен содержать не менее 8 символов')
    // .matches('[0-9]')
    // .withMessage('Password Must Contain a Number')
    // .matches('[A-Z]')
    // .withMessage('Password Must Contain an Uppercase Letter')
    .trim()
    .escape(),
];
module.exports = passwordValidate;