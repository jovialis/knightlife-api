// Complication

const mongoose = require('mongoose');
const shortid = require('shortid');

const BlockDetails = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        enum: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'x', 'lunch', 'activities', 'lab', 'class_meeting', 'assembly', 'advisory', 'custom']
    },
    name: String,
    color: String,
    location: String
}, {
    versionKey: false,
    _id: false
});

const Block = new mongoose.Schema({
    badge: {
        type: String,
        default: shortid.generate
    },
    details: {
        type: BlockDetails,
        required: true,
    },
    time: {
        start: {
            type: Date,
            required: true
        },
        end: {
            type: Date,
            required: true
        }
    },
    variation: {
        type: Number, 
        required: false 
    }
}, {
    versionKey: false,
    _id: false
});

const Schedule = new mongoose.Schema({
    badge: {
        type: String,
        default: shortid.generate
    },
    blocks: {
        type: [ Block ],
        required: true
    },
    day: {
        type: String,
        required: false,
        enum: ['m', 't', 'w', 'th', 'f', 'sa', 'su']
    }
}, {
    collection: 'schedules',
    versionKey: false
});

mongoose.model('Schedule', Schedule)