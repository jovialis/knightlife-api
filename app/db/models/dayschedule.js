const mongoose = require('mongoose');
const shortid = require('shortid');

const GradeLevel = require('./gradelevel');

const Block = new mongoose.Schema({
    legend: {
        badge: {
            type: String,
            default: shortid.generate
        },
        id: {
            type: String,
            required: true,
            enum: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'x', 'lunch', 'activities', 'lab', 'class_meeting', 'assembly', 'advisory', 'custom']
        }
    },
    start: String,
    end: String,
    variation: { 
        type: Number, 
        required: false 
    },
    custom: {
        type: Custom,
        required: false
    }
}, {
    _id: false
});

const DaySchedule = new mongoose.Schema({

}, {
    collection: 'day_schedules',
    versionKey: false
});