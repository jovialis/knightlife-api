// Complication

const mongoose = require('mongoose');
const uuid = require('uuid/v4');

const Annotation = new mongoose.Schema({
    badge: {
        type: String,
        default: uuid
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
        default: uuid
    },
    id: {
        type: String,
        required: true,
        enum: require(`${ global.__interface }/day/complications/schedule/schedule-template.json`).blocks
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
    badge: {
        type: String,
        default: uuid
    },
    blocks: {
        type: [ Block ]
    },
    target: { // 0 = freshman, etc. 4 = other.
        type: Number,
        default: null
    },
    title: { 
        type: String,
        default: null
    } // For specific names: e.g. instead of Freshman block schedule, Freshman Exam Schedule
}, {
    _id: false
});

const Schedule = new mongoose.Schema({
    badge: {
        type: String,
        default: uuid
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