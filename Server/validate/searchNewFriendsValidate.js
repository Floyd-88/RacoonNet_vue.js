const { check } = require("express-validator");

let searchNewFriendsValidate = [
    // Check Name
    check('name')
    .trim()
    .escape(),

    // Check Surname
    check('surname')
    .trim()
    .escape(),

    // Check Country
    check('country')
    .trim()
    .escape(),

    // Check City
    check('city')
    .trim()
    .escape(),
];
module.exports = searchNewFriendsValidate;