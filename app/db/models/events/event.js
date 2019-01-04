const mongoose = require('mongoose');
const uuid = require('uuid/v4');

const Event = new mongoose.Schema({
    badge: {
        type: String,
        default: uuid
    },
    date: {
        type: Date,
        required: true
    },
    schedule: {
        blocks: { // These are the badges of all blocks during which this event occurrs on that day.
            type: [ String ],
            default: null
        },
        start: {
            type: Date,
            default: null
        },
        end: {
            type: Date,
            default: null
        }
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: null
    },
    location: {
        type: String,
        default: null
    },
    categories: {
        type: [ String ],
        default: []
    }
}, {
    collection: 'events',
    versionKey: false
});

mongoose.model('Event', Event);

require('./sportingevent');