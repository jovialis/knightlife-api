const mongoose = require('mongoose');
const shortid = require('shortid');

const DayOutline = new mongoose.Schema({
    legend: {
        badge: {
            type: String,
            default: shortid.generate,
            unique: true
        },
        date: {
            type: Date,
            required: true
        }
    },
    content: {
        schedule: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'DaySchedule',
            required: true
        },
        lunch: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'DayMenu',
            required: true
        },
        events: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'DayEvent',
            default: []
        },
        news: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'DayNews',
            default: []
        }
    }
}, {
    collection: 'day_outlines',
    versionKey: false
});

mongoose.model(DayOutline, 'DayOutline');