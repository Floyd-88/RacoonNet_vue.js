const { check } = require("express-validator");

let messageValidate = [
    // Check Message
    check('textMessage')
    .isLength({ min: 1 })
    .withMessage('Пост должен содержать не менее 1 символа')
    .trim()
    .escape()
]
module.exports = messageValidate;