const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ActivitySchema = new Schema({
    name: {
        alias: 'activityName',
        type: String,
        required: true
    },
    duration: { // in minutes
        type: Number,
        required: true
    }
});

const ActivityEntrySchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },

    predictedActivities: {
        type: [ActivitySchema],
        required: true
    },

    actual_activities: {
        type: [ActivitySchema]
    },

    entryWasAchieved: {
        type: Boolean,
        default: false
    }
});

module.exports = {
    ActivityEntry: mongoose.model('activityEntries', ActivityEntrySchema),
    Activity: mongoose.model('activity', ActivitySchema)
};
