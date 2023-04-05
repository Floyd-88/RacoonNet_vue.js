const { check } = require("express-validator");

let feedBackUser = [
    // Check title
    check('title')
    .isLength({ min: 2 })
    .withMessage('Наименование должно содержать не менее 2 символов')
    .trim()
    .escape(),

    // Check description
    check('description')
    .isLength({ min: 2 })
    .withMessage('Описание должно содержать не менее 2 символов')
    .trim()
    .escape(),
];
module.exports = feedBackUser;