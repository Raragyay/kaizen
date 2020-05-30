const express = require('express');
const moment = require('moment');
const router = express.Router();
const {ActivityEntry, Activity} = require('../models/ActivityEntry');

const validateActivityEntry = require('../validation/activityEntry');
const checkToken = require('../validation/checkToken');
const authenticateUser = require('../validation/authenticateUser');
const retrieveUser = require('../retrieve/retrieveUser');
const retrieveActivityEntry = require('../retrieve/retrieveActivityEntry');
router.use(checkToken);
router.use(authenticateUser);
router.use(retrieveUser);
router.use(retrieveActivityEntry);

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
    if (req.activityEntry === null) {
        const newActivityEntry = new ActivityEntry({
            userId: req.user._id,
            predictedActivities: activities
        });
        newActivityEntry
            .save()
            .then(activityEntry => res.sendStatus(201))
            .catch(err => console.log(err));
    } else {
        req.activityEntry.predictedActivities = activities;
        req.activityEntry.date = Date.now();
        req.activityEntry
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

    if (req.activityEntry === null) {
        return res.status(404).json({error: "No entry exists for today. Did you mean to PUT the predicted activities?"})
    } else {
        req.activityEntry.actualActivities = buildActivityArray(req.body.activities);
        req.activityEntry.entryWasAchieved = req.body.achieved;
        req.activityEntry
            .save()
            .then(activityEntry => res.sendStatus(200))
            .catch(err => console.log(err));
    }

});

router.delete('', (req, res) => {
    if (req.activityEntry === null) {
        res.sendStatus(204);
    } else {
        req.activityEntry.delete();
        res.sendStatus(204);
    }
});

router.get('', (req, res) => {
    if (req.activityEntry === null) {
        return res.sendStatus(404);
    } else {
        return res.json(req.activityEntry);
    }
});

module.exports = router;
