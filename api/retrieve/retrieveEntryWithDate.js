const {ActivityEntry} = require('../models/ActivityEntry');
const moment = require('moment');
module.exports = function retrieveEntryWithDate(cls) {
    return (req, res, next) => {
        if (typeof req.userId === 'undefined') {
            res.sendStatus(401);
        } else {
            let today;
            if (typeof req.date !== 'undefined') {
                today = req.date;
            } else {
                today = moment().toDate();
            }
            // const today = typeof req.body.date === 'undefined' ? moment().startOf('day') : moment(req.body.date);
            cls.findOne({
                userId: req.userId, date: {$gte: today, $lte: moment(today).endOf('day').toDate()}
            }, function (err, entry) {
                if (err) {
                    return res.status(400).json({query: "Malformed query"});
                } else {
                    req.entry = entry;
                    next();
                }
            });
        }
    }
};
