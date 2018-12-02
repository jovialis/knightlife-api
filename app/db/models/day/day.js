const mongoose = require('mongoose');
const shortid = require('shortid');

const Complication = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    document: {
        type: mongoose.Schema.Types.ObjectId
//        ref: this.type
    }
}, {
    versionKey: false
});

const Day = new mongoose.Schema({
    badge: {
        type: String,
        default: shortid.generate
    },
    date: {
        type: Date,
        required: true
    },
    complications: {
        type: [ Complication ],
        default: []
    }
}, {
    collection: 'days',
    versionKey: false
});

mongoose.model(Day, 'Day');