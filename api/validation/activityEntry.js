const Validator = require('validator');
const isEmpty = require('is-empty');

module.exports = function validateActivityEntry(data) { // data is the request body
    let errors = {};


    // Convert empty fields to empty string to be able to validate
    if (isEmpty(data.activities)) {
        errors.activities = "No activities were provided.";
        data.activities = {};
    }
    let totalTime = 0;
    for (let [name, duration] of Object.entries(data.activities)) {
        name = isEmpty(name) ? "" : name;
        if (Validator.isEmpty(name)) {
            errors.activityName = "Empty activity names"
        }
        if (!Number.isSafeInteger(duration)) {
            errors.activityDuration = "Time is not an integer"
        } else if (!(0 <= duration <= 1440)) { //1 day in minutes
            errors.activityDuration = "Time allocation is too short or too long. Please pass in minutes."
        }
        totalTime += duration;
    }
    if (!(totalTime <= 1440)) {
        errors.activityTotalTime = "Total time allocation exceeds 1 day";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};
