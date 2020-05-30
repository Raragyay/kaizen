const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },

    activityStats: {
        activityStreak: {
            type: Number,
            default: 0
        },
        activitiesMet: {
            type: Number,
            default: 0
        },
        activitiesEntered: {
            type: Number,
            default: 0
        }
    }
});

module.exports = User = mongoose.model('users', UserSchema);
