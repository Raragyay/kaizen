const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GoalSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    goal: {
        type: String,
        required: true,
        maxlength: 65535
    }
});
module.exports = mongoose.model('goals', GoalSchema);
