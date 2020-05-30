const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
module.exports = function authenticateUser(req, res, next) { // uses jwt to check for token authentication and in database
    if (typeof req.token === 'undefined') {
        res.sendStatus(401);
    } else {
        jwt.verify(req.token, keys.secretOrKey, {}, function (err, decoded) {
            if (err) {
                res.sendStatus(401);
            } else {
                req.userId = decoded.id;
                next();
            }
        })
    }
};
