const mongoose = require('mongoose');
const shortid = require('shortid');

const Event = new mongoose.Schema({
    badge: {
        type: String,
        default: shortid.generate
    },
    link: String,
    schedule: {
        date: {
            type: Date,
            required: true
        },
        blocks: { // These are the badges of all blocks during which this event occurrs on that day.
            type: [ String ],
            default: []
        },
        start: Date,
        end: Date
    },
    title: {
        type: String,
        required: true
    },
    description: String,
    location: String,
    categories: {
        type: [ String ],
        default: []
    }
}, {
    collection: 'events',
    versionKey: false
});

mongoose.model('Event', Event);