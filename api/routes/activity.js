const express = require('express');
const moment = require('moment');
const router = express.Router();
const {ActivityEntry, Activity} = require('../models/ActivityEntry');

const validateActivityEntry = require('../validation/activityEntry');
const checkToken = require('../validation/checkToken');
const authenticateUser = require('../validation/authenticateUser');
const retrieveUser = require('../validation/retrieveUser');
router.use(checkToken);
router.use(authenticateUser);
router.use(retrieveUser);

router.put('/addActivityEntry', (req, res) => {
    const {errors, isValid} = validateActivityEntry(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }
    const today = moment().startOf('day');
    ActivityEntry.findOne({
            userId: req.userId, date: {$gte: today.toDate(), $lte: moment(today).endOf('day').toDate()}
        }, function (err, activityEntry) {
            if (err) { // no entry has been made so far
                return res.status(400).json({query: "Malformed query"});
            } else {
                let activities = [];
                for (let [name, time] of Object.entries(req.body.activities)) {
                    activities.push(new Activity({
                        activityName: name,
                        duration: time
                    }));
                }
                if (activityEntry === null) {
                    const newActivityEntry = new ActivityEntry({
                        userId: req.user._id,
                        predictedActivities: activities
                    });
                    newActivityEntry
                        .save()
                        .then(activityEntry => res.status(201))
                        .catch(err => console.log(err));
                } else {
                    if (req.body.confirm !== true) {
                        return res.status(403).json({confirm: "There is already an entry for today"})
                    } else {
                        console.log(err);
                        console.log(activityEntry);
                        activityEntry.predictedActivities = activities;
                        activityEntry.date = Date.now();
                        activityEntry
                            .save()
                            .then(activity => res.status(200))
                            .catch(err => console.log(err));
                    }
                }
            }
        }
    );
});

router.get('/getCurrentActivities', (req, res) => {
    const today = moment().startOf('day');
    ActivityEntry.findOne({
        userId: req.userId,
        date: {$gte: today.toDate(), $lte: moment(today).endOf('day').toDate()}
    }, (err, activityEntry) => {
        if (err) { // no entry has been made so far
            return res.status(400).json({query: "Malformed query"});
        } else if (activityEntry === null) {
            return res.sendStatus(404);
        } else {
            return res.json(activityEntry);
        }
    })
});

module.exports = router;
