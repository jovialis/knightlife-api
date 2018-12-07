const mongoose = require('mongoose');
const shortid = require('shortid');

const Day = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        unique: true
    },
    complications: {
        schedule: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Schedule'
        },
        lunch: {
            type: mongoose.Schema.Types.ObjeectId,
            ref: 'Lunch'
        }
    }
}, {
    collection: 'days'
});

mongoose.model(Day, 'Day');