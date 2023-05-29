const { check } = require("express-validator");

let postValidate = [
    check('postText')
    .isLength({ min: 1 })
    .withMessage('Пост должен содержать не менее 1 символа')
    .trim()
    .escape()
]

module.exports = postValidate;