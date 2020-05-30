const express = require('express');
const moment = require('moment');
const router = express.Router();
const {ActivityEntry, Activity} = require('../models/ActivityEntry');
const User = require('../models/User');
const isEmpty = require('is-empty');

const validateActivityEntry = require('../validation/activityEntry');
const checkToken = require('../validation/checkToken');
const authenticateUser = require('../validation/authenticateUser');
const retrieveUser = require('../retrieve/retrieveUser');
const retrieveEntryWithDate = require('../retrieve/retrieveEntryWithDate');
const retrieveDate = require('../retrieve/retrieveDate');

router.use(checkToken);
router.use(authenticateUser);
router.use(retrieveUser);
router.use(retrieveDate);
router.use(retrieveEntryWithDate(ActivityEntry));

function buildActivityArray(activityDict) {
    let activities = [];
    for (let [name, time] of Object.entries(activityDict)) {
        activities.push(new Activity({
            activityName: name,
            duration: time
        }));
    }
    return activities
}

router.put('', (req, res) => {
    const {errors, isValid} = validateActivityEntry(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    let activities = buildActivityArray(req.body.activities);
    if (req.entry === null) {
        const newActivityEntry = new ActivityEntry({
            userId: req.user._id,
            predictedActivities: activities,
            date: req.date
        });
        newActivityEntry
            .save()
            .then(activityEntry => res.sendStatus(201))
            .catch(err => console.log(err));
    } else {
        req.entry.predictedActivities = activities;
        req.entry.date = req.date;
        req.entry
            .save()
            .then(activityEntry => res.sendStatus(200))
            .catch(err => console.log(err));
    }
});

router.post('', (req, res) => {
    let {errors, isValid} = validateActivityEntry(req.body);

    if (typeof req.body.achieved !== 'boolean') {
        errors.achieved = 'Missing achieved metric';
        isValid = false;
    }

    if (!isValid) {
        return res.status(400).json(errors);
    }

    if (req.entry === null) {
        return res.status(404).json({error: "No entry exists for today. Did you mean to PUT the predicted activities?"})
    } else {
        let alreadyRecordedActualActivities = !isEmpty(req.entry.actualActivities);
        let originalEntryWasAchieved = req.entry.entryWasAchieved;
        req.entry.actualActivities = buildActivityArray(req.body.activities);
        req.entry.entryWasAchieved = req.body.achieved;

        if (!alreadyRecordedActualActivities) {
            req.user.activityStats.activitiesEntered += 1;
        }
        if (req.date - req.user.activityStats.activityLastEntered === 86400000 && !alreadyRecordedActualActivities) {
            req.user.activityStats.activitiesEnteredStreak += 1;
        } else if (!alreadyRecordedActualActivities) {
            req.user.activityStats.activitiesEnteredStreak = 1;
        }
        if (req.date > req.user.activityStats.activityLastEntered) {
            req.user.activityStats.activityLastEntered = req.date;
        }


        if (req.body.achieved === true) {
            if (!originalEntryWasAchieved) {
                req.user.activityStats.activitiesMet += 1;
            }
            if (req.date - req.user.activityStats.activityLastMet === 86400000 && !originalEntryWasAchieved) {
                req.user.activityStats.activitiesMetStreak += 1;
            } else if (!originalEntryWasAchieved) {
                req.user.activityStats.activitiesMetStreak = 1;
            }
            if (req.date > req.user.activityStats.activityLastMet) {
                req.user.activityStats.activityLastMet = req.date;
            }
        } else {
            req.user.activityStats.activitiesMetStreak = 0;
            if (originalEntryWasAchieved) {
                req.user.activityStats.activitiesMet -= 1;
            }
        }
        req.entry
            .save()
            .then(req.user.save())
            .then(res.sendStatus(200))
            .catch(err => console.log(err));
    }
});

router.delete('', (req, res) => {
    if (req.entry === null) {
        res.sendStatus(204);
    } else {
        req.entry.delete();
        res.sendStatus(204);
    }
});

router.get('', (req, res) => {
    if (req.entry === null) {
        return res.sendStatus(404);
    } else {
        return res.json(req.entry);
    }
});

router.get('/all', (req, res) => {
    ActivityEntry.find({userId: req.userId}, (err, entries) => {
        if (err) {
            return res.sendStatus(404);
        } else {
            return res.json(entries);
        }
    })
});

module.exports = router;
