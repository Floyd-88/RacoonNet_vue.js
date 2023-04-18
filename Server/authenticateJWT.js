const jwt = require('jsonwebtoken');
const tokenKey = require('./tokenKey');

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        jwt.verify(authHeader, tokenKey.secret, (err, user) => {
            if (err) {
                return res.status(302).send("Неверный токен");
            }
            req.tokenID = user.id;
            next();
        });
    } else {
        next()
    }
};
module.exports = authenticateJWT;