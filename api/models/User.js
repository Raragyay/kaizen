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
        activitiesMetStreak: {
            type: Number,
            default: 0
        },
        activitiesEnteredStreak: {
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
        },
        activityLastEntered: {
            type: Date,
            default: 0
        },
        activityLastMet: {
            type: Date,
            default: 0
        }
    },
    goalStats: {
        goalsMetStreak: {
            type: Number,
            default: 0
        },
        goalsMet: {
            type: Number,
            default: 0
        },
        goalLastMet: {
            type: Date,
            default: 0
        }
    }
});

module.exports = User = mongoose.model('users', UserSchema);
