const { check } = require("express-validator");

let postValidate = []
if (!'photo') {
    postValidate = [
        // Check Password
        check('postText')
        .isLength({ min: 1 })
        .withMessage('Пост должен содержать не менее 1 символа')
        .trim()
        .escape()
    ]
} else {
    postValidate = [
        // Check Password
        check('postText')
        .trim()
        .escape()
    ]
}

module.exports = postValidate;