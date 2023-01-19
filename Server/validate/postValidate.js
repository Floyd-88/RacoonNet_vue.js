const {check} = require("express-validator");

let postValidate = [
    // Check Password
    check('body')
        .isLength({min: 1})
        .withMessage('Пост должен содержать не менее 1 символа')
        .trim()
        .escape(),
]
module.exports = postValidate;