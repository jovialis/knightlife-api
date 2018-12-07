// Complication

const mongoose = require('mongoose');
const shortid = require('shortid');

const Annotation = new mongoose.Schema({
    badge: {
        type: String,
        default: shortid.generate
    },
    message: {
        type: String,
        required: true
    },
    target: {
        type: Number,
        default: 0
    },
    meta: {
        location: String,
        color: String
    }
}, {
    _id: false
});

const Block = new mongoose.Schema({
    badge: {
        type: String,
        default: shortid.generate
    },
    id: {
        type: String,
        required: true,
        enum: require(`${ global.__interface }/day/complications/schedule-template.json`).blocks
    },
    variation: {
        type: Number,
        required: false 
    },
    time: {
        start: {
            type: String,
            required: true
        },
        end: {
            type: String,
            required: true
        }
    },
    annotations: {
        type: [ Annotation ],
        default: []
    }
}, {
    _id: false
});

const BlockList = new mongoose.Schema({
    blocks: {
        type: [ Block ]
    },
    target: { // 0 = all school, 1 = freshman, etc. 5 = other.
        type: Number,
        default: 0
    },
    title: String // For specific names: e.g. instead of Freshman block schedule, Freshman Exam Schedule
}, {
    _id: false
});

const Schedule = new mongoose.Schema({
    badge: {
        type: String,
        default: shortid.generate
    },
    schedules: {
        type: [ BlockList ],
        required: true
    },
    day: Number
}, {
    collection: 'schedules'
});

mongoose.model('Schedule', Schedule);