const moment = require('moment');
module.exports = function retrieveDate(req, res, next) {
    let today;
    if (typeof req.body.date === 'undefined') {
        if (typeof req.query.date === 'undefined') {
            today = moment().startOf('day');
        } else {
            today = moment(req.query.date).startOf('day');
        }
    } else {
        today = moment(req.body.date).startOf('day');
    }
    req.date = today.toDate();
    next();
};
