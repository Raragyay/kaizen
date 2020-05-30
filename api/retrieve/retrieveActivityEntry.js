const {ActivityEntry} = require('../models/ActivityEntry');
const moment = require('moment');
module.exports = function retrieveActivityEntry(req, res, next) {
    if (typeof req.userId === 'undefined') {
        res.sendStatus(401);
    } else {
        const today = typeof req.body.date === 'undefined' ? moment().startOf('day') : req.body.date;
        ActivityEntry.findOne({
            userId: req.userId, date: {$gte: today.toDate(), $lte: moment(today).endOf('day').toDate()}
        }, function (err, activityEntry) {
            if (err) {
                return res.status(400).json({query: "Malformed query"});
            } else {
                req.activityEntry = activityEntry;
                next();
            }
        });
    }
};
