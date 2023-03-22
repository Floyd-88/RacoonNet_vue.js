const { check } = require("express-validator");

let postValidatePhoto = [
    // Check Password
    check('postText')
    .trim()
    .escape()
]
module.exports = postValidatePhoto;