const Validator = require('validator');
const isEmpty = require('is-empty');

module.exports = function validateGoal(data) { // data is the request body
    let errors = {};

    data.goal = isEmpty(data.goal) ? "" : data.goal;

    if (Validator.isEmpty(data.goal)) {
        errors.goal = "No goal was provided"
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};
