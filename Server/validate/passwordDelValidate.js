const { check } = require("express-validator");

let passwordDelValidate = [
    //chek password
    check('password')
    .trim()
    .escape()
    .isLength({ min: 8 })
    .withMessage('Пароль должен содержать не менее 8 символов')

];
module.exports = passwordDelValidate;