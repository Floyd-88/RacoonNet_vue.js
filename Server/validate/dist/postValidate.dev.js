"use strict";

var _require = require("express-validator"),
    check = _require.check;

var postValidate = [check('postText').isLength({
  min: 1
}).withMessage('Пост должен содержать не менее 1 символа').trim().escape()];
module.exports = postValidate;