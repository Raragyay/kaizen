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

    activities: {
        type: [ActivitySchema],
        required: true
    }
});

module.exports = {
    ActivityEntry: mongoose.model('activityEntries', ActivityEntrySchema),
    Activity: mongoose.model('activities', ActivitySchema)
};
