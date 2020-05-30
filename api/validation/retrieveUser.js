const User = require('../models/User');
module.exports = function retrieveUser(req, res, next) {
    if (typeof req.userId === 'undefined') {
        res.sendStatus(401);
    } else {
        User.findById(req.userId, function (err, user) {
            if (err) {
                res.sendStatus(401);
            } else {
                req.user = user;
                next();
            }
        })
    }
};
