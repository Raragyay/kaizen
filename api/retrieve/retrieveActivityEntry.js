const {ActivityEntry} = require('../models/ActivityEntry');
const moment = require('moment');
module.exports = function retrieveActivityEntry(req, res, next) {
    if (typeof req.userId === 'undefined') {
        res.sendStatus(401);
    } else {
        let today;
        if (typeof req.date !== 'undefined') {
            today = req.date;
        } else {
            today = moment().toDate();
        }
        console.log(req.date);
        console.log(typeof req.date);
        console.log(today);
        console.log(moment(today).endOf('day').toDate());
        // const today = typeof req.body.date === 'undefined' ? moment().startOf('day') : moment(req.body.date);
        ActivityEntry.findOne({
            userId: req.userId, date: {$gte: today, $lte: moment(today).endOf('day').toDate()}
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
