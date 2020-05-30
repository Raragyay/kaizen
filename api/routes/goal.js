const express = require('express');
const moment = require('moment');
const router = express.Router();
const Goal = require('../models/Goal');
const User = require('../models/User');
const isEmpty = require('is-empty');

const validateGoal = require('../validation/goal');
const checkToken = require('../validation/checkToken');
const authenticateUser = require('../validation/authenticateUser');
const retrieveUser = require('../retrieve/retrieveUser');
const retrieveEntryWithDate = require('../retrieve/retrieveEntryWithDate');
const retrieveDate = require('../retrieve/retrieveDate');

router.use(checkToken);
router.use(authenticateUser);
router.use(retrieveUser);
router.use(retrieveDate);
router.use(retrieveEntryWithDate(Goal));

router.put('', (req, res) => {
    const {errors, isValid} = validateGoal(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }
    if (req.entry === null) {
        const newGoal = new Goal({
            userId: req.user._id,
            goal: req.body.goal,
            date: req.date
        });
        newGoal
            .save()
            .then(entry => res.sendStatus(201))
            .catch(err => console.log(err));
    } else {
        req.entry.goal = req.body.goal;
        req.entry.date = req.date;
        req.entry
            .save()
            .then(entry => res.sendStatus(200))
            .catch(err => console.log(err));
    }
});

router.get('', (req, res) => {
    if (req.entry === null) {
        return res.sendStatus(404);
    } else {
        return res.json(req.entry);
    }
});

router.post('', (req, res) => {
    if (typeof req.body.achieved != 'boolean') {
        return res.status(400).json({achieved: 'Achieved metric not provided. Did you mean to call the PUT request instead?'});
    }
    if (req.entry === null) {
        return res.status(404).json({error: 'No goal exists for today. Did you mean to call the PUT request instead?'});
    } else {
        let goalWasAlreadyAchieved = req.entry.achievedGoal;
        req.entry.achievedGoal = req.body.achieved;
        if (req.body.achieved === true) {
            if (!goalWasAlreadyAchieved) {
                req.user.goalStats.goalsMet += 1;
            }
            if (req.date - req.user.goalStats.goalLastMet === 86400000 && !originalEntryWasAchieved) {
                req.user.goalStats.goalsMetStreak += 1;
            } else if (!goalWasAlreadyAchieved) {
                req.user.goalStats.goalsMetStreak = 1;
            }
            if (req.date > req.user.goalStats.goalLastMet) {
                req.user.goalStats.goalLastMet = req.date;
            }
        } else {
            req.user.goalStats.goalsMetStreak = 0;
            if (goalWasAlreadyAchieved) {
                req.user.goalStats.goalsMet -= 1;
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

module.exports = router;
